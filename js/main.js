/* ============================================================
   Devon's Own — JavaScript
   ============================================================ */

'use strict';

/* ── Product data ───────────────────────────────────────── */
const PRODUCTS = [
  { id:1,  name:'Big Heart – Moon Mix Ketting',              price:24.95, category:'kettingen',   tag:'Bestseller', image:'images/hero-1.jpg',  desc:'Handgemaakte stainless steel ketting met hart en maan bedels. Meet 44cm met 5cm verlenging. Perfect om alleen te dragen of te layeren met andere kettingen.' },
  { id:2,  name:'Kralen Armband Set Bruin met Bedels',       price:12.50, category:'armbanden',   tag:'Set',        image:'images/hero-2.jpg',  desc:'Aantrekkelijke bruine bedelarmband set met parelkralen en gouden bedels. Set van 3 aparte armbanden in verschillende tinten bruin. Perfect voor mix-and-match styling.' },
  { id:3,  name:'Ketting met Hanger Zeshoek Natuursteen',    price:12.50, category:'kettingen',   tag:'Nieuw',      image:'images/hero-3.jpg',  desc:'Opvallende zeshoek natuursteen ketting met nikkelvrij metaal. Hanger 40x13mm in zwart of blauw-wit. Ketting 58cm lang. Ideaal als cadeau of te layeren.' },
  { id:4,  name:'Verstelbare Ring met Geplakte Cabochon',    price:8.00,  category:'ringen',      tag:null,         image:'images/hero-4.jpg',  desc:'Leuke verstelbare zilveren en gouden ring met geplakte glitter cabochon. 12mm bruine glitter cabochon. Verstelbaar voor elke vinger. Perfect cadeau voor kinderen.' },
  { id:5,  name:'Goudkleurige Leeuwenkop Ketting',           price:13.00, category:'kettingen',   tag:'Bold',       image:'images/hero-5.jpg',  desc:'Stoere goudkleurige ketting met leeuwenkop bedel. Totaal 47cm, bedel 24x20mm, curb chain 3x2mm. Te dragen alleen of gelaagd. Prachtig cadeau.' },
  { id:6,  name:'Rondellen Kralen – Smiley Telefoonkoordje',  price:12.50, category:'koorden',     tag:'Zomer',      image:'images/hero-6.jpg',  desc:'Vrolijk telefoonkoord met candy crush kralen en acryl rondellen met smiley bedels. 26cm gemaakt met macramé draad. Acryl schijfkralen 9mm.' },
  { id:7,  name:'Gouden Kauri Schelp Oorsteker Set',         price:14.50, category:'oorbellen',   tag:'Beach',      image:'images/hero-7.jpg',  desc:'Zomerse strand-style oorstekers met grote natuurlijke schelpen. Licht en comfortabel draagbar. Afmetingen 23x12mm. Uitstekend cadeau voor de zomer.' },
  { id:8,  name:'Choker Miyuki Bugles',                      price:14.50, category:'chokers',     tag:'Nieuw',      image:'images/hero-8.jpg',  desc:'Choker met miyuki bugles en zoetwater parels. Totaal 38cm + 5cm verlenging. Short neck wear voor layering effect. Combineer met meerdere kettingen voor trendy look.' },
  { id:9,  name:'Regenboog Katsuki Choker',                  price:13.50, category:'chokers',     tag:'Trend',      image:'images/hero-9.jpg',  desc:'Super leuke surf choker met vibrant regenboogkleuren: roze, hemelsblauw, wit, oranje, neon pink en rood. Flat katsuki kralen 4mm. Totaal 35cm + 5cm verlenging.' },
  { id:10, name:'Brillenkoord Kralen Zwart – Oranje Druppel', price:14.50, category:'koorden',     tag:'Festival',   image:'images/hero-10.jpg', desc:'Aantrekkelijk zwart-oranje bedelkoord met oranje drop-faceted kralen en hartjes. Mengeling van oranje en zwarte kralen. 4mm kralen diameter. Perfect voor festival wear.' },
];

