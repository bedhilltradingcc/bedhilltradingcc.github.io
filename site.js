{
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // mobile menu
  const menu = document.querySelector('.menu'), nav = document.getElementById('nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', open);
      menu.textContent = open ? 'Close' : 'Menu';
    });
  }

  // hero slideshow
  const slides = document.querySelectorAll('.slides img');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slides.length > 1 && !still) {
    let i = 0;
    const slideTimer = setInterval(() => {
      slides[i].classList.remove('on');
      i = (i + 1) % slides.length;
      slides[i].classList.add('on');
    }, 6000);
  }

  // gallery filters
  const filterBtns = document.querySelectorAll('.filters button');
  const tiles = [...document.querySelectorAll('.gallery button')];
  filterBtns.forEach(b => b.addEventListener('click', () => {
    filterBtns.forEach(x => x.setAttribute('aria-pressed', x === b));
    const f = b.dataset.f;
    tiles.forEach(t => { t.hidden = !(f === 'all' || t.dataset.cat === f); });
  }));

  // lightbox
  const lb = document.querySelector('.lightbox');
  if (lb && tiles.length) {
    const lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p');
    let cur = 0, last = null;
    const visible = () => tiles.filter(t => !t.hidden);
    const show = t => {
      const im = t.querySelector('img');
      lbImg.src = im.src; lbImg.alt = im.alt;
      lbCap.textContent = t.querySelector('.cap').textContent;
    };
    const step = d => { const v = visible(); cur = (cur + d + v.length) % v.length; show(v[cur]); };
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; if (last) last.focus(); };
    tiles.forEach(t => t.addEventListener('click', () => {
      last = t; cur = visible().indexOf(t); show(t);
      lb.classList.add('open'); document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    }));
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', () => step(-1));
    lb.querySelector('.lb-next').addEventListener('click', () => step(1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  // quote form
  const form = document.getElementById('quote');
  if (form) {
    const pre = new URLSearchParams(location.search).get('type');
    if (pre) { const o = [...form.type.options].find(x => x.value === pre); if (o) o.selected = true; }
    form.addEventListener('submit', e => {
      e.preventDefault();
      const note = document.getElementById('formnote');
      const missing = [form.name, form.phone].find(f => !f.value.trim());
      if (missing) { note.textContent = 'Add your name and phone number so we can call you back.'; missing.focus(); return; }
      const body = `Name: ${form.name.value}\nPhone: ${form.phone.value}\nEmail: ${form.email.value}\nType of work: ${form.type.value}\nSite: ${form.where.value}\n\n${form.msg.value}`;
      location.href = 'mailto:bedhilltradingcc@gmail.com?subject=' +
        encodeURIComponent('Quote request: ' + form.type.value) + '&body=' + encodeURIComponent(body);
      note.textContent = 'Your email app should now open with the request ready to send. If it doesn’t, email bedhilltradingcc@gmail.com or call 071 245 5112.';
    });
  }
}
