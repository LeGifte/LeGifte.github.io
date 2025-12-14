/* ================= LeGifte FINAL SCRIPT ================= */

/* ---------- PRODUCTS ---------- */
const PRODUCTS = [
  {
    id: 1,
    name: "Mini Hamper",
    price: 599,
    imgs: ["images/mini-hamper-1.jpg","images/mini-hamper-2.jpg"],
    customizable: true
  },
  {
    id: 2,
    name: "Make Up Bouquet",
    price: 999,
    imgs: ["images/makeup-bouquet-1.jpg"],
    customizable: false
  },
  {
    id: 3,
    name: "12 Beauty Products Hamper",
    price: 1299,
    imgs: ["images/beauty-hamper-12-1.jpg"],
    customizable: true
  },
  {
    id: 4,
    name: "Mini 6 Beauty Item Cup Hamper",
    price: 299,
    imgs: ["images/cup-hamper-1.jpg","images/cup-hamper-2.jpg"],
    customizable: true
  },
  {
    id: 5,
    name: "Men Customizable Hamper",
    price: 2999,
    imgs: ["images/men-hamper-1.jpg"],
    customizable: true
  }
];

/* ---------- STORAGE KEYS ---------- */
const CART_KEY = "legifte_cart";
const WISHLIST_KEY = "legifte_wishlist";
const ORDER_KEY = "legifte_orders";

/* ---------- TEMP ORDER ---------- */
let CURRENT_ORDER = {};

/* ---------- HELPERS ---------- */
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY)) || [];
const saveCart = c => localStorage.setItem(CART_KEY, JSON.stringify(c));

const getWishlist = () => JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
const saveWishlist = w => localStorage.setItem(WISHLIST_KEY, JSON.stringify(w));

const getOrders = () => JSON.parse(localStorage.getItem(ORDER_KEY)) || [];
const saveOrders = o => localStorage.setItem(ORDER_KEY, JSON.stringify(o));

const orderId = () => "LG-" + Date.now();

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts() {
  const box = document.getElementById("product-list");
  if (!box) return;
  box.innerHTML = "";

  PRODUCTS.forEach(p => {
    box.innerHTML += `
      <div class="product">
        <img src="${p.imgs[0]}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="buyNow(${p.id})">Buy Now</button>
        <button onclick="addToCart(${p.id})">🛒 Cart</button>
        <button onclick="toggleWishlist(${p.id})">❤ Wishlist</button>
      </div>
    `;
  });
}

/* ---------- CART ---------- */
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const cart = getCart();
  cart.push(p);
  saveCart(cart);
  alert("Added to Cart");
}

function openCart() {
  const cart = getCart();
  let html = "<h3>Your Cart</h3>";
  if (!cart.length) html += "<p>Cart is empty</p>";

  cart.forEach((c, i) => {
    html += `
      <p>${c.name} – ₹${c.price}
      <button onclick="removeCart(${i})">Remove</button></p>`;
  });

  showModal(html);
}

function removeCart(i) {
  const cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  openCart();
}

/* ---------- WISHLIST ---------- */
function toggleWishlist(id) {
  let wl = getWishlist();
  const p = PRODUCTS.find(x => x.id === id);

  if (wl.find(x => x.id === id)) {
    wl = wl.filter(x => x.id !== id);
  } else {
    wl.push(p);
  }
  saveWishlist(wl);
  alert("Wishlist updated");
}

function openWishlist() {
  const wl = getWishlist();
  let html = "<h3>Wishlist</h3>";
  if (!wl.length) html += "<p>No items</p>";

  wl.forEach((w, i) => {
    html += `
      <p>${w.name}
      <button onclick="buyNow(${w.id})">Buy</button>
      <button onclick="removeWishlist(${i})">Remove</button></p>`;
  });

  showModal(html);
}

function removeWishlist(i) {
  const wl = getWishlist();
  wl.splice(i, 1);
  saveWishlist(wl);
  openWishlist();
}

/* ---------- BUY NOW FLOW ---------- */
function buyNow(id) {
  const p = PRODUCTS.find(x => x.id === id);
  CURRENT_ORDER = {
    id: orderId(),
    product: p,
    message: ""
  };

  if (p.customizable) openMessage();
  else openAddress();
}

/* ---------- MESSAGE CUSTOMISATION ---------- */
function openMessage() {
  showModal(`
    <h3>Gift Message</h3>
    <textarea id="giftMsg"></textarea>
    <button onclick="saveMessage()">Order Now</button>
  `);
}

function saveMessage() {
  CURRENT_ORDER.message = document.getElementById("giftMsg").value || "";
  openAddress();
}

/* ---------- ADDRESS ---------- */
function openAddress() {
  showModal(`
    <h3>Delivery Details</h3>
    <input id="name" placeholder="Full Name">
    <input id="phone" placeholder="Mobile Number">
    <textarea id="address" placeholder="Full Address"></textarea>
    <input id="city" placeholder="City / Village">
    <input id="state" placeholder="State">
    <input id="pin" placeholder="Pincode">
    <button onclick="saveAddress()">Continue</button>
  `);
}

function saveAddress() {
  CURRENT_ORDER.customer = {
    name: name.value,
    phone: phone.value,
    address: address.value,
    city: city.value,
    state: state.value,
    pin: pin.value
  };
  openPayment();
}

/* ---------- PAYMENT ---------- */
function openPayment() {
  showModal(`
    <h3>Payment Method</h3>
    <button onclick="payOnline()">Pay Online</button>
    <button onclick="payCOD()">Cash on Delivery</button>
  `);
}

function saveOrder(mode) {
  const orders = getOrders();
  const d = new Date();
  const delivery = new Date(d);
  delivery.setDate(d.getDate() + 7);

  orders.push({
    orderId: CURRENT_ORDER.id,
    product: CURRENT_ORDER.product.name,
    price: CURRENT_ORDER.product.price,
    status: "Pending Verification",
    payment: mode,
    orderDate: d.toDateString(),
    deliveryDate: delivery.toDateString()
  });

  saveOrders(orders);
}

function payOnline() {
  saveOrder("Online");
  window.location.href =
    `upi://pay?pa=9431541689@ibl&pn=LeGifte&am=${CURRENT_ORDER.product.price}&cu=INR`;
  setTimeout(showScreenshotHelp, 800);
}

function payCOD() {
  saveOrder("COD");
  alert("Order placed successfully!");
  closeModal();
}

/* ---------- SCREENSHOT SHARE ---------- */
function showScreenshotHelp() {
  showModal(`
    <h3>Payment Done?</h3>
    <p>Please share screenshot for faster confirmation</p>
    <button onclick="window.open('https://wa.me/919431541689')">
      Share Screenshot on WhatsApp
    </button>
  `);
}

/* ---------- MY ORDERS ---------- */
function showMyOrders() {
  const orders = getOrders();
  let html = "<h3>My Orders</h3>";

  if (!orders.length) html += "<p>No orders found</p>";

  orders.forEach(o => {
    html += `
      <p>
        <b>${o.orderId}</b><br>
        ${o.product} – ₹${o.price}<br>
        Status: ${o.status}<br>
        Expected Delivery: ${o.deliveryDate}
      </p><hr>`;
  });

  showModal(html);
}

/* ---------- MODAL ---------- */
function showModal(content) {
  closeModal();
  document.body.insertAdjacentHTML("beforeend", `
    <div id="modal" class="modal">
      <div class="modal-box">
        ${content}
        <button onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
}

function closeModal() {
  document.getElementById("modal")?.remove();
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderProducts);
