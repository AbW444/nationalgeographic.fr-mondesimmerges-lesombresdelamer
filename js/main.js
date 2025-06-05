// JavaScript principal avec support tactile et responsive
// Variables globales
let currentGalleryIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let isMenuOpen = false;
let currentLanguage = 'fr'; // NOUVELLE VARIABLE GLOBALE

// Variables pour les contrôles vidéo - DÉPLACÉES EN GLOBAL
let controlsHideTimeout;
let pauseHideTimeout;
let docVideo, videoContainer, playButton; // DÉCLARATION GLOBALE

document.addEventListener("DOMContentLoaded", function() {
    console.log('=== DEMARRAGE APPLICATION MOBILE/TACTILE ===');
    
    // Détection du type d'appareil
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1025;
    const isDesktop = window.innerWidth >= 1025;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // *** NOUVEAU LOADER AVEC L-JELLY VISIBLE ***
    document.body.classList.add('loading');
    
    // Créer le nouveau loader avec l-jelly - comme dans app.js
    const customLoader = document.createElement('div');
    customLoader.className = 'custom-loader';
    customLoader.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: #000 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        z-index: 999999 !important;
        opacity: 1 !important;
        visibility: visible !important;
        transition: opacity 0.8s ease !important;
    `;
    
    // Enregistrer l-jelly si nécessaire (comme dans app.js)
    if (window.jelly && window.jelly.register) {
        window.jelly.register();
    }
    
    // Créer l'élément l-jelly comme dans app.js
    const jellyLoader = document.createElement('l-jelly');
    jellyLoader.setAttribute('size', '60');
    jellyLoader.setAttribute('speed', '1.2');
    jellyLoader.setAttribute('color', '#ffcc00');
    jellyLoader.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
    `;
    
    customLoader.appendChild(jellyLoader);
    document.body.appendChild(customLoader);
    
    console.log('Loader l-jelly créé et affiché');
    
    // Force le retour en haut
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // LANCER LA VIDÉO IMMÉDIATEMENT
    startGlobeVideoImmediately();
    
    // MASQUER LE LOADER APRÈS 2 SECONDES ET RÉVÉLER LE SITE
    setTimeout(() => {
        console.log('=== MASQUAGE DU LOADER ET RÉVÉLATION DU SITE ===');
        
        // Transition fluide du loader
        customLoader.style.opacity = '0';
        
        setTimeout(() => {
            customLoader.remove();
            document.body.classList.remove('loading');
            
            // Initialiser le curseur personnalisé UNIQUEMENT sur desktop avec souris
            if (isDesktop && !isTouchDevice) {
                initCustomCursor();
                console.log('Curseur personnalisé initialisé pour desktop');
            }
            
            console.log('Site révélé, vidéo active');
        }, 800);
        
    }, 2000);
    
    // Masquer l'ancien loader s'il existe
    const oldLoader = document.querySelector('.loader');
    if (oldLoader) {
        oldLoader.style.display = 'none';
    }
    
    // Initialiser toutes les fonctionnalités
    initGlobalLoader();
    initMobileMenu();
    initAnimations();
    initSideNav();
    initBackToTop();
    initShareButtons();
    initTranslateButton(); // UNE SEULE FOIS
    fixVideos();
    initLogoClick();
    initGallery();
    initReturnExploration();
    animateNavLinks();
    
    // Gestion du redimensionnement
    window.addEventListener('resize', handleResize);
    
    function handleResize() {
        const newIsMobile = window.innerWidth < 768;
        const newIsTablet = window.innerWidth >= 768 && window.innerWidth < 1025;
        
        // Fermer le menu mobile si on passe à desktop
        if (window.innerWidth >= 1025 && isMenuOpen) {
            closeMenu();
        }
        
        // Réinitialiser la galerie si nécessaire
        if ((isMobile && !newIsMobile) || (!isMobile && newIsMobile)) {
            initGallery();
        }
    }
    
    // Force le retour en haut lors du rechargement
    window.addEventListener('beforeunload', function() {
        window.scrollTo(0, 0);
    });
    
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
    
    console.log('=== INITIALISATION TERMINEE ===');
    console.log('Type d\'appareil:', { isMobile, isTablet, isDesktop, isTouchDevice });
});

