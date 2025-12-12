/* LeGifte - script.js
   Features:
   - Product listing
   - Product modal (colors, quantity, extra request)
   - Cart (localStorage)
   - Wishlist (localStorage)
   - Similar products
   - UPI checkout link generator
*/

/* ---------- SAMPLE PRODUCTS - Customize these (images, price, colors, category) ---------- */
const PRODUCTS = [
  {
    id: 1,
    name: "Customized Gift Box",
    price: 499,
    imgs: ["https://via.placeholder.com/600x400?text=Gift+Box+1"],
    colors: ["Red", "Pink", "White"],
    category: "box",
    desc: "Beautiful customized gift box with ribbons and card."
  },
  {
    id: 2,
    name: "Rose Teddy Gift",
    price: 399,
    imgs: ["https://via.placeholder.com/600x400?text=Rose+Teddy"],
    colors: ["Pink", "Brown"],
    category: "teddy",
    desc: "Soft teddy with artificial roses - perfect for anniversaries."
  },
  {
    id: 3,
    name: "Couple Photo Frame",
    price: 599,
    imgs: ["https://via.placeholder.com/600x400?text=Photo+Frame"],
    colors: ["Black", "White"],
    category: "frame",
    desc: "Personalized couple frame - add your photo."
  },
  {
    id: 4,
    name: "Chocolate Combo",
    price: 349,
    imgs: ["https://via.placeholder.com/600x400?text=Chocolates"],
    colors: ["Brown"],
    category: "chocolate",
    desc: "Assorted chocolate hamper."
  },
  {
    id: 5,
    name: "Personalized Mug",
    price: 299,
    imgs: ["https://via.placeholder.com/600x400?text=Mug"],
    colors: ["White", "Black"],
    category: "custom",
    desc: "Custom print mug - upload photo or text."
  }
];

/* ---------- UTIL: localStorage helpers ---------- */
const LS_CART = "lg_cart_v1";
const LS_WL = "lg_wishlist_v1";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(LS_CART)) || [];
  } catch (e) { return []; }
}
function writeCart(data) {
  localStorage.setItem(LS_CART, JSON.stringify(data));
}
function readWishlist() {
  try {
    return JSON.parse(localStorage.getItem(LS_WL)) || [];
  } catch (e) { return []; }
}
function writeWishlist(data) {
  localStorage.setItem(LS_WL, JSON.stringify(data));
}

/* ---------- RENDERING ---------- */
function renderHeader() {
  // Create simple header with buttons for cart & wishlist
  const existing = document.getElementById("lg-header");
  if (existing) return;
  const header = document.createElement("header");
  header.id = "lg-header";
  header.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#ff4d79;color:#fff;">
      <div style="font-weight:700;font-size:20px">Le Gift'e</div>
      <div style="display:flex;gap:10px;align-items:center">
        <button id="lg-wish-btn" title="Wishlist" style="background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer">♡ <span id="lg-wl-count">0</span></button>
        <button id="lg-cart-btn" title="Cart" style="background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer">🛒 <span id="lg-cart-count">0</span></button>
      </div>
    </div>
  `;
  document.body.prepend(header);

  document.getElementById("lg-cart-btn").addEventListener("click", () => toggleCartDrawer(true));
  document.getElementById("lg-wish-btn").addEventListener("click", () => showWishlistModal());
}

/* product grid renderer */
function renderProducts(products = PRODUCTS) {
  const container = document.getElementById("product-list");
  if (!container) {
    console.error("Add <div id='product-list'></div> to your index.html");
    return;
  }
  container.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "lg-product-card";
    card.style = `
      background:#fff;padding:12px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.06);
      text-align:center;
    `;
    card.innerHTML = `
      <img src="${p.imgs[0]}" alt="${p.name}" style="width:100%;height:160px;object-fit:cover;border-radius:8px;">
      <h3 style="margin:10px 0 6px">${p.name}</h3>
      <p style="margin:0;color:#666">₹${p.price}</p>
      <div style="margin-top:10px;display:flex;gap:8px;justify-content:center">
        <button class="lg-view-btn" data-id="${p.id}" style="padding:8px 10px;border-radius:8px;border:0;background:#ff4d79;color:#fff;cursor:pointer">View</button>
        <button class="lg-wish-small" data-id="${p.id}" title="Add to wishlist" style="padding:8px 10px;border-radius:8px;border:1px solid #ff4d79;background:transparent;color:#ff4d79;cursor:pointer">♡</button>
      </div>
    `;
    container.appendChild(card);
  });

  // attach view listeners
  document.querySelectorAll(".lg-view-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = Number(btn.dataset.id);
      openProductModal(id);
    });
  });
  document.querySelectorAll(".lg-wish-small").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      toggleWishlist(id);
    });
  });
  updateHeaderCounts();
}

/* ---------- PRODUCT MODAL ---------- */
function openProductModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  // remove existing modal
  const existing = document.getElementById("lg-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "lg-modal";
  modal.style = `
    position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;
    z-index:9999;padding:20px;
  `;
  modal.innerHTML = `
    <div style="width:100%;max-width:900px;background:#fff;border-radius:12px;overflow:hidden;">
      <div style="display:flex;gap:0;flex-wrap:wrap;">
        <div style="flex:1;min-width:280px;padding:18px;">
          <img id="lg-main-img" src="${p.imgs[0]}" style="width:100%;height:320px;object-fit:cover;border-radius:8px;">
          <div id="lg-thumb-row" style="display:flex;gap:8px;margin-top:8px"></div>
        </div>
        <div style="flex:1;min-width:260px;padding:18px;">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h2 style="margin:0">${p.name}</h2>
            <button id="lg-close-modal" style="border:0;background:transparent;font-size:18px;cursor:pointer">✖</button>
          </div>
          <p style="color:#999;margin-top:6px">${p.desc || ""}</p>
          <p style="font-weight:700;margin-top:10px">₹${p.price}</p>

          <div style="margin-top:12px">
            <label style="font-weight:600">Color</label>
            <div id="lg-color-row" style="display:flex;gap:8px;margin-top:6px"></div>
          </div>

          <div style="margin-top:12px">
            <label style="font-weight:600">Quantity</label>
            <div style="margin-top:6px">
              <input id="lg-qty" type="number" value="1" min="1" style="width:80px;padding:8px;border-radius:8px;border:1px solid #ddd">
            </div>
          </div>

          <div style="margin-top:12px">
            <label style="font-weight:600">Additional request</label>
            <textarea id="lg-extra" placeholder='e.g. "Add small card: Happy Birthday"' style="width:100%;height:70px;margin-top:6px;padding:8px;border-radius:8px;border:1px solid #ddd"></textarea>
          </div>

          <div style="display:flex;gap:8px;margin-top:14px">
            <button id="lg-add-cart" style="flex:1;padding:10px;border-radius:10px;border:0;background:#000;color:#fff;cursor:pointer">Add to cart</button>
            <button id="lg-buy-now" style="flex:1;padding:10px;border-radius:10px;border:1px solid #ff4d79;background:#ff4d79;color:#fff;cursor:pointer">Buy Now</button>
          </div>

          <div style="margin-top:12px">
            <h4 style="margin:0 0 8px 0">Similar products</h4>
            <div id="lg-similar" style="display:flex;gap:8px;flex-wrap:wrap"></div>
          </div>

        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // thumbs
  const thumbRow = document.getElementById("lg-thumb-row");
  p.imgs.forEach(src => {
    const t = document.createElement("img");
    t.src = src;
    t.style = "width:60px;height:50px;object-fit:cover;border-radius:6px;cursor:pointer";
    t.addEventListener("click", () => document.getElementById("lg-main-img").src = src);
    thumbRow.appendChild(t);
  });

  // colors
  const colorRow = document.getElementById("lg-color-row");
  let selectedColor = p.colors[0] || "";
  p.colors.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c;
    btn.style = `padding:6px 10px;border-radius:8px;border:1px solid #ddd;background:${selectedColor===c? '#ff4d79':'transparent'};color:${selectedColor===c? '#fff':'#333'};cursor:pointer`;
    btn.addEventListener("click", () => {
      selectedColor = c;
      // refresh color highlight
      Array.from(colorRow.children).forEach(ch => {
        ch.style.background = (ch.innerText===c) ? '#ff4d79':'transparent';
        ch.style.color = (ch.innerText===c) ? '#fff':'#333';
      });
    });
    colorRow.appendChild(btn);
  });

  document.getElementById("lg-close-modal").addEventListener("click", () => modal.remove());

  // Add to cart
  document.getElementById("lg-add-cart").addEventListener("click", () => {
    const qty = Math.max(1, parseInt(document.getElementById("lg-qty").value || 1));
    const extra = document.getElementById("lg-extra").value || "";
    addToCart(p.id, selectedColor, qty, extra);
    modal.remove();
    toggleCartDrawer(true);
  });

  // Buy now -> direct UPI link for the amount of 1 qty (you may want to adjust)
  document.getElementById("lg-buy-now").addEventListener("click", () => {
    const qty = Math.max(1, parseInt(document.getElementById("lg-qty").value || 1));
    const amount = p.price * qty;
    // Replace YOURUPI@bank with your UPI id
    const upi = `upi://pay?pa=YOURUPI@bank&pn=LeGifte&am=${amount}&cu=INR`;
    // open deep link (works on mobile where UPI apps exist)
    window.location.href = upi;
  });

  // similar products
  const sim = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0,4);
  const simDiv = document.getElementById("lg-similar");
  if (sim.length===0) simDiv.innerHTML = "<small style='color:#777'>No similar products</small>";
  sim.forEach(s => {
    const d = document.createElement("div");
    d.style = "width:110px;background:#fafafa;padding:8px;border-radius:8px;cursor:pointer";
    d.innerHTML = `<img src="${s.imgs[0]}" style="width:100%;height:60px;object-fit:cover;border-radius:6px"><div style="font-size:13px;margin-top:6px">${s.name}</div><div style="color:#999;font-size:12px">₹${s.price}</div>`;
    d.addEventListener("click", () => {
      modal.remove();
      openProductModal(s.id);
    });
    simDiv.appendChild(d);
  });
}

