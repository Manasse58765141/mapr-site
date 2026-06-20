// ============================
// DÉTECTION AUTOMATIQUE DE LANGUE
// MAPR - Multilingual System v2.0
// ============================

(function() {
    'use strict';
    
    // === CONFIGURATION ===
    const SUPPORTED_LANGUAGES = ['fr', 'en'];
    const DEFAULT_LANGUAGE = 'fr';
    const STORAGE_KEY = 'mapr_user_language';
    
    // === ÉTAPE 1 : INTERCEPTER LES CLICS DE LANGUE EN PREMIER ===
    // (TRÈS IMPORTANT : doit s'exécuter AVANT la détection)
    function setupManualLangChange() {
        document.addEventListener('click', function(e) {
            const langLink = e.target.closest('.lang-option');
            if (!langLink) return;
            
            const href = langLink.getAttribute('href');
            if (!href || href === '#') return;
            
            // Détecter si on va vers EN ou FR
            const goingToEnglish = href.includes('/en/') || 
                                   href.startsWith('en/') ||
                                   href === '../en/index.html';
            const userChoice = goingToEnglish ? 'en' : 'fr';
            
            // ⚡ SAUVEGARDER IMMÉDIATEMENT (avant que la page change)
            try {
                localStorage.setItem(STORAGE_KEY, userChoice);
                console.log('💾 Choix utilisateur sauvegardé : ' + userChoice);
            } catch(err) {
                console.warn('⚠️ localStorage non disponible');
            }
        }, true); // ← true = capture phase (priorité)
    }
    
    // === ÉTAPE 2 : DÉTECTION ET REDIRECTION ===
    function detectAndRedirect() {
        
        // 1. PRIORITÉ ABSOLUE : choix manuel sauvegardé
        let savedLang = null;
        try {
            savedLang = localStorage.getItem(STORAGE_KEY);
        } catch(err) {
            console.warn('⚠️ localStorage non disponible');
        }
        
        if (savedLang) {
            console.log('🌐 Langue sauvegardée trouvée : ' + savedLang);
            console.log('✋ Respect du choix utilisateur (pas de détection auto)');
            // L'utilisateur a fait un choix → ON LE RESPECTE
            // On vérifie juste qu'il est sur la bonne version
            redirectIfNeeded(savedLang, false); // false = pas de sauvegarde
            return;
        }
        
        // 2. Aucun choix sauvegardé → première visite
        // → On détecte la langue du navigateur
        const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        console.log('🌐 Première visite. Langue navigateur : ' + browserLang);
        
        let detectedLang = DEFAULT_LANGUAGE;
        
        if (browserLang.startsWith('fr')) {
            detectedLang = 'fr';
        } else {
            detectedLang = 'en';
        }
        
        console.log('🌐 Langue choisie automatiquement : ' + detectedLang);
        
        // 3. SAUVEGARDER cette détection (pour les visites futures)
        try {
            localStorage.setItem(STORAGE_KEY, detectedLang);
            console.log('💾 Langue auto sauvegardée : ' + detectedLang);
        } catch(err) {}
        
        // 4. Rediriger si nécessaire
        redirectIfNeeded(detectedLang, true);
    }
    
    // === REDIRECTION INTELLIGENTE ===
    function redirectIfNeeded(targetLang, isAutoDetection) {
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
            let newPath = currentPath;
            
            // Cas spécial : page d'accueil
            if (currentPath === '/' || currentPath === '/index.html' || currentPath === '') {
                newPath = '/en/index.html';
            } else {
                // ⚠️ ATTENTION : on ne redirige PAS si la page EN n'existe pas
                // Pour l'instant, seul en/index.html existe
                // Donc on ne redirige automatiquement QUE pour la home
                if (!isAutoDetection) {
                    // Choix manuel : on essaye de rediriger
                    newPath = '/en' + currentPath;
                } else {
                    // Détection auto : on ne redirige que pour la home
                    console.log('ℹ️ Page EN non disponible pour : ' + currentPath);
                    return;
                }
            }
            
            console.log('🔄 Redirection vers EN : ' + newPath);
            window.location.replace(newPath);
            return;
        }
        
        // Sinon, on est déjà sur la bonne version
        console.log('✅ Vous êtes sur la bonne version : ' + targetLang);
    }
    
    // === LANCEMENT ===
    
    // ⚡ TRÈS IMPORTANT : on installe les clics EN PREMIER
    // pour qu'ils interceptent même si la détection démarre
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupManualLangChange();  // 1er : intercepter les clics
            detectAndRedirect();       // 2ème : détecter et rediriger
        });
    } else {
        setupManualLangChange();
        detectAndRedirect();
    }
    
})();