/* ============================================================
   BEAUTY RUSH NAILS INSTITUTE — script.js
   Features: Navbar scroll, mobile menu, scroll animations,
             hero particles, gallery filter, booking form,
             date minimum, smooth UX
   ============================================================ */

'use strict';

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
const SCROLL_THRESHOLD = 60;

function handleNavbarScroll() {
  if (window.scrollY > SCROLL_THRESHOLD) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run on load

/* ---- MOBILE MENU ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  // prevent body scroll when menu open
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on nav-link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ---- HERO PARTICLES ---- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const COUNT = 28;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size   = Math.random() * 4 + 1.5;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 14;
    const dur    = Math.random() * 10 + 10;
    const opacity= Math.random() * 0.5 + 0.2;

    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${left}%;
      animation-delay:${delay}s;
      animation-duration:${dur}s;
      opacity:${opacity};
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ---- SCROLL REVEAL OBSERVER ---- */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ---- SMOOTH ACTIVE NAV LINK HIGHLIGHTING ---- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${id}`) {
          a.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

/* Add active link styling dynamically */
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--rose-light) !important; }
.nav-link.active::after { width: 100% !important; }`;
document.head.appendChild(style);

/* ---- GALLERY FILTER ---- */
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const cat = item.dataset.cat;
      if (filter === 'all' || cat === filter) {
        item.style.opacity    = '0';
        item.style.transform  = 'scale(0.95)';
        item.style.display    = '';
        // Re-animate in
        requestAnimationFrame(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity   = '1';
          item.style.transform = 'scale(1)';
        });
      } else {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity    = '0';
        item.style.transform  = 'scale(0.9)';
        setTimeout(() => {
          if (btn.dataset.filter !== 'all' && item.dataset.cat !== btn.dataset.filter) {
            item.style.display = 'none';
          }
        }, 300);
      }
    });
  });
});

/* ---- SET MIN DATE FOR BOOKING ---- */
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

/* ---- BOOKING FORM SUBMIT ---- */
function handleBooking(e) {
  e.preventDefault();

  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');
  const btn     = form.querySelector('button[type="submit"]');

  // Simulate async submission
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    form.classList.add('hidden');
    success.classList.add('show');

    // Auto-generate WhatsApp message as fallback
    const name    = document.getElementById('name').value;
    const phone   = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const date    = document.getElementById('date').value;
    const notes   = document.getElementById('notes').value || 'None';

    const msg = encodeURIComponent(
      `Hello Beauty Rush Nails Institute! 💅\n\nNew Booking Request:\n\n` +
      `Name: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nNotes: ${notes}\n\n` +
      `Looking forward to my appointment!`
    );

    // Optionally open WhatsApp after 1.5s
    setTimeout(() => {
      window.open(`https://wa.me/2347030405080?text=${msg}`, '_blank');
    }, 1500);
  }, 1200);
}

/* ---- SMOOTH SCROLL FOR ALL ANCHOR LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- GALLERY LIGHTBOX (SIMPLE) ---- */
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img   = item.querySelector('img');
    const label = item.querySelector('.gallery-overlay span');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(12,10,11,0.95);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:20px;cursor:zoom-out;
      animation:fadeIn 0.3s ease;
    `;
    const i = document.createElement('img');
    i.src = img.src;
    i.style.cssText = `
      max-width:90vw;max-height:80vh;
      object-fit:contain;border-radius:12px;
      box-shadow:0 40px 120px rgba(0,0,0,0.6);
    `;
    const cap = document.createElement('p');
    cap.textContent = label ? label.textContent : '';
    cap.style.cssText = `
      color:rgba(255,255,255,0.5);font-size:0.8rem;
      letter-spacing:0.2em;text-transform:uppercase;margin-top:16px;
      font-family:'DM Sans',sans-serif;
    `;
    overlay.appendChild(i);
    overlay.appendChild(cap);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

/* ---- ADD FADE-IN KEYFRAME ---- */
const ks = document.createElement('style');
ks.textContent = `@keyframes fadeIn{from{opacity:0}to{opacity:1}}`;
document.head.appendChild(ks);

/* ---- PARALLAX HERO (subtle) ---- */
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  if (hero && window.scrollY < window.innerHeight) {
    const offset = window.scrollY * 0.35;
    hero.style.backgroundPositionY = `calc(50% + ${offset}px)`;
  }
}, { passive: true });

/* ---- COUNTER ANIMATION (for badge) ---- */
function animateCounter(el, end, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * end) + '+';
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const badgeNum = document.querySelector('.badge-num');
if (badgeNum) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, 5);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(badgeNum);
}

/* ---- LOG READY ---- */
console.log('%c💅 Beauty Rush Nails Institute', 'color:#c9956c;font-size:1.2rem;font-weight:bold;');
console.log('%cWebsite loaded successfully.', 'color:#7a6a6f;');