// Traductions du site - UNE SEULE FOIS
const translations = {
    fr: {
        title: "LES OMBRES DE LA MER",
        subtitle: "Une enquête sur le traffic des espèces marines en voie d'extinction",
        navHome: "Accueil",
        navDoc: "Documentaire",
        navExpedition: "Expédition",
        navGallery: "Galerie",
        navScience: "Enjeux scientifiques",
        navResources: "Documentation",
        navCredits: "Équipe",
        docTitle: "PRÉSENTATION DU DOCUMENTAIRE",
        docDesc1: "Dans le golfe de Californie, un groupe d'individus déterminés risque leur vie pour sauver le marsouin du Pacifique, qui est en passe de disparaître à jamais. Cette espèce rare, connue localement sous le nom de \"vaquita\", est victime de la pêche illégale, visant un autre poisson menacé : le totoaba, dont la vessie natatoire est surnommée \"la cocaïne de la mer\" en raison de sa valeur sur le marché noir.",
        docDesc2: "Lorsqu'environnementalistes, journalistes d'investigation et services de renseignement militaire suivent les traces du \"cartel de la mer\", ils découvrent une réalité sinistre qui dépasse la simple activité de pêche : il s'agit d'une véritable opération criminelle qui menace la dernière espèce de marsouin au monde.",
        docButton: "Voir le documentaire",
        expeditionTitle: "L'EXPÉDITION",
        galleryTitle: "GALERIE PHOTO",
        scienceTitle: "ENJEUX SCIENTIFIQUES ET ÉCOLOGIQUES",
        resourcesTitle: "DOCUMENTATION ET RECHERCHES ASSOCIÉES",
        creditsTitle: "ÉQUIPE ET COLLABORATIONS",
        copyright: "© 2025 National Geographic Partners, LLC. Tous droits réservés."
    },
    en: {
        title: "SEA OF SHADOWS",
        subtitle: "An investigation into the trafficking of endangered marine species",
        navHome: "Home",
        navDoc: "Documentary",
        navExpedition: "Expedition",
        navGallery: "Gallery",
        navScience: "Scientific Issues",
        navResources: "Documentation",
        navCredits: "Team",
        docTitle: "DOCUMENTARY PRESENTATION",
        docDesc1: "In the Gulf of California, a group of determined individuals risk their lives to save the Pacific porpoise, which is about to disappear forever. This rare species, known locally as the \"vaquita\", is a victim of illegal fishing, targeting another endangered fish: the totoaba, whose swim bladder is nicknamed \"the cocaine of the sea\" due to its value on the black market.",
        docDesc2: "When environmentalists, investigative journalists and military intelligence services follow the trail of the \"sea cartel\", they discover a sinister reality that goes beyond simple fishing activity: it is a real criminal operation that threatens the last porpoise species in the world.",
        docButton: "Watch the documentary",
        expeditionTitle: "THE EXPEDITION",
        galleryTitle: "PHOTO GALLERY",
        scienceTitle: "SCIENTIFIC AND ECOLOGICAL ISSUES",
        resourcesTitle: "DOCUMENTATION AND ASSOCIATED RESEARCH",
        creditsTitle: "TEAM AND COLLABORATIONS",
        copyright: "© 2025 National Geographic Partners, LLC. All rights reserved."
    }
};

// Fonctions pour les contrôles vidéo - DÉPLACÉES EN GLOBAL
function hideControlsAfterDelay(delay = 3000) {
    clearTimeout(controlsHideTimeout);
    controlsHideTimeout = setTimeout(() => {
        if (docVideo && !docVideo.paused) {
            videoContainer.classList.add('auto-hide');
        }
    }, delay);
}

function hideControlsAfterPause(delay = 5000) {
    clearTimeout(pauseHideTimeout);
    pauseHideTimeout = setTimeout(() => {
        if (docVideo && docVideo.paused) {
            videoContainer.classList.add('hide-after-pause');
        }
    }, delay);
}

function showControlsTemporarily() {
    if (videoContainer) {
        videoContainer.classList.remove('auto-hide', 'hide-after-pause');
        if (docVideo && !docVideo.paused) {
            hideControlsAfterDelay(3000);
        }
    }
}

// Nouvelle fonction pour lancer la vidéo immédiatement
function startGlobeVideoImmediately() {
    const globeVideo = document.querySelector('.globe-video');
    if (globeVideo) {
        console.log('>>> LANCEMENT IMMÉDIAT DE LA VIDÉO TEXTURE <<<');
        
        globeVideo.muted = true;
        globeVideo.loop = true;
        globeVideo.playsInline = true;
        globeVideo.autoplay = true;
        
        // Révéler la vidéo progressivement
        globeVideo.style.opacity = '0';
        globeVideo.style.transition = 'opacity 1.5s ease';
        
        const playVideo = async function() {
            try {
                await globeVideo.play();
                console.log("Vidéo texture lancée immédiatement");
                
                // Révéler la vidéo après le début de lecture
                setTimeout(() => {
                    globeVideo.style.opacity = '1';
                }, 500);
                
            } catch (error) {
                console.log("Erreur lecture vidéo:", error);
                setTimeout(async () => {
                    try {
                        await globeVideo.play();
                        console.log("Vidéo texture - 2ème tentative réussie");
                        globeVideo.style.opacity = '1';
                    } catch (e) {
                        console.log("Vidéo texture - 2ème tentative échouée");
                    }
                }, 1000);
            }
        };
        
        // Lancer immédiatement
        if (globeVideo.readyState >= 2) {
            playVideo();
        } else {
            globeVideo.addEventListener('canplay', playVideo, { once: true });
        }
        
        // Surveillance continue
        setInterval(() => {
            if (globeVideo.paused && !document.body.classList.contains('loading')) {
                console.log("Vidéo s'est arrêtée - relancement...");
                globeVideo.play().catch(e => console.log("Erreur relancement:", e));
            }
        }, 3000);
    }
}

// Force le retour en haut au chargement
window.addEventListener('load', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 50);
});

// Initialisation du menu mobile/tablette
function initMobileMenu() {
    console.log('=== INITIALISATION MENU MOBILE ===');
    
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sideNav = document.querySelector('.side-nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !sideNav || !menuOverlay) {
        console.error('Éléments du menu mobile manquants');
        return;
    }
    
    // Afficher le bouton hamburger après la section hero
    window.addEventListener('scroll', function() {
        const heroHeight = document.querySelector('#hero').offsetHeight;
        if (window.scrollY > heroHeight * 0.8) {
            menuToggle.classList.add('visible');
        } else {
            menuToggle.classList.remove('visible');
        }
    });
    
    // Toggle du menu
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Fermer le menu en cliquant sur l'overlay
    menuOverlay.addEventListener('click', closeMenu);
    
    // Fermer le menu en cliquant sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 1025) {
                closeMenu();
            }
        });
    });
    
    // Fonctions d'ouverture/fermeture du menu
    window.openMenu = openMenu;
    window.closeMenu = closeMenu;
    
    function openMenu() {
        sideNav.classList.add('open');
        menuOverlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;
        console.log('Menu ouvert');
    }
    
    function closeMenu() {
        sideNav.classList.remove('open');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        isMenuOpen = false;
        console.log('Menu fermé');
    }
    
    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
}

