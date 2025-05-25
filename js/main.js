// JavaScript principal avec animations bidirectionnelles au scroll et loader global
document.addEventListener("DOMContentLoaded", function() {
    console.log('=== DEMARRAGE DE L\'APPLICATION ===');
    
    // *** MASQUER IMMEDIATEMENT LE CURSEUR PENDANT LE CHARGEMENT ***
    document.body.classList.add('loading');
    document.body.style.cursor = 'none !important';
    document.documentElement.style.cursor = 'none !important';
    
    // *** SOLUTION ALTERNATIVE POUR LE LOADER ET CURSEUR ***
    // Créer un loader de secours si celui du HTML ne fonctionne pas
    let loaderBackup = document.createElement('div');
    loaderBackup.id = 'loader-backup';
    loaderBackup.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: #000 !important;
        z-index: 999999 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        opacity: 1 !important;
        visibility: visible !important;
    `;
    
    // Créer une animation de chargement simple mais visible
    let spinnerBackup = document.createElement('div');
    spinnerBackup.style.cssText = `
        width: 40px !important;
        height: 40px !important;
        border: 3px solid rgba(255, 221, 0, 0.3) !important;
        border-top: 3px solid #ffdd00 !important;
        border-radius: 50% !important;
        animation: spin 1s linear infinite !important;
    `;
    
    // Ajouter l'animation CSS
    let style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        body.loading, body.loading * {
            cursor: none !important;
        }
    `;
    document.head.appendChild(style);
    
    loaderBackup.appendChild(spinnerBackup);
    document.body.insertBefore(loaderBackup, document.body.firstChild);
    
    console.log('Loader de secours créé et affiché');
    
    // S'assurer que la page est en haut au chargement - FORCE ABSOLU
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Variables globales
    let hasVisitedExpedition = false;
    
    // GESTION DU LOADER ORIGINAL
    const loader = document.querySelector('.loader');
    console.log('Loader original trouvé:', loader);
    
    if (loader) {
        // Forcer la visibilité du loader original également
        loader.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: #000 !important;
            z-index: 999998 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            opacity: 1 !important;
            visibility: visible !important;
        `;
        console.log('Loader original forcé visible');
    }
    
    // Masquer TOUS les loaders après 2.5 secondes et DEMARRER LA VIDEO TEXTURE
    setTimeout(() => {
        console.log('=== MASQUAGE DES LOADERS ET DEMARRAGE VIDEO TEXTURE ===');
        
        // Masquer le loader de secours
        if (loaderBackup) {
            loaderBackup.style.opacity = '0';
            setTimeout(() => {
                loaderBackup.remove();
            }, 500);
        }
        
        // Masquer le loader original
        if (loader) {
            loader.classList.add('hidden');
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
        
        // RETIRER la classe loading et réactiver le curseur personnalisé
        setTimeout(() => {
            document.body.classList.remove('loading');
            initCustomCursor();
            console.log('Curseur personnalisé initialisé après loader');
            
            // LANCER LA VIDÉO TEXTURE MAINTENANT
            if (window.startGlobeVideoAfterLoading) {
                window.startGlobeVideoAfterLoading();
            }
            
        }, 600);
        
    }, 2500);
    
    // Configuration du loader global
    initGlobalLoader();
    
    // Initialiser les autres fonctionnalités (SANS le curseur pour l'instant)
    initAnimations();
    animateNavLinks();
    initSideNav();
    initBackToTop();
    initShareButtons();
    fixVideos();
    initLogoClick();
    initGallery();
    initReturnExploration();
    
    // FORCE le retour en haut lors du rechargement - DEFINITIF
    window.addEventListener('beforeunload', function() {
        window.scrollTo(0, 0);
    });
    
    // Force également au cas où
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
    
    console.log('=== INITIALISATION TERMINEE ===');
});

// Force le retour en haut - DEFINITIF dans le code
window.addEventListener('load', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 50);
});

// Initialisation du bouton "retour à l'exploration" - MOINS SENSIBLE
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
    
    // Variable pour suivre si on a visité l'expédition
    let expeditionVisited = false;
    
    // Observer MOINS sensible - seuil plus élevé
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log('Observer déclenché - isIntersecting:', entry.isIntersecting);
            console.log('Intersection ratio:', entry.intersectionRatio);
            
            // Plus strict : 50% de la section doit être visible
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !expeditionVisited) {
                expeditionVisited = true;
                console.log('>>> EXPEDITION VRAIMENT VISITEE (50%) - AFFICHAGE DU BOUTON <<<');
                
                // Forcer l'affichage
                returnBtn.style.opacity = '1';
                returnBtn.style.pointerEvents = 'all';
                returnBtn.style.transform = 'translateY(0)';
                returnBtn.classList.add('visible');
                
                console.log('Bouton affiché - styles appliqués');
            }
        });
    }, {
        threshold: 0.5, // 50% de la section doit être visible
        rootMargin: '-100px 0px -100px 0px' // Marges pour être encore moins sensible
    });
    
    observer.observe(expeditionSection);
    console.log('Observer attaché avec seuil 50%');
    
    // Suppression du test automatique - ne s'affiche que si vraiment visité
    
    // Gestion du clic
    returnBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('>>> CLIC SUR BOUTON RETOUR EXPLORATION <<<');
        showGlobalLoader();
        
        setTimeout(() => {
            hideGlobalLoader();
            console.log('Redirection simulée');
        }, 1000);
    });
    
    console.log('=== FIN INITIALISATION BOUTON ===');
}

// Initialisation du loader global pour tous les temps de chargement
function initGlobalLoader() {
    // Créer le loader global s'il n'existe pas
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
    
    // Fonction pour afficher le loader
    window.showGlobalLoader = function() {
        globalLoader.classList.add('active');
    };
    
    // Fonction pour masquer le loader
    window.hideGlobalLoader = function() {
        globalLoader.classList.remove('active');
    };
    
    // Afficher le loader lors des navigations internes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            showGlobalLoader();
            setTimeout(() => {
                hideGlobalLoader();
            }, 800);
        });
    });
    
    // Afficher le loader lors du rechargement de page
    window.addEventListener('beforeunload', function() {
        showGlobalLoader();
    });
    
    // Afficher le loader lors des changements d'état
    let isLoading = false;
    window.addEventListener('load', function() {
        if (isLoading) {
            hideGlobalLoader();
            isLoading = false;
        }
    });
}

// Initialisation de la galerie photo avec chargement dynamique des images
function initGallery() {
    loadGalleryImages();
    
    const galleryTrack = document.querySelector('.gallery-track');
    const dots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    let currentIndex = 0;
    let isFullscreenMode = false;
    let autoplayInterval;
    
    // Créer l'élément pour le mode plein écran SANS croix
    const fullscreenMode = document.createElement('div');
    fullscreenMode.className = 'fullscreen-mode';
    fullscreenMode.innerHTML = `
        <img src="" alt="Image en plein écran" class="fullscreen-image">
    `;
    document.body.appendChild(fullscreenMode);
    
    // Gérer les événements pour le mode plein écran
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
        
        currentIndex = index;
    }
    
    // Démarrer/arrêter le défilement automatique
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (!isFullscreenMode) {
                const gallerySection = document.querySelector('#gallery');
                const rect = gallerySection.getBoundingClientRect();
                
                if (rect.top <= 0 && rect.bottom >= window.innerHeight / 2) {
                    showSlide(currentIndex + 1);
                }
            }
        }, 8000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Activer le mode plein écran
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
    
    // Désactiver le mode plein écran
    function deactivateFullscreenMode() {
        fullscreenMode.classList.remove('active');
        isFullscreenMode = false;
        startAutoplay();
        document.body.style.overflow = '';
    }
    
    // Fermeture du mode plein écran par clic sur le fond (pas sur l'image)
    fullscreenMode.addEventListener('click', function(e) {
        // Si on clique sur le fond (pas sur l'image), fermer le mode plein écran
        if (e.target === fullscreenMode) {
            deactivateFullscreenMode();
        }
    });
    
    // Navigation en mode plein écran via clic sur l'image
    fsImage.addEventListener('click', function(e) {
        e.stopPropagation();
        showSlide(currentIndex + 1);
        
        showGlobalLoader();
        const currentSlide = document.querySelector('.gallery-slide.active');
        const currentImg = currentSlide.querySelector('.gallery-image');
        fsImage.src = currentImg.src;
        fsImage.onload = function() {
            hideGlobalLoader();
        };
    });
    
    // Gérer le clic sur les flèches
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentIndex + 1);
        });
    }
    
    // Gérer le clic sur les points
    function initDots() {
        const dots = document.querySelectorAll('.gallery-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
    }
    
    initDots();
    
    // Ajouter des écouteurs d'événements pour le clic sur les images
    function initImageClicks() {
        const imageContainers = document.querySelectorAll('.gallery-image-container');
        imageContainers.forEach(container => {
            container.addEventListener('click', function() {
                const img = this.querySelector('.gallery-image');
                activateFullscreenMode(img.src);
            });
        });
    }
    
    setTimeout(initImageClicks, 1000);
    
    // Gestion des touches clavier pour la navigation
    document.addEventListener('keydown', e => {
        if (isFullscreenMode) {
            // Supprimer la gestion de la touche Escape puisqu'il n'y a plus de croix
            if (e.key === 'ArrowLeft') {
                showSlide(currentIndex - 1);
                showGlobalLoader();
                const currentSlide = document.querySelector('.gallery-slide.active');
                const currentImg = currentSlide.querySelector('.gallery-image');
                fsImage.src = currentImg.src;
                fsImage.onload = function() {
                    hideGlobalLoader();
                };
            } else if (e.key === 'ArrowRight') {
                showSlide(currentIndex + 1);
                showGlobalLoader();
                const currentSlide = document.querySelector('.gallery-slide.active');
                const currentImg = currentSlide.querySelector('.gallery-image');
                fsImage.src = currentImg.src;
                fsImage.onload = function() {
                    hideGlobalLoader();
                };
            }
        } else {
            const gallerySection = document.querySelector('#gallery');
            const rect = gallerySection.getBoundingClientRect();
            
            if (rect.top <= 0 && rect.bottom >= window.innerHeight / 2) {
                if (e.key === 'ArrowLeft') {
                    showSlide(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    showSlide(currentIndex + 1);
                }
            }
        }
    });
    
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
        slide.appendChild(imageContainer);
        galleryTrack.appendChild(slide);
        
        const dot = document.createElement('span');
        dot.className = 'gallery-dot' + (i === 1 ? ' active' : '');
        dot.setAttribute('data-index', (i - 1).toString());
        galleryDots.appendChild(dot);
    }
}

// Initialiser le clic sur le logo pour retourner en haut
function initLogoClick() {
    const logo = document.querySelector('.fixed-logo');
    if (logo) {
        logo.addEventListener('click', function() {
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

// Gestion du menu latéral qui n'apparaît qu'après la section hero
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
        if (window.scrollY > heroSection.offsetHeight * 0.8) {
            sideNav.classList.add('visible');
        } else {
            sideNav.classList.remove('visible');
        }
        
        updateActiveSection(sections);
    });
}

// Mettre à jour la section active dans le menu
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

// Initialisation du bouton de retour en haut de page
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
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

// Gestion améliorée des vidéos - VIDÉO TEXTURE APRÈS CHARGEMENT UNIQUEMENT
function fixVideos() {
    console.log('=== INITIALISATION DES VIDEOS ===');
    
    // Vidéo de texture (hero) - ATTENDRE LA FIN DU CHARGEMENT
    const globeVideo = document.querySelector('.globe-video');
    if (globeVideo) {
        console.log('Vidéo texture trouvée - configuration...');
        
        // FORCER L'ARRÊT initial de la vidéo
        globeVideo.pause();
        globeVideo.currentTime = 0;
        globeVideo.autoplay = false; // Désactiver l'autoplay initial
        globeVideo.muted = true;
        globeVideo.loop = true; // S'assurer que la boucle est activée
        globeVideo.playsInline = true;
        
        // Masquer la vidéo pendant le chargement
        globeVideo.style.opacity = '0';
        
        console.log('Vidéo texture mise en pause - attente fin du chargement');
        
        // Fonction pour lancer la vidéo de manière robuste
        function startGlobeVideo() {
            console.log('>>> LANCEMENT VIDÉO TEXTURE APRÈS CHARGEMENT <<<');
            
            // Réafficher la vidéo
            globeVideo.style.opacity = '1';
            globeVideo.style.transition = 'opacity 1s ease';
            
            // Forcer le rechargement de la vidéo
            globeVideo.load();
            
            const playVideo = async function() {
                try {
                    globeVideo.currentTime = 0;
                    await globeVideo.play();
                    console.log("Vidéo texture lancée avec succès après chargement");
                } catch (error) {
                    console.log("Erreur lecture vidéo texture:", error);
                    
                    // Nouvelle tentative après 1 seconde
                    setTimeout(async () => {
                        try {
                            await globeVideo.play();
                            console.log("Vidéo texture - 2ème tentative réussie");
                        } catch (e) {
                            console.log("Vidéo texture - 2ème tentative échouée, création nouveau clone");
                            
                            // Créer un clone de la vidéo en dernier recours
                            const newVideo = globeVideo.cloneNode(true);
                            newVideo.muted = true;
                            newVideo.loop = true;
                            newVideo.autoplay = false;
                            globeVideo.parentNode.replaceChild(newVideo, globeVideo);
                            
                            setTimeout(() => {
                                newVideo.play().catch(err => console.log("Clone vidéo échec:", err));
                            }, 500);
                        }
                    }, 1000);
                }
            };
            
            // Lancer la vidéo immédiatement après le chargement
            playVideo();
            
            // Surveillance continue pour éviter les freeze
            setInterval(() => {
                if (globeVideo.paused || globeVideo.ended) {
                    console.log("Vidéo texture s'est arrêtée - relancement...");
                    globeVideo.currentTime = 0;
                    globeVideo.play().catch(e => {
                        console.log("Erreur relancement vidéo texture:", e);
                        // Forcer le rechargement si nécessaire
                        globeVideo.load();
                        setTimeout(() => {
                            globeVideo.play().catch(err => console.log("Rechargement forcé échoué:", err));
                        }, 1000);
                    });
                }
            }, 5000); // Vérification toutes les 5 secondes
        }
        
        // Exporter la fonction pour l'appeler après le chargement
        window.startGlobeVideoAfterLoading = startGlobeVideo;
        
        // Gestionnaire d'événements pour éviter les freeze
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
    
    // Vidéo du documentaire avec bouton de lecture et contrôles au survol UNIQUEMENT
    const docVideo = document.querySelector('.main-video');
    const videoContainer = document.querySelector('.video-container');
    const playButton = document.querySelector('.video-play-button');
    
    if (docVideo && playButton) {
        // Masquer les contrôles par défaut et les afficher uniquement au survol
        docVideo.controls = false; // Désactiver les contrôles par défaut
        
        // Afficher les contrôles au survol uniquement
        videoContainer.addEventListener('mouseenter', function() {
            docVideo.controls = true;
            if (docVideo.paused) {
                playButton.style.opacity = '1';
            }
        });
        
        videoContainer.addEventListener('mouseleave', function() {
            docVideo.controls = false; // Masquer les contrôles quand on sort de la zone
            if (docVideo.paused) {
                playButton.style.opacity = '0';
            }
        });
        
        playButton.addEventListener('click', function() {
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
                        videoContainer.classList.add('playing');
                        setTimeout(() => {
                            playButton.style.opacity = '0';
                        }, 500);
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
                videoContainer.classList.remove('playing');
                playButton.style.opacity = '1';
            }
        });
        
        docVideo.addEventListener('pause', function() {
            videoContainer.classList.remove('playing');
            playButton.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z"></path>
                </svg>
            `;
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
        
        docVideo.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
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
                            playButton.innerHTML = `
                                <svg viewBox="0 0 24 24">
                                    <path d="M14,19H18V5H14M6,19H10V5H6V19Z"></path>
                                </svg>
                            `;
                            setTimeout(() => {
                                playButton.style.opacity = '0';
                            }, 500);
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

// Initialisation des boutons de partage - Mêmes conditions que back-to-top
function initShareButtons() {
    const shareButton = document.querySelector('.share-button');
    const shareIcon = document.querySelector('.share-icon');
    const shareOptions = document.querySelector('.share-options');
    const shareOptionLinks = document.querySelectorAll('.share-option');
    
    // Variables pour le suivi du survol
    let isOverShareArea = false;
    
    // Apparition avec les mêmes conditions que back-to-top
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            shareButton.classList.add('visible');
        } else {
            shareButton.classList.remove('visible');
        }
    });
    
    // Gérer le survol du bouton principal
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
    
    // Gérer le survol des options de partage
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
    
    // Gérer les clics sur les options de partage
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
                    shareUrl = `https://www.instagram.com/`;
                    break;
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
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
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

// Stocke la dernière position de défilement pour déterminer la direction
let lastScrollTop = 0;

// Animations au défilement (dans les deux sens)
function initAnimations() {
    const elementsToAnimate = document.querySelectorAll('[data-animation], .video-section, .expedition-image, .stat-card, .scientific-image-wrapper, .resource-card, .credits-col, .section-title, .description');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isScrollingDown = currentScrollTop > lastScrollTop;
            lastScrollTop = currentScrollTop;
            
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('will-change');
            } else {
                entry.target.classList.add('will-change');
                entry.target.classList.remove('visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    document.addEventListener("scroll", throttle(function() {
        checkVisibleElements();
    }, 100));
    
    window.addEventListener('load', function() {
        checkVisibleElements();
    });
}

