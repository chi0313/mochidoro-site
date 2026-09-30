// One page, five languages: blocks marked data-lang="en|de|zh-Hant|ja|ko" are shown for the
// chosen language. Order: ?lang=, then what the visitor chose before, then the browser.
(function () {
  const supported = ['en', 'de', 'zh-Hant', 'ja', 'ko'];
  const labels = { en: 'English', de: 'Deutsch', 'zh-Hant': '繁體中文', ja: '日本語', ko: '한국어' };
  function detect() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q && supported.includes(q)) return q;
    try { const s = localStorage.getItem('mochidoro.lang'); if (s && supported.includes(s)) return s; } catch (e) {}
    for (const l of (navigator.languages || [navigator.language || 'en'])) {
      const low = l.toLowerCase();
      if (low.startsWith('zh')) return (low.includes('cn') || low.includes('hans') || low.includes('sg')) ? 'en' : 'zh-Hant';
      if (low.startsWith('ja')) return 'ja';
      if (low.startsWith('ko')) return 'ko';
      if (low.startsWith('de')) return 'de';
      if (low.startsWith('en')) return 'en';
    }
    return 'en';
  }
  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach(el => el.classList.toggle('on', el.dataset.lang === lang));
    document.querySelectorAll('.langs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.set === lang ? 'true' : 'false'));
    const t = document.querySelector('title[data-' + lang.toLowerCase().replace('-', '') + ']');
    const titleEl = document.querySelector('title');
    const key = 'data-' + lang.toLowerCase().replace('-', '');
    if (titleEl && titleEl.hasAttribute(key)) titleEl.textContent = titleEl.getAttribute(key);
    try { localStorage.setItem('mochidoro.lang', lang); } catch (e) {}
  }
  document.addEventListener('DOMContentLoaded', () => {
    const bar = document.querySelector('.langs');
    if (bar) supported.forEach(l => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = labels[l]; b.dataset.set = l;
      b.addEventListener('click', () => { apply(l); history.replaceState(null, '', '?lang=' + l); });
      bar.appendChild(b);
    });
    apply(detect());
  });
})();
