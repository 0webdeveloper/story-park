class StickyHeader {
    constructor(headerSelector = 'header', threshold = 100) {
      this.header = document.querySelector(headerSelector);
      this.threshold = threshold;
      this.lastScrollPosition = 0;
      this.isHidden = false;
      
      if (!this.header) return;
      
      // Сохраняем оригинальную высоту header для правильного масштабирования
      this.originalHeight = this.header.offsetHeight;
      
      // Инициализация стилей
      Object.assign(this.header.style, {
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        position: 'sticky',
        top: '0',
        left: '0',
        right: '0',
        zIndex: '2',
        transformOrigin: 'top center' // Для красивого масштабирования сверху
      });
      
      // Добавляем обработчик события с throttle
      window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));
    }
    
    handleScroll() {
      const currentScrollPosition = window.pageYOffset;
      
      // Прокрутка вниз - скрываем header с уменьшением
      if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > this.threshold) {
        if (!this.isHidden) {
          this.header.style.transform = 'translateY(-100%) scale(0.99)';
          this.header.style.opacity = '0.7';
          this.isHidden = true;
        }
      } 
      // Прокрутка вверх - показываем header в нормальном размере
      else if (currentScrollPosition < this.lastScrollPosition) {
        if (this.isHidden) {
          this.header.style.transform = 'translateY(0) scale(1)';
          this.header.style.opacity = '1';
          this.isHidden = false;
        }
      }
      
      this.lastScrollPosition = currentScrollPosition;
    }
    
    // Функция throttle для оптимизации производительности
    throttle(func, limit) {
      let lastFunc;
      let lastRan;
      return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
          func.apply(context, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(function() {
            if ((Date.now() - lastRan) >= limit) {
              func.apply(context, args);
              lastRan = Date.now();
            }
          }, limit - (Date.now() - lastRan));
        }
      };
    }
  }

