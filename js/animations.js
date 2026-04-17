/* ═══════════════════════════════════════════════════
   CURA — GSAP Animations
   Scroll-triggered reveals, counters, text effects
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  initHeroAnimation();
  initRevealAnimations();
  initCounterAnimations();
  initCardStagger();
  initParallax();
  initQuoteReveal();
});

/* ── Hero Text Reveal ─────────────────────────── */
function initHeroAnimation() {
  const heroLines = document.querySelectorAll('.hero h1 .line span');
  if (!heroLines.length) return;

  const tl = gsap.timeline({ delay: 0.5 });

  heroLines.forEach((span, i) => {
    tl.to(span, {
      y: 0,
      duration: 1,
      ease: 'power4.out',
    }, i * 0.2);
  });

  // Subtitle fade in
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    tl.fromTo(subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    );
  }

  // Scroll indicator
  const scrollInd = document.querySelector('.scroll-indicator');
  if (scrollInd) {
    tl.fromTo(scrollInd,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.2'
    );
  }
}

/* ── General Reveal on Scroll ─────────────────── */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  document.querySelectorAll('.reveal-left').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
    });
  });

  document.querySelectorAll('.reveal-right').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
    });
  });

  document.querySelectorAll('.reveal-scale').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
    });
  });
}

/* ── Counter Animation ────────────────────────── */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-count'));
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';
    const decimals = (target % 1 !== 0) ? 1 : 0;

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            const current = this.targets()[0].val;
            counter.textContent = prefix + (decimals ? current.toFixed(1) : Math.round(current)).toLocaleString() + suffix;
          }
        });
      }
    });
  });
}

/* ── Card Stagger ─────────────────────────────── */
function initCardStagger() {
  const cardGroups = document.querySelectorAll('.cards-stagger');
  cardGroups.forEach(group => {
    const cards = group.children;
    gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      {
        scrollTrigger: {
          trigger: group,
          start: 'top 80%',
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      }
    );
  });
}

/* ── Parallax ─────────────────────────────────── */
function initParallax() {
  document.querySelectorAll('.parallax').forEach(el => {
    const speed = el.getAttribute('data-speed') || 0.2;
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: () => parseFloat(speed) * 100,
      ease: 'none',
    });
  });
}

/* ── Quote Reveal ─────────────────────────────── */
function initQuoteReveal() {
  document.querySelectorAll('.quote').forEach(q => {
    gsap.fromTo(q,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: { trigger: q, start: 'top 80%' },
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      }
    );
  });
}