/* ---------- CART & WISHLIST LOGIC ---------- */
function addToCart(productId, color, qty, extra) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const cart = readCart();
  // if same product+color exists, increase qty
  const existing = cart.find(i => i.id === productId && i.color === color && i.extra === extra);
  if (existing) {
    existing.qty = Number(existing.qty) + Number(qty);
  } else {
    cart.push({ id: p.id, name: p.name, price: p.price, color: color, qty: Number(qty), extra: extra, img: p.imgs[0] });
  }
  writeCart(cart);
  updateHeaderCounts();
}

function toggleWishlist(productId) {
  const wl = readWishlist();
  const exists = wl.find(x => x.id === productId);
  if (exists) {
    const newwl = wl.filter(x => x.id !== productId);
    writeWishlist(newwl);
  } else {
    const p = PRODUCTS.find(x => x.id === productId);
    if (p) {
      wl.push({ id: p.id, name: p.name, img: p.imgs[0], price: p.price });
      writeWishlist(wl);
    }
  }
  updateHeaderCounts();
  // small visual feedback
  alert("Wishlist updated");
}

/* ---------- CART DRAWER UI ---------- */
function createCartDrawer() {
  if (document.getElementById("lg-cart-drawer")) return;
  const d = document.createElement("div");
  d.id = "lg-cart-drawer";
  d.style = `
    position:fixed;right:0;top:0;height:100vh;width:360px;max-width:92%;background:#fff;box-shadow:-6px 0 18px rgba(0,0,0,0.12);z-index:9998;
    transform:translateX(100%);transition:transform .28s ease;
  `;
  d.innerHTML = `
    <div style="padding:16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eee">
      <h3 style="margin:0">Cart</h3>
      <button id="lg-close-cart" style="border:0;background:transparent;font-size:18px;cursor:pointer">✖</button>
    </div>
    <div id="lg-cart-items" style="padding:12px;overflow:auto;height:calc(100vh - 190px)"></div>
    <div style="padding:12px;border-top:1px solid #eee">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><strong>Total</strong><strong id="lg-cart-total">₹0</strong></div>
      <button id="lg-checkout-upi" style="width:100%;padding:10px;border-radius:8px;border:0;background:#ff4d79;color:#fff;cursor:pointer">Checkout (UPI)</button>
      <button id="lg-clear-cart" style="margin-top:8px;width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;background:transparent;cursor:pointer">Clear cart</button>
    </div>
  `;
  document.body.appendChild(d);

  document.getElementById("lg-close-cart").addEventListener("click", () => toggleCartDrawer(false));
  document.getElementById("lg-clear-cart").addEventListener("click", () => {
    if (confirm("Clear cart?")) { writeCart([]); renderCartItems(); updateHeaderCounts(); }
  });
  document.getElementById("lg-checkout-upi").addEventListener("click", () => {
    startUPICheckout();
  });
}

