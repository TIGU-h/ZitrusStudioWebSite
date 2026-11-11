if (window.location.pathname.endsWith('/index.html')) {
    var cleanUrl = window.location.pathname.replace(/index\.html$/, '') + window.location.search + window.location.hash;
    window.history.replaceState(null, '', cleanUrl || '/');
}

function getMenuLabel(open) {
    var labels = document.documentElement.lang === 'de'
        ? { open: 'Menü öffnen', close: 'Menü schließen' }
        : { open: 'Open menu', close: 'Close menu' };
    return open ? labels.close : labels.open;
}

function toggleCard(card, button) {
    var activeCard = document.querySelector('.service-card.expanded');
    if (activeCard && activeCard !== card) {
        activeCard.classList.remove('expanded');
        var activeButton = activeCard.querySelector('.service-toggle');
        var activeDetails = activeCard.querySelector('.service-details');
        if (activeButton) activeButton.setAttribute('aria-expanded', 'false');
        if (activeDetails) activeDetails.inert = true;
    }
    card.classList.toggle('expanded');
    button.setAttribute('aria-expanded', String(card.classList.contains('expanded')));
    var details = card.querySelector('.service-details');
    if (details) details.inert = !card.classList.contains('expanded');
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
    var headings = document.querySelectorAll('.service-title');
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

function getSiteBasePath() {
    var pathname = window.location.pathname || '/';
    if (!pathname.endsWith('/')) {
        pathname = pathname.replace(/[^/]*$/, '');
    }
    if (!pathname.startsWith('/')) {
        pathname = '/' + pathname;
    }
    return pathname === '/' ? '/' : pathname.replace(/\/+$/, '/') + '';
}

function resolveAssetUrl(path, baseUrl) {
    var normalizedPath = normalizeAssetPath(path);
    if (!normalizedPath) return '';
    if (/^(?:[a-z]+:)?\/\//i.test(normalizedPath) || normalizedPath.startsWith('data:') || normalizedPath.startsWith('mailto:') || normalizedPath.startsWith('#')) {
        return normalizedPath;
    }

    if (normalizedPath.startsWith('/')) {
        var siteBasePath = getSiteBasePath();
        var relativePath = normalizedPath.replace(/^\/+/, '');
        return new URL(relativePath, window.location.origin + siteBasePath).toString();
    }

    try {
        return new URL(normalizedPath, baseUrl || window.location.href).toString();
    } catch (error) {
        return normalizedPath;
    }
}

var heroCarouselImages = [
    'assets/gallery/stones.webp',
    'assets/gallery/candles.webp',
    'assets/gallery/oil.webp',
];

var galleryCarouselImages = [
    'assets/gallery/prof_duo.webp',
    'assets/gallery/candles.webp',
    'assets/gallery/duolike.webp',
    'assets/gallery/oil.webp',
    'assets/gallery/stones.webp',
];

function getSiteRootBaseUrl() {
    var pathname = window.location.pathname || '/';
    var normalizedPath = String(pathname).replace(/\\/g, '/');
    var isLanguagePage = /\/(en|de)(\/|$)/i.test(normalizedPath);

    if (isLanguagePage) {
        return new URL('../', window.location.href).toString();
    }

    return new URL('./', window.location.href).toString();
}

function resolveImagePath(imagePath, baseUrl) {
    var normalizedPath = normalizeAssetPath(imagePath);
    if (!normalizedPath) return '';

    if (/^(?:[a-z]+:)?\/\//i.test(normalizedPath) || normalizedPath.startsWith('data:') || normalizedPath.startsWith('mailto:') || normalizedPath.startsWith('#')) {
        return normalizedPath;
    }

    if (normalizedPath.startsWith('/')) {
        return resolveAssetUrl(normalizedPath.replace(/^\/+/, ''), getSiteRootBaseUrl());
    }

    if (normalizedPath.includes('/') || normalizedPath.includes('\\')) {
        return resolveAssetUrl(normalizedPath, getSiteRootBaseUrl());
    }

    return resolveAssetUrl(normalizedPath, baseUrl || getSiteRootBaseUrl());
}

function buildHeroCarousel() {
    var carousel = document.getElementById('heroBootstrapCarousel');
    if (!carousel || !heroCarouselImages.length) return;

    var inner = carousel.querySelector('.carousel-inner');
    if (!inner) return;

    inner.innerHTML = '';
    var fragment = document.createDocumentFragment();

    heroCarouselImages.forEach(function (imagePath, index) {
        var slide = document.createElement('div');
        slide.className = 'carousel-item h-100' + (index === 0 ? ' active' : '');

        var background = document.createElement('div');
        background.className = 'carousel-bg-slide';
        background.style.backgroundImage = 'url("' + resolveImagePath(imagePath, getSiteRootBaseUrl()) + '")';

        slide.appendChild(background);
        fragment.appendChild(slide);
    });

    inner.appendChild(fragment);
}

function buildGalleryCarousel() {
    var gallery = document.getElementById('studioGalleryCarousel');
    if (!gallery) return;

    var galleryImages = galleryCarouselImages && galleryCarouselImages.length
        ? galleryCarouselImages.slice()
        : [];

    if (!galleryImages.length) {
        var galleryImagesAttribute = gallery.getAttribute('data-gallery-images');
        galleryImages = galleryImagesAttribute
            ? galleryImagesAttribute.split(',').map(function (value) {
                return value.trim();
            }).filter(Boolean)
            : [];
    }

    var galleryBase = gallery.getAttribute('data-gallery-base') || 'assets/gallery/';
    var resolvedGalleryBase = resolveAssetUrl(galleryBase, getSiteRootBaseUrl());

    var galleryIndicators = document.getElementById('gallery-indicators');
    var gallerySlides = document.getElementById('gallery-slides');
    if (!galleryIndicators || !gallerySlides || !galleryImages.length) return;

    galleryIndicators.innerHTML = '';
    gallerySlides.innerHTML = '';

    var indicatorsFragment = document.createDocumentFragment();
    var slidesFragment = document.createDocumentFragment();

    galleryImages.forEach(function (imagePath, index) {
        var indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#studioGalleryCarousel');
        indicator.setAttribute('data-bs-slide-to', String(index));
        indicator.setAttribute('aria-label', 'Slide ' + (index + 1));

        var slide = document.createElement('div');
        slide.className = 'carousel-item h-100' + (index === 0 ? ' active' : '');

        if (index === 0) {
            indicator.className = 'active';
            indicator.setAttribute('aria-current', 'true');
        }

        var img = document.createElement('img');
        img.src = resolveImagePath(imagePath, resolvedGalleryBase);
        img.className = 'd-block w-100 h-100';
        img.style.objectFit = 'cover';
        img.alt = document.documentElement.lang === 'de'
            ? 'Einblick ins Zitrus Massagestudio ' + (index + 1)
            : 'A look inside Zitrus Massage Studio ' + (index + 1);

        slide.appendChild(img);
        indicatorsFragment.appendChild(indicator);
        slidesFragment.appendChild(slide);
    });

    galleryIndicators.appendChild(indicatorsFragment);
    gallerySlides.appendChild(slidesFragment);
}

function createServiceCard(service, lang, fallbackImage, servicesBaseUrl) {
    var localized = service[lang] || {};
    var title = localized.title || (service.en && service.en.title) || (service.de && service.de.title) || 'Massage';
    var description = localized.desc || (service.en && service.en.desc) || (service.de && service.de.desc) || '';
    
    var card = document.createElement('article');
    card.className = 'service-card';
    card.id = 'service-' + service.id;

    var preview = document.createElement('div');
    preview.className = 'service-preview';

    var button = document.createElement('button');
    button.className = 'service-toggle';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'service-details-' + service.id);
    button.addEventListener('click', function () { toggleCard(card, button); });

    var imageWrapper = document.createElement('span');
    imageWrapper.className = 'service-img-wrapper';

    var image = document.createElement('img');
    var fallbackImageUrl = resolveAssetUrl(fallbackImage, document.baseURI);
    var imageUrl = service.img ? resolveAssetUrl(service.img, servicesBaseUrl) : fallbackImageUrl;

    image.src = imageUrl || fallbackImageUrl;
    image.alt = '';
    image.loading = 'lazy';
    image.addEventListener('error', function () {
        if (fallbackImageUrl && image.currentSrc !== fallbackImageUrl) {
            image.src = fallbackImageUrl;
        }
    });
    imageWrapper.appendChild(image);

    var footer = document.createElement('span');
    footer.className = 'service-footer';

    var heading = document.createElement('span');
    heading.className = 'service-title';
    heading.textContent = title;
    var normalizedTitle = (title || '').trim();
    if (normalizedTitle && !/\s/.test(normalizedTitle) && normalizedTitle.length > 16) {
        heading.classList.add('single-word');
    }

    var availablePrices = (service.durations || []).filter(function (duration) {
        return duration.price && duration.price !== '--';
    });
    var listedPrices = [];
    availablePrices.forEach(function (duration) {
        var matches = String(duration.price).match(/\d+(?:[.,]\d+)?/g) || [];
        matches.forEach(function (price) {
            listedPrices.push(Number(price.replace(',', '.')));
        });
    });
    var summary = document.createElement('span');
    summary.className = 'service-price-summary';
    if (listedPrices.length) {
        summary.textContent = (lang === 'de' ? 'Ab ' : 'From ') + Math.min.apply(Math, listedPrices) + '€';
    } else if (service.id === 'gift-certificate') {
        summary.textContent = lang === 'de' ? 'Auf Anfrage' : 'Ask us';
    } else {
        summary.textContent = lang === 'de' ? 'Preise ansehen' : 'View prices';
    }

    var arrow = document.createElement('span');
    arrow.className = 'btn-arrow';
    arrow.setAttribute('aria-hidden', 'true');

    footer.appendChild(heading);
    footer.appendChild(summary);
    footer.appendChild(arrow);
    button.appendChild(imageWrapper);
    button.appendChild(footer);
    preview.appendChild(button);

    var details = document.createElement('div');
    details.className = 'service-details';
    details.id = 'service-details-' + service.id;
    details.inert = true;

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
        time.textContent = duration[lang] || duration.time;

        var priceGroup = document.createElement('span');
        if (duration.oldPrice && duration.oldPrice !== '--') {
            var oldPrice = document.createElement('span');
            oldPrice.className = 'old-price';
            oldPrice.textContent = duration.oldPrice;
            priceGroup.appendChild(oldPrice);
        } else {
            item.classList.add('price-single');
        }

        priceGroup.appendChild(document.createTextNode(duration.price));
        item.appendChild(time);
        item.appendChild(priceGroup);
        prices.appendChild(item);
    });

    detailsContent.appendChild(prices);
    var contactLink = document.createElement('a');
    contactLink.className = 'service-contact-link';
    contactLink.href = '#contact';
    contactLink.textContent = lang === 'de' ? 'Per WhatsApp anfragen' : 'Ask us via WhatsApp';
    detailsContent.appendChild(contactLink);
    details.appendChild(detailsContent);
    card.appendChild(preview);
    card.appendChild(details);

    return card;
}

