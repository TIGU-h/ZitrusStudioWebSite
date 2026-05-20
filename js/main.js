// Main JS for global interactions
document.addEventListener('DOMContentLoaded', function () {
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
                // close mobile nav if open
                if (navList && navList.classList.contains('show')) { navList.classList.remove('show'); toggle.setAttribute('aria-expanded', 'false'); }
            }
        });
    });
});