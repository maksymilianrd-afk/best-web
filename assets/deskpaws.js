/* ============================================================
   DESKPAWS — Interactive behaviours
   Scroll animations · FAQ accordion · Gallery · Sticky header
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll-triggered animations ───────────────────────── */
  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('anim-in');
          animObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  document.querySelectorAll('[data-anim]').forEach((el) => {
    animObserver.observe(el);
  });

  /* ── Sticky header shadow on scroll ────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── FAQ Accordion ─────────────────────────────────────── */
  document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const isOpen = item.classList.contains('open');

      // Close all siblings in the same accordion
      const accordion = item.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion__item.open').forEach((openItem) => {
          if (openItem !== item) openItem.classList.remove('open');
        });
      }

      item.classList.toggle('open', !isOpen);
    });
  });

  /* ── Product image gallery ─────────────────────────────── */
  const mainImg = document.querySelector('.gallery-main img');
  const thumbs  = document.querySelectorAll('.gallery-thumbs .thumb');

  if (mainImg && thumbs.length) {
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src    = thumb.dataset.src    || thumb.querySelector('img')?.src;
        const srcset = thumb.dataset.srcset || '';

        if (src) {
          mainImg.style.opacity = '0';
          mainImg.style.transform = 'scale(0.97)';
          setTimeout(() => {
            mainImg.src = src;
            if (srcset) mainImg.srcset = srcset;
            mainImg.style.opacity = '1';
            mainImg.style.transform = '';
          }, 160);
        }

        thumbs.forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    // Set first thumb active
    if (thumbs[0]) thumbs[0].classList.add('active');

    // Smooth main image transition
    mainImg.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
  }

  /* ── Sticky mobile CTA: show after hero leaves viewport ── */
  const stickyCta = document.querySelector('.sticky-mobile-cta');
  const heroSection = document.querySelector('.hero');

  if (stickyCta && heroSection) {
    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        stickyCta.style.transform = entry.isIntersecting
          ? 'translateY(100%)'
          : 'translateY(0)';
        stickyCta.style.opacity = entry.isIntersecting ? '0' : '1';
      },
      { threshold: 0.1 }
    );
    ctaObserver.observe(heroSection);

    // Start hidden
    stickyCta.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    stickyCta.style.transform = 'translateY(100%)';
    stickyCta.style.opacity = '0';
  }

  /* ── Cart quantity stepper ─────────────────────────────── */
  document.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.qty-wrap')?.querySelector('.qty-input');
      if (!input) return;
      const val = parseInt(input.value, 10) || 1;
      const dir = btn.dataset.dir === 'up' ? 1 : -1;
      input.value = Math.max(1, val + dir);
    });
  });

  /* ── Smooth scroll for anchor links ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Auto-open first FAQ item ───────────────────────────── */
  const firstAccordionItem = document.querySelector('.accordion__item');
  if (firstAccordionItem) {
    firstAccordionItem.classList.add('open');
  }

})();
