/* ================= LeGifte SAFE script.js ================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Mini Hamper",
    price: 599,
    imgs: ["images/mini-hamper-1.jpg", "images/mini-hamper-2.jpg"],
    customizable: true
  },
  {
    id: 2,
    name: "Make Up Bouquet",
    price: 999,
    imgs: ["images/makeup-bouquet.jpg"],
    customizable: false
  },
  {
    id: 3,
    name: "12 Beauty Products Hamper",
    price: 1299,
    imgs: ["images/beauty-hamper-12.jpg"],
    customizable: true
  },
  {
    id: 4,
    name: "Mini 6 Beauty Item Cup Hamper",
    price: 299,
    imgs: ["images/cup-hamper-1.jpg", "images/cup-hamper-2.jpg"],
    customizable: true
  },
  {
    id: 5,
    name: "Men Customizable Hamper",
    price: 2999,
    imgs: ["images/men-hamper-1.jpg", "images/men-hamper-2.jpg"],
    customizable: true
  }
];

const CART_KEY = "legifte_cart";
const WISHLIST_KEY = "legifte_wishlist";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
function saveCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
}

function getWishlist() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}
function saveWishlist(w) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(w));
}

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  list.innerHTML = "";

  PRODUCTS.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    const img = document.createElement("img");
    img.src = p.imgs[0];
    img.alt = p.name;

    const h3 = document.createElement("h3");
    h3.textContent = p.name;

    const price = document.createElement("p");
    price.textContent = "₹" + p.price;

    const buyBtn = document.createElement("button");
    buyBtn.textContent = "Buy Now";
    buyBtn.onclick = () => openProduct(p.id);

    const wishBtn = document.createElement("button");
    wishBtn.textContent = "❤ Wishlist";
    wishBtn.onclick = () => addToWishlist(p.id);

    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(price);
    div.appendChild(buyBtn);
    div.appendChild(wishBtn);

    list.appendChild(div);
  });
}

/* ---------- PRODUCT MODAL ---------- */
function openProduct(id) {
  closeModal();
  const p = PRODUCTS.find(x => x.id === id);

  const modal = document.createElement("div");
  modal.id = "modal";
  modal.className = "modal";

  const box = document.createElement("div");
  box.className = "modal-box";

  box.innerHTML = `
    <h2>${p.name}</h2>
    <p><b>₹${p.price}</b></p>
    ${p.customizable ? '<textarea id="giftMsg" placeholder="Gift message (optional)"></textarea>' : ''}
    <button id="orderNow">Order Now</button>
    <button onclick="closeModal()">Close</button>
  `;

  modal.appendChild(box);
  document.body.appendChild(modal);

  document.getElementById("orderNow").onclick = () => proceedOrder(p);
}

function closeModal() {
  const m = document.getElementById("modal");
  if (m) m.remove();
}

/* ---------- ORDER ---------- */
function proceedOrder(p) {
  const msg = document.getElementById("giftMsg")?.value || "";

  const cart = getCart();
  cart.push({
    id: p.id,
    name: p.name,
    price: p.price,
    message: msg
  });
  saveCart(cart);

  closeModal();
  openPayment(p.price);
}

/* ---------- PAYMENT ---------- */
function openPayment(amount) {
  const upi = upi://pay?pa=9431541689@ibl&pn=LeGifte&am=${amount}&cu=INR;
  window.location.href = upi;

  setTimeout(() => {
    alert("After payment, please send screenshot on WhatsApp to confirm order.");
    window.open("https://wa.me/919431541689", "_blank");
  }, 1500);
}

/* ---------- WISHLIST ---------- */
function addToWishlist(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const wl = getWishlist();

  if (!wl.find(x => x.id === id)) {
    wl.push(p);
    saveWishlist(wl);
    alert("Added to wishlist");
  }
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderProducts);
