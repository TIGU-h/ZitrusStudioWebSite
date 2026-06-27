function toggleCard(card) {
    var activeCard = document.querySelector('.service-card.expanded');
    if (activeCard && activeCard !== card) {
        activeCard.classList.remove('expanded');
    }
    card.classList.toggle('expanded');
}

function fitServiceTitle(heading) {
    if (!heading) return;

    var text = (heading.textContent || '').trim();
    if (!text) return;

    var maxFontSize = 1.1;
    var minFontSize = 0.72;
    var step = 0.02;
    var computedStyle = window.getComputedStyle(heading);
    var maxHeight = parseFloat(computedStyle.lineHeight) * 2;

    heading.style.fontSize = maxFontSize + 'rem';
    heading.style.lineHeight = '1.25';

    while (maxFontSize >= minFontSize) {
        heading.style.fontSize = maxFontSize + 'rem';
        if (heading.scrollHeight <= maxHeight + 1 && heading.scrollWidth <= heading.clientWidth + 1) {
            break;
        }
        maxFontSize -= step;
    }

    heading.style.fontSize = Math.max(maxFontSize, minFontSize) + 'rem';
}

function fitServiceTitles() {
    var headings = document.querySelectorAll('.service-footer h3');
    headings.forEach(function (heading) {
        fitServiceTitle(heading);
    });
}

function normalizeAssetPath(value) {
    if (!value) return '';

    var normalized = String(value).trim();
    if (!normalized) return '';
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(normalized)) return normalized;

    return normalized.replace(/\/{2,}/g, '/');
}

function resolveAssetUrl(path, baseUrl) {
    var normalizedPath = normalizeAssetPath(path);
    if (!normalizedPath) return '';
    if (/^(?:[a-z]+:)?\/\//i.test(normalizedPath) || normalizedPath.startsWith('data:') || normalizedPath.startsWith('mailto:') || normalizedPath.startsWith('#')) {
        return normalizedPath;
    }

    try {
        return new URL(normalizedPath, baseUrl || window.location.href).toString();
    } catch (error) {
        return normalizedPath;
    }
}

function createServiceCard(service, lang, fallbackImage, servicesBaseUrl) {
    var localized = service[lang] || {};
    var title = localized.title || (service.en && service.en.title) || (service.de && service.de.title) || 'Massage';
    var description = localized.desc || (service.en && service.en.desc) || (service.de && service.de.desc) || '';
    
    var card = document.createElement('div');
    card.className = 'service-card';
    card.addEventListener('click', function () { toggleCard(card); });

    var preview = document.createElement('div');
    preview.className = 'service-preview';

    var imageWrapper = document.createElement('div');
    imageWrapper.className = 'service-img-wrapper';

    var image = document.createElement('img');
    var fallbackImageUrl = resolveAssetUrl(fallbackImage, document.baseURI);
    var imageUrl = service.img ? resolveAssetUrl(service.img, servicesBaseUrl) : fallbackImageUrl;

    image.src = imageUrl || fallbackImageUrl;
    image.alt = title;
    image.addEventListener('error', function () {
        if (fallbackImageUrl && image.currentSrc !== fallbackImageUrl) {
            image.src = fallbackImageUrl;
        }
    });
    imageWrapper.appendChild(image);

    var footer = document.createElement('div');
    footer.className = 'service-footer';

    var heading = document.createElement('h3');
    heading.textContent = title;
    var normalizedTitle = (title || '').trim();
    if (normalizedTitle && !/\s/.test(normalizedTitle) && normalizedTitle.length > 16) {
        heading.classList.add('single-word');
    }

    var button = document.createElement('button');
    button.className = 'btn-arrow';
    button.type = 'button';
    button.setAttribute('aria-label', 'Toggle details');
    button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>';

    footer.appendChild(heading);
    footer.appendChild(button);
    preview.appendChild(imageWrapper);
    preview.appendChild(footer);

    var details = document.createElement('div');
    details.className = 'service-details';

    var detailsContent = document.createElement('div');
    detailsContent.className = 'details-content';

    if (description) {
        var descriptionElement = document.createElement('p');
        descriptionElement.className = 'description';
        descriptionElement.textContent = description;
        detailsContent.appendChild(descriptionElement);
    }

    var prices = document.createElement('ul');
    prices.className = 'prices';

    (service.durations || []).forEach(function (duration) {
        if (!duration.price || duration.price === '--') return;

        var item = document.createElement('li');
        var time = document.createElement('strong');
        time.textContent = duration.time;

        var priceGroup = document.createElement('span');
        if (duration.oldPrice && duration.oldPrice !== '--') {
            var oldPrice = document.createElement('span');
            oldPrice.className = 'old-price';
            oldPrice.textContent = duration.oldPrice;
            priceGroup.appendChild(oldPrice);
        }

        priceGroup.appendChild(document.createTextNode(duration.price));
        item.appendChild(time);
        item.appendChild(priceGroup);
        prices.appendChild(item);
    });

    detailsContent.appendChild(prices);
    details.appendChild(detailsContent);
    card.appendChild(preview);
    card.appendChild(details);

    return card;
}

