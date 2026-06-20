// ============================
// DÉTECTION AUTOMATIQUE DE LANGUE
// MAPR - Multilingual System
// ============================

(function() {
    'use strict';
    
    // === CONFIGURATION ===
    const SUPPORTED_LANGUAGES = ['fr', 'en'];
    const DEFAULT_LANGUAGE = 'fr';
    const STORAGE_KEY = 'mapr_user_language';
    
    // === FONCTION PRINCIPALE ===
    function detectAndRedirect() {
        
        // 1. Vérifier si l'utilisateur a déjà fait un choix
        const savedLang = localStorage.getItem(STORAGE_KEY);
        if (savedLang) {
            console.log('🌐 Langue sauvegardée : ' + savedLang);
            redirectIfNeeded(savedLang);
            return;
        }
        
        // 2. Si aucun choix sauvegardé, détecter la langue du navigateur
        const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        console.log('🌐 Langue navigateur détectée : ' + browserLang);
        
        // 3. Déterminer la langue à utiliser
        let detectedLang = DEFAULT_LANGUAGE;
        
        if (browserLang.startsWith('fr')) {
            detectedLang = 'fr';
        } else {
            // Tout sauf le français → anglais (langue internationale)
            detectedLang = 'en';
        }
        
        console.log('🌐 Langue choisie automatiquement : ' + detectedLang);
        
        // 4. Sauvegarder le choix
        localStorage.setItem(STORAGE_KEY, detectedLang);
        
        // 5. Rediriger si nécessaire
        redirectIfNeeded(detectedLang);
    }
    
    // === REDIRECTION INTELLIGENTE ===
    function redirectIfNeeded(targetLang) {
        const currentPath = window.location.pathname;
        const isInEnglishFolder = currentPath.includes('/en/');
        
        // Si on veut FR et qu'on est dans /en/ → rediriger vers FR
        if (targetLang === 'fr' && isInEnglishFolder) {
            const newPath = currentPath.replace('/en/', '/');
            console.log('🔄 Redirection vers FR : ' + newPath);
            window.location.replace(newPath);
            return;
        }
        
        // Si on veut EN et qu'on n'est PAS dans /en/ → rediriger vers EN
        if (targetLang === 'en' && !isInEnglishFolder) {
            // Construire le chemin EN
            let newPath = currentPath;
            
            // Cas spécial : page d'accueil
            if (currentPath === '/' || currentPath === '/index.html' || currentPath === '') {
                newPath = '/en/index.html';
            } else {
                // Pour les autres pages : ajouter /en/ au début
                newPath = '/en' + currentPath;
            }
            
            console.log('🔄 Redirection vers EN : ' + newPath);
            window.location.replace(newPath);
            return;
        }
        
        // Sinon, on est déjà sur la bonne version
        console.log('✅ Vous êtes sur la bonne version : ' + targetLang);
    }
    
    // === SAUVEGARDE QUAND L'UTILISATEUR CHANGE MANUELLEMENT ===
    function setupManualLangChange() {
        document.addEventListener('click', function(e) {
            const langLink = e.target.closest('.lang-option');
            if (!langLink) return;
            
            const href = langLink.getAttribute('href');
            if (!href || href === '#') return;
            
            // Détecter si on va vers EN ou FR
            const goingToEnglish = href.includes('/en/') || href.includes('en/');
            const userChoice = goingToEnglish ? 'en' : 'fr';
            
            console.log('👆 Choix manuel utilisateur : ' + userChoice);
            localStorage.setItem(STORAGE_KEY, userChoice);
        });
    }
    
    // === LANCEMENT ===
    // Au chargement de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            detectAndRedirect();
            setupManualLangChange();
        });
    } else {
        detectAndRedirect();
        setupManualLangChange();
    }
    
})();