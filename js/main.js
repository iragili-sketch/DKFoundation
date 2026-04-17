/* ═══════════════════════════════════════════════════
   CURA — Main JavaScript
   Navigation, Language Toggle, Custom Cursor
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initDropdowns();
  initLanguageToggle();
  initMobileMenu();
});

/* ── Custom Cursor ────────────────────────────── */
function initCursor() {
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
  const hoverEls = document.querySelectorAll('a, button, .card, .cta-path, .btn, .nav-link, .lang-toggle');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ── Navigation Scroll ────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
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
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileM