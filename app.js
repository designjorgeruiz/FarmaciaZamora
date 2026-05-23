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
  const subtotal  = Object.entries(cart).reduce((s, [id, qty]) => {
    const p = PRODUCTS.find(x => x.id === +id);
    return s + (p ? p.price * qty : 0);
  }, 0);
  const delivery  = $('cartDelivery');
  const method    = delivery ? delivery.value : 'zamora';
  const shipping  = (method === 'zamora' && subtotal >= 200) ? 0 : 49;

  // Cupón — soporta monto fijo y porcentaje
  let discountAmt = 0;
  if (activeCoupon) {
    if (subtotal >= activeCoupon.min) {
      discountAmt = activeCoupon.isPercent
        ? Math.round(subtotal * activeCoupon.discount / 100)
        : activeCoupon.discount;
    } else {
      activeCoupon = null;
      const msgEl = $('couponMsg');
      if (msgEl) { msgEl.textContent = '⚠️ Cupón removido: subtotal insuficiente'; msgEl.className = 'cart-coupon__msg cart-coupon__msg--err'; }
    }
  }

  const discountRow = $('cartDiscountRow');
  const discountEl  = $('cartDiscount');
  if (discountRow) discountRow.style.display = discountAmt > 0 ? 'flex' : 'none';
  if (discountEl)  discountEl.textContent = `-${fmt(discountAmt)}`;

  $('cartSubtotal').textContent = fmt(subtotal);
  const shippingEl = $('cartShipping');
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'GRATIS' : fmt(shipping);
  $('cartTotal').textContent = fmt(Math.max(0, subtotal - discountAmt + shipping));
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
   SISTEMA DE LEALTAD
═══════════════════════════════════════════ */
const LOYALTY_TIERS = [
  { name: 'Bronce',  emoji: '🥉', minPurchases: 1,  maxPurchases: 2,  discount: 5,  color: 'bronze',  nextName: 'Plata',   nextAt: 3  },
  { name: 'Plata',   emoji: '🥈', minPurchases: 3,  maxPurchases: 5,  discount: 10, color: 'silver',  nextName: 'Oro',     nextAt: 6  },
  { name: 'Oro',     emoji: '🥇', minPurchases: 6,  maxPurchases: 11, discount: 15, color: 'gold',    nextName: 'Diamante',nextAt: 12 },
  { name: 'Diamante',emoji: '💎', minPurchases: 12, maxPurchases: Infinity, discount: 20, color: 'diamond', nextName: null, nextAt: null },
];

function getTier(purchases) {
  if (purchases < 1) return null;
  return LOYALTY_TIERS.find(t => purchases >= t.minPurchases && purchases <= t.maxPurchases)
      || LOYALTY_TIERS[LOYALTY_TIERS.length - 1];
}

function generateCode(name, phone, tier) {
  const suffix = phone.slice(-4);
  return `${tier.name.toUpperCase()}-${suffix}`;
}

function loadCustomer() {
  try { return JSON.parse(localStorage.getItem('zam_loyalty') || 'null'); } catch { return null; }
}
function saveCustomer(data) {
  localStorage.setItem('zam_loyalty', JSON.stringify(data));
}

function registerLoyalty(e) {
  e.preventDefault();
  const name  = $('loyaltyName').value.trim();
  const phone = $('loyaltyPhone').value.trim().replace(/\D/g, '');
  if (phone.length < 4) { showToast('⚠️ Ingresa tu teléfono completo'); return; }

  const customer = { name, phone, purchases: 0, totalSpent: 0, joinDate: new Date().toISOString() };
  saveCustomer(customer);
  renderLoyaltyDashboard(customer);
  showToast('🎉 ¡Bienvenido al Club Farmacia Zamora!');
}