const CATEGORIES = [
  { id:'alle',        label:'Alle producten' },
  { id:'armbanden',  label:'Armbanden' },
  { id:'chokers',    label:'Chokers' },
  { id:'kettingen',  label:'Kettingen' },
  { id:'enkelbanden',label:'Enkelbanden' },
  { id:'oorbellen',  label:'Oorbellen' },
  { id:'ringen',     label:'Ringen' },
  { id:'koorden',    label:'Koorden' },
  { id:'collecties', label:'Collecties' },
  { id:'heren',      label:'Heren' },
  { id:'kinderen',   label:'Kinderen' },
  { id:'cadeaubonnen',label:'Cadeaubonnen' },
];

/* ── Cart state ─────────────────────────────────────────── */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('devonsown_cart') || '[]'); } catch {}
let activeFilter = 'alle';
let sortMode = 'default';

function saveCart() {
  try { localStorage.setItem('devonsown_cart', JSON.stringify(cart)); } catch {}
}
function cartTotal()  { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartCount()  { return cart.reduce((s, i) => s + i.qty, 0); }

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++; else cart.push({ ...p, qty: 1 });
  saveCart();
  updateCartBadge();
  renderMiniCart();
  toast(`${p.name} toegevoegd`);
  const btn = document.querySelector(`[data-add="${id}"]`);
  if (btn) { btn.classList.add('is-added'); setTimeout(() => btn.classList.remove('is-added'), 1200); }
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart(); updateCartBadge(); renderMiniCart();
  if (document.querySelector('.cart-page')) renderCartPage();
}

function updateQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartBadge(); renderMiniCart(); if (document.querySelector('.cart-page')) renderCartPage(); }
}

function updateCartBadge() {
  const n = cartCount();
  document.querySelectorAll('.cart-count').forEach(el => { el.textContent = n; el.style.display = n > 0 ? 'inline-flex' : 'none'; });
}

/* ── Mini cart render ───────────────────────────────────── */
function renderMiniCart() {
  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body) return;

  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty-state"><div class="cart-empty-state-icon"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:48px;height:48px;color:var(--gold)"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div><p>Je winkelwagen is leeg.<br>Ontdek onze sieraden!</p></div>`;
    if (foot) foot.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-img ${i.pg}">${i.icon}</div>
      <div class="cart-item-meta">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">€${i.price.toFixed(2).replace('.',',')}</div>
        <div class="cart-qty-row">
          <button class="qty-btn" onclick="updateQty(${i.id},-1)">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="updateQty(${i.id},1)">+</button>
        </div>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${i.id})" title="Verwijderen">✕</button>
    </div>`).join('');

  if (foot) {
    const total = cartTotal();
    const free  = total >= 50;
    foot.innerHTML = `
      <div class="cart-subtotal"><span>Subtotaal</span><strong>€${total.toFixed(2).replace('.',',')}</strong></div>
      <div class="cart-shipping-note">${free ? '✓ Gratis verzending!' : `Nog €${(50 - total).toFixed(2).replace('.',',')} voor gratis verzending`}</div>
      <a href="cart.html" class="btn btn-gold btn--full btn--sm">Afrekenen →</a>
      <a href="shop.html" class="btn btn-outline btn--full btn--sm" style="margin-top:0.5rem">Verder winkelen</a>`;
  }
}

