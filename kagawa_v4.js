(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Page loader
  window.addEventListener('load', () => {
    setTimeout(() => $('.page-loader')?.classList.add('is-loaded'), 350);
  });

  // Mobile navigation
  const menuToggle = $('.menu-toggle');
  const navMenu = $('.nav-menu');
  menuToggle?.addEventListener('click', () => {
    const open = navMenu?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(!!open));
  });

  $$('.nav-menu a').forEach(link => link.addEventListener('click', () => {
    navMenu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Scroll progress + header state
  const progress = $('.scroll-progress span');
  const header = $('.site-header');
  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${percent}%`;
    header?.classList.toggle('scrolled', window.scrollY > 30);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  // Scroll reveal
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -55px 0px' });

  $$('.reveal, .hero-reveal, .reveal-item').forEach(el => revealObserver.observe(el));

  // Active section navigation
  const sections = $$('main section[id]');
  const links = $$('.nav-menu a[href^="#"]');
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle(
        'active', link.getAttribute('href') === `#${entry.target.id}`
      ));
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => activeObserver.observe(section));

  // Subtle hero parallax, disabled on small screens / reduced motion
  const hero = $('.hero');
  const canAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && canAnimate && window.innerWidth > 800) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, window.innerHeight) * 0.12;
      hero.style.setProperty('--hero-shift', `${y}px`);
    }, { passive: true });
  }

  // Project inquiry -> WhatsApp
  $('#projectForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(this);
    const name = data.get('name') || '';
    const company = data.get('company') || '-';
    const phone = data.get('phone') || '';
    const service = data.get('service') || '';
    const message = data.get('message') || '';
    const text = [
      `Halo Kagawa, saya ${name}.`,
      '',
      `Perusahaan/Usaha: ${company}`,
      `WhatsApp: ${phone}`,
      `Kebutuhan: ${service}`,
      '',
      'Project Brief:',
      message
    ].join('\n');
    window.open(`https://wa.me/6281363154019?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  });

  // Smoothly close other FAQ items when one opens
  $$('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      $$('.faq-item').forEach(other => {
        if (other !== item) other.removeAttribute('open');
      });
    });
  });
})();
