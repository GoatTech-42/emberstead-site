(function () {
  var body = document.body;

  function startIntroSequence() {
    window.setTimeout(function () {
      body.classList.add('ready');
      body.classList.remove('loading');
      body.classList.remove('intro');

      window.setTimeout(function () {
        window.scrollTo({
          top: Math.max(window.innerHeight * 0.7, 440),
          left: 0,
          behavior: 'auto'
        });
      }, 220);
    }, 1500);
  }

  startIntroSequence();
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