function renderServiceCards(services, servicesBaseUrl) {
    var grid = document.querySelector('.services-grid');
    if (!grid) return;

    var lang = document.documentElement.lang || 'en';
    var fallbackImage = grid.getAttribute('data-service-fallback') || 'assets/carousel/slide1.png';
    var resolvedFallbackImage = resolveAssetUrl(fallbackImage, document.baseURI);
    grid.innerHTML = '';
    delete grid.dataset.columns;

    // Оптимізація: додаємо через фрагмент, щоб не перевантажувати DOM
    var fragment = document.createDocumentFragment();
    services.forEach(function (service) {
        fragment.appendChild(createServiceCard(service, lang, resolvedFallbackImage, servicesBaseUrl));
    });
    grid.appendChild(fragment);

    layoutServiceColumns();
    window.requestAnimationFrame(fitServiceTitles);
}

function loadServiceCards() {
    var grid = document.querySelector('.services-grid');
    if (!grid) return;

    var servicesSource = grid.getAttribute('data-services-source') || 'assets/MassageList.json';
    var servicesUrl = resolveAssetUrl(servicesSource, document.baseURI);
    fetch(servicesUrl)
        .then(function (response) {
            if (!response.ok) throw new Error('Could not load services');
            return response.json();
        })
        .then(function(services) {
            renderServiceCards(services, servicesUrl);

            if (window.location.hash) {
                var targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    setTimeout(function() {
                        var header = document.querySelector('.site-header');
                        var headerHeight = header ? header.getBoundingClientRect().height : 72;
                        var rect = targetElement.getBoundingClientRect();
                        var offset = window.scrollY + rect.top - headerHeight - 12;
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                    }, 150);
                }
            }
        })
        .catch(function () {
            grid.innerHTML = '<p class="muted services-loading">Services could not be loaded.</p>';
        });
}

function getServiceColumnCount() {
    if (window.innerWidth <= 699) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
}

