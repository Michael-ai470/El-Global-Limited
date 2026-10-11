/* ═══════════════════════════════════════════════════════════════
   EL-GLOBAL BUSINESS — Main JavaScript
   Luxury animations, scroll effects, motion system
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     PRELOADER
     ───────────────────────────────────────────── */
  // Lifts 800ms after DOMContentLoaded. It never waits for window load, so images,
  // video and hero frames still downloading cannot hold it up.
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.style.overflow = '';
    }, 800);
  }


  /* ─────────────────────────────────────────────
     SCROLL PROGRESS BAR
     ───────────────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }


  /* ─────────────────────────────────────────────
     NAVBAR SCROLL EFFECT
     ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      updateProgress();
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────
     HAMBURGER / MOBILE NAV
     ───────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a:not(.mobile-nav-trigger)').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  /* ─────────────────────────────────────────────
     MOBILE NAV ACCORDION
     ───────────────────────────────────────────── */
  document.querySelectorAll('[data-mobile-dropdown]').forEach(item => {
    const trigger = item.querySelector('.mobile-nav-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('[data-mobile-dropdown]').forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
      });
    }
  });


  /* ─────────────────────────────────────────────
     DESKTOP DROPDOWN — Click to toggle on touch
     ───────────────────────────────────────────── */
  document.querySelectorAll('.nav-item[data-dropdown]').forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) return;
        if ('ontouchstart' in window) {
          e.preventDefault();
          document.querySelectorAll('.nav-item[data-dropdown]').forEach(other => {
            if (other !== item) other.classList.remove('open');
          });
          item.classList.toggle('open');
        }
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item[data-dropdown]')) {
      document.querySelectorAll('.nav-item[data-dropdown]').forEach(item => {
        item.classList.remove('open');
      });
    }
  });


  /* ─────────────────────────────────────────────
     ACTIVE NAV LINK HIGHLIGHTING
     ───────────────────────────────────────────── */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('../', '').replace('./', ''))) {
      link.classList.add('active');
    }
  });


  /* ─────────────────────────────────────────────
     LUXURY SCROLL REVEAL SYSTEM
     Handles: .reveal, .reveal-left, .reveal-right,
              .reveal-scale, .img-reveal, .split-text,
              .line-draw, .stagger-children
     ───────────────────────────────────────────── */
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .img-reveal, .split-text, .line-draw, .stagger-children';
  const revealElements = document.querySelectorAll(revealSelectors);

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  /* ─────────────────────────────────────────────
     SPLIT TEXT ANIMATION
     Auto-wraps words in heading elements with
     data-split attribute for word-by-word reveal
     ───────────────────────────────────────────── */
  document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent;
    const words = text.split(/\s+/);
    el.innerHTML = words.map(word =>
      `<span class="word"><span class="word-inner">${word}</span></span>`
    ).join(' ');
    el.classList.add('split-text');
  });


  /* ─────────────────────────────────────────────
     SMOOTH SCROLL FOR ANCHOR LINKS
     ───────────────────────────────────────────── */
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Pages with smooth scroll (js/home.js) let Lenis handle anchors.
      if (document.documentElement.classList.contains('lenis')) return;
      const href = this.getAttribute('href');
      if (href.startsWith('#') || (href.includes('#') && href.split('#')[0] === '')) {
        const targetId = href.split('#')[1];
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = navbar ? navbar.offsetHeight : 80;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      }
    });
  });


  /* ─────────────────────────────────────────────
     COUNTER ANIMATION (Luxury easing)
     ───────────────────────────────────────────── */
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.getAttribute('data-count');
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2500;
          const start = performance.now();
          const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));

          function updateCounter(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth ease-out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(numericTarget * eased);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = prefix + target + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  animateCounters();


  /* ─────────────────────────────────────────────
     MAGNETIC BUTTON EFFECT
     Buttons subtly follow cursor on hover
     ───────────────────────────────────────────── */
  document.querySelectorAll('.btn-magnetic, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });


  /* ─────────────────────────────────────────────
     PARALLAX IMAGES ON SCROLL
     Add data-parallax="0.1" to any element
     ───────────────────────────────────────────── */
  function updateParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    parallaxElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (visible) {
        const yPos = (rect.top - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${yPos}px)`;
      }
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();


  /* ─────────────────────────────────────────────
     TILT EFFECT ON CARDS
     Add data-tilt to any card element
     ───────────────────────────────────────────── */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });


  /* ─────────────────────────────────────────────
     SMOOTH IMAGE REVEAL ON HOVER
     Zoom + brightness shift on card images
     ───────────────────────────────────────────── */
  document.querySelectorAll('.division-card, .service-card, .op-service-card, .hl-service-card').forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;

    card.addEventListener('mouseenter', () => {
      img.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), filter 0.8s ease';
    });

    card.addEventListener('mouseleave', () => {
      img.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), filter 0.8s ease';
    });
  });


  /* ─────────────────────────────────────────────
     NAVBAR LINK HOVER EFFECT
     Smooth underline animation on nav links
     ───────────────────────────────────────────── */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.add('hover-underline');
  });


  /* ─────────────────────────────────────────────
     TOAST NOTIFICATIONS
     ───────────────────────────────────────────── */
  window.showToast = function (message, duration = 4000) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  };


  /* ─────────────────────────────────────────────
     FORM VALIDATION UTILITIES
     ───────────────────────────────────────────── */
  window.validateForm = function (formElement) {
    let valid = true;
    const inputs = formElement.querySelectorAll('[required]');

    inputs.forEach(input => {
      input.style.borderColor = '';

      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#D4762C';
      }

      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          valid = false;
          input.style.borderColor = '#D4762C';
        }
      }

      if (input.type === 'tel' && input.value.trim()) {
        const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
        if (!phoneRegex.test(input.value.trim())) {
          valid = false;
          input.style.borderColor = '#D4762C';
        }
      }
    });

    return valid;
  };

  document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.style.borderColor = '';
    });
  });


  /* ─────────────────────────────────────────────
     FORM SUBMISSION HANDLER
     ───────────────────────────────────────────── */
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!window.validateForm(this)) {
        showToast('Please fill in all required fields correctly.');
        return;
      }

      const submitBtn = this.querySelector('[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          showToast('Message received. A senior advisor will respond within 24 hours.');
          this.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  });


  /* ─────────────────────────────────────────────
     ENHANCED CARD INTERACTIONS
     Golden border glow + tilt on all major cards
     ───────────────────────────────────────────── */
  const allCards = document.querySelectorAll('.division-card, .service-card, .op-service-card, .hl-service-card, .er-service-card, .te-asset-card, .eco-card, .bento-item, .city-card, .office-card-full');
  allCards.forEach(card => {
    if (!card.hasAttribute('data-tilt')) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--mouse-x', x);
        card.style.setProperty('--mouse-y', y);
      });
    }
  });


  /* ─────────────────────────────────────────────
     SMOOTH SECTION SCROLL SNAPPING HINT
     Adds subtle momentum to scrolling
     ───────────────────────────────────────────── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        // Update any scroll-linked effects
        updateParallax();
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });


  /* ─────────────────────────────────────────────
     HOVER SOUND EFFECT (VISUAL FEEDBACK)
     Golden ripple on button clicks
     ───────────────────────────────────────────── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(201,168,76,0.2);transform:scale(0);animation:btnRipple 0.6s ease-out forwards;pointer-events:none;';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = '@keyframes btnRipple { to { transform: scale(1); opacity: 0; } }';
    document.head.appendChild(style);
  }


  /* ─────────────────────────────────────────────
     CUSTOM CURSOR (Desktop only)
     Subtle gold dot that follows the mouse
     ───────────────────────────────────────────── */
  if (window.innerWidth > 1024 && !('ontouchstart' in window)) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
    document.body.appendChild(cursor);

    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Expand ring on interactive elements
    const interactiveElements = 'a, button, .btn, .division-card, .service-card, .op-service-card, .hl-service-card, input, select, textarea';
    document.querySelectorAll(interactiveElements).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });
  }

});
