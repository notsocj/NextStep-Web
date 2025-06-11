document.addEventListener('DOMContentLoaded', function() {
    // Enhanced mobile navigation with better UX
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            body.classList.toggle('nav-open');
            
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.classList.toggle('active');
            });
            
            // Improved accessibility
            const isOpen = navLinks.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            navLinks.setAttribute('aria-hidden', !isOpen);
        });
    }
    
    // Close nav on outside click
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            body.classList.remove('nav-open');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
            
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.remove('active'));
        }
    });
    
    // Enhanced nav item interactions
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                body.classList.remove('nav-open');
                
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            }
        });
    });
    
    // Smooth scrolling with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced header scroll effects
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // Update scroll progress indicator
        updateScrollProgress();
    });
    
    // Scroll progress indicator
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        let indicator = document.querySelector('.scroll-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            document.body.appendChild(indicator);
        }
        
        indicator.style.transform = `scaleX(${scrollPercent / 100})`;
    }
    
    // Enhanced intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Stagger animations for children
                const children = entry.target.querySelectorAll('.service-card, .project-card, .team-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    document.querySelectorAll('.service-card, .project-card, .testimonial-slide, .team-card').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
    
    // Enhanced form handling with better UX
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) return;
            
            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');
            const submitLoader = document.getElementById('submit-loader');
            
            // Enhanced loading state
            submitBtn.classList.add('loading');
            submitText.classList.add('hidden');
            submitLoader.classList.remove('hidden');
            submitBtn.disabled = true;
            
            const formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
                
                // Confetti animation on success
                createConfetti();
            })
            .catch(error => {
                showFormMessage('Oops! There was a problem submitting your form. Please try again.', 'error');
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtn.classList.remove('loading');
                submitText.classList.remove('hidden');
                submitLoader.classList.add('hidden');
                submitBtn.disabled = false;
            });
        });
    }
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        
        // Remove existing error
        clearFieldError(field);
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
        
        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid && value);
        
        return isValid;
    }
    
    function validateForm() {
        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function clearErrors() {
        this.classList.remove('invalid');
        clearFieldError(this);
    }
    
    function showFieldError(field, message) {
        let error = field.parentNode.querySelector('.field-error');
        if (!error) {
            error = document.createElement('div');
            error.className = 'field-error text-red-500 text-sm mt-1';
            field.parentNode.appendChild(error);
        }
        error.textContent = message;
    }
    
    function clearFieldError(field) {
        const error = field.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showFormMessage(message, type) {
        formMessage.className = `mb-6 p-4 rounded-lg ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
        formMessage.innerHTML = `<p>${message}</p>`;
        formMessage.classList.remove('hidden');
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        }
    }
    
    // Confetti animation
    function createConfetti() {
        const colors = ['#0A1A3E', '#2C4F7C', '#4A6FA5'];
        const confetti = [];
        
        for (let i = 0; i < 50; i++) {
            const confettiPiece = document.createElement('div');
            confettiPiece.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                animation: confetti-fall 3s linear forwards;
            `;
            
            document.body.appendChild(confettiPiece);
            confetti.push(confettiPiece);
            
            setTimeout(() => {
                confettiPiece.remove();
            }, 3000);
        }
    }
    
    // Add confetti animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti-fall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Enhanced testimonial slider with better UX
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let autoSlideInterval;
    
    function showSlide(index, direction = 'next') {
        if (slides.length <= 1) return;
        
        const currentSlideEl = slides[currentSlide];
        const nextSlideEl = slides[index];
        
        // Add transition classes
        currentSlideEl.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
        currentSlideEl.style.opacity = '0';
        
        setTimeout(() => {
            currentSlideEl.style.display = 'none';
            currentSlideEl.style.transform = '';
            
            nextSlideEl.style.display = 'block';
            nextSlideEl.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
            nextSlideEl.style.opacity = '0';
            
            setTimeout(() => {
                nextSlideEl.style.transform = 'translateX(0)';
                nextSlideEl.style.opacity = '1';
            }, 50);
        }, 300);
        
        // Update dots
        if (dots.length > 0) {
            dots.forEach(dot => {
                dot.classList.remove('active', 'bg-slate-800');
                dot.classList.add('bg-slate-300');
            });
            
            if (dots[index]) {
                dots[index].classList.add('active', 'bg-slate-800');
                dots[index].classList.remove('bg-slate-300');
            }
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next, 'next');
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev, 'prev');
    }
    
    function startAutoSlide() {
        if (slides.length > 1) {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Initialize slider
    if (slides.length > 1) {
        startAutoSlide();
        
        // Mouse interactions
        const sliderContainer = document.querySelector('.testimonial-slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
        }
        
        // Button controls
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoSlide();
                nextSlide();
                setTimeout(startAutoSlide, 2000);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoSlide();
                prevSlide();
                setTimeout(startAutoSlide, 2000);
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                showSlide(index);
                setTimeout(startAutoSlide, 2000);
            });
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        slides.forEach(slide => {
            slide.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            slide.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                stopAutoSlide();
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                setTimeout(startAutoSlide, 2000);
            }
        }
        
        showSlide(0);
    } else if (slides.length === 1) {
        slides[0].style.display = 'block';
        slides[0].style.opacity = '1';
    }
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            body.classList.remove('nav-open');
            
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.remove('active'));
        }
        
        // Slider keyboard controls
        if (slides.length > 1) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
    
    // Performance optimization: Lazy loading images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('skeleton');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Initialize page
    updateScrollProgress();
});
