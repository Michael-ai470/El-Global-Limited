/* ═══════════════════════════════════════════════════════════════
   EL-GLOBAL BUSINESS — Shared Components (Header + Footer)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  // Determine base path based on page depth
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  const pagePath = window.location.pathname;
  // Check if we're in a subdirectory (jet-el/, hl/, etc.)
  const isSubdir = /\/(jet-el|hl|one-percent|el-rock|token-el|el-access|el-business|jetel-elite)\//i.test(pagePath);
  const BASE = isSubdir ? '../' : './';

  /* ─────────────────────────────────────────────
     HEADER / NAVBAR
     ───────────────────────────────────────────── */

  const headerHTML = `
  <!-- Preloader -->
  <div class="preloader" id="preloader">
    <img src="${BASE}img/logo.jpeg" alt="El-Global Business" class="preloader-logo-img">
    <div class="preloader-bar"></div>
  </div>

  <!-- Navbar -->
  <nav class="navbar" id="navbar">
    <div class="navbar-inner">
      <a href="${BASE}index.html" class="nav-logo">
        <img src="${BASE}img/logo.jpeg" alt="El-Global Business" class="nav-logo-img">
        <span class="nav-logo-text">El-Global <span>Business</span></span>
      </a>

      <!-- Desktop Menu -->
      <div class="nav-menu" id="navMenu">
        <div class="nav-item"><a class="nav-link" href="${BASE}jet-el/index.html">Jet-El</a></div>
        <div class="nav-item"><a class="nav-link" href="${BASE}el-access/index.html">El-Access</a></div>
        <div class="nav-item"><a class="nav-link" href="${BASE}hl/index.html">H&L</a></div>
        <div class="nav-item"><a class="nav-link" href="${BASE}one-percent/index.html">The 1%</a></div>
        <div class="nav-item"><a class="nav-link" href="${BASE}el-rock/index.html">El&Rock</a></div>
        <div class="nav-item"><a class="nav-link" href="${BASE}el-business/index.html">El-Business</a></div>
        <div class="nav-item"><a class="nav-link" href="${BASE}token-el/index.html">Token-El</a></div>
        <div class="nav-item"><a class="nav-link" href="${BASE}about.html">About</a></div>
        <div class="nav-item"><a class="nav-link" href="${BASE}contact.html">Enquire</a></div>
      </div>

      <!-- Desktop CTA -->
      <a href="${BASE}contact.html" class="nav-cta desktop-only">Enquire</a>

      <!-- Hamburger -->
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Mobile Nav Overlay -->
  <div class="mobile-nav" id="mobileNav">
    <div class="mobile-nav-item">
      <a class="mobile-nav-trigger" href="${BASE}jet-el/index.html">Jet-El</a>
    </div>
    <div class="mobile-nav-item">
      <a class="mobile-nav-trigger" href="${BASE}el-access/index.html">El-Access</a>
    </div>
    <div class="mobile-nav-item">
      <a class="mobile-nav-trigger" href="${BASE}hl/index.html">H&L</a>
    </div>
    <div class="mobile-nav-item">
      <a class="mobile-nav-trigger" href="${BASE}one-percent/index.html">The 1%</a>
    </div>
    <div class="mobile-nav-item">
      <a class="mobile-nav-trigger" href="${BASE}el-rock/index.html">El&Rock</a>
    </div>
    <div class="mobile-nav-item">
      <a class="mobile-nav-trigger" href="${BASE}el-business/index.html">El-Business</a>
    </div>
    <div class="mobile-nav-item">
      <a class="mobile-nav-trigger" href="${BASE}token-el/index.html">Token-El</a>
    </div>
    <div class="mobile-nav-item">
      <a class="mobile-nav-trigger" href="${BASE}about.html">About</a>
    </div>
    <a href="${BASE}contact.html" class="mobile-nav-cta">Enquire Now</a>
  </div>
  `;


  /* ─────────────────────────────────────────────
     FOOTER
     ───────────────────────────────────────────── */

  const footerHTML = `
  <footer class="footer">
    <!-- World Map Background -->
    <div class="footer-map-bg"></div>
    <div class="footer-map-glow"></div>

    <div class="container">
      <div class="footer-grid">

        <!-- Brand -->
        <div class="footer-brand">
          <a href="${BASE}index.html" class="nav-logo">
            <img src="${BASE}img/logo.jpeg" alt="El-Global Business" class="nav-logo-img">
            <span class="nav-logo-text">El-Global <span>Business</span></span>
          </a>
          <p class="footer-desc">A multidisciplinary portfolio management and investment advisory firm. Strategic asset acquisition, optimization, and digital transformation across global markets.</p>
          <div class="btn-row">
            <a href="${BASE}contact.html" class="btn btn-sm btn-outline">Enquire Now</a>
          </div>
        </div>

        <!-- Divisions -->
        <div>
          <div class="footer-heading">Divisions</div>
          <ul class="footer-links">
            <li><a href="${BASE}jet-el/index.html">Jet-El</a></li>
            <li><a href="${BASE}el-access/index.html">El-Access</a></li>
            <li><a href="${BASE}hl/index.html">H&L</a></li>
            <li><a href="${BASE}one-percent/index.html">The 1%</a></li>
            <li><a href="${BASE}el-rock/index.html">El&Rock</a></li>
            <li><a href="${BASE}el-business/index.html">El-Business</a></li>
            <li><a href="${BASE}token-el/index.html">Token-El</a></li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div>
          <div class="footer-heading">Quick Links</div>
          <ul class="footer-links">
            <li><a href="${BASE}about.html">About Us</a></li>
            <li><a href="${BASE}contact.html">Enquire</a></li>
          </ul>
        </div>

        <!-- Connect -->
        <div>
          <div class="footer-heading">Connect</div>
          <div class="footer-contact-item">
            <div class="footer-contact-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg></div>
            <div>
              <a href="mailto:info@el-globalbusiness.com">info@el-globalbusiness.com</a>
              <div class="footer-contact-label" style="color:var(--text-dim);margin-top:2px;">General Enquiries</div>
            </div>
          </div>
          <div class="footer-contact-item">
            <div class="footer-contact-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg></div>
            <div>
              <a href="mailto:sales@el-globalbusiness.com">sales@el-globalbusiness.com</a>
              <div class="footer-contact-label" style="color:var(--text-dim);margin-top:2px;">Sales &amp; Investments</div>
            </div>
          </div>
          <div class="footer-contact-item">
            <div class="footer-contact-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></div>
            <a href="https://el-globalbusiness.com" target="_blank">el-globalbusiness.com</a>
          </div>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} El-Global Business LLC. All rights reserved.</span>
      </div>
    </div>
  </footer>

  <div id="toast" class="toast"></div>
  `;


  /* ─────────────────────────────────────────────
     INJECT INTO PAGE
     ───────────────────────────────────────────── */

  // Insert header at the start of body
  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  // Insert footer at the end of body (before scripts)
  document.body.insertAdjacentHTML('beforeend', footerHTML);

})();
