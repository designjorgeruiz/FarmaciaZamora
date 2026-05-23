'use strict';

/* ═══════════════════════════════════════════
   PRODUCT DATA
═══════════════════════════════════════════ */
const PRODUCTS = [
  // ─── SUPER ───────────────────────────────
  { id: 1,  cat: 'super',    name: 'Agua Ciel 1.5L',              brand: 'Ciel',      price: 18,  orig: null, emoji: '💧', bg: '#dbeafe', sale: false },
  { id: 2,  cat: 'super',    name: 'Leche Lala Entera 1L',        brand: 'Lala',      price: 28,  orig: null, emoji: '🥛', bg: '#fef9c3', sale: false },
  { id: 3,  cat: 'super',    name: 'Papel Higiénico Vogue x4',    brand: 'Vogue',     price: 65,  orig: null, emoji: '🧻', bg: '#f3e8ff', sale: false },
  { id: 4,  cat: 'super',    name: 'Cereal Choco Krispis 490g',   brand: "Kellogg's", price: 89,  orig: 115,  emoji: '🥣', bg: '#fef3c7', sale: true  },
  { id: 5,  cat: 'super',    name: 'Jabón Zote Rosa 400g',        brand: 'Zote',      price: 22,  orig: null, emoji: '🧼', bg: '#fce7f3', sale: false },
  { id: 6,  cat: 'super',    name: 'Cloro Cloralex 1L',           brand: 'Cloralex',  price: 35,  orig: null, emoji: '🧪', bg: '#d1fae5', sale: false },
  { id: 7,  cat: 'super',    name: 'Azúcar Estándar 1kg',         brand: 'La Abeja',  price: 32,  orig: 39,   emoji: '🍚', bg: '#fefce8', sale: true  },
  { id: 8,  cat: 'super',    name: 'Atún en Agua Dolores 140g',   brand: 'Dolores',   price: 28,  orig: 36,   emoji: '🐟', bg: '#e0f2fe', sale: true  },

  // ─── FARMACIA ────────────────────────────
  { id: 9,  cat: 'farmacia', name: 'Paracetamol 500mg x10 tabs',  brand: 'Genérico',  price: 45,  orig: null, emoji: '💊', bg: '#d1fae5', sale: false },
  { id: 10, cat: 'farmacia', name: 'Vitamina C 1000mg x30 tabs',  brand: 'Bayer',     price: 89,  orig: 125,  emoji: '🍊', bg: '#fef3c7', sale: true  },
  { id: 11, cat: 'farmacia', name: 'Antigripal Lem Sobre x10',    brand: 'Lem',       price: 55,  orig: null, emoji: '🤧', bg: '#e0f2fe', sale: false },
  { id: 12, cat: 'farmacia', name: 'Omeprazol 20mg x14 caps',     brand: 'Genérico',  price: 120, orig: null, emoji: '💉', bg: '#f3e8ff', sale: false },
  { id: 13, cat: 'farmacia', name: 'Alcohol Isopropílico 1L',     brand: 'SafeCare',  price: 38,  orig: null, emoji: '🧴', bg: '#d1fae5', sale: false },
  { id: 14, cat: 'farmacia', name: 'Tapabocas Quirúrgico x10',    brand: 'SafeCare',  price: 65,  orig: 89,   emoji: '😷', bg: '#e0f2fe', sale: true  },
  { id: 15, cat: 'farmacia', name: 'Termómetro Digital',          brand: 'Citizen',   price: 185, orig: null, emoji: '🌡️', bg: '#fef9c3', sale: false },
  { id: 16, cat: 'farmacia', name: 'Preservativos Durex x3',      brand: 'Durex',     price: 95,  orig: null, emoji: '❤️', bg: '#fce7f3', sale: false },

  // ─── DERMO ───────────────────────────────
  { id: 17, cat: 'dermo',    name: 'Protector Solar FPS50 60ml',  brand: 'Neutrogena',price: 185, orig: 249,  emoji: '☀️', bg: '#fef9c3', sale: true  },
  { id: 18, cat: 'dermo',    name: 'Crema Hidratante Nivea 200ml',brand: 'Nivea',     price: 89,  orig: null, emoji: '🧴', bg: '#dbeafe', sale: false },
  { id: 19, cat: 'dermo',    name: 'Shampoo H&S Anticaspa 375ml', brand: 'H&S',       price: 125, orig: null, emoji: '🫧', bg: '#d1fae5', sale: false },
  { id: 20, cat: 'dermo',    name: 'Desodorante Dove Original',   brand: 'Dove',      price: 75,  orig: 99,   emoji: '🌸', bg: '#fce7f3', sale: true  },
  { id: 21, cat: 'dermo',    name: 'Labial Protector Neutrogena', brand: 'Neutrogena',price: 145, orig: null, emoji: '💄', bg: '#fce7f3', sale: false },
  { id: 22, cat: 'dermo',    name: 'Agua Micelar Garnier 400ml',  brand: 'Garnier',   price: 165, orig: 215,  emoji: '💆', bg: '#f3e8ff', sale: true  },
];

