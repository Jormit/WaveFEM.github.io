const images = [
    {
        src: "assets/gui1.png",
        title: "Series fed Patch Array 3D Farfield",
        alt: "Series fed Patch Array 3D Farfield"
    },
    {
        src: "assets/gui2.png", 
        title: "Waveguide Filter E-Field",
        alt: "Waveguide Filter E-Field"
    },
    {
        src: "assets/gui3.png",
        title: "Waveguide Filter S-Parameters", 
        alt: "Waveguide Filter S-Parameters"
    },
    {
        src: "assets/gui4.png",
        title: "Microstrip Stepped Impedance Filter",
        alt: "Microstrip Stepped Impedance Filter"
    },
    {
        src: "assets/gui5.png",
        title: "Microstrip Stackup Editor",
        alt: "Microstrip Stackup Editor"
    },
    {
        src: "assets/gui6.png",
        title: "Ridged Waveguide Horn Antenna Excitation",
        alt: "Ridged Waveguide Horn Antenna Excitation"
    }
];

let currentIndex = 0;
let preloadedImages = [];

// Prefetch all images
function prefetchImages() {
    images.forEach((imageData, index) => {
        const img = new Image();
        img.src = imageData.src;
        preloadedImages[index] = img;
        
        // Optional: Add error handling
        img.onerror = function() {
            console.warn(`Failed to preload image: ${imageData.src}`);
        };
        
        // Optional: Add load event for debugging
        img.onload = function() {
            console.log(`Preloaded image: ${imageData.src}`);
        };
    });
}

function updateGallery() {
    const img = document.getElementById('gallery-image');
    const title = document.getElementById('image-title');
    const counter = document.getElementById('counter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Update image - use preloaded image if available
    if (preloadedImages[currentIndex] && preloadedImages[currentIndex].complete) {
        img.src = preloadedImages[currentIndex].src;
    } else {
        img.src = images[currentIndex].src;
    }
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
    // Start prefetching images immediately
    prefetchImages();
    
    // Initialize gallery
    updateGallery();
});