// Initialisation du bouton de traduction avec initiales
function initTranslateButton() {
    console.log('=== INITIALISATION BOUTON TRADUCTION AVEC INITIALES ===');
    
    const translateButton = document.querySelector('.translate-button');
    const translateCurrent = document.querySelector('.translate-current');
    
    if (!translateButton || !translateCurrent) {
        console.error('Éléments du bouton de traduction manquants');
        return;
    }
    
    // Apparition avec les mêmes conditions que back-to-top
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            translateButton.classList.add('visible');
        } else {
            translateButton.classList.remove('visible');
        }
    });
    
    // Mettre à jour l'affichage initial
    updateTranslateButton();
    
    // Gestion du clic pour basculer la langue
    translateButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Empêcher les clics multiples pendant l'animation
        if (translateButton.classList.contains('changing')) return;
        
        const newLang = currentLanguage === 'fr' ? 'en' : 'fr';
        
        console.log(`>>> CHANGEMENT DE LANGUE: ${currentLanguage} -> ${newLang} <<<`);
        
        // Animation de changement
        translateButton.classList.add('changing');
        showGlobalLoader();
        
        setTimeout(() => {
            translateSite(newLang);
            currentLanguage = newLang;
            updateTranslateButton();
            
            // Sauvegarder la préférence
            localStorage.setItem('preferredLanguage', newLang);
            
            hideGlobalLoader();
            
            setTimeout(() => {
                translateButton.classList.remove('changing');
            }, 100);
        }, 300);
    });
    
    // Charger la langue sauvegardée au démarrage
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== currentLanguage && translations[savedLang]) {
        setTimeout(() => {
            translateSite(savedLang);
            currentLanguage = savedLang;
            updateTranslateButton();
        }, 1000);
    }
}

// Fonction pour mettre à jour l'affichage du bouton - VERSION INVERSÉE
function updateTranslateButton() {
    const translateCurrent = document.querySelector('.translate-current');
    if (translateCurrent) {
        // Afficher la langue OPPOSÉE (vers laquelle on peut basculer)
        const nextLang = currentLanguage === 'fr' ? 'en' : 'fr';
        translateCurrent.textContent = nextLang.toUpperCase();
        console.log(`Bouton mis à jour: ${nextLang.toUpperCase()} (site actuellement en ${currentLanguage})`);
    }
}

// Fonction pour traduire le site - VERSION AMÉLIORÉE
function translateSite(targetLang) {
    console.log(`Traduction vers: ${targetLang}`);
    
    const t = translations[targetLang];
    if (!t) return;
    
    // Titre principal
    const title = document.querySelector('.title');
    if (title) title.textContent = t.title;
    
    // Sous-titre
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) subtitle.textContent = t.subtitle;
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks[0] && (navLinks[0].textContent = t.navHome);
    navLinks[1] && (navLinks[1].textContent = t.navDoc);
    navLinks[2] && (navLinks[2].textContent = t.navExpedition);
    navLinks[3] && (navLinks[3].textContent = t.navGallery);
    navLinks[4] && (navLinks[4].textContent = t.navScience);
    navLinks[5] && (navLinks[5].textContent = t.navResources);
    navLinks[6] && (navLinks[6].textContent = t.navCredits);
    
    // Titres de sections
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles[0] && (sectionTitles[0].textContent = t.docTitle);
    sectionTitles[1] && (sectionTitles[1].textContent = t.expeditionTitle);
    sectionTitles[2] && (sectionTitles[2].textContent = t.galleryTitle);
    sectionTitles[3] && (sectionTitles[3].textContent = t.scienceTitle);
    sectionTitles[4] && (sectionTitles[4].textContent = t.resourcesTitle);
    sectionTitles[5] && (sectionTitles[5].textContent = t.creditsTitle);
    
    // Descriptions du documentaire
    const descriptions = document.querySelectorAll('.description');
    descriptions[0] && (descriptions[0].textContent = t.docDesc1);
    descriptions[1] && (descriptions[1].textContent = t.docDesc2);
    
    // Bouton documentaire - CORRECTION
    const docButton = document.querySelector('.doc-button');
    if (docButton) {
        // Chercher le texte après le SVG
        const textNode = Array.from(docButton.childNodes).find(node => 
            node.nodeType === Node.TEXT_NODE && node.textContent.trim()
        );
        if (textNode) {
            textNode.textContent = t.docButton;
        } else {
            // Si pas de nœud texte, l'ajouter
            docButton.appendChild(document.createTextNode(t.docButton));
        }
    }
    
    // Copyright
    const copyright = document.querySelector('.copyright');
    if (copyright) copyright.textContent = t.copyright;
    
    // Mettre à jour le titre de la page
    document.title = `National Geographic | ${t.title}`;
    
    console.log(`Site traduit en ${targetLang}`);
}

// Fonction pour mettre à jour l'option active
function updateActiveLanguage() {
    const options = document.querySelectorAll('.translate-option');
    options.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === currentLanguage) {
            option.classList.add('active');
        }
    });
}