// Curseur personnalisé amélioré - Garantit le z-index maximum partout
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    
    const follower = document.createElement('div');
    follower.classList.add('cursor-follower');
    
    document.body.appendChild(cursor);
    document.body.appendChild(follower);
    
    let isOverImage = false;
    
    // Mise à jour de la position du curseur
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 30);
        
        // Vérifier si on survole une vidéo ou une image
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
    
    // Effets au survol des liens et boutons
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .share-icon, .back-to-top, .video-play-button, .gallery-arrow, .gallery-dot, .fullscreen-close, .gallery-image-container, .return-exploration');
    
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
    
    // Mise à jour dynamique pour les éléments ajoutés après coup
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    const newInteractiveElements = node.querySelectorAll('a, button, .nav-link, .share-icon, .back-to-top, .video-play-button, .gallery-arrow, .gallery-dot, .fullscreen-close, .gallery-image-container, .return-exploration');
                    newInteractiveElements.forEach(el => {
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
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

// Vérifie quels éléments sont visibles et les anime
function checkVisibleElements() {
    const elementsToCheck = document.querySelectorAll('.will-change, [data-animation]:not(.visible), .video-section:not(.visible), .expedition-image:not(.visible), .stat-card:not(.visible), .scientific-image-wrapper:not(.visible), .resource-card:not(.visible), .credits-col:not(.visible), .section-title:not(.visible), .description:not(.visible)');
    
    elementsToCheck.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
            element.classList.remove('will-change');
        }
    });
}

// Afficher le loader lors du chargement des pages
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

// Vérifie si un élément est dans la zone visible
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < window.innerHeight * 0.85 && 
        rect.bottom > 0
    );
}

// Fonction throttle pour limiter la fréquence d'exécution
function throttle(callback, limit) {
    let waiting = false;
    return function() {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(function() {
                waiting = false;
            }, limit);
        }
    };
}