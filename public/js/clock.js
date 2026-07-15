// Live clock — updates the status-time stamp every second client-side
// The open/closed logic itself runs server-side; this is cosmetic only.
(function () {
  const el = document.querySelector('.status-time');
  if (!el) return;

  function tick() {
    const now = new Date();
    el.textContent = 'as of ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });
  }

  tick();
  setInterval(tick, 1000);
})();