function toggleCartDrawer(open = true) {
  createCartDrawer();
  const d = document.getElementById("lg-cart-drawer");
  if (!d) return;
  if (open) {
    d.style.transform = "translateX(0)";
    renderCartItems();
  } else {
    d.style.transform = "translateX(100%)";
  }
}

function renderCartItems() {
  const itemsDiv = document.getElementById("lg-cart-items");
  const cart = readCart();
  itemsDiv.innerHTML = "";
  if (cart.length === 0) {
    itemsDiv.innerHTML = `<div style="padding:12px;color:#777">Your cart is empty</div>`;
  } else {
    cart.forEach((c, idx) => {
      const row = document.createElement("div");
      row.style = "display:flex;gap:8px;padding:8px;border-bottom:1px solid #f0f0f0;align-items:center";
      row.innerHTML = `
        <img src="${c.img}" style="width:66px;height:66px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <div style="font-weight:600">${c.name}</div>
          <div style="color:#777;font-size:13px">Color: ${c.color || '-'}</div>
          <div style="color:#777;font-size:13px">Extra: ${c.extra || '-'}</div>
          <div style="margin-top:6px;display:flex;gap:6px;align-items:center">
            <input type="number" min="1" value="${c.qty}" data-idx="${idx}" class="lg-cart-qty" style="width:64px;padding:6px;border-radius:6px;border:1px solid #ddd">
            <button data-idx="${idx}" class="lg-remove" style="padding:6px;border-radius:6px;border:1px solid #eee;background:transparent;cursor:pointer">Remove</button>
          </div>
        </div>
        <div style="font-weight:600">₹${c.price * c.qty}</div>
      `;
      itemsDiv.appendChild(row);
    });
    // attach listeners
    document.querySelectorAll(".lg-cart-qty").forEach(i => {
      i.addEventListener("change", (e) => {
        const idx = Number(e.target.dataset.idx);
        let val = Math.max(1, Number(e.target.value || 1));
        const cart = readCart();
        cart[idx].qty = val;
        writeCart(cart);
        renderCartItems();
        updateHeaderCounts();
      });
    });
    document.querySelectorAll(".lg-remove").forEach(b => {
      b.addEventListener("click", () => {
        const idx = Number(b.dataset.idx);
        const cart = readCart();
        cart.splice(idx, 1);
        writeCart(cart);
        renderCartItems();
        updateHeaderCounts();
      });
    });
  }
  // total
  const total = readCart().reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("lg-cart-total").innerText = "₹" + total;
  document.getElementById("lg-cart-count")?.remove(); // safe
}

