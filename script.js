// ===== MENU MOBILE =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fermer le menu après clic sur un lien
document.querySelectorAll('.nav__menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===== HEADER SCROLL =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(26, 58, 107, 0.98)';
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(26, 58, 107, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// ===== COMPTEUR ANIMÉ =====
const counters = document.querySelectorAll('.impact__number[data-target]');

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
        current += step;
        if (current < target) {
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(update);
        } else {
            counter.textContent = target;
        }
    };
    update();
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => observer.observe(counter));

// ===== ANIMATION AU SCROLL =====
const fadeElements = document.querySelectorAll('.pilier-card, .impact__card, .partenaire-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});
// ============================
// SÉLECTEUR DE LANGUE — VERSION ROBUSTE
// ============================

// On attend que la page soit ENTIÈREMENT chargée
document.addEventListener('DOMContentLoaded', function() {
    
    const langBtn = document.getElementById('langBtn');
    const langSelector = document.querySelector('.lang-selector');
    
    if (langBtn && langSelector) {
        console.log('✅ Sélecteur de langue trouvé et activé');
        
        // Ouvrir/fermer le menu au clic
        langBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            langSelector.classList.toggle('open');
            console.log('🌐 Menu langue : ' + (langSelector.classList.contains('open') ? 'ouvert' : 'fermé'));
        });

        // Fermer si on clique ailleurs
        document.addEventListener('click', function(e) {
            if (!langSelector.contains(e.target)) {
                langSelector.classList.remove('open');
            }
        });
        
        // Empêcher la fermeture quand on clique DANS le dropdown
        const langDropdown = document.getElementById('langDropdown');
        if (langDropdown) {
            langDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    } else {
        console.warn('⚠️ Sélecteur de langue non trouvé sur cette page');
    }
});

// ============================
// GOOGLE TRANSLATE
// ============================

function openGoogleTranslate() {
    console.log('🌍 Ouverture de Google Translate');
    
    // Fermer le menu langue
    const langSelector = document.querySelector('.lang-selector');
    if (langSelector) langSelector.classList.remove('open');
    
    // Si le widget existe déjà, juste l'afficher
    let widget = document.getElementById('google_translate_widget');
    if (widget) {
        widget.classList.add('visible');
        return;
    }
    
    // Créer le widget
    widget = document.createElement('div');
    widget.id = 'google_translate_widget';
    widget.innerHTML = `
        <button class="google-translate-close" onclick="document.getElementById('google_translate_widget').classList.remove('visible')" aria-label="Fermer">×</button>
        <div id="google_translate_element"></div>
    `;
    document.body.appendChild(widget);
    
    // Charger Google Translate (si pas déjà chargé)
    if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
    } else {
        // Si déjà chargé, juste réinitialiser
        if (typeof googleTranslateElementInit === 'function') {
            googleTranslateElementInit();
        }
    }
    
    // Afficher le widget
    setTimeout(function() {
        widget.classList.add('visible');
    }, 100);
}

// Configuration Google Translate
function googleTranslateElementInit() {
    if (typeof google !== 'undefined' && google.translate) {
        new google.translate.TranslateElement({
            pageLanguage: 'fr',
            includedLanguages: 'en,es,pt,de,it,zh-CN,ar,ru,ja,ko,hi,sw',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');
    }
}

// Rendre les fonctions accessibles globalement
window.googleTranslateElementInit = googleTranslateElementInit;
window.openGoogleTranslate = openGoogleTranslate;