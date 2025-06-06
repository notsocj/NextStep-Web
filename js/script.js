document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {            hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.classList.toggle('active');
            });
        });    }
    
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.classList.remove('active');
                });
            }
        });    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });    });
    
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }    });
    
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .project-card, .testimonial-slide');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });    };
    
    document.querySelectorAll('.service-card, .project-card, .testimonial-slide').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';    });
    
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');            const submitLoader = document.getElementById('submit-loader');
            
            submitText.classList.add('hidden');
            submitLoader.classList.remove('hidden');            submitBtn.disabled = true;
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
                }            })
            .then(data => {
                formMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700');
                formMessage.classList.add('bg-green-100', 'text-green-700');                formMessage.innerHTML = '<p>Thank you for your message! We will get back to you soon.</p>';
                
                contactForm.reset();            })
            .catch(error => {
                formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                formMessage.classList.add('bg-red-100', 'text-red-700');
                formMessage.innerHTML = '<p>Oops! There was a problem submitting your form. Please try again or contact us directly.</p>';
                console.error('Error:', error);            })
            .finally(() => {
                submitText.classList.remove('hidden');
                submitLoader.classList.add('hidden');
                submitBtn.disabled = false;
            });
        });
    }
});

let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');

function showSlide(index) {
    slides.forEach(slide => {
        slide.style.opacity = '0';
        setTimeout(() => {
            slide.style.display = 'none';
        }, 300);    });
    
    dots.forEach(dot => {
        dot.classList.remove('active');
        dot.classList.add('bg-slate-300');
        dot.classList.remove('bg-blue-700');    });
    
    setTimeout(() => {
        slides[index].style.display = 'block';
        setTimeout(() => {
            slides[index].style.opacity = '1';
        }, 50);    }, 300);
    
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

if (slides.length > 1) {
    const autoSlide = setInterval(nextSlide, 5000);
    
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
        });    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoSlide);
            currentSlide = index;
            showSlide(currentSlide);
        });    });
    
    showSlide(0);
} else if (slides.length === 1) {
    slides[0].style.display = 'block';
    slides[0].style.opacity = '1';
}