document.addEventListener('DOMContentLoaded', function() {

    new StickyHeader();

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navigation = document.querySelector('nav');
    const mainMenu = document.querySelector('.main-menu');
    
    mobileMenuToggle.addEventListener('click', function() {
        mainMenu.classList.toggle('hidden'); 
        mainMenu.classList.toggle('block'); 
        // const menu = navigation.querySelector('.hidden.md\\:flex');
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

                mainMenu.classList.toggle('hidden'); 
                mainMenu.classList.toggle('block'); 
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
    document.querySelectorAll('.section').forEach(section => {
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
            this.style.transform = '';
        });
    });

    // Draggable and zoomable scheme-image-block (only when first tab is active)
    const schemeProjectLabel = document.getElementById('scheme-project-label');
    const schemeMapLabel = document.getElementById('scheme-map-label');
    const schemeImageBlock = document.getElementById('scheme-image-block');
    const schemeImageInner = schemeImageBlock.querySelector('div');
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let imgStart = { x: 0, y: 0 };
    let scale = 1;
    let minScale = 0.5;
    let maxScale = 2.5;

    function setTransform() {
        schemeImageInner.style.transform = `translate(${imgStart.x}px, ${imgStart.y}px) scale(${scale})`;
    }

    schemeImageInner.addEventListener('mousedown', function(e) {
        if (schemeImageBlock.classList.contains('hidden')) return;
        isDragging = true;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
        schemeImageInner.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        imgStart.x += dx;
        imgStart.y += dy;
        setTransform();
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
    });
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            schemeImageInner.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
    schemeImageInner.addEventListener('wheel', function(e) {
        if (schemeImageBlock.classList.contains('hidden')) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.min(maxScale, Math.max(minScale, scale + delta));
        setTransform();
    }, { passive: false });
    // Reset position/scale when switching tabs
    schemeProjectLabel.addEventListener('click', function() {
        imgStart = { x: 0, y: 0 };
        scale = 1;
        setTransform();
    });
    schemeMapLabel.addEventListener('click', function() {
        imgStart = { x: 0, y: 0 };
        scale = 1;
        setTransform();
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







    const markers = schemeImageBlock.querySelectorAll('button'),
          markerModal = document.getElementById('markerModal'),
          markerModalBackdrop = document.getElementById('markerModalBackdrop'),
          markerModalContainer = document.getElementById('markerModalContainer');

    markers.forEach(marker => {
        marker.addEventListener('click', function() {
            const target = document.querySelector(this.getAttribute('data-target'));
            markerModal.classList.remove('invisible');
            markerModal.classList.remove('opacity-0');
            // Animate backdrop in
            markerModalBackdrop.classList.add('opacity-100');
            markerModalBackdrop.classList.remove('opacity-0');
            setTimeout(() => {
                // Animate container in after backdrop
                markerModalContainer.classList.remove('translate-y-full', 'opacity-0');
                markerModalContainer.classList.add('translate-y-0', 'opacity-100');
            }, 200);
        })
    });

    markerModal.addEventListener('click', function(e) {
        // Only close if clicking on backdrop
        if (e.target === markerModal || e.target === markerModalBackdrop) {
            // Animate container out
            markerModalContainer.classList.remove('translate-y-0', 'opacity-100');
            markerModalContainer.classList.add('translate-y-full', 'opacity-0');
            // Animate backdrop out after container
            setTimeout(() => {
                markerModalBackdrop.classList.remove('opacity-100');
                markerModalBackdrop.classList.add('opacity-0');
                setTimeout(() => {
                    markerModal.classList.add('invisible');
                }, 300);
            }, 200);
        }
    });

    })

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
    // const apartmentsData = [
    //     {
    //         type: 'Студия',
    //         area: '25-30',
    //         price: '2.5-3.2',
    //         image: '/api/placeholder/300/200'
    //     },
    //     {
    //         type: '1-комнатная',
    //         area: '35-42',
    //         price: '3.8-4.5',
    //         image: '/api/placeholder/300/200'
    //     },
    //     {
    //         type: '2-комнатная',
    //         area: '55-68',
    //         price: '5.2-6.8',
    //         image: '/api/placeholder/300/200'
    //     },
    //     {
    //         type: '3-комнатная',
    //         area: '75-95',
    //         price: '7.1-9.2',
    //         image: '/api/placeholder/300/200'
    //     }
    // ];

    // Interactive map functionality (placeholder)
    // function initializeMap() {
    //     const mapContainer = document.querySelector('.h-96.bg-gradient-to-br');
    //     if (mapContainer) {
    //         mapContainer.addEventListener('click', function() {
    //             // Here you would integrate with a real mapping service
    //             console.log('Opening interactive map...');
    //         });
    //     }
    // }

    // initializeMap();


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





/**
 * Яндекс.Карта с двумя пользовательскими метками в Липецке.
 *
 * @function
 * @returns {void}
 */

ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map("map", {
        center: [52.6100, 39.5942], // Центр Липецка
        zoom: 12
    });
    myMap.behaviors.disable('scrollZoom');

    // Первая метка
    var myPlacemark = new ymaps.Placemark(
        [52.617061, 39.571893], // Координаты центра Липецка
        {
            balloonContent: "Центр Липецка",
            hintContent: "Центр города"
        },
        {
            iconLayout: 'default#image',
            iconImageHref: '../assets/img/pin.svg',
            iconImageSize: [40, 40], // Размеры иконки
            iconImageOffset: [-20, -40] // Смещение иконки
        }
    );

    // Вторая метка
    var myPlacemark2 = new ymaps.Placemark(
        [52.639002, 39.519604],
        {
            balloonContent: "Вторая метка в Липецке",
            hintContent: "Вторая точка"
        },
        {
            iconLayout: 'default#image',
            iconImageHref: '../assets/img/pin.svg',
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -40]
        }
    );

    myMap.geoObjects.add(myPlacemark);
    myMap.geoObjects.add(myPlacemark2);
}





        const modal = document.getElementById('apartmentModal');
        const openBtn = document.querySelectorAll('.openModalBtn');
        const closeBtn = document.getElementById('closeModalBtn');
        
        // Открытие модального окна
        openBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.showModal();
                document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
            });
        })

        
        // Закрытие модального окна кнопкой
        closeBtn.addEventListener('click', () => {
            modal.close();
            document.body.style.overflow = 'auto'; // Разблокируем скролл страницы
        });
        
        // Закрытие модального окна по клику на backdrop
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.close();
                document.body.style.overflow = 'auto';
            }
        });
        
        // Закрытие модального окна по ESC (встроенная функция dialog)
        modal.addEventListener('close', () => {
            document.body.style.overflow = 'auto';
        });
        
        // Обработка отправки формы
        const contactForm = document.getElementById('contactForm');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Предотвращаем стандартную отправку формы
            
            // Получаем данные формы
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                comment: formData.get('comment')
            };
            
            console.log('Данные формы:', data);
            
            // Здесь можно добавить отправку данных на сервер
            // fetch('/api/contact', { method: 'POST', body: formData })
            
            // Показываем сообщение об успехе
            alert('Спасибо за заявку! Наш менеджер свяжется с вами в ближайшее время.');
            
            // Закрываем модальное окно и очищаем форму
            modal.close();
            contactForm.reset();
            document.body.style.overflow = 'auto';
        });
        
        // Маска для телефона
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] !== '7') {
                    value = '7' + value;
                }
                value = value.substring(0, 11);
                const formatted = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
                e.target.value = formatted;
            }
        });

    // --- Scheme Switcher Animated Indicator ---
    const schemeSwitcher = document.getElementById('scheme-switcher');
    const schemeIndicator = document.getElementById('scheme-indicator');
    const schemeProjectLabel = document.getElementById('scheme-project-label');
    const schemeMapLabel = document.getElementById('scheme-map-label');
    const schemeImageBlock = document.getElementById('scheme-image-block');
    const schemeMapBlock = document.getElementById('scheme-map-block');
    
    let schemeActive = 'project';
    
    function setSchemeActive(type) {
      schemeActive = type;
      if (type === 'project') {
        schemeIndicator.style.left = '4px';
        schemeProjectLabel.classList.add('text-navy');
        schemeMapLabel.classList.remove('text-navy');
        schemeImageBlock.classList.remove('hidden');
        schemeMapBlock.classList.add('hidden');
      } else {
        schemeIndicator.style.left = '132px';
        schemeMapLabel.classList.add('text-navy');
        schemeProjectLabel.classList.remove('text-navy');
        schemeImageBlock.classList.add('hidden');
        schemeMapBlock.classList.remove('hidden');
        // Инициализация карты, если требуется (оставить как есть)
        if (!window.schemeMapInited && typeof ymaps !== 'undefined') {
          ymaps.ready(function() {
            window.schemeMapInited = true;
            var schemeMap = new ymaps.Map('scheme-map', {
              center: [52.624835, 39.538374],
              zoom: 13,
              controls: ['zoomControl']
            });
            // Add markers as in the footer map
            var schemePlacemark1 = new ymaps.Placemark(
              [52.617061, 39.571893],
              {
                balloonContent: "Центр Липецка",
                hintContent: "Центр города"
              },
              {
                iconLayout: 'default#image',
                iconImageHref: '../assets/img/pin.svg',
                iconImageSize: [40, 40],
                iconImageOffset: [-20, -40]
              }
            );
            var schemePlacemark2 = new ymaps.Placemark(
              [52.639002, 39.519604],
              {
                balloonContent: "Вторая метка в Липецке",
                hintContent: "Вторая точка"
              },
              {
                iconLayout: 'default#image',
                iconImageHref: '../assets/img/pin.svg',
                iconImageSize: [40, 40],
                iconImageOffset: [-20, -40]
              }
            );
            schemeMap.geoObjects.add(schemePlacemark1);
            schemeMap.geoObjects.add(schemePlacemark2);
          });
        }
      }
    }
    
    schemeProjectLabel.addEventListener('click', function() {
      if (schemeActive !== 'project') setSchemeActive('project');
    });
    schemeMapLabel.addEventListener('click', function() {
      if (schemeActive !== 'map') setSchemeActive('map');
    });
    
    setSchemeActive('project');
