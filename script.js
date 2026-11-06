(function () {
    'use strict';

    function initNav() {
        var toggle = document.querySelector('.nav-toggle');
        var links = document.getElementById('nav-links');
        if (!toggle || !links) return;

        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var open = links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        links.addEventListener('click', function (e) {
            if (e.target.closest('a')) {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('click', function (e) {
            if (!links.classList.contains('open')) return;
            if (links.contains(e.target) || toggle.contains(e.target)) return;
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && links.classList.contains('open')) {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 900) {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function initReveal() {
        var sections = document.querySelectorAll('.section');
        if (!('IntersectionObserver' in window)) {
            sections.forEach(function (s) { s.classList.add('visible'); });
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        sections.forEach(function (s) { obs.observe(s); });
    }

    function initYear() {
        var el = document.getElementById('year');
        if (el) el.textContent = String(new Date().getFullYear());
    }

    function initActiveNav() {
        var anchors = document.querySelectorAll('.nav-links a[href^="#"]');
        var pairs = [];
        anchors.forEach(function (a) {
            var t = document.getElementById(a.getAttribute('href').slice(1));
            if (t) pairs.push({ link: a, target: t });
        });
        if (!pairs.length) return;

        var ticking = false;
        function update() {
            var y = window.scrollY + 120;
            var current = null;
            pairs.forEach(function (p) { if (p.target.offsetTop <= y) current = p; });
            anchors.forEach(function (a) { a.classList.remove('active'); });
            if (current) current.link.classList.add('active');
        }
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () { update(); ticking = false; });
                ticking = true;
            }
        }, { passive: true });
    }

    function boot() {
        initNav();
        initReveal();
        initYear();
        initActiveNav();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();