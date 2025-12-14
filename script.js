/* ================= LeGifte FINAL – CLEAN & STABLE ================= */

/* ---------- CONFIG ---------- */
const UPI_ID = "9431541689@ibl";
const WHATSAPP_NO = "919431541689";
const SHEET_API =
  "https://script.google.com/macros/s/AKfycbxtd00FIPgoYL-XrtfwKGqBlM6_WwaTOq9NymQWQ9pKzU2tIRLsUBmu13h21GKF98gU/exec";

/* ---------- PRODUCTS ---------- */
const PRODUCTS = [
  {
    id: 1,
    name: "Mini Hamper",
    price: 599,
    imgs: ["images/mini-hamper-1.jpg", "images/mini-hamper-2.jpg"],
    customizable: true,
  },
  {
    id: 2,
    name: "Make Up Bouquet",
    price: 999,
    imgs: ["images/makeup-bouquet.jpg"],
    customizable: false,
  },
  {
    id: 3,
    name: "12 Beauty Products Hamper",
    price: 1299,
    imgs: ["images/beauty-hamper-12.jpg"],
    customizable: true,
  },
  {
    id: 4,
    name: "Mini 6 Beauty Item Cup Hamper",
    price: 299,
    imgs: ["images/cup-hamper-1.jpg", "images/cup-hamper-2.jpg"],
    customizable: true,
  },
  {
    id: 5,
    name: "Men Customizable Hamper",
    price: 2999,
    imgs: ["images/men-hamper-1.jpg", "images/men-hamper-2.jpg"],
    customizable: true,
  },
];

/* ---------- STORAGE ---------- */
const CART_KEY = "legifte_cart";
const WISHLIST_KEY = "legifte_wishlist";

const getCart = () => JSON.parse(localStorage.getItem(CART_KEY)) || [];
const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

const getWishlist = () =>
  JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
const saveWishlist = (w) =>
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(w));

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts() {
  const box = document.getElementById("product-list");
  if (!box) return;

  box.innerHTML = "";

  PRODUCTS.forEach((p) => {
    const d = document.createElement("div");
    d.className = "product";

    d.innerHTML = `
      <img src="${p.imgs[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="buyNow(${p.id})">Buy Now</button>
      <button onclick="addToWishlist(${p.id})">❤ Wishlist</button>
    `;

    box.appendChild(d);
  });
}

/* ---------- BUY FLOW ---------- */
function buyNow(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  closeModal();

  let messageBox = "";
  if (p.customizable) {
    messageBox = `
      <label>Gift Message</label>
      <textarea id="giftMsg" placeholder="Write your message"></textarea>
    `;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h2>${p.name}</h2>
        <p><b>₹${p.price}</b></p>
        ${messageBox}
        <button onclick="selectPayment(${p.id})">Order Now</button>
        <button onclick="closeModal()">Close</button>
      </div>
    </div>
  `
  );
}

/* ---------- PAYMENT ---------- */
function selectPayment(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  const msg = document.getElementById("giftMsg")?.value || "";

  const order = {
    product: p.name,
    price: p.price,
    message: msg,
    date: new Date().toLocaleString(),
    status: "Pending",
  };

  localStorage.setItem("last_order", JSON.stringify(order));

  closeModal();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h3>Select Payment</h3>
        <button onclick="payOnline(${p.price})">Pay Online</button>
        <button onclick="cashOnDelivery()">Cash on Delivery</button>
      </div>
    </div>
  `
  );
}

function payOnline(amount) {
  const upi = upi://pay?pa=${UPI_ID}&pn=LeGifte&am=${amount}&cu=INR;
  window.location.href = upi;

  setTimeout(showScreenshotOption, 4000);
}

function cashOnDelivery() {
  sendOrderToSheet("COD");
  alert("Order placed! Seller will confirm.");
}

/* ---------- AFTER PAYMENT ---------- */
function showScreenshotOption() {
  closeModal();
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h3>Payment Done?</h3>
        <p>Please send payment screenshot</p>
        <button onclick="sendWhatsApp()">Send Screenshot on WhatsApp</button>
      </div>
    </div>
  `
  );
}

function sendWhatsApp() {
  sendOrderToSheet("Online");
  window.open(https://wa.me/${WHATSAPP_NO}, "_blank");
}

/* ---------- SAVE ORDER ---------- */
function sendOrderToSheet(mode) {
  const o = JSON.parse(localStorage.getItem("last_order"));
  if (!o) return;

  fetch(SHEET_API, {
    method: "POST",
    body: JSON.stringify({
      product: o.product,
      price: o.price,
      paymentMode: mode,
      message: o.message,
    }),
  });

  localStorage.removeItem("last_order");
}

/* ---------- WISHLIST ---------- */
function addToWishlist(id) {
  const wl = getWishlist();
  if (!wl.includes(id)) {
    wl.push(id);
    saveWishlist(wl);
    alert("Added to wishlist");
  }
}

/* ---------- UTIL ---------- */
function closeModal() {
  document.getElementById("modal")?.remove();
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderProducts);
