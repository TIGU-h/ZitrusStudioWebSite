// Main JS for global interactions
document.addEventListener('DOMContentLoaded', function () {

        // Intercept logo click to prevent reload and scroll to top
        var logoLink = document.querySelector('.logo-img')?.parentElement;
        if (logoLink) {
            logoLink.addEventListener('click', function(e) {
                // Only intercept if already on /en/ (current page)
                if (window.location.pathname.startsWith('/en/')) {
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

    // Language switch: preserve hash and map between /de/ and /en/
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
        var path = location.pathname;
        var hash = location.hash || '';
        var target = '/de/';
        if (path.indexOf('/de/') === 0) target = '/en/';
        if (path.indexOf('/en/') === 0) target = '/de/';
        // ensure trailing slash
        if (!target.endsWith('/')) target += '/';
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