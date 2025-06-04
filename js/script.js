// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.classList.toggle('active');
            });
        });
    }
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                
                // Reset hamburger animation
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.classList.remove('active');
                });
            }
        });
    });
    
    // Scroll to sections smoothly
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .project-card, .testimonial-slide');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    document.querySelectorAll('.service-card, .project-card, .testimonial-slide').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
      // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');
            const submitLoader = document.getElementById('submit-loader');
            
            // Show loading state
            submitText.classList.add('hidden');
            submitLoader.classList.remove('hidden');
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Send form data using fetch API to Formspree
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
                // Show success message
                formMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700');
                formMessage.classList.add('bg-green-100', 'text-green-700');
                formMessage.innerHTML = '<p>Thank you for your message! We will get back to you soon.</p>';
                
                // Reset form
                contactForm.reset();
            })
            .catch(error => {
                // Show error message
                formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                formMessage.classList.add('bg-red-100', 'text-red-700');
                formMessage.innerHTML = '<p>Oops! There was a problem submitting your form. Please try again or contact us directly.</p>';
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button state
                submitText.classList.remove('hidden');
                submitLoader.classList.add('hidden');
                submitBtn.disabled = false;
            });
        });
    }
});

// Enhanced testimonial slider
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
        slide.style.opacity = '0';
        setTimeout(() => {
            slide.style.display = 'none';
        }, 300);
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
        dot.classList.add('bg-slate-300');
        dot.classList.remove('bg-blue-700');
    });
    
    // Show current slide
    setTimeout(() => {
        slides[index].style.display = 'block';
        setTimeout(() => {
            slides[index].style.opacity = '1';
        }, 50);
    }, 300);
    
    // Update active dot
    if (dots[index]) {
        dots[index].classList.add('active');
        dots[index].classList.remove('bg-slate-300');
        dots[index].classList.add('bg-blue-700');
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Initialize slider if testimonials exist
if (slides.length > 1) {
    // Auto-advance slider
    const autoSlide = setInterval(nextSlide, 5000);
    
    // Navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(autoSlide);
            nextSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(autoSlide);
            prevSlide();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoSlide);
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Initialize first slide
    showSlide(0);
} else if (slides.length === 1) {
    // Show single slide
    slides[0].style.display = 'block';
    slides[0].style.opacity = '1';
}