function layoutServiceColumns() {
    var grid = document.querySelector('.services-grid');
    if (!grid) return;

    var columnCount = getServiceColumnCount();
    if (grid.dataset.columns === String(columnCount)) return;

    var cards = Array.from(grid.querySelectorAll('.service-card'));
    grid.innerHTML = '';
    grid.dataset.columns = String(columnCount);

    var columns = [];
    var fragment = document.createDocumentFragment();
    
    for (var i = 0; i < columnCount; i += 1) {
        var column = document.createElement('div');
        column.className = 'service-column';
        columns.push(column);
        fragment.appendChild(column);
    }

    cards.forEach(function (card, index) {
        columns[index % columnCount].appendChild(card);
    });
    
    grid.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', loadServiceCards);
window.addEventListener('resize', function () {
    window.requestAnimationFrame(layoutServiceColumns);
    window.requestAnimationFrame(fitServiceTitles);
});

// Hero Background Carousel
document.addEventListener('DOMContentLoaded', function () {
    const bgSlides = document.querySelectorAll('#hero-carousel-bg .carousel-bg-slide');
    let current = 0;
    if (bgSlides.length > 1) {
        setInterval(() => {
            bgSlides[current].classList.remove('active');
            current = (current + 1) % bgSlides.length;
            bgSlides[current].classList.add('active');
        }, 4000);
    }
});

// Global interactions
document.addEventListener('DOMContentLoaded', function () {

    // Intercept logo click
    var logoLink = document.querySelector('.logo-img')?.parentElement;
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            var path = window.location.pathname;
            if (path.endsWith('/') || path.endsWith('/index.html')) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    var toggle = document.querySelector('.nav-toggle');
    var navList = document.getElementById('nav-list');
    if (toggle && navList) {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            navList.classList.toggle('show');
            this.classList.toggle('active');
        });
    }

    document.addEventListener('click', function (e) {
        if (navList && navList.classList.contains('show')) {
            if (!navList.contains(e.target) && !toggle.contains(e.target)) {
                navList.classList.remove('show');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ==========================================
    // ОПТИМІЗОВАНА ГАЛЕРЕЯ
    // ==========================================
    var gallery = document.getElementById('studioGalleryCarousel');
    var galleryImages = [];
    var galleryBase = 'assets/gallery/';

    if (gallery && gallery.getAttribute('data-gallery-images')) {
        galleryImages = gallery.getAttribute('data-gallery-images').split(',').map(function (value) {
            return value.trim();
        }).filter(Boolean);
    }

    if (gallery && gallery.getAttribute('data-gallery-base')) {
        galleryBase = gallery.getAttribute('data-gallery-base');
    }

    var resolvedGalleryBase = resolveAssetUrl(galleryBase, document.baseURI);

    var galleryIndicators = document.getElementById('gallery-indicators');
    var gallerySlides = document.getElementById('gallery-slides');

    if (galleryIndicators && gallerySlides && galleryImages.length > 0) {
        var indicatorsFragment = document.createDocumentFragment();
        var slidesFragment = document.createDocumentFragment();

        galleryImages.forEach(function (imageName, index) {
            var indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#studioGalleryCarousel');
            indicator.setAttribute('data-bs-slide-to', String(index));
            indicator.setAttribute('aria-label', 'Slide ' + (index + 1));
            
            var slide = document.createElement('div');
            slide.className = 'carousel-item h-100';
            
            if (index === 0) {
                indicator.className = 'active';
                indicator.setAttribute('aria-current', 'true');
                slide.className += ' active';
            }

            var img = document.createElement('img');
            img.src = resolveAssetUrl(imageName, resolvedGalleryBase);
            img.className = 'd-block w-100 h-100';
            img.style.objectFit = 'cover';
            img.alt = 'Zitrus Massagestudio Galeriebild ' + (index + 1);

            slide.appendChild(img);
            indicatorsFragment.appendChild(indicator);
            slidesFragment.appendChild(slide);
        });

        galleryIndicators.appendChild(indicatorsFragment);
        gallerySlides.appendChild(slidesFragment);
    }

    // --- ХЕДЕР ТА СКРОЛ ---
    var lastScrollY = window.scrollY;
    var ticking = false;
    var header = document.querySelector('.site-header');
    var cachedHideDistance = '72px';

    function updateHideDistance() {
        var rootStyles = getComputedStyle(document.documentElement);
        var valueString = rootStyles.getPropertyValue('--header-hide-distance').trim();
        if (!valueString) return;
        
        var values = valueString.split(' ');
        var w = window.innerWidth;
        if (w <= 699) cachedHideDistance = values[2] || values[0];
        else if (w <= 1024) cachedHideDistance = values[1] || values[0];
        else cachedHideDistance = values[0];
        
        if (header) {
            header.style.setProperty('--header-hide-distance-active', cachedHideDistance);
        }
    }

    if (header) {
        updateHideDistance();
        window.addEventListener('resize', updateHideDistance);

        var hideThreshold = 150; 
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if (navList && navList.classList.contains('show')) {
                        header.classList.remove('hide');
                        lastScrollY = window.scrollY;
                        ticking = false;
                        return;
                    }
                    var currentScrollY = window.scrollY;
                    if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
                        if (!header.classList.contains('hide')) {
                            header.classList.add('hide');
                        }
                    } else if (currentScrollY < lastScrollY || currentScrollY <= hideThreshold) {
                        if (header.classList.contains('hide')) {
                            header.classList.remove('hide');
                        }
                    }
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Anchor smooth scroll
    var headerHeight = header ? header.getBoundingClientRect().height : 72;
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var hash = this.getAttribute('href');
            if (!hash || hash === '#') return;
            var targetEl = document.querySelector(hash);
            if (targetEl) {
                e.preventDefault();
                var rect = targetEl.getBoundingClientRect();
                var offset = window.scrollY + rect.top - headerHeight - 12;
                window.scrollTo({ top: offset, behavior: 'smooth' });
                
                if (navList && navList.classList.contains('show')) { 
                    navList.classList.remove('show'); 
                    if (toggle) {
                        toggle.classList.remove('active'); 
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });
});