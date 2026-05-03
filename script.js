/* ══════════════════════════════════════════
   Career Clarity Cohort — Dr. Joanne
   Main Script
   ══════════════════════════════════════════ */

(function() {
  'use strict';

  // ─── COUNTDOWN TIMER ───
  const launchDateRef = { t: new Date('2026-05-16T00:00:00').getTime() };
  
  function tick() {
    const diff = launchDateRef.t - Date.now();
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

  // ─── DYNAMIC DATE FROM SUPABASE SETTINGS ───
  // Fetches 'cohort_start_date' from settings table and replaces all
  // [COHORT_DATE] placeholders in the DOM (set by dashboard).
  (function loadCohortDate() {
    var SUPA = 'https://ljwrcnquefgucelbzwzq.supabase.co';
    var KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqd3JjbnF1ZWZndWNlbGJ6d3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzA4MzksImV4cCI6MjA5MjUwNjgzOX0.gECut5Xi7sZisAgWNQ4um7kflP_UXQUo5IaFFYEv4g0';
    fetch(SUPA + '/rest/v1/settings?key=eq.cohort_start_date&select=value', {
      headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY }
    })
    .then(function(r) { return r.json(); })
    .then(function(rows) {
      if (!rows || !rows[0]) return;
      var date  = rows[0].value;                        // e.g. "May 16, 2026"
      var short = date.replace(/, \d{4}$/, '');         // e.g. "May 16"
      document.querySelectorAll('[data-cohort-date]').forEach(function(el) {
        el.textContent = el.getAttribute('data-cohort-date') === 'short' ? short : date;
      });
      var parsed = new Date(date);
      if (!isNaN(parsed.getTime())) launchDateRef.t = parsed.getTime();
    })
    .catch(function() {});
  })();

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
      // Skip checkout CTAs — they have their own popup handler
      if (this.classList.contains('cta-checkout')) return;
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
  const SUPABASE_URL = 'https://ljwrcnquefgucelbzwzq.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqd3JjbnF1ZWZndWNlbGJ6d3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzA4MzksImV4cCI6MjA5MjUwNjgzOX0.gECut5Xi7sZisAgWNQ4um7kflP_UXQUo5IaFFYEv4g0';

  const form         = document.getElementById('applicationForm');
  const formContent  = document.getElementById('formContent');
  const formSuccess  = document.getElementById('formSuccess');
  const formSuccessCohort = document.getElementById('formSuccessCohort');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;

      // Clear previous errors
      form.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.form-radio-group').forEach(rg => rg.style.outline = '');

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
      const selectedInvestment = form.querySelector('input[name="investment"]:checked');
      if (radioGroup && !selectedInvestment) {
        isValid = false;
        const rg = radioGroup.closest('.form-radio-group');
        if (rg) rg.style.outline = '1px solid var(--rust)';
      }

      if (!isValid) {
        const firstError = form.querySelector('.has-error, .error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // ── Collect form data ──
      const inputs  = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
      const firstName = inputs[0] ? inputs[0].value.trim() : '';
      const lastName  = inputs[1] ? inputs[1].value.trim() : '';
      const email     = inputs[2] ? inputs[2].value.trim() : '';
      const phone     = inputs[3] ? inputs[3].value.trim() : '';
      const textareas = form.querySelectorAll('textarea');
      const situation = textareas[0] ? textareas[0].value.trim() : '';
      const notes     = textareas[1] ? textareas[1].value.trim() : '';
      const selects   = form.querySelectorAll('select');
      const childYear = selects[0] ? selects[0].value : '';
      const childSituation = selects[1] ? selects[1].value : '';
      const source    = selects[2] ? selects[2].value : '';
      const investment = selectedInvestment ? selectedInvestment.value : '';

      // ── Save to Supabase (fire-and-forget) ──
      fetch(SUPABASE_URL + '/rest/v1/form_submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          first_name:  firstName,
          last_name:   lastName,
          email:       email,
          phone:       phone,
          child_year:  childYear || childSituation,
          situation:   situation,
          investment:  investment,
          source:      source,
          notes:       notes
        })
      }).catch(function() {
        // Silent fail — submission still routes correctly even if Supabase is unreachable
      });

      // ── Meta Pixel: custom ApplicationSubmitted event ──
      if (typeof fbq === 'function') {
        fbq('trackCustom', 'ApplicationSubmitted', { investment_choice: investment });
        fbq('track', 'Lead');
      }

      // ── Show inline success then route by selection ──
      if (formContent) formContent.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
      const section = form.closest('section');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(function() {
        if (investment === 'yes') {
          // 1-on-1 → Book a Call
          window.location.href = 'https://stan.store/DrJoanne/p/book-a-11-call-with-me-5fde61ac';
        } else if (investment === 'cohort') {
          // Group cohort → Checkout
          if (typeof fbq === 'function') fbq('track', 'InitiateCheckout');
          window.location.href = 'https://stan.store/DrJoanne/p/join-me-at-the-career-clarity-cohort';
        } else {
          // Unsure → WhatsApp
          window.location.href = 'https://wa.me/971502835898';
        }
      }, 1200);
    });
  }

  // ─── ALL CTAs → SCROLL TO FORM ───
  document.querySelectorAll('.cta-checkout').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const formSection = document.getElementById('apply-1on1');
      if (formSection) {
        const offset = 80;
        const top = formSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