// Initialisation du bouton "retour à l'exploration" - AVEC ANIMATION DYNAMIQUE
function initReturnExploration() {
    console.log('=== INITIALISATION BOUTON RETOUR EXPLORATION ===');
    
    const returnBtn = document.querySelector('.return-exploration');
    console.log('Bouton trouvé:', returnBtn);
    
    if (!returnBtn) {
        console.error('ERREUR: Bouton retour à l\'exploration non trouvé dans le DOM');
        return;
    }
    
    const expeditionSection = document.querySelector('#expedition');
    console.log('Section expédition trouvée:', expeditionSection);
    
    if (!expeditionSection) {
        console.error('ERREUR: Section expédition non trouvée');
        return;
    }
    
    // Variable locale pour éviter les conflits
    let expeditionVisited = false;
    
    // Observer pour détecter la visite de l'expédition
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log('Observer déclenché - isIntersecting:', entry.isIntersecting);
            console.log('Intersection ratio:', entry.intersectionRatio);
            
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !expeditionVisited) {
                expeditionVisited = true;
                console.log('>>> EXPEDITION VRAIMENT VISITEE (50%) - AFFICHAGE DU BOUTON <<<');
                
                returnBtn.style.opacity = '1';
                returnBtn.style.pointerEvents = 'all';
                returnBtn.style.transform = 'translateY(0)';
                returnBtn.classList.add('visible');
                
                console.log('Bouton affiché - styles appliqués');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    observer.observe(expeditionSection);
    console.log('Observer attaché avec seuil 50%');
    
    // NOUVEAU: Animation dynamique quand on est en haut du site
    window.addEventListener('scroll', function() {
        if (returnBtn.classList.contains('visible')) {
            if (window.scrollY < 100) {
                // En haut du site - animation pulse
                returnBtn.classList.add('at-top');
            } else {
                // Pas en haut - retour normal
                returnBtn.classList.remove('at-top');
            }
        }
    });
    
    // Gestion du clic - REDIRECTION VERS LOCALHOST
    returnBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('>>> CLIC SUR BOUTON RETOUR EXPLORATION - REDIRECTION IMMÉDIATE <<<');
        
        // Animation de clic
        returnBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            window.location.href = 'http://localhost:3000/';
        }, 150);
    });
    
    console.log('=== FIN INITIALISATION BOUTON ===');
}

// Initialisation du loader global
function initGlobalLoader() {
    let globalLoader = document.querySelector('.global-loader');
    if (!globalLoader) {
        globalLoader = document.createElement('div');
        globalLoader.className = 'global-loader';
        globalLoader.innerHTML = `
            <div class="loader-content">
                <l-jelly size="40" speed="0.9" color="#ffdd00"></l-jelly>
            </div>
        `;
        document.body.appendChild(globalLoader);
    }
    
    window.showGlobalLoader = function() {
        globalLoader.classList.add('active');
    };
    
    window.hideGlobalLoader = function() {
        globalLoader.classList.remove('active');
    };
    
    // Loader pour les navigations internes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            showGlobalLoader();
            setTimeout(() => {
                hideGlobalLoader();
            }, 800);
        });
    });
    
    window.addEventListener('beforeunload', function() {
        showGlobalLoader();
    });
}

