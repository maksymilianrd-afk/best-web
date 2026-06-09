/* DeskPaws — Mily Group interactive patterns */
(function () {
  'use strict';

  /* ── Header: transparent → white on scroll (overlay pages only) ── */
  const header = document.getElementById('site-header');
  if (header && header.classList.contains('header--overlay')) {
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

  /* ── Variant price update (product page + buy section) ─ */
  function wireVariantSelect(selectId, priceId, atcBtnId, checkoutBtnId) {
    var sel      = document.getElementById(selectId);
    var priceEl  = document.getElementById(priceId);
    var atcBtn   = document.getElementById(atcBtnId);
    var checkBtn = document.getElementById(checkoutBtnId);
    if (!sel || !priceEl) return;
    sel.addEventListener('change', function () {
      var opt = sel.options[sel.selectedIndex];
      if (opt.dataset.price) priceEl.textContent = opt.dataset.price;
      if (atcBtn && opt.dataset.price) {
        var arr = atcBtn.querySelector('.btn-butter__arr');
        atcBtn.textContent = atcBtn.textContent.replace(/\$[\d,.]+/, opt.dataset.price);
        if (arr) atcBtn.appendChild(arr);
      }
      if (checkBtn) checkBtn.href = '/checkout?variant=' + sel.value + '&quantity=1';
    });
  }
  wireVariantSelect('variant-select',     'product-price', 'atc-btn',     'checkout-btn');
  wireVariantSelect('buy-variant-select', 'buy-price',     'buy-atc-btn', 'buy-checkout-btn');

  /* ── PDP thumbnail strip + arrows ───────────────────── */
  document.querySelectorAll('.pdp__thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var mainImg = document.getElementById('pdp-main-img');
      if (!mainImg) return;
      var src = thumb.dataset.src;
      if (src) {
        mainImg.style.opacity = '0';
        setTimeout(function () { mainImg.src = src; mainImg.style.opacity = '1'; }, 160);
      }
      document.querySelectorAll('.pdp__thumb').forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
    });
  });
  var thumbTrack = document.getElementById('pdp-thumb-track');
  if (thumbTrack) {
    var btnPrev = document.getElementById('pdp-thumb-prev');
    var btnNext = document.getElementById('pdp-thumb-next');
    if (btnPrev) btnPrev.addEventListener('click', function () { thumbTrack.scrollBy({ left: -200, behavior: 'smooth' }); });
    if (btnNext) btnNext.addEventListener('click', function () { thumbTrack.scrollBy({ left: 200, behavior: 'smooth' }); });
  }

  /* ── PDP variant tiles ───────────────────────────────── */
  document.querySelectorAll('.pdp__variant-tile').forEach(function (tile) {
    tile.addEventListener('click', function () {
      if (tile.disabled) return;
      var variantId  = tile.dataset.variantId;
      var price      = tile.dataset.price;
      var imgSrc     = tile.dataset.imageSrc;
      var name       = tile.dataset.variantName;

      var hiddenInput = document.getElementById('variant-id-input');
      if (hiddenInput) hiddenInput.value = variantId;

      var priceEl = document.getElementById('product-price');
      if (priceEl && price) priceEl.textContent = price;

      var atcPriceEl = document.getElementById('pdp-atc-price');
      if (atcPriceEl && price) atcPriceEl.textContent = price;

      var checkBtn = document.getElementById('checkout-btn');
      if (checkBtn) checkBtn.href = '/checkout?variant=' + variantId + '&quantity=1';

      var subtitle = document.getElementById('pdp-variant-name');
      if (subtitle && name) subtitle.textContent = name;

      if (imgSrc) {
        var mainImg = document.getElementById('pdp-main-img');
        if (mainImg) {
          mainImg.style.opacity = '0';
          setTimeout(function () { mainImg.src = imgSrc; mainImg.style.opacity = '1'; }, 160);
        }
      }

      document.querySelectorAll('.pdp__variant-tile').forEach(function (t) { t.classList.remove('active'); });
      tile.classList.add('active');
    });
  });

  /* ── Gallery thumb click (product page + buy section) ─── */
  document.querySelectorAll('.product-thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var targetId = thumb.dataset.target || 'main-product-img';
      var mainImg  = document.getElementById(targetId) || document.querySelector('.gallery-main img');
      if (!mainImg) return;
      mainImg.style.transition = 'opacity 0.18s ease';
      var src = thumb.dataset.src;
      if (src) {
        mainImg.style.opacity = '0';
        setTimeout(function () { mainImg.src = src; mainImg.style.opacity = '1'; }, 160);
      }
      var gallery = thumb.closest('.gallery-thumbs');
      if (gallery) gallery.querySelectorAll('.product-thumb').forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
    });
  });

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

  /* ── Meet section: dot navigation ──────────────────────── */
  (function () {
    var slides = document.querySelectorAll('#meet-slides .meet-slide');
    var dots   = document.querySelectorAll('#meet-dots .meet-dot');
    if (!slides.length || !dots.length) return;
    function goTo(i) {
      slides.forEach(function (s) { s.classList.remove('meet-slide--active'); });
      dots.forEach(function (d) { d.classList.remove('meet-dot--active'); });
      slides[i].classList.add('meet-slide--active');
      dots[i].classList.add('meet-dot--active');
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () { goTo(parseInt(dot.dataset.slide, 10)); });
    });
  })();

  /* ── Smooth scroll for anchor links ────────────────────── */
  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      var href = link.getAttribute('href');
      var hash = href.charAt(0) === '/' ? href.slice(1) : href;
      var target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── Scroll reveal ──────────────────────────────────────── */
  (function () {
    // Stagger a group of elements: each gets an incremental delay based on
    // its index among siblings matched by the same selector within the same parent.
    function markList(selector, step) {
      var groups = new Map();
      document.querySelectorAll(selector).forEach(function (el) {
        var p = el.parentElement;
        if (!groups.has(p)) groups.set(p, []);
        groups.get(p).push(el);
      });
      groups.forEach(function (items) {
        items.forEach(function (el, i) {
          el.classList.add('reveal');
          if (i > 0) el.style.setProperty('--reveal-delay', (i * (step || 0.1)) + 's');
        });
      });
    }

    // Galleries slide in from their natural reading side
    document.querySelectorAll('.product-section__gallery').forEach(function (el) {
      var section = el.closest('.product-section');
      var dir = section && section.classList.contains('product-section--image-left') ? 'left' : 'right';
      el.classList.add('reveal', 'reveal--' + dir);
    });

    // Before/After panels slide in from their respective sides
    var beforePanel = document.querySelector('.before-after__panel--before');
    if (beforePanel) beforePanel.classList.add('reveal', 'reveal--left');
    var afterPanel = document.querySelector('.before-after__panel--after');
    if (afterPanel) afterPanel.classList.add('reveal', 'reveal--right');

    // Body children with stagger
    markList('.product-section__group', 0.12);
    markList('.steps-list li', 0.1);
    markList('.review-item', 0.1);
    markList('.spec-row', 0.07);
    markList('.benefit-card', 0.08);
    markList('.review-card', 0.08);
    markList('.before-after__item', 0.09);
    markList('.comparison-table tbody tr', 0.06);

    // One-off elements
    [
      '.pull-quote', '.stat-bar', '.price-row', '.guarantee-strip',
      '.product-section__cta', '.buy-block', '.tip-callout',
      '.benefits-section__header', '.reviews-section__header',
      '.comparison-section__header', '.reviews-cta', '.comparison-cta',
      '.guarantee-hero', '.before-after__heading', '.before-after__label',
      '.final-cta__eyebrow', '.final-cta__heading', '.final-cta__sub'
    ].forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) { el.classList.add('reveal'); });
      });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    /* Tighter observer for problem lines — fires when line is well into view */
    var obsLine = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obsLine.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.classList.contains('the-problem__line') || el.classList.contains('the-problem__eyebrow') || el.classList.contains('the-problem__heading')) {
        obsLine.observe(el);
      } else {
        obs.observe(el);
      }
    });
  })();

})();
