import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const CAD_SCRIPT = `import cadquery as cq

# ========= DESIGN PARAMETERS ===========

throat_w = {throat_w}
throat_h = {throat_h}
throat_l = {throat_l}
aperture_w = {aperture_w}
aperture_h = {aperture_h}
horn_l = {horn_l}
horn_thickness = {thickness}

# ========= CREATE OUTER SOLID ===========

# Create the outer throat + horn extension
throat_outer = (
    cq.Workplane("XY")
    .rect(throat_w + 2 * horn_thickness, throat_h + 2 * horn_thickness)
    .extrude(throat_l)
)

horn_extension_outer = (
    throat_outer.faces("+Z")
    .workplane()
    .rect(throat_w + 2 * horn_thickness, throat_h + 2 * horn_thickness)
    .workplane(offset=horn_l)
    .rect(aperture_w + 2 * horn_thickness, aperture_h + 2 * horn_thickness)
    .loft()
)

outer_horn = throat_outer.union(horn_extension_outer)

# ========= CREATE INNER CAVITY ===========

throat_inner = (
    cq.Workplane("XY")
    .workplane(offset=horn_thickness)
    .rect(throat_w, throat_h)
    .extrude(throat_l - horn_thickness)
)

horn_extension_inner = (
    throat_inner.faces("+Z")
    .workplane()
    .rect(throat_w, throat_h)
    .workplane(offset=horn_l)
    .rect(aperture_w, aperture_h)
    .loft()
)

inner_cavity = throat_inner.union(horn_extension_inner)

# ========= CREATE FINAL SOLID ===========
result = outer_horn.cut(inner_cavity)

out_file = "simple_horn.step"
result.export(out_file)`;

const params = {
  throat_w: 50,
  throat_h: 20,
  throat_l: 20,
  aperture_w: 70,
  aperture_h: 70,
  horn_l: 100,
  thickness: 2,
};

const sliders = [
  { key: "throat_w", label: "Throat Width", min: 10, max: 100, step: 1 },
  { key: "throat_h", label: "Throat Height", min: 5, max: 60, step: 1 },
  { key: "throat_l", label: "Throat Length", min: 5, max: 60, step: 1 },
  { key: "aperture_w", label: "Aperture Width", min: 20, max: 200, step: 1 },
  { key: "aperture_h", label: "Aperture Height", min: 20, max: 200, step: 1 },
  { key: "horn_l", label: "Horn Length", min: 20, max: 250, step: 1 },
  { key: "thickness", label: "Wall Thickness", min: 0.5, max: 8, step: 0.1 },
];

function createGradientTexture() {
  const c = document.createElement("canvas");
  c.width = 2;
  c.height = 512;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(1, "#b0cce8");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 2, 512);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.LinearFilter;
  return t;
}

const scene = new THREE.Scene();
scene.background = createGradientTexture();

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
camera.position.set(150, 80, 170);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const container = document.getElementById("viewport");
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 60);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(50, 100, 50);
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
dirLight2.position.set(-50, -30, -50);
scene.add(dirLight2);

const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight3.position.set(-30, 60, -20);
scene.add(dirLight3);

let hornMesh = null;
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x6a7a8a,
  wireframe: true,
  transparent: true,
  opacity: 0.3,
});
let wireframeMesh = null;

