/* Bunn demo site: small, dependency-free interactions. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Sticky header shadow
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile navigation
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  function setNav(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  // Menu filter
  var tabs = document.querySelectorAll('.tab');
  var items = document.querySelectorAll('.item');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = tab.dataset.filter;
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-pressed', String(active));
      });
      items.forEach(function (item) {
        item.hidden = !(filter === 'all' || item.dataset.cat === filter);
      });
    });
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Contact form validation (demo: no backend)
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Please write at least 10 characters.'; }
  };
  function check(field) {
    var msg = rules[field.name](field.value);
    form.querySelector('.error[data-for="' + field.name + '"]').textContent = msg;
    field.classList.toggle('invalid', !!msg);
    return !msg;
  }
  Object.keys(rules).forEach(function (n) {
    form.elements[n].addEventListener('blur', function (e) { check(e.target); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(rules).map(function (n) { return check(form.elements[n]); }).every(Boolean);
    status.style.color = ok ? '' : '#B3261E';
    status.textContent = ok ? 'Thank you! This is a demo form, so no message was sent.' : 'Please fix the highlighted fields.';
    if (ok) form.reset();
  });
})();