/* ── Cart page ──────────────────────────────────────────── */
function renderCartPage() {
  const tbody   = document.querySelector('.cart-table-body');
  const summary = document.querySelector('.order-summary-box');
  if (!tbody || !summary) return;

  if (!cart.length) {
    tbody.innerHTML = `<div style="text-align:center;padding:3rem 1.5rem;color:var(--ink-3)"><div style="font-size:2.5rem;margin-bottom:1rem"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:60px;height:60px;color:var(--gold)"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div><p style="margin-bottom:1.25rem">Je winkelwagen is leeg.</p><a href="shop.html" class="btn btn-gold">Ga naar de shop</a></div>`;
    summary.innerHTML = '';
    return;
  }
  const total    = cartTotal();
  const shipping = total >= 50 ? 0 : 2.95;

  tbody.innerHTML = cart.map(i => `
    <div class="cart-table-row">
      <div class="cart-row-product">
        <div class="cart-row-img ${i.pg}">${i.icon}</div>
        <div>
          <div class="cart-row-name">${i.name}</div>
          <button onclick="removeFromCart(${i.id})" style="font-size:0.75rem;color:var(--ink-4);border:none;background:none;cursor:pointer;margin-top:3px">Verwijderen</button>
        </div>
      </div>
      <div class="cart-row-price">€${i.price.toFixed(2).replace('.',',')}</div>
      <div><div class="cart-qty-row"><button class="qty-btn" onclick="updateQty(${i.id},-1)">−</button><span class="qty-num">${i.qty}</span><button class="qty-btn" onclick="updateQty(${i.id},1)">+</button></div></div>
      <div class="cart-row-total">€${(i.price*i.qty).toFixed(2).replace('.',',')}</div>
    </div>`).join('');

  summary.innerHTML = `
    <div class="summary-title">Besteloverzicht</div>
    <div class="summary-row"><span>Subtotaal</span><span>€${total.toFixed(2).replace('.',',')}</span></div>
    <div class="summary-row"><span>Verzendkosten</span><span>${shipping===0?'<span style="color:var(--success)">Gratis</span>':'€'+shipping.toFixed(2).replace('.',',')}</span></div>
    <div class="summary-row total"><span>Totaal</span><span>€${(total+shipping).toFixed(2).replace('.',',')}</span></div>
    <div class="coupon-row">
      <input class="coupon-input" placeholder="Kortingscode">
      <button class="btn btn-outline btn--sm">Toepassen</button>
    </div>
    <button class="btn btn-gold btn--full" onclick="alert('Koppel aan jouw betaalprovider (bijv. Mollie)')">Afrekenen →</button>
    <a href="shop.html" class="btn btn-outline btn--full btn--sm" style="margin-top:0.5rem">← Verder winkelen</a>
    <p style="text-align:center;font-size:0.72rem;color:var(--ink-4);margin-top:1rem">🔒 Veilig betalen via iDEAL, Bancontact & meer</p>`;
}

/* ── Product card HTML ──────────────────────────────────── */
function productCard(p) {
  const tagHtml = p.tag ? `<span class="tag ${p.tag==='Nieuw'?'tag--new':p.tag==='Luxe'?'tag--dark':'tag--gold'}">${p.tag}</span>` : '';
  const img = p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">` : `<div class="product-img-bg ${p.pg}"><span class="product-emoji">${p.icon}</span></div>`;
  return `<a href="product.html?id=${p.id}" class="product-card js-reveal" data-category="${p.category}">
    <div class="product-img">
      ${img}
      <div class="product-badges">${tagHtml}</div>
      <button class="product-wish" onclick="event.preventDefault(); toggleWish(this)" title="Verlanglijst" aria-label="Aan verlanglijst toevoegen">♡</button>
      <button class="quick-add" onclick="event.preventDefault(); addToCart(${p.id})">Toevoegen aan winkelwagen</button>
    </div>
    <div class="product-info">
      <div class="product-cat-label">${catLabel(p.category)}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-footer">
        <span class="product-price">€${p.price.toFixed(2).replace('.',',')}</span>
        <button class="add-to-cart-btn" data-add="${p.id}" onclick="event.preventDefault(); addToCart(${p.id})" aria-label="Toevoegen"><svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
      </div>
    </div>
  </a>`;
}

function catLabel(cat) {
  return CATEGORIES.find(c => c.id === cat)?.label ?? cat;
}

