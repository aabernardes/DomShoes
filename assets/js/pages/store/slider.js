
// === Hero Slider Functionality ===
import { qs, qsa, on } from '../../modules/utils.js';

/**
 * Initializes a hero slider component.
 * @param {string} sliderSelector - CSS selector for the main slider container.
 */
export function setupHeroSlider(sliderSelector) {
    const slider = qs(sliderSelector);
    if (!slider) {
        console.error(`Slider element not found with selector: ${sliderSelector}`);
        return;
    }

    const track = qs('.hero-slider-track', slider);
    const slides = qsa('.hero-banner', track);
    const prevButton = qs('.slider-control.prev', slider);
    const nextButton = qs('.slider-control.next', slider);
    const indicatorsContainer = qs('.slider-indicators', slider);

    if (!track || slides.length === 0) {
        console.error("Slider track or slides not found within:", sliderSelector);
        // Optionally hide controls if no slides
        if(prevButton) prevButton.style.display = 'none';
        if(nextButton) nextButton.style.display = 'none';
        if(indicatorsContainer) indicatorsContainer.style.display = 'none';
        return;
    }
    console.log(`Found ${slides.length} slides.`);


    let currentIndex = 0;
    const slideCount = slides.length;
    let slideInterval;
    const intervalTime = 5000; // Time per slide in ms

    // --- Create Indicators ---
    let indicators = []; // Initialize as empty array
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = ''; // Clear existing indicators
        console.log("Creating indicators...");
        for (let i = 0; i < slideCount; i++) {
            const indicator = document.createElement('button');
            indicator.classList.add('indicator');
            indicator.dataset.index = i;
            indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            if (i === 0) indicator.classList.add('active');
            indicatorsContainer.appendChild(indicator);
        }
        indicators = qsa('.indicator', indicatorsContainer); // Re-query after creation
        console.log(`Created ${indicators.length} indicators.`);
    } else {
         console.warn("Slider indicators container not found.");
    }


    // --- Functions ---

    const updateSliderPosition = (smooth = true) => {
         // Debounce or check if width actually changed if performance is an issue
        const slideWidth = slides[0].offsetWidth; // Get width of a slide
        if (slideWidth === 0) {
            console.warn("Slide width is 0, cannot calculate position. Is the slider visible?");
            // Maybe try again after a short delay?
            // setTimeout(() => updateSliderPosition(smooth), 100);
            return;
        }
        const newTransform = `translateX(-${currentIndex * slideWidth}px)`;
        console.log(`Updating slider: Index=${currentIndex}, Width=${slideWidth}, Transform=${newTransform}`);

        // Apply transition only when smooth is true
        track.style.transition = smooth ? 'transform var(--transition-speed) ease-in-out' : 'none';
        track.style.transform = newTransform;

        // Update indicators
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
    };

    const nextSlide = () => {
        const oldIndex = currentIndex;
        currentIndex = (currentIndex + 1) % slideCount;
        console.log(`Next slide: Index changed from ${oldIndex} to ${currentIndex}`);
        updateSliderPosition();
    };

    const prevSlide = () => {
         const oldIndex = currentIndex;
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        console.log(`Previous slide: Index changed from ${oldIndex} to ${currentIndex}`);
        updateSliderPosition();
    };

     const goToSlide = (index) => {
        if (index >= 0 && index < slideCount && index !== currentIndex) {
             const oldIndex = currentIndex;
             currentIndex = index;
             console.log(`Go to slide: Index changed from ${oldIndex} to ${currentIndex}`);
             updateSliderPosition();
        } else {
            // console.log(`Go to slide: Index ${index} is invalid or already active.`);
        }
     };

    const startAutoSlide = () => {
        stopAutoSlide(); // Clear existing interval first
        console.log(`Starting auto slide with interval ${intervalTime}ms`);
        slideInterval = setInterval(nextSlide, intervalTime);
    };

    const stopAutoSlide = () => {
        if(slideInterval) {
            // console.log("Stopping auto slide interval.");
            clearInterval(slideInterval);
            slideInterval = null;
        }
    };


    // --- Event Listeners ---

    if (nextButton) {
        on(nextButton, 'click', () => {
            console.log("Next button clicked.");
            nextSlide();
            stopAutoSlide(); // Stop auto sliding on manual control
            startAutoSlide(); // Optional: Restart timer after manual click
        });
    } else {
         console.warn("Next button not found.");
    }


    if (prevButton) {
        on(prevButton, 'click', () => {
             console.log("Previous button clicked.");
            prevSlide();
            stopAutoSlide();
             startAutoSlide(); // Optional: Restart timer
        });
    } else {
         console.warn("Previous button not found.");
    }


     if (indicatorsContainer && indicators.length > 0) {
        on(indicatorsContainer, 'click', '.indicator', (event) => {
             if (event.target.matches('.indicator')) { // Ensure it's the button itself
                const index = parseInt(event.target.dataset.index, 10);
                 console.log(`Indicator ${index} clicked.`);
                goToSlide(index);
                stopAutoSlide();
                 startAutoSlide(); // Optional: Restart timer
             }
        });
     } else {
          console.warn("Indicators container or indicators not found for event listener setup.");
     }


    // Pause on hover
    on(slider, 'mouseenter', () => {
        // console.log("Slider mouseenter - stopping auto slide.");
        stopAutoSlide();
    });
    on(slider, 'mouseleave', () => {
        // console.log("Slider mouseleave - starting auto slide.");
        startAutoSlide();
    });

    // Update on resize to handle width changes - Debounced
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
             console.log("Window resized, updating slider position without transition.");
             updateSliderPosition(false); // Update without smooth transition on resize
        }, 250); // Debounce resize event
    });


    // --- Initialization ---
    console.log("Initializing slider position...");
    // Delay initial update slightly to ensure layout is stable
    setTimeout(() => {
        updateSliderPosition(false); // Set initial position without animation
        startAutoSlide(); // Start automatic sliding after initial position is set
    }, 100); // Small delay


    console.log(`Hero slider initialized for ${sliderSelector}.`);
}
