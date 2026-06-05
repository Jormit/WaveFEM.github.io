const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("content/style.css");
  eleventyConfig.addPassthroughCopy("content/scripts.js");
  eleventyConfig.addPassthroughCopy("content/CNAME");
  eleventyConfig.addPassthroughCopy("content/assets");

  eleventyConfig.addNunjucksAsyncShortcode("image", async function (src, alt, ...args) {
    let cls = args[0] || "";
    let id = args[1] || "";
    let filePath = path.join("content", src);
    let stats;
    try {
      stats = await Image(filePath, {
        widths: [null],
        formats: [null],
        dryRun: true,
      });
    } catch {
      return `<img src="${src}" alt="${alt}"${cls ? ` class="${cls}"` : ""}${id ? ` id="${id}"` : ""}>`;
    }
    let format = Object.keys(stats)[0];
    let img = stats[format][0];
    let clsAttr = cls ? ` class="${cls}"` : "";
    let idAttr = id ? ` id="${id}"` : "";
    return `<img src="${src}" width="${img.width}" height="${img.height}" alt="${alt}"${clsAttr}${idAttr}>`;
  });

  return {
    templateFormats: ["njk"],
    dir: {
      input: "content",
      output: "_site",
      includes: "../_includes",
    },
  };
};
