// Services expandable cards
var SERVICE_IMAGE_FALLBACK = '../assets/carousel/slide1.png';

function toggleCard(card) {
    var activeCard = document.querySelector('.service-card.expanded');
    if (activeCard && activeCard !== card) {
        activeCard.classList.remove('expanded');
    }

    card.classList.toggle('expanded');
}

function createServiceCard(service, lang) {
    var localized = service[lang] || {};
    var title = localized.title || (service.en && service.en.title) || (service.de && service.de.title) || 'Massage';
    var description = localized.desc || (service.en && service.en.desc) || (service.de && service.de.desc) || '';
    var card = document.createElement('div');
    card.className = 'service-card';
    card.addEventListener('click', function () {
        toggleCard(card);
    });

    var preview = document.createElement('div');
    preview.className = 'service-preview';

    var imageWrapper = document.createElement('div');
    imageWrapper.className = 'service-img-wrapper';

    var image = document.createElement('img');
    image.src = service.img || SERVICE_IMAGE_FALLBACK;
    image.alt = title;
    image.addEventListener('error', function () {
        if (image.src.indexOf(SERVICE_IMAGE_FALLBACK) === -1) {
            image.src = SERVICE_IMAGE_FALLBACK;
        }
    });
    imageWrapper.appendChild(image);

    var footer = document.createElement('div');
    footer.className = 'service-footer';

    var heading = document.createElement('h3');
    heading.textContent = title;

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

function renderServiceCards(services) {
    var grid = document.querySelector('.services-grid');
    if (!grid) return;

    var lang = document.documentElement.lang || 'en';
    grid.innerHTML = '';
    delete grid.dataset.columns;

    services.forEach(function (service) {
        grid.appendChild(createServiceCard(service, lang));
    });

    layoutServiceColumns();
}

function loadServiceCards() {
    var grid = document.querySelector('.services-grid[data-services-source]');
    if (!grid) return;

    fetch(grid.dataset.servicesSource)
        .then(function (response) {
            if (!response.ok) throw new Error('Could not load services');
            return response.json();
        })
        .then(function(services) {
            renderServiceCards(services); // Малюємо картки з цінами

            // --- ПОЧАТОК КОСТИЛЯ (Фікс скролу) ---
            if (window.location.hash) {
                var targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    setTimeout(function() {
                        var header = document.querySelector('.site-header');
                        var headerHeight = header ? header.getBoundingClientRect().height : 72;
                        var rect = targetElement.getBoundingClientRect();
                        var offset = window.scrollY + rect.top - headerHeight - 12;
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                    }, 150); // Даємо браузеру 150мс на перерахунок висоти після вставки HTML
                }
            }
            // --- КІНЕЦЬ КОСТИЛЯ ---
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
    for (var i = 0; i < columnCount; i += 1) {
        var column = document.createElement('div');
        column.className = 'service-column';
        columns.push(column);
        grid.appendChild(column);
    }

    cards.forEach(function (card, index) {
        columns[index % columnCount].appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', loadServiceCards);
window.addEventListener('resize', function () {
    window.requestAnimationFrame(layoutServiceColumns);
});

// Hero Background Carousel Logic
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
// Main JS for global interactions
document.addEventListener('DOMContentLoaded', function () {

        // Intercept logo click to prevent reload and scroll to top
        // Intercept logo click to prevent reload and scroll to top (ONLY on the home page)
    var logoLink = document.querySelector('.logo-img')?.parentElement;
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            var path = window.location.pathname;
            var isHomePage = /\/(?:en|de)\/(?:index\.html)?$/.test(path);
            if (isHomePage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    // Mobile nav toggle
    var toggle = document.querySelector('.nav-toggle');
    var navList = document.getElementById('nav-list');
    if (toggle && navList) {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            navList.classList.toggle('show');
            this.classList.toggle('active'); // ОЦЕ ДОДАЛИ: анімує три смужки
        });
    }

    // Close mobile nav when clicking outside of it
    document.addEventListener('click', function (e) {
        if (navList && navList.classList.contains('show')) {
            if (!navList.contains(e.target) && !toggle.contains(e.target)) {
                navList.classList.remove('show');
                toggle.classList.remove('active'); // ОЦЕ ДОДАЛИ: повертає смужки назад
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Language switch: preserve hash and map between language folders.
    var langSwitch = document.getElementById('lang-switch');

    // HEADER HIDE/SHOW ON SCROLL
    // --- SETTINGS ---
    // Transition time: set in CSS as --header-transition-time
    // Hide distance: set in CSS as --header-hide-distance (3 values: desktop / tablet / mobile)
    var lastScrollY = window.scrollY;
    var ticking = false;
    var header = document.querySelector('.site-header');
    function getHideDistance() {
        // Get the 3 values from the CSS variable
        var rootStyles = getComputedStyle(document.documentElement);
        var values = rootStyles.getPropertyValue('--header-hide-distance').trim().split(' ');
        var w = window.innerWidth;
        if (w <= 699) return values[2] || values[0]; // mobile
        if (w <= 1024) return values[1] || values[0]; // tablet
        return values[0]; // desktop
    }
    if (header) {
        // HEADER IMMEDIATE HIDE AFTER FEW SCROLLS
        var hideThreshold = 150; // <--- how many px to scroll before header hides immediately
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    // Prevent hiding if nav menu is open
                    if (navList && navList.classList.contains('show')) {
                        header.classList.remove('hide');
                        header.style.setProperty('--header-hide-distance-active', getHideDistance());
                        lastScrollY = window.scrollY;
                        ticking = false;
                        return;
                    }
                    var currentScrollY = window.scrollY;
                    if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
                        // Scrolling down and past threshold, hide header immediately
                        header.classList.add('hide');
                        header.style.setProperty('--header-hide-distance-active', getHideDistance());
                    } else if (currentScrollY < lastScrollY || currentScrollY <= hideThreshold) {
                        // Scrolling up or above threshold, show header
                        header.classList.remove('hide');
                        header.style.setProperty('--header-hide-distance-active', getHideDistance());
                    }
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        });
        // Update on resize
        window.addEventListener('resize', function () {
            header.style.setProperty('--header-hide-distance-active', getHideDistance());
        });
        // Set initial value
        header.style.setProperty('--header-hide-distance-active', getHideDistance());
    }
    if (langSwitch) {
        var hash = location.hash || '';
        var currentLang = document.documentElement.lang === 'de' ? 'de' : 'en';
        var nextLang = currentLang === 'de' ? 'en' : 'de';
        var fileName = location.pathname.split('/').pop() || 'index.html';
        var target = '../' + nextLang + '/' + fileName;

        langSwitch.setAttribute('href', target + hash);
    }

    // Adjust anchor clicks to account for sticky header
    var header = document.querySelector('.site-header');
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
                
                // ФІКС ОПТИМІЗАЦІЇ: закриваємо меню І знімаємо хрестик при кліку на лінк
                if (navList && navList.classList.contains('show')) { 
                    navList.classList.remove('show'); 
                    if (toggle) {
                        toggle.classList.remove('active'); // ПРИБИРАЄМО ХРЕСТИК ТУТ
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });
});
