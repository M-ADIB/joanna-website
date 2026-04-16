/* ══════════════════════════════════════════
   Career Clarity Cohort — Dr. Joanne
   Main Script
   ══════════════════════════════════════════ */

(function() {
  'use strict';

  // ─── COUNTDOWN TIMER ───
  const launchDate = new Date('2026-05-02T00:00:00');
  
  function tick() {
    const diff = launchDate - new Date();
    const dEl = document.getElementById('cd-d');
    const hEl = document.getElementById('cd-h');
    const mEl = document.getElementById('cd-m');
    const sEl = document.getElementById('cd-s');
    if (!dEl) return;

    if (diff <= 0) {
      dEl.textContent = '00';
      hEl.textContent = '00';
      mEl.textContent = '00';
      sEl.textContent = '00';
      const countdown = document.querySelector('.countdown');
      if (countdown) countdown.classList.add('countdown-expired');
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    dEl.textContent = String(d).padStart(2,'0');
    hEl.textContent = String(h).padStart(2,'0');
    mEl.textContent = String(m).padStart(2,'0');
    sEl.textContent = String(s).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);

  // ─── STICKY CTA ───
  const stickyCta = document.getElementById('stickyCta');
  const hero = document.querySelector('.hero');
  if (stickyCta && hero) {
    const observer = new IntersectionObserver(([e]) => {
      stickyCta.classList.toggle('visible', !e.isIntersecting);
    }, { threshold: 0 });
    observer.observe(hero);
  }

  // ─── WAVEFORM BARS ───
  ['w1','w2','w3'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const heights = [4,7,12,18,14,9,16,22,17,11,8,14,20,15,10,6,13,19,14,8,5,11,17,12,7,15,21,16,9,6];
    heights.forEach(h => {
      const bar = document.createElement('div');
      bar.className = 'vp-bar';
      bar.style.height = h + 'px';
      el.appendChild(bar);
    });
  });

  // ─── VOICE PLAYER TOGGLE ───
  document.querySelectorAll('.vp-play').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const wasPlaying = this.classList.contains('playing');
      // Reset all
      document.querySelectorAll('.vp-play').forEach(b => b.classList.remove('playing'));
      document.querySelectorAll('.vp-bar.active').forEach(b => b.classList.remove('active'));
      if (!wasPlaying) {
        this.classList.add('playing');
        const waveform = this.closest('.voice-player').querySelector('.vp-waveform');
        if (waveform) {
          const bars = waveform.querySelectorAll('.vp-bar');
          bars.forEach((bar, i) => {
            setTimeout(() => bar.classList.add('active'), i * 30);
          });
        }
      }
    });
  });

  // ─── FAQ ACCORDION ───
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ─── SCROLL REVEAL ───
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ─── NUMBER COUNTER ANIMATION ───
  function animateCounter(el, target, suffix) {
    const duration = 1500;
    const startTime = performance.now();
    const numTarget = parseInt(target.replace(/[^0-9]/g, ''));
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numTarget);
      
      let display = current.toLocaleString();
      if (suffix) display += suffix;
      el.textContent = display;
      
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const val = el.getAttribute('data-counter');
          const suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, val, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  // ─── SMOOTH SCROLL WITH OFFSET ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── FORM VALIDATION & SUBMISSION ───
  const form = document.getElementById('applicationForm');
  const formContent = document.getElementById('formContent');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      
      // Clear previous errors
      form.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      // Validate required inputs
      form.querySelectorAll('[required]').forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim() || (input.tagName === 'SELECT' && input.selectedIndex === 0)) {
          isValid = false;
          input.classList.add('error');
          if (group) group.classList.add('has-error');
        }
      });

      // Validate radio
      const radioGroup = form.querySelector('input[name="investment"]');
      if (radioGroup && !form.querySelector('input[name="investment"]:checked')) {
        isValid = false;
        const rg = radioGroup.closest('.form-radio-group');
        if (rg) rg.style.outline = '1px solid var(--rust)';
      }

      if (isValid) {
        // Show success state
        if (formContent) formContent.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
        // Scroll to success
        const section = form.closest('section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Redirect to booking page
        setTimeout(() => {
          window.location.href = 'https://stan.store/DrJoanne/p/book-a-11-call-with-me-5fde61ac';
        }, 800);
      } else {
        // Scroll to first error
        const firstError = form.querySelector('.has-error, .error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

})();
