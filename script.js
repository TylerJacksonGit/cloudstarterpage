document.addEventListener('DOMContentLoaded', () => {
    // 1. Horizontal Line Strategy & Section Active States via Intersection Observer
    const sections = document.querySelectorAll('.section');
    const lines = document.querySelectorAll('.horizontal-line');
    
    // Observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.3 // Trigger when 30% of the section is visible
    });

    sections.forEach(sec => sectionObserver.observe(sec));

    // Observer for horizontal lines growing from center
    const lineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find the child .horizontal-line and expand it
                const line = entry.target.querySelector('.horizontal-line');
                if (line) {
                    line.classList.add('grow');
                }
            }
        });
    }, {
        threshold: 0.1
    });

    const lineWrappers = document.querySelectorAll('.horizontal-line-wrapper');
    lineWrappers.forEach(wrapper => lineObserver.observe(wrapper));


    // 2. Subtle Bird Flap on Scroll interaction
    let scrollTimeout;
    const birds = document.querySelectorAll('.corner-bird');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        // Background Scroll bleed percentage
        const scrollTop = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        
        document.body.style.setProperty('--scroll-percent', `${scrollPercent}%`);
        if (scrollTop > 10) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }

        // Debounce to prevent over-triggering
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                const currentScrollY = window.scrollY;
                const scrollDelta = Math.abs(currentScrollY - lastScrollY);
                
                // If scrolled significantly, flap the birds
                if (scrollDelta > 50) {
                    birds.forEach(bird => {
                        // Remove then immediately re-add class to restart animation
                        bird.classList.remove('flap-action');
                        // Trigger reflow
                        void bird.offsetWidth;
                        bird.classList.add('flap-action');
                    });
                    lastScrollY = currentScrollY;
                }
                
                scrollTimeout = null;
            }, 100); // Check every 100ms during scroll
        }
    }, { passive: true });
});