/* ── Shop / filter ──────────────────────────────────────── */
function filteredProducts() {
  let list = activeFilter === 'alle' ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === activeFilter);
  if (sortMode === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (sortMode === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (sortMode === 'name')       list.sort((a,b) => a.name.localeCompare(b.name, 'nl'));
  return list;
}

function renderShop() {
  const grid  = document.getElementById('products-grid');
  const count = document.getElementById('product-count');
  if (!grid) return;
  const list = filteredProducts();
  if (count) count.textContent = list.length;
  grid.innerHTML = list.map(productCard).join('');
  observeReveal();
}

function renderFeatured() {
  const grid = document.getElementById('featured-products');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.slice(0,8).map(productCard).join('');
  observeReveal();
}

function renderFilterList() {
  const el = document.getElementById('filter-list');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c => {
    const n = c.id === 'alle' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === c.id).length;
    return `<div class="filter-item${c.id===activeFilter?' is-active':''}" data-cat="${c.id}" onclick="setFilter('${c.id}')">
      <span>${c.label}</span><span class="filter-count">${n}</span>
    </div>`;
  }).join('');
}

function setFilter(cat) {
  activeFilter = cat;
  document.querySelectorAll('.filter-item').forEach(el => el.classList.toggle('is-active', el.dataset.cat === cat));
  renderShop();
}

/* ── Wishlist ────────────────────────────────────────────── */
function toggleWish(btn) {
  btn.classList.toggle('is-wished');
  btn.textContent = btn.classList.contains('is-wished') ? '♥' : '♡';
  toast(btn.classList.contains('is-wished') ? 'Toegevoegd aan verlanglijst' : 'Verwijderd van verlanglijst');
}

