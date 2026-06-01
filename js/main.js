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

    // Intercept logo click to prevent reload and scroll to top (ONLY on the home page)
    var logoLink = document.querySelector('.logo-img')?.parentElement;
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            var path = window.location.pathname;
            // Перевіряємо, чи ми на головній сторінці (англійській чи німецькій)
            var isHomePage = path.indexOf('/en/') !== -1 || path.indexOf('/de/') !== -1 || path === '/';
            
            if (isHomePage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Якщо при кліку на лого було відкрито мобільне меню — закриваємо його
                if (navList && navList.classList.contains('show')) {
                    navList.classList.remove('show');
                    if (toggle) {
                        toggle.classList.remove('active');
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                }
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
            this.classList.toggle('active'); // анімує три смужки
        });
    }

    // Close mobile nav when clicking outside of it
    document.addEventListener('click', function (e) {
        if (navList && navList.classList.contains('show')) {
            if (!navList.contains(e.target) && !toggle.contains(e.target)) {
                navList.classList.remove('show');
                toggle.classList.remove('active'); // повертає смужки назад
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

// ==========================================
    // ТУТ ПОЧИНАЄТЬСЯ НАША ДИНАМІЧНА ГАЛЕРЕЯ
    // ==========================================
    var galleryImages = [
        'slide1.png',
        'slide2.jpg',
        'slide3.jpg'
        // Якщо закинеш нові фото в assets/gallery/, просто допиши їх назви через кому сюди
    ];

    var galleryIndicators = document.getElementById('gallery-indicators');
    var gallerySlides = document.getElementById('gallery-slides');

    if (galleryIndicators && gallerySlides && galleryImages.length > 0) {
        galleryImages.forEach(function (imageName, index) {
            // Створюємо крапочку-індикатор
            var indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#studioGalleryCarousel');
            indicator.setAttribute('data-bs-slide-to', String(index));
            indicator.setAttribute('aria-label', 'Slide ' + (index + 1));
            
            // Створюємо слайд
            var slide = document.createElement('div');
            slide.className = 'carousel-item h-100';
            
            // Першому слайду даємо активний клас
            if (index === 0) {
                indicator.className = 'active';
                indicator.setAttribute('aria-current', 'true');
                slide.className += ' active';
            }

            var img = document.createElement('img');
            
            // Автоматично виправляємо шлях, якщо користувач сидить на англійській версії
            var basePath = (window.location.pathname.indexOf('/en/') !== -1) ? '../assets/gallery/' : 'assets/gallery/';
            
            img.src = basePath + imageName;
            img.className = 'd-block w-100 h-100';
            img.style.objectFit = 'cover';
            img.alt = 'Zitrus Massagestudio Galeriebild ' + (index + 1);

            slide.appendChild(img);
            galleryIndicators.appendChild(indicator);
            gallerySlides.appendChild(slide);
        });
    }
    // ==========================================
    // КІНЕЦЬ БЛОКУ ГАЛЕРЕЇ
    // ==========================================

    var langSwitch = document.getElementById('lang-switch');

    // --- ОПТИМІЗАЦІЯ ХЕДЕРА ТА УКРОЩЕННЯ СКРОЛУ ---
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
                        header.classList.add('hide');
                    } else if (currentScrollY < lastScrollY || currentScrollY <= hideThreshold) {
                        header.classList.remove('hide');
                    }
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
if (langSwitch) {
        var path = window.location.pathname;
        var hash = window.location.hash || '';
        
        // Отримуємо чисте ім'я файлу (наприклад, index.html, oksana.html)
        var fileName = path.split('/').pop() || 'index.html';
        var target = '';

        // 1. Якщо ми знаходимося на АНГЛІЙСЬКІЙ сторінці (в папці /en/)
        if (path.indexOf('/en/') !== -1) {
            if (fileName === 'index.html' || fileName === '') {
                // Якщо це головна англійська -> перемикаємо на німецьку головну в корінь
                target = '../index.html';
            } else {
                // Якщо це внутрішня англійська -> перемикаємо на таку саму в папку /de/
                target = '../de/' + fileName;
            }
        } 
        
        // 2. Якщо ми знаходимося на сторінці в папці /de/
        else if (path.indexOf('/de/') !== -1) {
            // З папки /de/ ми завжди перемикаємо в папку /en/ на такий самий файл
            target = '../en/' + fileName;
        } 
        
        // 3. Якщо ми на НІМЕЦЬКІЙ ГОЛОВНІЙ сторінці в корені сайту
        else {
            // З кореня перемикаємо на англійську головну в папку /en/
            target = 'en/' + fileName;
        }

        langSwitch.setAttribute('href', target + hash);
    }

    // Adjust anchor clicks to account for sticky header
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