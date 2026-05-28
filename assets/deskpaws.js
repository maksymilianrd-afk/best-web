/* DeskPaws — Mily Group interactive patterns */
(function () {
  'use strict';

  /* ── Header: overlay → scrolled on scroll ──────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Gallery arrow navigation (scroll-snap) ────────────── */
  document.querySelectorAll('.btn-arrow[data-slides]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const slidesEl = document.getElementById(btn.dataset.slides);
      if (!slidesEl) return;
      const dir = parseInt(btn.dataset.dir, 10);
      slidesEl.scrollBy({ left: dir * slidesEl.offsetWidth, behavior: 'smooth' });
    });
  });

  /* ── FAQ Accordion ─────────────────────────────────────── */
  document.querySelectorAll('.faq-item__trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      const list = item.closest('.faq-list');
      if (list) {
        list.querySelectorAll('.faq-item.open').forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ── Auto-open first FAQ item ───────────────────────────── */
  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) {
    firstFaq.classList.add('open');
    firstFaq.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'true');
  }

  /* ── Product page gallery thumbs ──────────────────────── */
  const mainImg = document.querySelector('.gallery-main img');
  const thumbs  = document.querySelectorAll('.product-thumb');

  if (mainImg && thumbs.length) {
    mainImg.style.transition = 'opacity 0.18s ease';

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.src;
        if (src) {
          mainImg.style.opacity = '0';
          setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = '1';
          }, 160);
        }
        thumbs.forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    if (thumbs[0]) thumbs[0].classList.add('active');
  }

  /* ── Sticky mobile CTA: show after hero leaves ─────────── */
  const stickyCta    = document.querySelector('.sticky-cta');
  const heroSection  = document.querySelector('.hero');

  if (stickyCta && heroSection) {
    stickyCta.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    stickyCta.style.transform  = 'translateY(100%)';
    stickyCta.style.opacity    = '0';

    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        const visible = !entry.isIntersecting;
        stickyCta.style.transform = visible ? 'translateY(0)' : 'translateY(100%)';
        stickyCta.style.opacity   = visible ? '1' : '0';
      },
      { threshold: 0.1 }
    );
    ctaObserver.observe(heroSection);
  }

  /* ── Cart qty stepper ──────────────────────────────────── */
  document.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.qty-wrap')?.querySelector('.qty-input');
      if (!input) return;
      const val = parseInt(input.value, 10) || 1;
      input.value = Math.max(1, val + (btn.dataset.dir === 'up' ? 1 : -1));
    });
  });

  /* ── Smooth scroll for anchor links ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