// Initialisation de la galerie avec support tactile
function initGallery() {
    console.log('=== INITIALISATION GALERIE TACTILE ===');
    
    loadGalleryImages();
    
    const galleryTrack = document.querySelector('.gallery-track');
    const dots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    let isFullscreenMode = false;
    let autoplayInterval;
    
    if (!galleryTrack) {
        console.error('Galerie non trouvée');
        return;
    }
    
    // Créer l'élément pour le mode plein écran
    let fullscreenMode = document.querySelector('.fullscreen-mode');
    if (!fullscreenMode) {
        fullscreenMode = document.createElement('div');
        fullscreenMode.className = 'fullscreen-mode';
        fullscreenMode.innerHTML = `
            <img src="" alt="Image en plein écran" class="fullscreen-image">
        `;
        document.body.appendChild(fullscreenMode);
    }
    
    const fsImage = fullscreenMode.querySelector('.fullscreen-image');
    
    // Fonction pour afficher une slide spécifique
    function showSlide(index) {
        const slides = document.querySelectorAll('.gallery-slide');
        if (!slides.length) return;
        
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.classList.remove('transitioning');
        });
        
        slides[index].classList.add('active');
        slides[index].classList.add('transitioning');
        
        const updatedDots = document.querySelectorAll('.gallery-dot');
        updatedDots.forEach(dot => dot.classList.remove('active'));
        if (updatedDots[index]) {
            updatedDots[index].classList.add('active');
        }
        
        currentGalleryIndex = index;
        console.log('Slide active:', index);
    }
    
    // Navigation par boutons
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSlide(currentGalleryIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSlide(currentGalleryIndex + 1);
        });
    }
    
    // Navigation par dots
    function initDots() {
        const dots = document.querySelectorAll('.gallery-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                showSlide(index);
            });
        });
    }
    
    // Support tactile pour le swipe
    if ('ontouchstart' in window) {
        galleryTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
        galleryTrack.addEventListener('touchmove', handleTouchMove, { passive: true });
        galleryTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }
    
    function handleTouchMove(e) {
        if (!touchStartX) return;
        touchEndX = e.touches[0].clientX;
    }
    
    function handleTouchEnd(e) {
        if (!touchStartX || !touchEndX) return;
        
        const difference = touchStartX - touchEndX;
        const threshold = 50; // Seuil minimum pour déclencher le swipe
        
        if (Math.abs(difference) > threshold) {
            if (difference > 0) {
                // Swipe vers la gauche - image suivante
                showSlide(currentGalleryIndex + 1);
            } else {
                // Swipe vers la droite - image précédente
                showSlide(currentGalleryIndex - 1);
            }
        }
        
        touchStartX = 0;
        touchEndX = 0;
    }
    
    // Mode plein écran
    function activateFullscreenMode(imgSrc) {
        showGlobalLoader();
        
        fsImage.src = imgSrc;
        fsImage.onload = function() {
            hideGlobalLoader();
            fullscreenMode.classList.add('active');
            isFullscreenMode = true;
            stopAutoplay();
            document.body.style.overflow = 'hidden';
        };
    }
    
    function deactivateFullscreenMode() {
        fullscreenMode.classList.remove('active');
        isFullscreenMode = false;
        startAutoplay();
        document.body.style.overflow = '';
    }
    
    // Fermer le mode plein écran par clic sur le fond
    fullscreenMode.addEventListener('click', function(e) {
        if (e.target === fullscreenMode) {
            deactivateFullscreenMode();
        }
    });
    
    // Navigation en mode plein écran
    if ('ontouchstart' in window) {
        fsImage.addEventListener('touchstart', handleTouchStart, { passive: true });
        fsImage.addEventListener('touchmove', handleTouchMove, { passive: true });
        fsImage.addEventListener('touchend', function(e) {
            handleTouchEnd(e);
            // Mettre à jour l'image en plein écran
            const currentSlide = document.querySelector('.gallery-slide.active');
            const currentImg = currentSlide.querySelector('.gallery-image');
            if (currentImg) {
                showGlobalLoader();
                fsImage.src = currentImg.src;
                fsImage.onload = function() {
                    hideGlobalLoader();
                };
            }
        }, { passive: true });
    } else {
        // Navigation par clic sur desktop
        fsImage.addEventListener('click', function(e) {
            e.stopPropagation();
            showSlide(currentGalleryIndex + 1);
            
            showGlobalLoader();
            const currentSlide = document.querySelector('.gallery-slide.active');
            const currentImg = currentSlide.querySelector('.gallery-image');
            fsImage.src = currentImg.src;
            fsImage.onload = function() {
                hideGlobalLoader();
            };
        });
    }
    
    // Ajouter des écouteurs pour les clics sur les images
    function initImageClicks() {
        const imageContainers = document.querySelectorAll('.gallery-image-container');
        imageContainers.forEach(container => {
            container.addEventListener('click', function(e) {
                e.preventDefault();
                const img = this.querySelector('.gallery-image');
                if (img) {
                    activateFullscreenMode(img.src);
                }
            });
        });
    }
    
    // Défilement automatique (seulement sur desktop)
    function startAutoplay() {
        if (window.innerWidth >= 1025 && !('ontouchstart' in window)) {
            autoplayInterval = setInterval(() => {
                if (!isFullscreenMode) {
                    const gallerySection = document.querySelector('#gallery');
                    const rect = gallerySection.getBoundingClientRect();
                    
                    if (rect.top <= 0 && rect.bottom >= window.innerHeight / 2) {
                        showSlide(currentGalleryIndex + 1);
                    }
                }
            }, 8000);
        }
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Gestion des touches clavier
    document.addEventListener('keydown', e => {
        if (isFullscreenMode) {
            if (e.key === 'Escape') {
                deactivateFullscreenMode();
            } else if (e.key === 'ArrowLeft') {
                showSlide(currentGalleryIndex - 1);
                const currentSlide = document.querySelector('.gallery-slide.active');
                const currentImg = currentSlide.querySelector('.gallery-image');
                if (currentImg) {
                    showGlobalLoader();
                    fsImage.src = currentImg.src;
                    fsImage.onload = () => hideGlobalLoader();
                }
            } else if (e.key === 'ArrowRight') {
                showSlide(currentGalleryIndex + 1);
                const currentSlide = document.querySelector('.gallery-slide.active');
                const currentImg = currentSlide.querySelector('.gallery-image');
                if (currentImg) {
                    showGlobalLoader();
                    fsImage.src = currentImg.src;
                    fsImage.onload = () => hideGlobalLoader();
                }
            }
        } else {
            const gallerySection = document.querySelector('#gallery');
            const rect = gallerySection.getBoundingClientRect();
            
            if (rect.top <= 0 && rect.bottom >= window.innerHeight / 2) {
                if (e.key === 'ArrowLeft') {
                    showSlide(currentGalleryIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    showSlide(currentGalleryIndex + 1);
                }
            }
        }
    });
    
    setTimeout(initImageClicks, 1000);
    setTimeout(initDots, 500);
    startAutoplay();
}

// Chargement dynamique des images de la galerie
function loadGalleryImages() {
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryDots = document.querySelector('.gallery-dots');
    
    if (!galleryTrack || !galleryDots) return;
    
    galleryTrack.innerHTML = '';
    galleryDots.innerHTML = '';
    
    const numImages = 10;
    
    for (let i = 1; i <= numImages; i++) {
        const index = i.toString().padStart(2, '0');
        
        const slide = document.createElement('div');
        slide.className = 'gallery-slide' + (i === 1 ? ' active' : '');
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'gallery-image-container';
        
        const image = document.createElement('img');
        image.src = `images/img-photo-gallerie-${index}.jpeg`;
        image.alt = `Galerie photo ${i}`;
        image.className = 'gallery-image';
        
        image.onerror = function() {
            if (i === 1) {
                image.src = 'images/vaquita.jpeg';
            } else {
                slide.remove();
                const correspondingDot = document.querySelector(`.gallery-dot[data-index="${i-1}"]`);
                if (correspondingDot) correspondingDot.remove();
            }
        };
        
        imageContainer.appendChild(image);
        
        // Ajouter les informations sur mobile/tablette
        if (window.innerWidth < 1025) {
            const imageInfo = document.createElement('div');
            imageInfo.className = 'image-info';
            imageInfo.innerHTML = `
                <h3>Image ${i}</h3>
                <p>Description de l'image ${i} de la galerie.</p>
            `;
            slide.appendChild(imageContainer);
            slide.appendChild(imageInfo);
        } else {
            slide.appendChild(imageContainer);
        }
        
        galleryTrack.appendChild(slide);
        
        const dot = document.createElement('span');
        dot.className = 'gallery-dot' + (i === 1 ? ' active' : '');
        dot.setAttribute('data-index', (i - 1).toString());
        galleryDots.appendChild(dot);
    }
}

// Clic sur le logo pour retourner en haut
function initLogoClick() {
    const logo = document.querySelector('.fixed-logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            showGlobalLoader();
            
            document.body.classList.add('scrolling-up');
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                document.body.classList.remove('scrolling-up');
                hideGlobalLoader();
            }, 500);
        });
    }
}

