const images = [
    {
        src: "assets/gui1.png",
        title: "3D Farfield Plot",
        alt: "3D Farfield Plot"
    },
    {
        src: "assets/gui2.png", 
        title: "E-Field Visualization",
        alt: "E-Field Visualization"
    },
    {
        src: "assets/gui3.png",
        title: "S-Parameter Plot", 
        alt: "S-Parameter Plot"
    },
    {
        src: "assets/gui4.png",
        title: "Support for PCB Importing",
        alt: "Support for PCB Importing"
    },
    {
        src: "assets/gui5.png",
        title: "Integrated Stackup Editor",
        alt: "Integrated Stackup Editor"
    },
    {
        src: "assets/gui6.png",
        title: "2D port solutions",
        alt: "2D port solutions"
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