/* ── Toast ──────────────────────────────────────────────── */
function toast(msg) {
  const c = document.querySelector('.toast-container');
  if (!c) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>✓</span><span>${msg}</span>`;
  c.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-visible'));
  setTimeout(() => { el.classList.remove('is-visible'); setTimeout(() => el.remove(), 400); }, 3000);
}

/* ── Scroll animations ──────────────────────────────────── */
let revealObserver;
function observeReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.js-reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });
  }
  document.querySelectorAll('.js-reveal:not(.is-visible)').forEach(el => revealObserver.observe(el));
}

/* ── Header ─────────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  header.classList.remove('hero-top');
  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Mobile menu ─────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger-btn');
  const nav  = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Menu openen');
    document.body.style.overflow = '';
  }));
}

/* ── Cart overlay ────────────────────────────────────────── */
function initCart() {
  const overlay  = document.getElementById('cart-overlay');
  const drawer   = document.getElementById('mini-cart');
  const openBtns = document.querySelectorAll('#cart-open-btn, .cart-icon');
  const closeBtn = document.getElementById('cart-close-btn');

  openBtns.forEach(b => b.addEventListener('click', () => {
    overlay?.classList.add('is-open');
    drawer?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }));
  const close = () => {
    overlay?.classList.remove('is-open');
    drawer?.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
}

/* ── Newsletter ──────────────────────────────────────────── */
function initNewsletter() {
  document.getElementById('newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const inp = e.target.querySelector('input');
    if (inp?.value) { toast('Aanmelding gelukt! Welkom bij Devon\'s Own ✨'); inp.value = ''; }
  });
}

/* ── Active nav ──────────────────────────────────────────── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('is-active', a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html'));
  });
}

/* ── URL cat filter on shop page ────────────────────────── */
function initShopFilter() {
  const params = new URLSearchParams(location.search);
  const cat    = params.get('cat');
  if (cat) { activeFilter = cat; }
  renderFilterList();
  renderShop();
  document.getElementById('sort-select')?.addEventListener('change', e => {
    sortMode = e.target.value;
    renderShop();
  });
}

/* ── Hero Slideshow ─────────────────────────────────────── */
function initSlideshow() {
  const container  = document.querySelector('.hero-slideshow');
  if (!container) return;

  const slides     = container.querySelectorAll('.slide');
  const dots       = container.querySelectorAll('.slide-dot');
  const prevBtn    = container.querySelector('.slide-prev');
  const nextBtn    = container.querySelector('.slide-next');
  const progBar    = container.querySelector('.slide-progress-bar');
  const INTERVAL   = 3500; // ms per slide
  const TRANSITION = 900;  // ms — must match CSS transition

  if (!slides.length) return;

  let current = 0;
  let timer   = null;
  let progTimer = null;

  function goTo(n, resetTimer = true) {
    slides[current].classList.remove('is-active');
    dots[current]?.classList.remove('is-active');
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current]?.classList.add('is-active');
    if (resetTimer) restartTimer();
  }

  function animateProgress() {
    if (!progBar) return;
    clearTimeout(progTimer);
    progBar.style.transition = 'none';
    progBar.style.width = '0%';
    // Force reflow so the reset takes effect before animating
    void progBar.offsetWidth;
    progBar.style.transition = `width ${INTERVAL - TRANSITION}ms linear`;
    progBar.style.width = '100%';
  }

  function restartTimer() {
    clearInterval(timer);
    animateProgress();
    timer = setInterval(() => goTo(current + 1, false) || restartTimer(), INTERVAL);
  }

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.slide)));
  });

  // Arrow clicks
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Pause on hover
  container.addEventListener('mouseenter', () => {
    clearInterval(timer);
    clearTimeout(progTimer);
    if (progBar) { progBar.style.transition = 'none'; }
  });
  container.addEventListener('mouseleave', () => restartTimer());

  // Touch/swipe support
  let touchStartX = 0;
  container.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  container.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  }, { passive: true });

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer);
    else restartTimer();
  });

  // Keyboard nav when hero is in view
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Start
  // Add progress bar element if not already in DOM
  if (!progBar) {
    const prog = document.createElement('div');
    prog.className = 'slide-progress';
    prog.innerHTML = '<div class="slide-progress-bar"></div>';
    container.appendChild(prog);
  }
  restartTimer();
}

/* ── Product Detail Page ────────────────────────────────── */
function initProductPage() {
  if (!document.body.classList.contains('page-product')) return;
  const id = new URLSearchParams(window.location.search).get('id');
  const product = PRODUCTS.find(p => p.id === Number(id));
  if (!product) { location.href = 'shop.html'; return; }

  document.title = `${product.name} — Devon's Own`;
  document.querySelector('#product-breadcrumb').textContent = product.name;
  document.querySelector('#product-title').textContent = product.name;
  document.querySelector('#product-cat').textContent = catLabel(product.category);
  document.querySelector('#product-price').textContent = `€${product.price.toFixed(2).replace('.',',')}`;
  document.querySelector('#product-desc').textContent = product.desc;

  const imgBox = document.querySelector('#product-img-box');
  imgBox.innerHTML = '';
  if (product.image) {
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    imgBox.appendChild(img);
  } else {
    imgBox.textContent = product.icon || '🎁';
  }

  if (product.tag) {
    const badge = document.createElement('div');
    badge.className = 'product-badge';
    badge.textContent = product.tag;
    document.querySelector('#product-badges').appendChild(badge);
  }

  const qtyInput = document.querySelector('#qty-input');
  const addBtn = document.querySelector('#add-to-cart-btn');
  document.querySelector('#qty-minus').addEventListener('click', () => { qtyInput.value = Math.max(1, Number(qtyInput.value) - 1); });
  document.querySelector('#qty-plus').addEventListener('click', () => { qtyInput.value = Math.min(10, Number(qtyInput.value) + 1); });
  addBtn.addEventListener('click', () => {
    addToCart(product.id, Number(qtyInput.value));
    addBtn.textContent = '✓ Toegevoegd!';
    setTimeout(() => { addBtn.textContent = 'Toevoegen aan winkelwagen'; }, 1500);
  });

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const grid = document.querySelector('#related-products');
  related.forEach(p => {
    const card = document.createElement('a');
    card.href = `product.html?id=${p.id}`;
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img" style="position:relative">
        <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <span class="product-price">€${p.price.toFixed(2).replace('.',',')}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initHeader();
  initSlideshow();
  initMobileMenu();
  initCart();
  initNewsletter();
  setActiveNav();
  renderMiniCart();
  renderFeatured();
  initShopFilter();
  observeReveal();
  if (document.querySelector('.cart-page')) renderCartPage();
  initProductPage();
});