function renderServiceCards(services, servicesBaseUrl) {
    var grid = document.querySelector('.services-grid');
    if (!grid) return;

    var lang = document.documentElement.lang || 'en';
    var fallbackImage = grid.getAttribute('data-service-fallback') || 'assets/gallery/stones.webp';
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
            var message = document.documentElement.lang === 'de'
                ? 'Die Angebote konnten nicht geladen werden.'
                : 'Services could not be loaded.';
            grid.innerHTML = '<p class="muted services-loading">' + message + '</p>';
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

document.addEventListener('DOMContentLoaded', function () {
    buildHeroCarousel();
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
            this.setAttribute('aria-label', getMenuLabel(!expanded));
        });
    }

    document.addEventListener('click', function (e) {
        if (navList && toggle && navList.classList.contains('show')) {
            if (!navList.contains(e.target) && !toggle.contains(e.target)) {
                navList.classList.remove('show');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', getMenuLabel(false));
            }
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navList && toggle && navList.classList.contains('show')) {
            navList.classList.remove('show');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', getMenuLabel(false));
            toggle.focus();
        }
    });

    buildGalleryCarousel();

    // --- ХЕДЕР ТА СКРОЛ ---
    var lastScrollY = window.scrollY || window.pageYOffset || 0;
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

        var hideThreshold = 24;
        function updateHeaderVisibility() {
            var currentScrollY = window.scrollY || window.pageYOffset || 0;
            var delta = currentScrollY - lastScrollY;

            if (navList && navList.classList.contains('show')) {
                header.classList.remove('hide');
                lastScrollY = currentScrollY;
                ticking = false;
                return;
            }

            if (Math.abs(delta) < 8) {
                ticking = false;
                return;
            }

            if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
                header.classList.add('hide');
            } else if (currentScrollY < lastScrollY || currentScrollY <= hideThreshold) {
                header.classList.remove('hide');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateHeaderVisibility);
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
                        toggle.setAttribute('aria-label', getMenuLabel(false));
                    }
                }
            }
        });
    });
});