/* ═══════════════════════════════════════════
   STATE
═══════════════════════════════════════════ */
let cart       = {};          // { productId: quantity }
let activecat  = 'all';
let searchQ    = '';
let sortMode   = 'default';
let heroIdx    = 0;
let heroTimer  = null;

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
const $ = id => document.getElementById(id);
const fmt = n => `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

function discount(p) {
  if (!p.orig) return null;
  return Math.round((1 - p.price / p.orig) * 100);
}

/* ═══════════════════════════════════════════
   RENDER PRODUCTS
═══════════════════════════════════════════ */
function getFilteredProducts() {
  let list = [...PRODUCTS];

  if (activecat === 'ofertas') {
    list = list.filter(p => p.sale);
  } else if (activecat !== 'all') {
    list = list.filter(p => p.cat === activecat);
  }

  if (searchQ) {
    const q = searchQ.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }

  if (sortMode === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (sortMode === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sortMode === 'sale')       list.sort((a, b) => (b.sale ? 1 : 0) - (a.sale ? 1 : 0));

  return list;
}

function renderProducts() {
  const grid  = $('productsGrid');
  const empty = $('productsEmpty');
  const list  = getFilteredProducts();

  // Title
  const titles = {
    all: 'Todos los productos',
    super: '🛒 Super',
    farmacia: '💊 Farmacia',
    dermo: '✨ Dermo',
    ofertas: '🏷️ Ofertas del día',
  };
  $('productsTitle').textContent = titles[activecat] || 'Todos los productos';
  $('productsCount').textContent = list.length === 1 ? '1 producto' : `${list.length} productos`;

  if (!list.length) {
    grid.style.display  = 'none';
    empty.style.display = 'block';
    return;
  }
  grid.style.display  = 'grid';
  empty.style.display = 'none';

  grid.innerHTML = list.map(p => {
    const disc    = discount(p);
    const inCart  = cart[p.id] || 0;
    const badgeEl = disc ? `<div class="product-card__badge">-${disc}%</div>` : '';
    const origEl  = p.orig ? `<span class="product-card__original">${fmt(p.orig)}</span>` : '';
    const actionEl = inCart > 0
      ? `<div class="qty-control" id="qty-${p.id}">
           <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
           <span class="qty-value" id="qval-${p.id}">${inCart}</span>
           <button class="qty-btn" onclick="changeQty(${p.id}, +1)">+</button>
         </div>`
      : `<button class="add-btn" id="addbtn-${p.id}" onclick="addToCart(${p.id})">
           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
           Agregar
         </button>`;

    return `
      <div class="product-card" id="card-${p.id}">
        <div class="product-card__img" style="background:${p.bg}">
          ${badgeEl}
          ${p.emoji}
        </div>
        <div class="product-card__body">
          <div class="product-card__brand">${p.brand}</div>
          <div class="product-card__name">${p.name}</div>
          <div class="product-card__pricing">
            <span class="product-card__price">${fmt(p.price)}</span>
            ${origEl}
          </div>
          <div class="product-card__actions">${actionEl}</div>
        </div>
      </div>`;
  }).join('');
}

/* ═══════════════════════════════════════════
   CART LOGIC
═══════════════════════════════════════════ */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCardAction(id);
  updateCartBadge();
  renderCartSidebar();
  showToast(`✓ Producto agregado`);
  bumpBadge();
}

function changeQty(id, delta) {
  const newQty = (cart[id] || 0) + delta;
  if (newQty <= 0) {
    delete cart[id];
  } else {
    cart[id] = newQty;
  }
  updateCardAction(id);
  updateCartBadge();
  renderCartSidebar();
}

function updateCardAction(id) {
  const actionsEl = document.querySelector(`#card-${id} .product-card__actions`);
  if (!actionsEl) return;
  const inCart = cart[id] || 0;
  if (inCart > 0) {
    actionsEl.innerHTML = `
      <div class="qty-control" id="qty-${id}">
        <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
        <span class="qty-value" id="qval-${id}">${inCart}</span>
        <button class="qty-btn" onclick="changeQty(${id}, +1)">+</button>
      </div>`;
  } else {
    actionsEl.innerHTML = `
      <button class="add-btn" id="addbtn-${id}" onclick="addToCart(${id})">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Agregar
      </button>`;
  }
}

function updateCartBadge() {
  const total = Object.values(cart).reduce((s, q) => s + q, 0);
  const badges = [$('cartBadge'), $('mobileBadge')];
  badges.forEach(b => { if (b) b.textContent = total; });
}