// Gestion du menu latéral - Adapté desktop/mobile
function initSideNav() {
    const sideNav = document.querySelector('.side-nav');
    const heroSection = document.querySelector('#hero');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = [];
    
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        const section = document.querySelector(targetId);
        if (section) {
            sections.push({
                id: targetId,
                element: section,
                link: link
            });
        }
    });
    
    window.addEventListener('scroll', function() {
        // Afficher la navigation seulement sur desktop après le hero
        if (window.innerWidth >= 1025) {
            if (window.scrollY > heroSection.offsetHeight * 0.8) {
                sideNav.classList.add('visible');
            } else {
                sideNav.classList.remove('visible');
            }
        }
        
        updateActiveSection(sections);
    });
}

// Mettre à jour la section active
function updateActiveSection(sections) {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    sections.forEach(section => {
        const sectionTop = section.element.offsetTop;
        const sectionBottom = sectionTop + section.element.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            section.link.classList.add('active');
        }
    });
}

// Bouton de retour en haut - Adapté tactile
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showGlobalLoader();
        
        document.body.classList.add('scrolling-up');
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            document.body.classList.remove('scrolling-up');
            hideGlobalLoader();
        }, 500);
    });
}

// Gestion des vidéos - Optimisée tactile avec contrôles intelligents
function fixVideos() {
    console.log('=== INITIALISATION DES VIDEOS ===');
    
    // Vidéo de texture (hero)
    const globeVideo = document.querySelector('.globe-video');
    if (globeVideo) {
        console.log('Vidéo texture trouvée - configuration...');
        
        globeVideo.pause();
        globeVideo.currentTime = 0;
        globeVideo.autoplay = false;
        globeVideo.muted = true;
        globeVideo.loop = true;
        globeVideo.playsInline = true;
        globeVideo.style.opacity = '0';
        
        console.log('Vidéo texture mise en pause - attente fin du chargement');
        
        function startGlobeVideo() {
            console.log('>>> LANCEMENT VIDÉO TEXTURE APRÈS CHARGEMENT <<<');
            
            globeVideo.style.opacity = '1';
            globeVideo.style.transition = 'opacity 1s ease';
            globeVideo.load();
            
            const playVideo = async function() {
                try {
                    globeVideo.currentTime = 0;
                    await globeVideo.play();
                    console.log("Vidéo texture lancée avec succès");
                } catch (error) {
                    console.log("Erreur lecture vidéo texture:", error);
                    
                    setTimeout(async () => {
                        try {
                            await globeVideo.play();
                            console.log("Vidéo texture - 2ème tentative réussie");
                        } catch (e) {
                            console.log("Vidéo texture - 2ème tentative échouée");
                        }
                    }, 1000);
                }
            };
            
            playVideo();
            
            // Surveillance continue
            setInterval(() => {
                if (globeVideo.paused || globeVideo.ended) {
                    console.log("Vidéo texture s'est arrêtée - relancement...");
                    globeVideo.currentTime = 0;
                    globeVideo.play().catch(e => {
                        console.log("Erreur relancement vidéo texture:", e);
                        globeVideo.load();
                        setTimeout(() => {
                            globeVideo.play().catch(err => console.log("Rechargement forcé échoué:", err));
                        }, 1000);
                    });
                }
            }, 5000);
        }
        
        window.startGlobeVideoAfterLoading = startGlobeVideo;
        
        // Gestionnaires d'événements
        globeVideo.addEventListener('ended', function() {
            console.log('Vidéo texture terminée - relancement immédiat');
            this.currentTime = 0;
            this.play();
        });
        
        globeVideo.addEventListener('pause', function() {
            console.log('Vidéo texture en pause - relancement');
            this.play();
        });
        
        globeVideo.addEventListener('stalled', function() {
            console.log('Vidéo texture bloquée - rechargement');
            this.load();
            setTimeout(() => {
                this.play();
            }, 1000);
        });
        
        globeVideo.addEventListener('error', function(e) {
            console.log('Erreur vidéo texture:', e);
            setTimeout(() => {
                this.load();
                this.play();
            }, 2000);
        });
        
    } else {
        console.error('Vidéo texture non trouvée');
    }
    
    // Vidéo du documentaire - AVEC CONTRÔLES INTELLIGENTS
    docVideo = document.querySelector('.main-video');
    videoContainer = document.querySelector('.video-container');
    playButton = document.querySelector('.video-play-button');
    
    if (docVideo && playButton) {
        // Masquer les contrôles par défaut
        docVideo.controls = false;
        
        // Afficher les contrôles au survol sur desktop seulement
        if (window.innerWidth >= 1025 && !('ontouchstart' in window)) {
            videoContainer.addEventListener('mouseenter', function() {
                docVideo.controls = true;
                if (docVideo.paused) {
                    playButton.style.opacity = '1';
                }
            });
            
            videoContainer.addEventListener('mouseleave', function() {
                docVideo.controls = false;
                if (docVideo.paused) {
                    playButton.style.opacity = '0';
                }
            });
        }
        
        // Gestion du bouton play avec contrôles intelligents
        playButton.addEventListener('click', function(e) {
            e.preventDefault();
            showGlobalLoader();
            
            if (docVideo.paused) {
                docVideo.play()
                    .then(() => {
                        hideGlobalLoader();
                        playButton.innerHTML = `
                            <svg viewBox="0 0 24 24">
                                <path d="M14,19H18V5H14M6,19H10V5H6V19Z"></path>
                            </svg>
                        `;
                        
                        // Gérer les classes et contrôles
                        videoContainer.classList.add('playing');
                        videoContainer.classList.remove('paused', 'hide-after-pause');
                        docVideo.controls = true;
                        
                        // Masquer le bouton play
                        setTimeout(() => {
                            playButton.style.opacity = '0';
                        }, 500);
                        
                        // Masquer les contrôles après 3 secondes
                        hideControlsAfterDelay(3000);
                    })
                    .catch(error => {
                        hideGlobalLoader();
                        console.log("Impossible de lancer la vidéo: ", error);
                    });
            } else {
                hideGlobalLoader();
                docVideo.pause();
                playButton.innerHTML = `
                    <svg viewBox="0 0 24 24">
                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z"></path>
                    </svg>
                `;
                
                // Gérer les classes
                videoContainer.classList.remove('playing', 'auto-hide');
                videoContainer.classList.add('paused');
                playButton.style.opacity = '1';
                
                // Afficher temporairement les contrôles puis les masquer
                docVideo.controls = true;
                hideControlsAfterPause(5000);
            }
        });

        // Gestionnaire pour l'événement pause
        docVideo.addEventListener('pause', function() {
            clearTimeout(controlsHideTimeout);
            videoContainer.classList.remove('playing', 'auto-hide');
            videoContainer.classList.add('paused');
            
            playButton.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z"></path>
                </svg>
            `;
            playButton.style.opacity = '1';
            
            // Afficher les contrôles temporairement
            docVideo.controls = true;
            videoContainer.classList.remove('hide-after-pause');
            
            // Les masquer après 5 secondes
            hideControlsAfterPause(5000);
        });

        // Gestionnaire pour l'événement play
        docVideo.addEventListener('play', function() {
            clearTimeout(pauseHideTimeout);
            videoContainer.classList.remove('paused', 'hide-after-pause');
            videoContainer.classList.add('playing');
            
            // Afficher les contrôles puis les masquer après 3 secondes
            docVideo.controls = true;
            videoContainer.classList.remove('auto-hide');
            hideControlsAfterDelay(3000);
        });

        // Réafficher temporairement les contrôles au mouvement de souris/touch
        videoContainer.addEventListener('mousemove', showControlsTemporarily);
        videoContainer.addEventListener('touchstart', showControlsTemporarily);

        // Gestionnaire pour le clic sur la vidéo
        docVideo.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.paused) {
                // Si en pause, reprendre la lecture
                this.play();
            } else {
                // Si en lecture, mettre en pause
                this.pause();
            }
        });

        // Nettoyer les timers quand la vidéo se termine
        docVideo.addEventListener('ended', function() {
            clearTimeout(controlsHideTimeout);
            clearTimeout(pauseHideTimeout);
            videoContainer.classList.remove('playing', 'paused', 'auto-hide', 'hide-after-pause');
            docVideo.controls = false;
            playButton.style.opacity = '1';
        });
        
        docVideo.addEventListener('loadedmetadata', function() {
            if (docVideo.paused) {
                videoContainer.classList.remove('playing');
                playButton.innerHTML = `
                    <svg viewBox="0 0 24 24">
                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z"></path>
                    </svg>
                `;
            }
        });
        
        // Bouton doc pour lancer la vidéo - AVEC CONTRÔLES INTELLIGENTS
        const docButton = document.querySelector('.doc-button');
        if (docButton) {
            docButton.addEventListener('click', function(e) {
                e.preventDefault();
                showGlobalLoader();
                
                const videoSection = document.querySelector('.video-section');
                if (videoSection) {
                    videoSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        docVideo.play().then(() => {
                            hideGlobalLoader();
                            videoContainer.classList.add('playing');
                            videoContainer.classList.remove('paused', 'hide-after-pause');
                            docVideo.controls = true;
                            
                            playButton.innerHTML = `
                                <svg viewBox="0 0 24 24">
                                    <path d="M14,19H18V5H14M6,19H10V5H6V19Z"></path>
                                </svg>
                            `;
                            
                            setTimeout(() => {
                                playButton.style.opacity = '0';
                            }, 500);
                            
                            // Masquer les contrôles après 3 secondes
                            hideControlsAfterDelay(3000);
                        }).catch(err => {
                            hideGlobalLoader();
                            console.log("Erreur lors du lancement automatique");
                        });
                    }, 1000);
                }
            });
        }
    }
}

// Boutons de partage - Adaptés tactile
function initShareButtons() {
    const shareButton = document.querySelector('.share-button');
    const shareIcon = document.querySelector('.share-icon');
    const shareOptions = document.querySelector('.share-options');
    const shareOptionLinks = document.querySelectorAll('.share-option');
    
    if (!shareButton || !shareIcon || !shareOptions) return;
    
    let isOverShareArea = false;
    
    // Apparition avec les mêmes conditions que back-to-top
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            shareButton.classList.add('visible');
        } else {
            shareButton.classList.remove('visible');
        }
    });
    
    // Gestion différente selon le type d'appareil
    if ('ontouchstart' in window) {
        // Sur tactile, toggle au clic
        shareIcon.addEventListener('click', function(e) {
            e.preventDefault();
            shareOptions.classList.toggle('visible');
        });
        
        // Fermer en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!shareButton.contains(e.target)) {
                shareOptions.classList.remove('visible');
            }
        });
    } else {
        // Sur desktop, au survol
        shareButton.addEventListener('mouseenter', function() {
            isOverShareArea = true;
            shareOptions.classList.add('visible');
        });
        
        shareButton.addEventListener('mouseleave', function() {
            isOverShareArea = false;
            setTimeout(() => {
                if (!isOverShareArea) {
                    shareOptions.classList.remove('visible');
                }
            }, 300);
        });
        
        shareOptions.addEventListener('mouseenter', function() {
            isOverShareArea = true;
        });
        
        shareOptions.addEventListener('mouseleave', function() {
            isOverShareArea = false;
            setTimeout(() => {
                if (!isOverShareArea) {
                    shareOptions.classList.remove('visible');
                }
            }, 300);
        });
    }
    
    // Gestion du partage
    shareOptionLinks.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            showGlobalLoader();
            
            const platform = this.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl;
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'instagram':
                    // Instagram ne permet pas le partage direct par URL
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Lien copié ! Collez-le dans votre post Instagram.');
                    } else {
                        alert('Copiez le lien manuellement pour le partager sur Instagram: ' + window.location.href);
                    }
                    hideGlobalLoader();
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
                setTimeout(() => {
                    hideGlobalLoader();
                }, 1000);
            } else {
                hideGlobalLoader();
            }
        });
    });
}

// Animation des liens de navigation
function animateNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            showGlobalLoader();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Fermer le menu mobile si ouvert
                if (window.innerWidth < 1025 && isMenuOpen) {
                    closeMenu();
                }
                
                const offsetTop = targetElement.offsetTop - (window.innerWidth < 768 ? 80 : 0);
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    hideGlobalLoader();
                }, 800);
            } else {
                hideGlobalLoader();
            }
        });
    });
}

// Animations au défilement - Optimisées performances mobile
function initAnimations() {
    const elementsToAnimate = document.querySelectorAll('[data-animation], .video-section, .expedition-image, .stat-card, .scientific-image-wrapper, .resource-card, .credits-col, .section-title, .description');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('will-change');
                
                // Désactiver l'observation une fois l'animation déclenchée pour optimiser les performances
                observer.unobserve(entry.target);
            } else {
                entry.target.classList.add('will-change');
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Vérification initiale
    checkVisibleElements();
    
    // Throttled scroll pour les performances
    let ticking = false;
    function updateElements() {
        checkVisibleElements();
        ticking = false;
    }
    
    document.addEventListener("scroll", function() {
        if (!ticking) {
            requestAnimationFrame(updateElements);
            ticking = true;
        }
    });
}

// Curseur personnalisé UNIQUEMENT sur desktop avec souris
function initCustomCursor() {
    // Vérifier si c'est vraiment un appareil avec souris
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return; // Ne pas initialiser sur tactile
    }
    
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    
    const follower = document.createElement('div');
    follower.classList.add('cursor-follower');
    
    document.body.appendChild(cursor);
    document.body.appendChild(follower);
    
    let isOverImage = false;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 30);
        
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element) {
            const isVideo = element.tagName === 'VIDEO' || element.closest('video');
            const isImage = element.tagName === 'IMG' || element.closest('img') || 
                           element.classList.contains('gallery-image') || 
                           element.classList.contains('fullscreen-image') ||
                           element.classList.contains('main-video') ||
                           element.classList.contains('globe-video');
            
            if (isVideo || isImage) {
                isOverImage = true;
                cursor.style.width = '60px';
                cursor.style.height = '60px';
                follower.style.width = '80px';
                follower.style.height = '80px';
            } else {
                isOverImage = false;
                cursor.style.width = '30px';
                cursor.style.height = '30px';
                follower.style.width = '40px';
                follower.style.height = '40px';
            }
        }
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .share-icon, .back-to-top, .video-play-button, .gallery-arrow, .gallery-dot, .gallery-image-container, .return-exploration');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!isOverImage) {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

// Vérifier les éléments visibles
function checkVisibleElements() {
    const elementsToCheck = document.querySelectorAll('.will-change, [data-animation]:not(.visible), .video-section:not(.visible), .expedition-image:not(.visible), .stat-card:not(.visible), .scientific-image-wrapper:not(.visible), .resource-card:not(.visible), .credits-col:not(.visible), .section-title:not(.visible), .description:not(.visible)');
    
    elementsToCheck.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
            element.classList.remove('will-change');
        }
    });
}

// Vérifier si un élément est dans la zone visible
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < window.innerHeight * 0.85 && 
        rect.bottom > 0
    );
}

// Prévenir le zoom sur double-tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Gestion des changements d'orientation
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        // Recalculer les positions après changement d'orientation
        window.scrollTo(window.scrollX, window.scrollY);
        
        // Réinitialiser la galerie si nécessaire
        if (document.querySelector('.gallery-track')) {
            initGallery();
        }
    }, 100);
});

// Affichage du loader lors du chargement des pages
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader && !loader.classList.contains('hidden')) {
        showGlobalLoader();
        
        setTimeout(() => {
            loader.classList.add('hidden');
            hideGlobalLoader();
        }, 800);
    }
});

// REDIRECTION TOUCHE ENTRÉE - Redirection vers la page collection
document.addEventListener('keydown', function(e) {
    // Vérifier si c'est la touche Entrée (keyCode 13 ou key === 'Enter')
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Empêcher le comportement par défaut
        e.preventDefault();
        
        console.log('>>> TOUCHE ENTRÉE DÉTECTÉE - REDIRECTION VERS COLLECTION <<<');
        
        // Afficher le loader pour une transition fluide
        if (typeof showGlobalLoader === 'function') {
            showGlobalLoader();
        }
        
        // Redirection immédiate vers votre page collection
        setTimeout(() => {
            window.location.href = 'https://abw444.github.io/Page-collection-IntoTheOkavango/';
        }, 200);
    }
});

console.log('=== REDIRECTION TOUCHE ENTRÉE ACTIVÉE ===');