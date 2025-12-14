/* ================= LeGifte FINAL script.js ================= */

/* ---------- CONFIG ---------- */
const ORDER_API =
  "https://script.google.com/macros/s/AKfycbxtd00FIPgoYL-XrtfwKGqBlM6_WwaTOq9NymQWQ9pKzU2tIRLsUBmu13h21GKF98gU/exec";

const UPI_ID = "9431541689@ibl";
const PAYTM_ID = "9431541689@axl";
const WHATSAPP = "919431541689";

/* ---------- PRODUCTS ---------- */
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

/* ---------- STORAGE ---------- */
const CART_KEY = "legifte_cart";
const WISHLIST_KEY = "legifte_wishlist";

const getCart = () => JSON.parse(localStorage.getItem(CART_KEY)) || [];
const saveCart = c => localStorage.setItem(CART_KEY, JSON.stringify(c));

const getWishlist = () => JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
const saveWishlist = w => localStorage.setItem(WISHLIST_KEY, JSON.stringify(w));

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts() {
  const box = document.getElementById("product-list");
  if (!box) return;

  box.innerHTML = "";

  PRODUCTS.forEach(p => {
    const d = document.createElement("div");
    d.className = "product";

    d.innerHTML = `
      <img src="${p.imgs[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>

      <button onclick="openProduct(${p.id})">Buy Now</button>
      <button onclick="addToWishlist(${p.id})">❤ Wishlist</button>
    `;

    box.appendChild(d);
  });
}

/* ---------- PRODUCT MODAL ---------- */
function openProduct(id) {
  closeModal();
  const p = PRODUCTS.find(x => x.id === id);

  let msgBox = "";
  if (p.customizable) {
    msgBox = `
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
        <img src="${p.imgs[0]}" style="width:100%;border-radius:8px">
        <p><b>₹${p.price}</b></p>

        ${msgBox}

        <label>Name</label>
        <input id="custName" placeholder="Your name">

        <label>Phone</label>
        <input id="custPhone" placeholder="Phone number">

        <label>Address</label>
        <textarea id="custAddress" placeholder="Full address"></textarea>

        <button onclick="placeOrder(${p.id}, 'ONLINE')">Pay Online</button>
        <button onclick="placeOrder(${p.id}, 'COD')">Cash on Delivery</button>
        <button onclick="closeModal()">Close</button>
      </div>
    </div>
    `
  );
}

function closeModal() {
  document.getElementById("modal")?.remove();
}

/* ---------- ORDER ---------- */
function placeOrder(id, mode) {
  const p = PRODUCTS.find(x => x.id === id);

  const data = {
    product: p.name,
    price: p.price,
    name: document.getElementById("custName").value,
    phone: document.getElementById("custPhone").value,
    address: document.getElementById("custAddress").value,
    message: document.getElementById("giftMsg")?.value || "",
    paymentMode: mode
  };

  if (!data.name || !data.phone || !data.address) {
    alert("Please fill all details");
    return;
  }

  fetch(ORDER_API, {
    method: "POST",
    body: JSON.stringify(data)
  });

  if (mode === "ONLINE") {
    const upi = upi://pay?pa=${UPI_ID}&pn=LeGifte&am=${p.price}&cu=INR;
    window.location.href = upi;
  } else {
    alert("Order placed! You will receive confirmation soon.");
  }

  window.open(
    https://wa.me/${WHATSAPP}?text=New Order:%0A${p.name}%0A₹${p.price}%0A${data.name}%0A${data.phone},
    "_blank"
  );

  closeModal();
}

/* ---------- WISHLIST ---------- */
function addToWishlist(id) {
  let wl = getWishlist();
  if (!wl.find(x => x.id === id)) {
    wl.push(PRODUCTS.find(x => x.id === id));
    saveWishlist(wl);
    alert("Added to Wishlist");
  }
}

function openWishlist() {
  const wl = getWishlist();
  const box = document.getElementById("wishlistItems");
  box.innerHTML = wl.length
    ? wl.map(i => <p>${i.name}</p>).join("")
    : "<p>No items</p>";
  document.getElementById("wishlistModal").classList.remove("hidden");
}

function closeWishlist() {
  document.getElementById("wishlistModal").classList.add("hidden");
}

/* ---------- CART ---------- */
function openCart() {
  const cart = getCart();
  const box = document.getElementById("cartItems");
  box.innerHTML = cart.length
    ? cart.map(i => <p>${i.name} – ₹${i.price}</p>).join("")
    : "<p>Cart empty</p>";
  document.getElementById("cartModal").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cartModal").classList.add("hidden");
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderProducts);