function buildHornGeometry(p) {
  const tw = p.throat_w,
    th = p.throat_h,
    tl = p.throat_l;
  const aw = p.aperture_w,
    ah = p.aperture_h,
    hl = p.horn_l;
  const t = p.thickness;
  const zt = tl + hl;

  const two = tw + 2 * t,
    tho = th + 2 * t;
  const awo = aw + 2 * t,
    aho = ah + 2 * t;

  const hw = tw / 2,
    hh = th / 2,
    haw = aw / 2,
    hah = ah / 2;
  const hwo = two / 2,
    hho = tho / 2,
    hawo = awo / 2,
    haho = aho / 2;

  const O = [
    [-hwo, -hho, 0],
    [hwo, -hho, 0],
    [hwo, hho, 0],
    [-hwo, hho, 0],
    [-hwo, -hho, tl],
    [hwo, -hho, tl],
    [hwo, hho, tl],
    [-hwo, hho, tl],
    [-hawo, -haho, zt],
    [hawo, -haho, zt],
    [hawo, haho, zt],
    [-hawo, haho, zt],
  ];
  const I = [
    [-hw, -hh, t],
    [hw, -hh, t],
    [hw, hh, t],
    [-hw, hh, t],
    [-hw, -hh, tl],
    [hw, -hh, tl],
    [hw, hh, tl],
    [-hw, hh, tl],
    [-haw, -hah, zt],
    [haw, -hah, zt],
    [haw, hah, zt],
    [-haw, hah, zt],
  ];

  const vertexPositions = O.concat(I);
  const faces = [];

  function triNormal(v0, v1, v2) {
    const ex = v1[0] - v0[0],
      ey = v1[1] - v0[1],
      ez = v1[2] - v0[2];
    const fx = v2[0] - v0[0],
      fy = v2[1] - v0[1],
      fz = v2[2] - v0[2];
    return [ey * fz - ez * fy, ez * fx - ex * fz, ex * fy - ey * fx];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function quadAuto(a, b, c, d, reverse) {
    const p0 = vertexPositions[a],
      p1 = vertexPositions[b];
    const p2 = vertexPositions[c],
      p3 = vertexPositions[d];
    const n = triNormal(p0, p1, p2);
    const cx = (p0[0] + p1[0] + p2[0] + p3[0]) / 4;
    const cy = (p0[1] + p1[1] + p2[1] + p3[1]) / 4;
    const cz = (p0[2] + p1[2] + p2[2] + p3[2]) / 4;

    const center = [0, 0, tl * 0.5];
    const outward = [cx - center[0], cy - center[1], cz - center[2]];

    const sign = reverse ? -1 : 1;
    if (dot(n, outward) * sign >= 0) {
      faces.push(a, b, c, a, c, d);
    } else {
      faces.push(a, c, b, a, d, c);
    }
  }

  quadAuto(0, 3, 2, 1, false);
  quadAuto(0, 4, 5, 1, false);
  quadAuto(4, 8, 9, 5, false);
  quadAuto(1, 5, 6, 2, false);
  quadAuto(5, 9, 10, 6, false);
  quadAuto(3, 7, 6, 2, false);
  quadAuto(7, 11, 10, 6, false);
  quadAuto(0, 3, 7, 4, false);
  quadAuto(4, 7, 11, 8, false);

  quadAuto(12, 16, 17, 13, true);
  quadAuto(16, 20, 21, 17, true);
  quadAuto(13, 17, 18, 14, true);
  quadAuto(17, 21, 22, 18, true);
  quadAuto(15, 19, 18, 14, true);
  quadAuto(19, 23, 22, 18, true);
  quadAuto(12, 15, 19, 16, true);
  quadAuto(16, 19, 23, 20, true);

  quadAuto(0, 1, 13, 12, false);
  quadAuto(1, 2, 14, 13, false);
  quadAuto(3, 15, 14, 2, false);
  quadAuto(0, 12, 15, 3, false);

  quadAuto(8, 9, 21, 20, false);
  quadAuto(9, 10, 22, 21, false);
  quadAuto(11, 23, 22, 10, false);
  quadAuto(8, 20, 23, 11, false);

  const positions = [];
  const ind = faces;

  for (let i = 0; i < ind.length; i++) {
    const vi = ind[i];
    positions.push(
      vertexPositions[vi][0],
      vertexPositions[vi][1],
      vertexPositions[vi][2],
    );
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

function rebuildHorn() {
  if (hornMesh) {
    hornMesh.geometry.dispose();
    scene.remove(hornMesh);
    hornMesh = null;
  }
  if (wireframeMesh) {
    wireframeMesh.geometry.dispose();
    scene.remove(wireframeMesh);
    wireframeMesh = null;
  }

  const geo = buildHornGeometry(params);

  const mat = new THREE.MeshStandardMaterial({
    color: 0x7a8a9a,
    metalness: 0.2,
    roughness: 0.6,
    side: THREE.DoubleSide,
  });
  hornMesh = new THREE.Mesh(geo, mat);
  hornMesh.position.y = 0;
  scene.add(hornMesh);

  const wm = wireframeMaterial.clone();
  wireframeMesh = new THREE.Mesh(geo.clone(), wm);
  wireframeMesh.position.y = 0;
  scene.add(wireframeMesh);

  updateCode();
}

function updateCode() {
  const el = document.getElementById("code-display");
  let code = CAD_SCRIPT;
  for (const key of Object.keys(params)) {
    const val = params[key];
    const displayVal = val.toFixed(1);
    const re = new RegExp(`({${key}})`);
    code = code.replace(re, displayVal);
  }
  el.textContent = code;
  if (window.hljs) {
    delete el.dataset.highlighted;
    window.hljs.highlightElement(el);
  }
}

function setupSliders() {
  const container = document.getElementById("sliders");
  for (const s of sliders) {
    const row = document.createElement("div");
    row.className = "slider-row";

    const label = document.createElement("label");
    label.textContent = s.label;
    row.appendChild(label);

    const input = document.createElement("input");
    input.type = "range";
    input.min = s.min;
    input.max = s.max;
    input.step = s.step;
    input.value = params[s.key];
    input.dataset.key = s.key;
    row.appendChild(input);

    const valSpan = document.createElement("span");
    valSpan.className = "slider-val";
    valSpan.textContent = params[s.key].toFixed(1);
    row.appendChild(valSpan);

    input.addEventListener("input", () => {
      const v = parseFloat(input.value);
      params[s.key] = v;
      valSpan.textContent = v.toFixed(1);
      rebuildHorn();
    });

    container.appendChild(row);
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w === 0 || h === 0) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function setupMobileTabs() {
  const tabs = document.querySelectorAll(".mobile-tab");
  const viewport = document.querySelector(".viewport-panel");
  const codePanel = document.querySelector(".code-panel");

  function activateTab(tab) {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const tabName = tab.dataset.tab;
    viewport.classList.toggle("active", tabName === "model");
    codePanel.classList.toggle("active", tabName === "code");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));
  });

  const activeTab = document.querySelector(".mobile-tab.active");
  if (activeTab) activateTab(activeTab);
}

window.addEventListener("resize", resize);

document.addEventListener("DOMContentLoaded", () => {
  setupSliders();
  setupMobileTabs();
  rebuildHorn();
  resize();
  animate();

  document.getElementById("reset-btn").addEventListener("click", () => {
    params.throat_w = 50;
    params.throat_h = 20;
    params.throat_l = 20;
    params.aperture_w = 70;
    params.aperture_h = 70;
    params.horn_l = 100;
    params.thickness = 2;
    for (const input of document.querySelectorAll(
      '#sliders input[type="range"]',
    )) {
      const key = input.dataset.key;
      input.value = params[key];
      input.nextElementSibling.textContent = params[key].toFixed(1);
    }
    rebuildHorn();
  });
});
