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

  /* ── Benefits: scroll-focus storytelling ───────────────── */
  (function () {
    var section = document.getElementById('benefits');
    if (!section) return;
    var items = Array.prototype.slice.call(section.querySelectorAll('.bf__item'));
    if (!items.length) return;

    var idxEl  = section.querySelector('.bf__idx-now');
    var fillEl = section.querySelector('.bf__track-fill');
    section.classList.add('bf--js');

    var current = -1;
    function setActive(i) {
      if (i === current) return;
      current = i;
      items.forEach(function (it, j) { it.classList.toggle('is-active', j === i); });
      if (idxEl)  idxEl.textContent = ('0' + (i + 1)).slice(-2);
      if (fillEl) fillEl.style.transform = 'scaleX(' + ((i + 1) / items.length) + ')';
    }

    // The item crossing the centre 12% band of the viewport becomes active.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var i = items.indexOf(e.target);
          if (i >= 0) setActive(i);
        }
      });
    }, { rootMargin: '-44% 0px -44% 0px', threshold: 0 });

    items.forEach(function (it) { io.observe(it); });
    setActive(0);
  })();

  /* ── Claimed Spots Wall: cursor-tilt depth ─────────────── */
  (function () {
    if (!window.matchMedia) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cards = document.querySelectorAll('.cw__card');
    if (!cards.length) return;
    var MAX = 6; // degrees

    cards.forEach(function (card) {
      var raf = null, rx = 0, ry = 0;
      function apply() {
        card.style.transform =
          'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-8px)';
        raf = null;
      }
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        ry = ((e.clientX - r.left) / r.width - 0.5) * MAX * 2;
        rx = -((e.clientY - r.top) / r.height - 0.5) * MAX * 2;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      card.addEventListener('mouseleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transform = '';
      });
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

    // Body children with stagger
    markList('.product-section__group', 0.12);
    markList('.steps-list li', 0.1);
    markList('.review-item', 0.1);
    markList('.spec-row', 0.07);
    markList('.review-card', 0.08);
    markList('.comparison-table tbody tr', 0.06);
    markList('.setup-step', 0.1);

    // One-off elements
    [
      '.pull-quote', '.stat-bar', '.price-row', '.guarantee-strip',
      '.product-section__cta', '.buy-block', '.tip-callout',
      '.bf__eyebrow', '.bf__heading', '.bf__intro', '.bf__meter', '.bf__cta', '.bf__quote',
      '.reviews-section__header',
      '.comparison-section__header', '.reviews-cta', '.comparison-cta',
      '.guarantee-hero', '.big-image__content', '.cw__head-lead', '.cw__intro', '.cw__meta', '.cw__tip', '.cw__cta',
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

  /* ── Cart page qty stepper (AJAX) ──────────────────────── */
  document.querySelectorAll('.cqty-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.cp-item__qty');
      if (!wrap) return;
      var numEl = wrap.querySelector('.cqty-num');
      var key   = wrap.dataset.key;
      if (!numEl || !key) return;
      var current = parseInt(numEl.textContent, 10) || 1;
      var next    = Math.max(0, current + (btn.dataset.dir === 'up' ? 1 : -1));
      numEl.textContent = String(next);
      btn.disabled = true;

      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: next })
      })
        .then(function (res) { return res.json(); })
        .then(function () { window.location.reload(); })
        .catch(function () {
          numEl.textContent = String(current);
          btn.disabled = false;
        });
    });
  });

  /* ── Buy Drawer ─────────────────────────────────────────── */
  (function () {
    var overlay  = document.getElementById('bd-overlay');
    var drawer   = document.getElementById('buy-drawer');
    var closeBtn = document.getElementById('bd-close');
    if (!overlay || !drawer) return;

    function openDrawer() {
      document.body.classList.add('bd-open');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      document.body.classList.remove('bd-open');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
    }

    var buySelectors = '.btn-benefits-cta, .reviews-cta__btn, .sticky-cta__btn, .hero__button a, [data-buy-drawer]';
    document.addEventListener('click', function (e) {
      if (e.target.closest(buySelectors)) {
        e.preventDefault();
        openDrawer();
      }
    });

    overlay.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('bd-open')) {
        closeDrawer();
      }
    });

    /* Variant card selection */
    var variantsEl = document.getElementById('bd-variants');
    if (variantsEl) {
      variantsEl.addEventListener('click', function (e) {
        var card = e.target.closest('.bd-variant-card');
        if (!card) return;
        variantsEl.querySelectorAll('.bd-variant-card').forEach(function (c) {
          c.classList.remove('bd-variant-card--selected');
          var r = c.querySelector('.bd-variant-radio');
          if (r) r.checked = false;
        });
        card.classList.add('bd-variant-card--selected');
        var radio = card.querySelector('.bd-variant-radio');
        if (radio) radio.checked = true;

        var priceEl   = document.getElementById('bd-price-display');
        var compareEl = document.getElementById('bd-compare-display');
        var saveEl    = document.getElementById('bd-save-display');
        var atcPrice  = document.getElementById('bd-atc-price');

        if (priceEl)  priceEl.textContent  = card.dataset.price  || '';
        if (atcPrice) atcPrice.textContent = card.dataset.price  || '';
        if (compareEl) {
          var hasCompare = card.dataset.compare && card.dataset.compare !== card.dataset.price;
          compareEl.textContent   = card.dataset.compare || '';
          compareEl.style.display = hasCompare ? '' : 'none';
        }
        if (saveEl) {
          saveEl.textContent   = card.dataset.save || '';
          saveEl.style.display = card.dataset.save ? '' : 'none';
        }
      });
    }

    /* Quantity stepper */
    var qtyDisplay = document.getElementById('bd-qty');
    document.querySelectorAll('.bd-qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!qtyDisplay) return;
        var val = parseInt(qtyDisplay.textContent, 10) || 1;
        qtyDisplay.textContent = String(Math.max(1, val + (btn.dataset.dir === 'up' ? 1 : -1)));
      });
    });

    /* Add to cart → checkout */
    var atcBtn = document.getElementById('bd-atc-btn');
    if (atcBtn) {
      atcBtn.addEventListener('click', function () {
        var selectedCard = variantsEl ? variantsEl.querySelector('.bd-variant-card--selected') : null;
        var variantId    = selectedCard ? selectedCard.dataset.variantId : '';
        var qty          = parseInt((qtyDisplay && qtyDisplay.textContent) || '1', 10) || 1;

        if (!variantId) {
          window.location.href = '/products/desk-paws-place-for-your-cat-co-worker';
          return;
        }

        var originalHTML = atcBtn.innerHTML;
        atcBtn.classList.add('bd-atc-btn--loading');
        atcBtn.textContent = 'Adding…';

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: parseInt(variantId, 10), quantity: qty })
        })
          .then(function (res) {
            if (!res.ok) throw new Error('add failed');
            return res.json();
          })
          .then(function () {
            window.location.href = '/checkout';
          })
          .catch(function () {
            atcBtn.classList.remove('bd-atc-btn--loading');
            atcBtn.innerHTML = originalHTML;
          });
      });
    }
  })();

  /* ── Footer reveal (sticky clip + stagger) ─────────────── */
  (function () {
    var ftOuter = document.getElementById('site-footer-outer');
    if (!ftOuter) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          ftOuter.classList.add('ft-active');
          io.unobserve(ftOuter);
        }
      });
    }, { threshold: 0.05 });
    io.observe(ftOuter);
  })();

  /* ── Reviews carousel (Section 7 v3) ───────────────────── */
  (function () {
    var section = document.querySelector('.rv2-section');
    if (!section) return;
    var cards = Array.prototype.slice.call(section.querySelectorAll('.rv2-card'));
    var dots  = Array.prototype.slice.call(section.querySelectorAll('.rv2-dot'));
    var stage = section.querySelector('.rv2-stage');
    if (!cards.length) return;

    var current = 0, total = cards.length, timer = null;
    var INTERVAL = 6000;

    function syncHeight() {
      if (!stage) return;
      var h = cards[current].offsetHeight;
      if (h > 0) {
        stage.style.minHeight = '0';
        stage.style.height = h + 'px';
      }
    }

    function show(idx) {
      cards.forEach(function (c, i) {
        c.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('rv2-dot--active', i === idx);
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
      current = idx;
      requestAnimationFrame(function () { requestAnimationFrame(syncHeight); });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () { show((current + 1) % total); }, INTERVAL);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); startTimer(); });
    });

    section.addEventListener('mouseenter', function () { clearInterval(timer); });
    section.addEventListener('mouseleave', startTimer);

    var tx = 0;
    section.addEventListener('touchstart', function (e) {
      tx = e.touches[0].clientX;
      clearInterval(timer);
    }, { passive: true });
    section.addEventListener('touchend', function (e) {
      var dx = tx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 44) show(dx > 0 ? (current + 1) % total : (current - 1 + total) % total);
      startTimer();
    }, { passive: true });

    show(0);
    startTimer();

    window.addEventListener('resize', function () {
      requestAnimationFrame(syncHeight);
    }, { passive: true });
  })();

})();
