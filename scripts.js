 // Sample images data - replace with your actual images
const images = [
    {
        src: "assets/gui1.png",
        title: "Waveguide Filter E Field",
        alt: "Waveguide Filter E Field"
    },
    {
        src: "assets/gui2.png", 
        title: "Waveguide Filter S-Parameters",
        alt: "Waveguide Filter S-Parameters"
    },
    {
        src: "assets/gui3.png",
        title: "Pyramidal Horn Antenna E Field", 
        alt: "Pyramidal Horn Antenna E Field"
    },
    {
        src: "assets/gui5.png",
        title: "Pyramidal Horn Antenna Radiation Pattern",
        alt: "Pyramidal Horn Antenna Radiation Pattern"
    }
];

let currentIndex = 0;

function updateGallery() {
    const img = document.getElementById('gallery-image');
    const title = document.getElementById('image-title');
    const counter = document.getElementById('counter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Update image
    img.src = images[currentIndex].src;
    img.alt = images[currentIndex].alt;
    
    // Update title
    title.textContent = images[currentIndex].title;
    
    // Update counter
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
    
    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === images.length - 1;
}

function nextImage() {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        updateGallery();
    }
}

function previousImage() {
    if (currentIndex > 0) {
        currentIndex--;
        updateGallery();
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        previousImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    updateGallery();
});