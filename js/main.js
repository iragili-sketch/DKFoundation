/* ═══════════════════════════════════════════════════
   CURA — Main JavaScript
   Navigation, Language Toggle, Custom Cursor
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Only init custom cursor on non-touch devices
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    initCursor();
  }
  initNav();
  initDropdowns();
  initLanguageToggle();
  initMobileMenu();
});

/* ── Hide System Cursor (Chrome bug workaround) ── */
function hideSystemCursor() {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.01)';
  ctx.fillRect(0, 0, 1, 1);
  const cursorUrl = canvas.toDataURL();
  const style = document.createElement('style');
  style.textContent = '*, *::before, *::after, a, a:hover, a:active, a:focus, button, [role="button"] { cursor: url(' + cursorUrl + ') 0 0, none !important; }';
  document.head.appendChild(style);
}

/* ── Custom Cursor ────────────────────────────── */
function initCursor() {
  hideSystemCursor();
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top = my - 6 + 'px';
  });

  function followCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx - 20 + 'px';
    follower.style.top = fy - 20 + 'px';
    requestAnimationFrame(followCursor);
  }
  followCursor();

  // Hover effects
  const hoverEls = document.querySelectorAll('a, button, .card, .cta-path, .btn, .nav-link, .lang-toggle, .hamburger, .menu-card, .nav-dropdown-trigger');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ── Navigation Scroll ────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/* ── Dropdowns ────────────────────────────────── */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dd => {
    const trigger = dd.querySelector('.nav-dropdown-trigger');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      // Close others
      dropdowns.forEach(other => {
        if (other !== dd) other.classList.remove('open');
      });
      dd.classList.toggle('open');
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      dropdowns.forEach(dd => dd.classList.remove('open'));
    }
  });
}

/* ── Language Toggle ──────────────────────────── */
function initLanguageToggle() {
  const toggle = document.querySelector('.lang-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const html = document.documentElement;
    const currentLang = html.getAttribute('lang') || 'en';
    const newLang = currentLang === 'en' ? 'he' : 'en';

    html.setAttribute('lang', newLang);
    html.setAttribute('dir', newLang === 'he' ? 'rtl' : 'ltr');

    // Swap visible content
    document.querySelectorAll('[data-en]').forEach(el => {
      if (newLang === 'en') {
        el.textContent = el.getAttribute('data-en');
      } else {
        el.textContent = el.getAttribute('data-he');
      }
    });

    // Swap innerHTML content (for elements with child tags)
    document.querySelectorAll('[data-en-html]').forEach(el => {
      if (newLang === 'en') {
        el.innerHTML = el.getAttribute('data-en-html');
      } else {
        el.innerHTML = el.getAttribute('data-he-html');
      }
    });

    // Update toggle display
    const spans = toggle.querySelectorAll('span');
    spans.forEach(s => s.classList.remove('active-lang'));
    if (newLang === 'en') {
      spans[0].classList.add('active-lang');
    } else {
      spans[1].classList.add('active-lang');
    }

    // Update font family for body
    if (newLang === 'he') {
      document.body.style.fontFamily = "var(--font-he)";
    } else {
      document.body.style.fontFamily = "var(--font-body)";
    }
  });
}

/* ── Mobile Menu (Side Panel) ────────────────── */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  // Create overlay if not exists
  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('mobile-menu-overlay');
    document.body.appendChild(overlay);
  }

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Keyboard support for hamburger
  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      hamburger.click();
    }
  });
  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}



/* ══════════ Cookie Consent Banner ══════════ */
document.addEventListener("DOMContentLoaded", function() {
  var banner = document.getElementById('cookieBanner');
  var acceptBtn = document.getElementById('cookieAccept');
  var declineBtn = document.getElementById('cookieDecline');
  if (!banner) return;

  var consent = localStorage.getItem('dkf_cookie_consent');
  if (consent) return; // already answered

  // Show banner after short delay
  setTimeout(function() {
    banner.classList.add('visible');
  }, 1200);

  function hideBanner(choice) {
    localStorage.setItem('dkf_cookie_consent', choice);
    banner.classList.remove('visible');
    setTimeout(function() { banner.remove(); }, 500);
    if (choice === 'declined') {
      // Delete non-essential cookies
      document.cookie.split(';').forEach(function(c) {
        var name = c.split('=')[0].trim();
        if (name && name !== 'dkf_cookie_consent') {
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        }
      });
    }
  }

  if (acceptBtn) acceptBtn.addEventListener('click', function() { hideBanner('accepted'); });
  if (declineBtn) declineBtn.addEventListener('click', function() { hideBanner('declined'); });
});

/* Accessibility Toggle */
document.addEventListener('DOMContentLoaded', function() {
  var wrapper = document.getElementById('a11yWrapper');
  var btn = document.getElementById('a11yToggle');
  var closeBtn = document.getElementById('a11yClose');
  if (!wrapper || !btn) return;

  // If closed this session, stay hidden
  if (sessionStorage.getItem('dkf_a11y_closed') === '1') {
    wrapper.classList.add('hidden');
    return;
  }

  // X closes icon for this session only (comes back on refresh/new tab)
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      wrapper.classList.add('hidden');
      sessionStorage.setItem('dkf_a11y_closed', '1');
    });
  }

  // Click icon opens UserWay menu
  btn.addEventListener('click', function() {
    if (typeof UserWay !== 'undefined') {
      UserWay.widgetOpen();
    }
  });
});


/* ══════════ Contact Form Submission ══════════ */
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var submitBtn = document.getElementById('contactSubmit');
  var statusDiv = document.getElementById('formStatus');
  var statusText = document.getElementById('formStatusText');
  var originalBtnText = submitBtn ? submitBtn.textContent : 'Send message';

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Disable button + show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    var formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      return response.json().then(function(data) {
        return { ok: response.ok, data: data };
      });
    })
    .then(function(result) {
      statusDiv.style.display = 'block';
      if (result.ok) {
        statusDiv.className = 'form-status form-status-success';
        statusText.textContent = 'Message sent successfully! We will get back to you soon.';
        form.reset();
      } else {
        statusDiv.className = 'form-status form-status-error';
        statusText.textContent = 'Something went wrong. Please try again or email us directly.';
      }
    })
    .catch(function() {
      statusDiv.style.display = 'block';
      statusDiv.className = 'form-status form-status-error';
      statusText.textContent = 'Connection error. Please try again or email us at info@dkfound.com';
    })
    .finally(function() {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      // Auto-hide after 8 seconds
      setTimeout(function() {
        statusDiv.style.display = 'none';
      }, 8000);
    });
  });
});