function renderLoyaltyDashboard(customer) {
  $('loyaltyRegister').style.display  = 'none';
  $('loyaltyDashboard').style.display = 'block';

  const tier     = getTier(customer.purchases);
  const tierData = tier || { name: 'Sin tier', emoji: '⭐', discount: 0, color: 'bronze', nextName: 'Bronce', nextAt: 1 };
  const code     = tier ? generateCode(customer.name, customer.phone, tier) : null;

  // Card
  const card      = $('loyaltyCard');
  const colorClass = tier ? tierData.color : 'notier';
  card.className  = `loyalty-card loyalty-card--${colorClass}`;
  $('cardName').textContent      = customer.name.toUpperCase();
  $('cardTierBadge').textContent = tier ? `${tierData.emoji} ${tierData.name}` : '⭐ Nuevo miembro';
  $('cardPurchases').textContent = customer.purchases;
  $('cardSpent').textContent     = `$${customer.totalSpent.toFixed(0)}`;
  $('cardDiscount').textContent  = tier ? `${tierData.discount}%` : '—';

  // Code box
  const codeBox = $('loyaltyCode').closest('.loyalty-code-box');
  if (tier && code) {
    if (codeBox) codeBox.classList.remove('loyalty-code-box--pending');
    $('loyaltyCode').textContent     = code;
    $('loyaltyCodeNote').textContent = `${tierData.discount}% de descuento aplicado en tu carrito`;
    COUPONS[code] = { discount: tierData.discount, min: 0, isPercent: true, desc: `¡${tierData.discount}% de descuento Club Farmacia Zamora! ${tierData.emoji}` };
  } else {
    if (codeBox) codeBox.classList.add('loyalty-code-box--pending');
    $('loyaltyCode').textContent     = 'Pendiente de primera compra';
    $('loyaltyCodeNote').textContent = 'Completa tu primera compra y tu código se desbloqueará automáticamente';
  }

  // Progress bar
  const progressBox = $('loyaltyProgress');
  const nextAt      = tierData.nextAt || 1;
  const start       = tier ? tier.minPurchases : 0;
  const progress    = tier
    ? Math.min(((customer.purchases - start) / (nextAt - start)) * 100, 100)
    : 0;
  $('progressLabel').textContent = tier ? `Progreso a ${tierData.nextName}` : `Próximo nivel: 🥉 Bronce`;
  $('progressCount').textContent = `${customer.purchases} / ${nextAt} compras`;
  $('progressFill').style.width  = `${progress}%`;
  const left = nextAt - customer.purchases;
  $('progressTip').textContent   = left > 0
    ? `¡Te ${left === 1 ? 'falta 1 compra' : `faltan ${left} compras`} para ${tier ? `subir a ${tierData.nextName}` : 'desbloquear Bronce y obtener 5% de descuento'}!`
    : `¡Ya eres ${tierData.name}! 🎉`;
  progressBox.style.display = tierData.nextAt ? 'block' : 'none';
}

function copyLoyaltyCode() {
  const code = $('loyaltyCode').textContent;
  if (!code || code.includes('primera')) return;
  navigator.clipboard.writeText(code).then(() => {
    const btn = $('copyLoyaltyBtn');
    btn.classList.add('copied');
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ¡Copiado!`;
    // Pre-fill cart
    const inp = $('couponInput');
    if (inp) inp.value = code;
    showToast(`✓ Código ${code} copiado al carrito`);
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copiar`;
    }, 2500);
  });
}

function recordPurchase(amount) {
  const customer = loadCustomer();
  if (!customer) return;
  customer.purchases  += 1;
  customer.totalSpent += amount;
  saveCustomer(customer);
  renderLoyaltyDashboard(customer);
  // Show tier-up message
  const tier = getTier(customer.purchases);
  if (tier) {
    const prevTier = getTier(customer.purchases - 1);
    if (!prevTier || prevTier.name !== tier.name) {
      setTimeout(() => showToast(`🎉 ¡Subiste a ${tier.emoji} ${tier.name}! Nuevo descuento: ${tier.discount}%`), 800);
    }
  }
}

function resetLoyalty() {
  if (!confirm('¿Seguro que quieres salir de tu cuenta Club Farmacia Zamora?')) return;
  localStorage.removeItem('zam_loyalty');
  $('loyaltyRegister').style.display  = 'block';
  $('loyaltyDashboard').style.display = 'none';
  $('loyaltyForm').reset();
}

function initLoyalty() {
  const customer = loadCustomer();
  if (customer) renderLoyaltyDashboard(customer);
}

