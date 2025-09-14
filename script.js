// Configuração e inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initNavigation();
    initCarousel();
    initScrollEffects();
    initProductInteractions();
    initContactForm();
    initMobileMenu();
    initLazyLoading();
    initInfinitePay();
}

// Navegação suave e ativa
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Navegação por clique
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Remove classe ativa de todos os links
                navLinks.forEach(nav => nav.classList.remove('active'));
                // Adiciona classe ativa ao link clicado
                this.classList.add('active');
                
                // Scroll suave para a seção
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Fechar menu mobile se estiver aberto
                const navMenu = document.getElementById('nav-menu');
                const hamburger = document.getElementById('hamburger');
                if (navMenu && hamburger) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Navegação por scroll (destacar seção ativa)
    window.addEventListener('scroll', throttle(() => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// Carousel infinito melhorado
function initCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    
    if (!carouselContainer || !carouselTrack) return;

    // Pausar animação no hover
    carouselContainer.addEventListener('mouseenter', () => {
        carouselTrack.style.animationPlayState = 'paused';
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        carouselTrack.style.animationPlayState = 'running';
    });

    // Pausar animação quando não estiver visível (performance)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                carouselTrack.style.animationPlayState = 'running';
            } else {
                carouselTrack.style.animationPlayState = 'paused';
            }
        });
    });

    observer.observe(carouselContainer);
}

// Efeitos de scroll
function initScrollEffects() {
    // Parallax no hero
    const hero = document.querySelector('.hero');
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }

        // Navbar background no scroll
        if (navbar) {
            if (scrolled > 100) {
                navbar.style.background = 'rgba(15, 15, 35, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(15, 15, 35, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    }, 16));

    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.product-card, .feature-card, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// Interações dos produtos
function initProductInteractions() {
    // Botões de compra
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', handlePurchaseClick);
    });

    // Botões de download gratuito
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', handleDownloadClick);
    });

    // Botões de preview
    const previewButtons = document.querySelectorAll('.preview-btn');
    previewButtons.forEach(button => {
        button.addEventListener('click', handlePreviewClick);
    });
}

// Manipuladores de eventos dos produtos
function handlePurchaseClick(e) {
    const button = e.target;
    const productId = button.getAttribute('data-product');
    const price = button.getAttribute('data-price');
    
    // Feedback visual
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Redirecionando...';
    button.disabled = true;

    // Redirecionar para Infinite Pay
    setTimeout(() => {
        redirectToInfinitePay(productId, price);
        
        // Restaurar botão após delay
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 3000);
    }, 1000);

    // Analytics
    trackEvent('purchase_click', { product_id: productId, price: price });
}

function handleDownloadClick(e) {
    const button = e.target;
    const productId = button.getAttribute('data-product');
    
    // Feedback visual
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Preparando...';
    button.disabled = true;

    // Simular download
    setTimeout(() => {
        // Aqui você implementaria o download real
        showNotification('Download iniciado! Verifique sua pasta de downloads.', 'success');
        
        button.innerHTML = '<i class="fas fa-check"></i> Baixado!';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 3000);
    }, 2000);

    trackEvent('download_click', { product_id: productId });
}

function handlePreviewClick(e) {
    const button = e.target;
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;

    
    showNotification(`Preview de "${productName}" em breve!`, 'info');
    
    trackEvent('preview_click', { product_name: productName });
}

function initInfinitePay() {
   
    window.infinitePayConfig = {
        baseUrl: 'https://loja.infinitepay.io/alex-santos-549/',
        products: {
            'infinity-pads': 'infinity-pads-39',
            'infinity-mix': 'infinity-mix-89',
            'abba-keys': 'abba-keys-220',
            'vst-stage': 'vgf8152-vst-stage',
            'curso-reaper': 'curso-reaper-15'
        }
    };
}

function redirectToInfinitePay(productId, price) {
    const config = window.infinitePayConfig;
    const productCode = config.products[productId];
    
    if (productCode) {
        const paymentUrl = `${config.baseUrl}${productCode}`;
        
        
        window.open(paymentUrl, '_blank');
        
        showNotification('Redirecionando para pagamento seguro...', 'info');
    } else {
        
        const fallbackUrl = `${config.baseUrl}vgf8152-vst-stage`;
        window.open(fallbackUrl, '_blank');
        
        showNotification('Redirecionando para nossa loja...', 'info');
    }
}


function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
 
    if (!data.name || !data.email || !data.message) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }

    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading"></span> Enviando...';
    submitButton.disabled = true;

    
    setTimeout(() => {
        showNotification('Mensagem enviada com sucesso! Responderemos em breve.', 'success');
        e.target.reset();
        
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);

    trackEvent('contact_form_submit', data);
}


function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });

        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}


function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Mostrar notificação
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remover após 5 segundos
    const autoRemove = setTimeout(() => removeNotification(notification), 5000);

    // Remover ao clicar no X
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}


function trackEvent(eventName, data = {}) {
    
    console.log('Event tracked:', eventName, data);
    
    
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
    }

    
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, data);
    }
}


function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}


function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


function addBackToTopButton() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;

    document.body.appendChild(backToTopButton);

    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    }, 100));

    backToTopButton.addEventListener('click', smoothScrollToTop);
}


document.addEventListener('DOMContentLoaded', addBackToTopButton);


function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="loading"></div>
            <p>Carregando D.A.W.LOAD...</p>
        </div>
    `;
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;

    document.body.appendChild(preloader);

   
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }, 1000);
    });
}


