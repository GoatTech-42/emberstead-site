(function () {
  var body = document.body;

  // Hero elements
  var heroTrack = document.getElementById('hero-track');
  var hero = document.getElementById('hero');
  var heroContent = document.getElementById('hero-content');
  var opensSlot = document.getElementById('opens-slot');
  var opensBox = document.getElementById('opens-box');
  var scrollCue = document.getElementById('scroll-cue');

  // Section tracks & elements
  var aboutTrack = document.getElementById('about-track');
  var aboutBlock = document.getElementById('about');
  var aboutHeader = document.getElementById('about-header');

  var seasonTrack = document.getElementById('season-track');
  var seasonBlock = document.getElementById('season');
  var seasonHeader = document.getElementById('season-header');
  var timelineEvs = document.querySelectorAll('#season-timeline .ev');

  var galleryTrack = document.getElementById('gallery-track');
  var galleryBlock = document.getElementById('gallery');
  var galleryHeader = document.getElementById('gallery-header');
  var galleryViewport = document.getElementById('gallery-viewport');
  var galleryStrip = document.getElementById('gallery-strip');
  var galleryCards = document.querySelectorAll('#gallery-strip .gallery-card');

  var rulesTrack = document.getElementById('rules-track');
  var rulesBlock = document.getElementById('rules');
  var rulesHeader = document.getElementById('rules-header');
  var ruleItems = document.querySelectorAll('#rules-list .rule-item');

  var joinTrack = document.getElementById('join-track');
  var joinBlock = document.getElementById('join');
  var joinHeader = document.getElementById('join-header');

  var commTrack = document.getElementById('community-track');
  var commBlock = document.getElementById('community');
  var commHeader = document.getElementById('community-header');

  function setReady() {
    body.classList.add('ready');
    body.classList.remove('loading');
    body.style.overflow = 'auto';
    body.style.overflowY = 'auto';
    updateAllBlocks();
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function getProgress(trackEl, windowH) {
    if (!trackEl) return 0;
    var rect = trackEl.getBoundingClientRect();
    var scrollable = trackEl.offsetHeight - windowH;
    if (scrollable <= 0) return 0;
    var p = -rect.top / scrollable;
    return Math.max(0, Math.min(1, p));
  }

  var ticking = false;

  function updateAllBlocks() {
    var windowH = window.innerHeight || document.documentElement.clientHeight;
    var windowW = window.innerWidth || document.documentElement.clientWidth;

    // 0. HERO (Focus Zoom)
    if (heroTrack && opensBox) {
      var heroProgress = getProgress(heroTrack, windowH);
      var hp = smoothstep(heroProgress);

      if (scrollCue) {
        var cueOpacity = Math.max(0, 1 - heroProgress * 5.5);
        scrollCue.style.opacity = cueOpacity;
        scrollCue.style.transform = 'translate3d(-50%, ' + (heroProgress * 22) + 'px, 0)';
        scrollCue.style.pointerEvents = cueOpacity <= 0.05 ? 'none' : 'auto';
      }

      if (heroContent) {
        var contentOpacity = Math.max(0, 1 - heroProgress * 2.8);
        var contentTranslate = -heroProgress * 55;
        var contentScale = 1 - heroProgress * 0.1;
        var contentBlur = heroProgress * 8;

        heroContent.style.opacity = contentOpacity;
        heroContent.style.transform = 'translate3d(0, ' + contentTranslate + 'px, 0) scale(' + contentScale + ')';
        heroContent.style.filter = 'blur(' + contentBlur + 'px)';
        heroContent.style.pointerEvents = contentOpacity <= 0.05 ? 'none' : 'auto';
      }

      var baseBoxW = opensBox.offsetWidth || 480;
      var baseBoxH = opensBox.offsetHeight || 140;

      var scaleByW = (windowW * 0.88) / baseBoxW;
      var scaleByH = (windowH * 0.72) / baseBoxH;
      var maxScale = Math.min(scaleByW, scaleByH);

      if (windowW <= 600) {
        maxScale = Math.min(scaleByW, 1.85);
      } else {
        maxScale = Math.min(maxScale, 2.5);
      }
      maxScale = Math.max(maxScale, 1.35);

      var currentScale = 1 + hp * (maxScale - 1);

      var shiftY = 0;
      if (opensSlot && hero) {
        var slotCenter = opensSlot.offsetTop + (opensSlot.offsetHeight / 2);
        var screenCenter = windowH / 2;
        var targetShiftY = screenCenter - slotCenter;
        var shiftProgress = Math.min(heroProgress / 0.55, 1);
        shiftY = targetShiftY * shiftProgress;
      }

      opensBox.style.transform = 'translate3d(0, ' + shiftY.toFixed(2) + 'px, 0) scale(' + currentScale.toFixed(4) + ')';
      opensBox.style.setProperty('--zoom-p', hp.toFixed(4));
    }

    // 1. ABOUT (Staggered 3D Card Convergence)
    if (aboutTrack && aboutBlock) {
      var aboutRaw = getProgress(aboutTrack, windowH);
      var ap = smoothstep(aboutRaw);
      aboutBlock.style.setProperty('--about-p', ap.toFixed(4));

      if (aboutHeader) {
        aboutHeader.style.opacity = Math.min(1, ap * 2.2).toFixed(3);
        aboutHeader.style.transform = 'translate3d(0, ' + ((1 - Math.min(1, ap * 1.8)) * 24).toFixed(2) + 'px, 0)';
      }
    }

    // 2. SEASON (Igniting Ember Timeline)
    if (seasonTrack && seasonBlock) {
      var sp = getProgress(seasonTrack, windowH);
      seasonBlock.style.setProperty('--season-p', sp.toFixed(4));

      if (seasonHeader) {
        seasonHeader.style.opacity = Math.min(1, sp * 2.5).toFixed(3);
        seasonHeader.style.transform = 'translate3d(0, ' + ((1 - Math.min(1, sp * 2)) * 20).toFixed(2) + 'px, 0)';
      }

      var seasonThresholds = [0.14, 0.32, 0.50, 0.68, 0.86];
      for (var i = 0; i < timelineEvs.length; i++) {
        if (sp >= (seasonThresholds[i] || 0.5)) {
          timelineEvs[i].classList.add('ignited');
        } else {
          timelineEvs[i].classList.remove('ignited');
        }
      }
    }

    // 3. GALLERY (Horizontal Cinema Parallax Strip)
    if (galleryTrack && galleryStrip && galleryViewport) {
      var gp = getProgress(galleryTrack, windowH);

      if (galleryHeader) {
        galleryHeader.style.opacity = Math.min(1, gp * 2.5).toFixed(3);
        galleryHeader.style.transform = 'translate3d(0, ' + ((1 - Math.min(1, gp * 2)) * 20).toFixed(2) + 'px, 0)';
      }

      var maxScrollX = galleryStrip.scrollWidth - galleryViewport.clientWidth;
      if (maxScrollX > 0) {
        var shiftX = gp * maxScrollX;
        galleryStrip.style.transform = 'translate3d(' + (-shiftX.toFixed(2)) + 'px, 0, 0)';
      }

      // Highlight card nearest to viewport center
      var screenCenterX = windowW / 2;
      var closestCard = null;
      var minDistance = Infinity;

      for (var g = 0; g < galleryCards.length; g++) {
        var cRect = galleryCards[g].getBoundingClientRect();
        var cCenter = cRect.left + cRect.width / 2;
        var dist = Math.abs(cCenter - screenCenterX);
        if (dist < minDistance) {
          minDistance = dist;
          closestCard = galleryCards[g];
        }
      }

      for (var k = 0; k < galleryCards.length; k++) {
        if (galleryCards[k] === closestCard) {
          galleryCards[k].classList.add('active');
        } else {
          galleryCards[k].classList.remove('active');
        }
      }
    }

    // 4. RULES (Molten Stone Decree Engraving)
    if (rulesTrack && rulesBlock) {
      var rp = getProgress(rulesTrack, windowH);
      rulesBlock.style.setProperty('--rules-p', rp.toFixed(4));

      if (rulesHeader) {
        rulesHeader.style.opacity = Math.min(1, rp * 2.5).toFixed(3);
        rulesHeader.style.transform = 'translate3d(0, ' + ((1 - Math.min(1, rp * 2)) * 20).toFixed(2) + 'px, 0)';
      }

      var ruleThresholds = [0.12, 0.26, 0.40, 0.54, 0.68, 0.82];
      for (var r = 0; r < ruleItems.length; r++) {
        if (rp >= (ruleThresholds[r] || 0.5)) {
          ruleItems[r].classList.add('engraved');
        } else {
          ruleItems[r].classList.remove('engraved');
        }
      }
    }

    // 5. HOW TO JOIN (Portal Gateway Bifurcation)
    if (joinTrack && joinBlock) {
      var jpRaw = getProgress(joinTrack, windowH);
      var jp = smoothstep(jpRaw);
      joinBlock.style.setProperty('--join-p', jp.toFixed(4));

      if (joinHeader) {
        joinHeader.style.opacity = Math.min(1, jp * 2.5).toFixed(3);
        joinHeader.style.transform = 'translate3d(0, ' + ((1 - Math.min(1, jp * 2)) * 20).toFixed(2) + 'px, 0)';
      }
    }

    // 6. COMMUNITY & FOOTER (Campfire Lantern Float)
    if (commTrack && commBlock) {
      var cpRaw = getProgress(commTrack, windowH);
      var cp = smoothstep(cpRaw);
      commBlock.style.setProperty('--community-p', cp.toFixed(4));

      if (commHeader) {
        commHeader.style.opacity = Math.min(1, cp * 2.5).toFixed(3);
        commHeader.style.transform = 'translate3d(0, ' + ((1 - Math.min(1, cp * 2)) * 20).toFixed(2) + 'px, 0)';
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateAllBlocks();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    updateAllBlocks();
  });

  setTimeout(setReady, 500);
  window.addEventListener('DOMContentLoaded', updateAllBlocks);
  updateAllBlocks();
})();

// ember particles
(function () {
  var box = document.getElementById('embers');
  if (!box) return;

  for (var i = 0; i < 14; i++) {
    var s = document.createElement('span');
    s.style.left = (Math.random() * 100) + '%';
    s.style.animationDelay = (Math.random() * 7) + 's';
    s.style.animationDuration = (5 + Math.random() * 6) + 's';
    var sz = 2 + Math.random() * 3;
    s.style.width = sz + 'px';
    s.style.height = sz + 'px';
    box.appendChild(s);
  }
})();

// countdown to opening: Sep 25 2026 18:00 PT (PDT, UTC-7)
(function () {
  var open = Date.UTC(2026, 8, 26, 1, 0, 0);
  var el = document.getElementById('countdown');
  if (!el) return;

  function tick() {
    var d = open - Date.now();
    if (d <= 0) {
      el.textContent = 'THE GATES ARE OPEN';
      return;
    }
    var days = Math.floor(d / 86400000);
    var hrs = Math.floor((d % 86400000) / 3600000);
    var min = Math.floor((d % 3600000) / 60000);
    var sec = Math.floor((d % 60000) / 1000);
    el.textContent = days + 'd ' + hrs + 'h ' + min + 'm ' + sec + 's until the gates open';
    setTimeout(tick, 1000);
  }

  tick();
})();

// copy buttons
document.querySelectorAll('.copybtn').forEach(function (b) {
  b.addEventListener('click', function () {
    var t = b.getAttribute('data-copy');

    function done() {
      b.textContent = 'COPIED';
      b.classList.add('copied');
      setTimeout(function () {
        b.textContent = 'COPY';
        b.classList.remove('copied');
      }, 1600);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(done, done);
    } else {
      var i = document.createElement('input');
      i.value = t;
      document.body.appendChild(i);
      i.select();
      document.execCommand('copy');
      i.remove();
      done();
    }
  });
});