function bumpBadge() {
  const b = $('cartBadge');
  if (!b) return;
  b.classList.remove('bump');
  void b.offsetWidth;
  b.classList.add('bump');
  setTimeout(() => b.classList.remove('bump'), 300);
}

/* ═══════════════════════════════════════════
   CART SIDEBAR RENDER
═══════════════════════════════════════════ */
function renderCartSidebar() {
  const itemsEl  = $('cartItems');
  const emptyEl  = $('cartEmpty');
  const footerEl = $('cartFooter');
  const ids      = Object.keys(cart).filter(id => cart[id] > 0);

  if (!ids.length) {
    emptyEl.style.display  = 'block';
    itemsEl.style.display  = 'none';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display  = 'none';
  itemsEl.style.display  = 'block';
  footerEl.style.display = 'block';

  itemsEl.innerHTML = ids.map(id => {
    const p = PRODUCTS.find(x => x.id === +id);
    if (!p) return '';
    const qty = cart[id];
    return `
      <div class="cart-item" id="citem-${p.id}">
        <div class="cart-item__img" style="background:${p.bg}">${p.emoji}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${p.name}</div>
          <div class="cart-item__brand">${p.brand}</div>
          <div class="cart-item__price">${fmt(p.price * qty)}</div>
        </div>
        <div class="cart-item__qty">
          <button class="cart-qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
          <span class="cart-qty-val">${qty}</span>
          <button class="cart-qty-btn" onclick="changeQty(${p.id}, +1)">+</button>
        </div>
        <button class="cart-item__remove" onclick="removeFromCart(${p.id})" title="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`;
  }).join('');

  updateCartTotals();
}

function removeFromCart(id) {
  delete cart[id];
  updateCardAction(id);
  updateCartBadge();
  renderCartSidebar();
}

function updateCartTotals() {
  const subtotal   = Object.entries(cart).reduce((s, [id, qty]) => {
    const p = PRODUCTS.find(x => x.id === +id);
    return s + (p ? p.price * qty : 0);
  }, 0);
  const delivery   = $('cartDelivery');
  const method     = delivery ? delivery.value : 'zamora';
  const shipping   = (method === 'zamora' && subtotal >= 200) ? 0 : 49;
  const shippingEl = $('cartShipping');
  const shipRow    = $('cartShippingRow');

  $('cartSubtotal').textContent = fmt(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'GRATIS' : fmt(shipping);
  if (shipRow)    shipRow.style.display = 'flex';
  $('cartTotal').textContent = fmt(subtotal + shipping);
}

/* ═══════════════════════════════════════════
   CART OPEN / CLOSE
═══════════════════════════════════════════ */
function openCart() {
  $('cartSidebar').classList.add('open');
  $('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  renderCartSidebar();
}

function closeCart() {
  $('cartSidebar').classList.remove('open');
  $('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════
   CATEGORY FILTER
═══════════════════════════════════════════ */
function setCategory(cat) {
  activecat = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.toggle('cat-pill--active', btn.dataset.cat === cat);
  });
  renderProducts();
  scrollToProducts();
}

function filterByCategory(cat) {
  setCategory(cat);
}

/* ═══════════════════════════════════════════
   HERO CAROUSEL
═══════════════════════════════════════════ */
function goToSlide(idx) {
  const slides = document.querySelectorAll('.hero__slide');
  heroIdx = (idx + slides.length) % slides.length;
  $('heroTrack').style.transform = `translateX(-${heroIdx * 100}%)`;
  document.querySelectorAll('.hero__dot').forEach((d, i) => {
    d.classList.toggle('hero__dot--active', i === heroIdx);
  });
}

function startCarousel() {
  stopCarousel();
  heroTimer = setInterval(() => goToSlide(heroIdx + 1), 5000);
}

function stopCarousel() {
  if (heroTimer) clearInterval(heroTimer);
}

/* ═══════════════════════════════════════════
   TOAST
═══════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ═══════════════════════════════════════════
   SCROLL HELPERS
═══════════════════════════════════════════ */
function scrollToProducts() {
  $('productsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scrollToDelivery() {
  $('deliverySection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function scrollToCategories() {
  $('catNav').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function clearSearch() {
  $('searchInput').value = '';
  searchQ = '';
  activecat = 'all';
  document.querySelectorAll('.cat-pill').forEach(b => {
    b.classList.toggle('cat-pill--active', b.dataset.cat === 'all');
  });
  renderProducts();
}

/* ═══════════════════════════════════════════
   CHECKOUT PLACEHOLDER
═══════════════════════════════════════════ */
function handleCheckout() {
  const total = $('cartTotal').textContent;
  showToast(`✓ Pedido procesado — Total: ${total}`);
  setTimeout(closeCart, 300);
}

/* ═══════════════════════════════════════════
   DRAWER HELPERS
═══════════════════════════════════════════ */
function drawerFilter(cat) {
  setCategory(cat);
  // closeDrawer is defined inside DOMContentLoaded — llamamos directamente
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('active');
  document.getElementById('hamburger').classList.remove('active');
  document.body.style.overflow = '';
}
function drawerScroll(id) {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('active');
  document.getElementById('hamburger').classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}

/* ═══════════════════════════════════════════
   FACTURACIÓN
═══════════════════════════════════════════ */
function handleFactura(e) {
  e.preventDefault();
  const modal = $('facturaModal');
  if (modal) modal.classList.remove('modal-overlay--hidden');
}
function closeFacturaModal() {
  const modal = $('facturaModal');
  if (modal) modal.classList.add('modal-overlay--hidden');
  const form = $('facturaForm');
  if (form) form.reset();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Render initial products
  renderProducts();

  // Category pills
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => setCategory(btn.dataset.cat));
  });

  // Search
  const searchInput = $('searchInput');
  searchInput.addEventListener('input', () => {
    searchQ = searchInput.value.trim();
    renderProducts();
  });
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') scrollToProducts();
  });
  document.querySelector('.search-bar__btn').addEventListener('click', () => {
    searchQ = searchInput.value.trim();
    renderProducts();
    scrollToProducts();
  });

  // Sort
  $('sortSelect').addEventListener('change', e => {
    sortMode = e.target.value;
    renderProducts();
  });

  // Cart open/close
  $('cartBtn').addEventListener('click', openCart);
  $('cartClose').addEventListener('click', closeCart);
  $('cartOverlay').addEventListener('click', closeCart);

  // Cart delivery change → recalc shipping
  $('cartDelivery').addEventListener('change', updateCartTotals);

  // Checkout
  $('checkoutBtn').addEventListener('click', handleCheckout);

  // Hero carousel
  $('heroPrev').addEventListener('click', () => { stopCarousel(); goToSlide(heroIdx - 1); startCarousel(); });
  $('heroNext').addEventListener('click', () => { stopCarousel(); goToSlide(heroIdx + 1); startCarousel(); });
  document.querySelectorAll('.hero__dot').forEach(dot => {
    dot.addEventListener('click', () => { stopCarousel(); goToSlide(+dot.dataset.idx); startCarousel(); });
  });

  // Pause carousel on hover
  const hero = $('hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopCarousel);
    hero.addEventListener('mouseleave', startCarousel);
  }

  startCarousel();

  // ── Hamburger / Drawer ──────────────────────
  const hamburger    = $('hamburger');
  const drawer       = $('drawer');
  const drawerOverlay = $('drawerOverlay');
  const drawerClose  = $('drawerClose');

  function openDrawer() {
    drawer.classList.add('open');
    drawerOverlay.classList.add('active');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Drawer search mirrors main search
  const drawerSearchInput = $('drawerSearch');
  if (drawerSearchInput) {
    drawerSearchInput.addEventListener('input', () => {
      searchQ = drawerSearchInput.value.trim();
      $('searchInput').value = searchQ;
      activecat = 'all';
      document.querySelectorAll('.cat-pill').forEach(b =>
        b.classList.toggle('cat-pill--active', b.dataset.cat === 'all'));
      renderProducts();
      closeDrawer();
      scrollToProducts();
    });
  }

  // Fallback si no están las imágenes del logo
  const logoImg = document.querySelector('.logo__img');
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      logoImg.style.display = 'none';
      const fallback = document.querySelector('.logo__fallback');
      if (fallback) fallback.style.display = 'flex';
    });
  }

  // ── Facturación ─────────────────────────────
  const facturaForm = $('facturaForm');
  if (facturaForm) {
    facturaForm.addEventListener('submit', e => handleFactura(e));
  }

  // Branch region tabs
  document.querySelectorAll('.region-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.region-tab').forEach(t => t.classList.remove('region-tab--active'));
      tab.classList.add('region-tab--active');
      const region = tab.dataset.region;
      $('branchesZamora').style.display = region === 'zamora' ? 'grid' : 'none';
      $('branchesRegion').style.display  = region === 'region'  ? 'block' : 'none';
    });
  });

  // Keyboard: Escape closes cart
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  // Sticky header shrink on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const header = $('header');
    const curr   = window.scrollY;
    if (curr > 80) header.classList.add('header--scrolled');
    else           header.classList.remove('header--scrolled');
    lastScroll = curr;
  }, { passive: true });

  // Touch swipe for hero carousel
  let touchStartX = 0;
  const heroEl = $('hero');
  if (heroEl) {
    heroEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        stopCarousel();
        goToSlide(dx < 0 ? heroIdx + 1 : heroIdx - 1);
        startCarousel();
      }
    }, { passive: true });
  }
});