/* ═══════════════════════════════════════════
   CUPONES
═══════════════════════════════════════════ */
const COUPONS = {
  'ZAMORA20':  { discount: 20,  min: 150,  desc: '¡$20 de descuento aplicado! 🎉' },
  'ZAMORA30':  { discount: 30,  min: 200,  desc: '¡$30 de descuento aplicado! 🎉' },
  'ZAMORA50':  { discount: 50,  min: 350,  desc: '¡$50 de descuento aplicado! 🎉' },
  'ZAMORA100': { discount: 100, min: 600,  desc: '¡$100 de descuento aplicado! 🎉' },
};

let activeCoupon = null; // { code, discount, min }

function copyCoupon(code, btn) {
  navigator.clipboard.writeText(code).then(() => {
    btn.classList.add('copied');
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ¡Copiado!`;
    showToast(`✓ Código ${code} copiado`);
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copiar`;
    }, 2500);
    // Pre-fill cart coupon input
    const inp = $('couponInput');
    if (inp) inp.value = code;
  }).catch(() => {
    showToast(`Código: ${code}`);
  });
}

function applyCoupon() {
  const input   = $('couponInput');
  const msgEl   = $('couponMsg');
  const code    = input.value.trim().toUpperCase();
  const coupon  = COUPONS[code];

  if (!coupon) {
    msgEl.textContent = '❌ Código no válido o expirado';
    msgEl.className   = 'cart-coupon__msg cart-coupon__msg--err';
    activeCoupon      = null;
    updateCartTotals();
    return;
  }

  const subtotal = Object.entries(cart).reduce((s, [id, qty]) => {
    const p = PRODUCTS.find(x => x.id === +id);
    return s + (p ? p.price * qty : 0);
  }, 0);

  if (subtotal < coupon.min) {
    msgEl.textContent = `❌ Compra mínima de $${coupon.min} para usar este cupón (te faltan $${(coupon.min - subtotal).toFixed(0)})`;
    msgEl.className   = 'cart-coupon__msg cart-coupon__msg--err';
    activeCoupon      = null;
    updateCartTotals();
    return;
  }

  activeCoupon      = { code, ...coupon };
  msgEl.textContent = coupon.desc;
  msgEl.className   = 'cart-coupon__msg cart-coupon__msg--ok';
  updateCartTotals();
}