/* ---------- WISHLIST UI ---------- */
function showWishlistModal() {
  const wl = readWishlist();
  // simple modal
  const existing = document.getElementById("lg-wl-modal");
  if (existing) existing.remove();
  const m = document.createElement("div");
  m.id = "lg-wl-modal";
  m.style = `position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px`;
  m.innerHTML = `
    <div style="width:100%;max-width:560px;background:#fff;border-radius:10px;overflow:hidden;">
      <div style="padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eee">
        <h3 style="margin:0">Wishlist</h3>
        <button id="lg-wl-close" style="border:0;background:transparent;font-size:18px;cursor:pointer">✖</button>
      </div>
      <div style="padding:12px" id="lg-wl-contents"></div>
    </div>
  `;
  document.body.appendChild(m);
  document.getElementById("lg-wl-close").addEventListener("click", () => m.remove());
  const cont = document.getElementById("lg-wl-contents");
  if (wl.length === 0) cont.innerHTML = `<div style="color:#777">No items in wishlist</div>`;
  else {
    wl.forEach((w, idx) => {
      const r = document.createElement("div");
      r.style = "display:flex;gap:8px;padding:8px;border-bottom:1px solid #f5f5f5;align-items:center";
      r.innerHTML = `<img src="${w.img}" style="width:70px;height:60px;object-fit:cover;border-radius:8px"><div style="flex:1"><div style="font-weight:600">${w.name}</div><div style="color:#777">₹${w.price}</div></div><div style='display:flex;flex-direction:column;gap:6px'><button data-idx="${idx}" class="lg-wl-move" style="padding:6px;border-radius:8px;border:0;background:#ff4d79;color:#fff;cursor:pointer">Add to cart</button><button data-idx="${idx}" class="lg-wl-remove" style="padding:6px;border-radius:8px;border:1px solid #ccc;background:transparent;cursor:pointer">Remove</button></div>`;
      cont.appendChild(r);
    });
    document.querySelectorAll(".lg-wl-move").forEach(b => {
      b.addEventListener("click", () => {
        const idx = Number(b.dataset.idx);
        const wl = readWishlist();
        const item = wl[idx];
        addToCart(item.id, item.color || "", 1, "");
        // remove from wishlist
        wl.splice(idx,1);
        writeWishlist(wl);
        showWishlistModal();
        updateHeaderCounts();
        toggleCartDrawer(true);
      });
    });
    document.querySelectorAll(".lg-wl-remove").forEach(b => {
      b.addEventListener("click", () => {
        const idx = Number(b.dataset.idx);
        const wl = readWishlist();
        wl.splice(idx,1);
        writeWishlist(wl);
        showWishlistModal();
        updateHeaderCounts();
      });
    });
  }
}

/* ---------- CHECKOUT (UPI) ---------- */
function startUPICheckout() {
  const cart = readCart();
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  // Replace YOURUPI@bank with your actual UPI id
  const upiId = "YOURUPI@bank";
  const payeeName = encodeURIComponent("Le Gifte");
  const amount = total.toString();
  const deep = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${payeeName}&am=${amount}&cu=INR&tn=${encodeURIComponent("LeGifte order")}`;
  // open on mobile
  if (confirm(`Total ₹${amount}\nClick OK to open UPI app for payment (mobile only).`)) {
    window.location.href = deep;
  }
}

/* ---------- HEADER COUNTS ---------- */
function updateHeaderCounts() {
  const cart = readCart();
  const wl = readWishlist();
  document.getElementById("lg-cart-count")?.remove();
  document.getElementById("lg-wl-count")?.innerText = wl.length;
  // update cart count in header by adding small bubble
  const cartBtn = document.getElementById("lg-cart-btn");
  if (cartBtn) {
    const existing = document.getElementById("lg-cart-count");
    if (existing) existing.innerText = cart.length;
  }
}

/* ---------- INIT ---------- */
function initLeGifte() {
  renderHeader();
  renderProducts();
  createCartDrawer();
  updateHeaderCounts();
  // add some base CSS (insert into head)
  if (!document.getElementById("lg-base-css")) {
    const css = document.createElement("style");
    css.id = "lg-base-css";
    css.innerHTML = `
      body { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#fafafa; margin:0; padding:0; color:#222 }
      #product-list { padding:18px; display:grid; gap:16px; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); }
      .lg-product-card h3 { font-size:16px; margin:8px 0 4px; }
      .lg-product-card p { margin:0;color:#777 }
      @media (max-width:720px) { #lg-header div:first-child {font-size:18px} }
    `;
    document.head.appendChild(css);
  }
}

/* Run on DOM ready */
document.addEventListener("DOMContentLoaded", initLeGifte);
