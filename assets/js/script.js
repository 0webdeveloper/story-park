// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navigation = document.querySelector('nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        const menu = navigation.querySelector('.hidden.md\\:flex');
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
        menu.classList.toggle('flex-col');
        menu.classList.toggle('absolute');
        menu.classList.toggle('top-full');
        menu.classList.toggle('left-0');
        menu.classList.toggle('w-full');
        menu.classList.toggle('bg-white');
        menu.classList.toggle('shadow-lg');
        menu.classList.toggle('p-4');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header background change on scroll
    // const header = document.querySelector('header');
    // window.addEventListener('scroll', function() {
    //     if (window.scrollY > 100) {
    //         header.classList.add('bg-white', 'shadow-md');
    //         header.classList.remove('bg-transparent');
    //     } else {
    //         header.classList.add('bg-transparent');
    //         header.classList.remove('bg-white', 'shadow-md');
    //     }
    // });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                } else {
                    input.classList.remove('border-red-500');
                }
            });
            
            if (isValid) {
                // Here you would normally send the data to your server
                alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
                this.reset();
            } else {
                alert('Пожалуйста, заполните все обязательные поля.');
            }
        });
    }

    // Apartment cards hover effects
    document.querySelectorAll('.hover\\:shadow-xl').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Counter animation for statistics
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        updateCounter();
    }

    // Parallax effect for hero section
    // window.addEventListener('scroll', function() {
    //     const scrolled = window.pageYOffset;
    //     const parallax = document.querySelector('#home');
    //     const speed = scrolled * 0.5;
        
    //     if (parallax) {
    //         parallax.style.transform = `translateY(${speed}px)`;
    //     }
    // });

    // Load apartments data (placeholder for dynamic content)
    const apartmentsData = [
        {
            type: 'Студия',
            area: '25-30',
            price: '2.5-3.2',
            image: '/api/placeholder/300/200'
        },
        {
            type: '1-комнатная',
            area: '35-42',
            price: '3.8-4.5',
            image: '/api/placeholder/300/200'
        },
        {
            type: '2-комнатная',
            area: '55-68',
            price: '5.2-6.8',
            image: '/api/placeholder/300/200'
        },
        {
            type: '3-комнатная',
            area: '75-95',
            price: '7.1-9.2',
            image: '/api/placeholder/300/200'
        }
    ];

    // Interactive map functionality (placeholder)
    function initializeMap() {
        const mapContainer = document.querySelector('.h-96.bg-gradient-to-br');
        if (mapContainer) {
            mapContainer.addEventListener('click', function() {
                // Here you would integrate with a real mapping service
                console.log('Opening interactive map...');
            });
        }
    }

    initializeMap();
});

// Utility functions for modern interactions
class ModernInteractions {
    static addHoverEffect(element, scale = 1.05) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = `scale(${scale})`;
            element.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    }
    
    static addClickRipple(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

// Apply modern interactions to buttons
document.querySelectorAll('button').forEach(button => {
    ModernInteractions.addClickRipple(button);
});

// CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);



ymaps.ready(init);
function init () {
    var myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10
    });
    myMap.behaviors.disable('scrollZoom');
    var myPlacemark = new ymaps.Placemark(myMap.getCenter(),{
        balloonContent: "Здесь какой-то текст для балуна",
        hintContent:'Здесь какой-то текст для хинта'
    });
    var myPlacemark2 = new ymaps.Placemark([55.77722100860132,37.71822337109375]);
    myMap.geoObjects.add(myPlacemark);
    myMap.geoObjects.add(myPlacemark2);
}