/* ═══════════════════════════════════════════
   CHECKOUT PLACEHOLDER
═══════════════════════════════════════════ */
function handleCheckout() {
  const total    = $('cartTotal').textContent;
  const subtotal = Object.entries(cart).reduce((s, [id, qty]) => {
    const p = PRODUCTS.find(x => x.id === +id);
    return s + (p ? p.price * qty : 0);
  }, 0);
  cart         = {};
  activeCoupon = null;
  updateCartBadge();
  renderCartSidebar();
  const inp = $('couponInput');
  if (inp) { inp.value = ''; }
  const msg = $('couponMsg');
  if (msg)  { msg.textContent = ''; }
  closeCart();
  showToast(`✓ ¡Pedido realizado! Total: ${total}`);
  recordPurchase(subtotal);
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
   BRANCH DATA
═══════════════════════════════════════════ */
const BRANCHES_ZAMORA = [
  { id: 'elvalle',    name: 'El Valle',            tag: 'Zamora',        super: false, address: 'Av. Juárez #543, Col. El Valle, CP 59650',                      phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Av.+Juárez+543,+Col.+El+Valle,+Zamora,+Michoacán',                  amaps: 'https://maps.apple.com/?q=Av.+Juárez+543,+Col.+El+Valle,+Zamora,+Michoacán' },
  { id: 'jardinadas', name: 'Jardinadas',           tag: 'Zamora',        super: false, address: 'Calle Dr. Alonso Martínez #683, Col. Jardinadas, CP 59680',      phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Calle+Dr.+Alonso+Martínez+683,+Col.+Jardinadas,+Zamora,+Michoacán', amaps: 'https://maps.apple.com/?q=Calle+Dr.+Alonso+Martínez+683,+Col.+Jardinadas,+Zamora,+Michoacán' },
  { id: 'catedral',   name: 'Jardines de Catedral', tag: 'Zamora',        super: false, address: 'Calle Circunvalación #184, Col. Jardines de Catedral, CP 59600',  phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Circunvalación+184,+Col.+Jardines+de+Catedral,+Zamora,+Michoacán',   amaps: 'https://maps.apple.com/?q=Circunvalación+184,+Col.+Jardines+de+Catedral,+Zamora,+Michoacán' },
  { id: 'vasco',      name: 'Vasco de Quiroga',     tag: 'Zamora Centro', super: false, address: 'Calle Vasco de Quiroga #107, Col. Centro, CP 59600',              phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Vasco+de+Quiroga+107,+Col.+Centro,+Zamora,+Michoacán',               amaps: 'https://maps.apple.com/?q=Vasco+de+Quiroga+107,+Col.+Centro,+Zamora,+Michoacán' },
  { id: 'madero',     name: 'Madero',               tag: 'Zamora Centro', super: false, address: 'Av. Juárez #9 Oriente, Col. Centro, CP 59600',                    phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Av.+Juárez+9+Oriente,+Col.+Centro,+Zamora,+Michoacán',               amaps: 'https://maps.apple.com/?q=Av.+Juárez+9+Oriente,+Col.+Centro,+Zamora,+Michoacán' },
  { id: 'noviembre',  name: '20 de Noviembre',      tag: 'Zamora',        super: false, address: 'Calle 20 de Noviembre #450, Zamora, CP 59660',                    phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Calle+20+de+Noviembre+450,+Zamora,+Michoacán',                    amaps: 'https://maps.apple.com/?q=Calle+20+de+Noviembre+450,+Zamora,+Michoacán' },
  { id: 'aquiles',    name: 'Aquiles Serdán',       tag: 'Zamora Centro', super: false, address: 'Calle Aquiles Serdán #285, Col. Centro, CP 59600',                 phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Aquiles+Serdán+285,+Col.+Centro,+Zamora,+Michoacán',               amaps: 'https://maps.apple.com/?q=Aquiles+Serdán+285,+Col.+Centro,+Zamora,+Michoacán' },
  { id: 'super',      name: 'Super Zamora',         tag: 'Superfarmacia', super: true,  address: 'Calle Martínez de Navarrete #25, Col. Jardinadas, CP 59680',       phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Martínez+de+Navarrete+25,+Col.+Jardinadas,+Zamora,+Michoacán',      amaps: 'https://maps.apple.com/?q=Martínez+de+Navarrete+25,+Col.+Jardinadas,+Zamora,+Michoacán' },
  { id: 'calvario',   name: 'El Calvario',          tag: 'Zamora Centro', super: false, address: 'Calle Hidalgo #21-B, Col. Centro, CP 59600',                       phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Calle+Hidalgo+21-B,+Col.+Centro,+Zamora,+Michoacán',               amaps: 'https://maps.apple.com/?q=Calle+Hidalgo+21-B,+Col.+Centro,+Zamora,+Michoacán' },
  { id: 'sanjose',    name: 'San José',             tag: 'Zamora',        super: false, address: 'Av. 5 de Mayo #151, Col. Centro, CP 59699',                        phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Av.+5+de+Mayo+151,+Col.+Centro,+Zamora,+Michoacán',                amaps: 'https://maps.apple.com/?q=Av.+5+de+Mayo+151,+Col.+Centro,+Zamora,+Michoacán' },
  { id: 'arboledas',  name: 'Arboledas',            tag: 'Zamora',        super: false, address: 'Av. del Árbol #1053, Col. Arboledas, CP 59698',                    phone: '351-690-6500', gmaps: 'https://maps.google.com/?q=Av.+del+Árbol+1053,+Col.+Arboledas,+Zamora,+Michoacán',            amaps: 'https://maps.apple.com/?q=Av.+del+Árbol+1053,+Col.+Arboledas,+Zamora,+Michoacán' },
];

const BRANCHES_REGION = [
  { name: 'Jacona',          state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Jacona,+Michoacán' },
  { name: 'Los Reyes',       state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Los+Reyes,+Michoacán' },
  { name: 'La Piedad',       state: 'Michoacán',  branches: 3, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+La+Piedad,+Michoacán' },
  { name: 'Peribán',         state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Peribán,+Michoacán' },
  { name: 'Tingüindín',      state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Tingüindín,+Michoacán' },
  { name: 'Zacapu',          state: 'Michoacán',  branches: 2, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Zacapu,+Michoacán' },
  { name: 'Churintzio',      state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Churintzio,+Michoacán' },
  { name: 'Purépero',        state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Purépero,+Michoacán' },
  { name: 'Chilchota',       state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Chilchota,+Michoacán' },
  { name: 'Tangancícuaro',   state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Tangancícuaro,+Michoacán' },
  { name: 'Chavinda',        state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Chavinda,+Michoacán' },
  { name: 'Ario de Rosales', state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Ario+de+Rosales,+Michoacán' },
  { name: 'Vista Hermosa',   state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Vista+Hermosa,+Michoacán' },
  { name: 'La Barca',        state: 'Jalisco',    branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+La+Barca,+Jalisco' },
  { name: 'Santa Clara',     state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Santa+Clara,+Michoacán' },
  { name: 'Yurécuaro',       state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Yurécuaro,+Michoacán' },
  { name: 'Pénjamo',         state: 'Guanajuato', branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Pénjamo,+Guanajuato' },
  { name: 'Ocampo',          state: 'Michoacán',  branches: 1, gmaps: 'https://maps.google.com/?q=Farmacia+Zamora,+Ocampo,+Michoacán' },
];

const PIN_SVG  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const TEL_SVG  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.07 12a19.79 19.79 0 01-3.07-8.63A2 2 0 013 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`;
const CHEV_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`;

function renderBranches() {
  // ── Zamora list ──────────────────────────
  const list = $('branchListZamora');
  if (!list) return;
  list.innerHTML = BRANCHES_ZAMORA.map((b, i) => `
    <div class="blist-item${b.super ? ' blist-item--super' : ''}" data-idx="${i}" onclick="selectBranch(${i})">
      <div class="blist-dot${b.super ? ' blist-dot--super' : ''}"></div>
      <div class="blist-info">
        <span class="blist-name">${b.name}</span>
        <span class="blist-addr">${b.tag}</span>
      </div>
      ${CHEV_SVG}
    </div>
  `).join('');

  // Auto-select first
  selectBranch(0);

  // ── Region pills ──────────────────────────
  const pills = $('branchesRegion');
  if (!pills) return;
  pills.innerHTML = BRANCHES_REGION.map(r => `
    <a class="region-pill" href="${r.gmaps}" target="_blank" rel="noopener">
      ${PIN_SVG}
      <span class="region-pill__name">${r.name}</span>
      ${r.branches > 1 ? `<span class="region-pill__count">${r.branches}</span>` : ''}
    </a>
  `).join('');
}

function selectBranch(idx) {
  const b = BRANCHES_ZAMORA[idx];
  if (!b) return;

  // Highlight list item
  document.querySelectorAll('.blist-item').forEach((el, i) => {
    el.classList.toggle('blist-item--active', i === idx);
  });

  // Render detail panel
  $('branchDetail').innerHTML = `
    <div class="bdetail">
      <div class="bdetail__eyebrow${b.super ? ' bdetail__eyebrow--super' : ''}">${b.super ? '🏬 Superfarmacia' : '🏪 Farmacia'}</div>
      <h3 class="bdetail__name">${b.name}</h3>
      <div class="bdetail__info">
        <div class="bdetail__row">${PIN_SVG}<span>${b.address}</span></div>
        <div class="bdetail__row">${TEL_SVG}<span>${b.phone}</span></div>
      </div>
      <div class="bdetail__maps">
        <a class="bdetail__mapbtn bdetail__mapbtn--google" href="${b.gmaps}" target="_blank" rel="noopener">
          ${PIN_SVG} Google Maps
        </a>
        <a class="bdetail__mapbtn bdetail__mapbtn--apple" href="${b.amaps}" target="_blank" rel="noopener">
          ${PIN_SVG} Apple Maps
        </a>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Render initial products
  renderProducts();

  // Inicializar sistema de lealtad
  initLoyalty();

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

  // Branch region tabs + render
  renderBranches();
  document.querySelectorAll('.region-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.region-tab').forEach(t => t.classList.remove('region-tab--active'));
      tab.classList.add('region-tab--active');
      const region = tab.dataset.region;
      $('branchesZamora').style.display = region === 'zamora' ? 'grid' : 'none';
      $('branchesRegion').style.display  = region === 'region'  ? 'flex' : 'none';
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
