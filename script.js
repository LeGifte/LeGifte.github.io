/* ================= LeGifte – FINAL SCRIPT ================= */

/* 🔗 GOOGLE SHEET WEB APP URL */
const SHEET_API =
  "https://script.google.com/macros/s/AKfycbxtd00FIPgoYL-XrtfwKGqBlM6_WwaTOq9NymQWQ9pKzU2tIRLsUBmu13h21GKF98gU/exec";

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
const ORDERS_KEY = "legifte_orders";

const getCart = () => JSON.parse(localStorage.getItem(CART_KEY)) || [];
const saveCart = c => localStorage.setItem(CART_KEY, JSON.stringify(c));

const getWishlist = () => JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
const saveWishlist = w => localStorage.setItem(WISHLIST_KEY, JSON.stringify(w));

const getOrders = () => JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
const saveOrders = o => localStorage.setItem(ORDERS_KEY, JSON.stringify(o));

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts() {
  const box = document.getElementById("product-list");
  if (!box) return;

  box.innerHTML = "";

  PRODUCTS.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${p.imgs[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>

      <button onclick="buyNow(${p.id})">Buy Now</button>
      <button onclick="addToWishlist(${p.id})">❤ Wishlist</button>
    `;

    box.appendChild(div);
  });
}

/* ---------- BUY / CUSTOMIZATION ---------- */
function buyNow(id) {
  const p = PRODUCTS.find(x => x.id === id);
  openOrderModal(p);
}

function openOrderModal(p) {
  closeModal();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h2>${p.name}</h2>
        <p><b>₹${p.price}</b></p>

        ${
          p.customizable
            ? `<label>Gift Message</label>
               <textarea id="giftMsg" placeholder="Write message"></textarea>`
            : ""
        }

        <label>Name</label>
        <input id="custName" placeholder="Full Name">

        <label>Phone</label>
        <input id="custPhone" placeholder="Mobile Number">

        <label>Address</label>
        <textarea id="custAddress" placeholder="Full Address"></textarea>

        <button onclick="selectPayment(${p.id})">Order Now</button>
        <button onclick="closeModal()">Close</button>
      </div>
    </div>
    `
  );
}

/* ---------- PAYMENT MODE ---------- */
function selectPayment(id) {
  const p = PRODUCTS.find(x => x.id === id);

  const order = {
    product: p.name,
    price: p.price,
    name: document.getElementById("custName").value,
    phone: document.getElementById("custPhone").value,
    address: document.getElementById("custAddress").value,
    message: document.getElementById("giftMsg")?.value || "",
    date: new Date().toISOString(),
    status: "Pending"
  };

  if (!order.name || !order.phone || !order.address) {
    alert("Please fill all details");
    return;
  }

  saveOrders([...getOrders(), order]);

  closeModal();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h3>Select Payment Mode</h3>

        <button onclick="payOnline(${p.price}, '${order.product}', '${order.phone}')">
          Pay Online (PhonePe / Paytm)
        </button>

        <button onclick="payCOD('${order.product}', '${order.phone}')">
          Cash on Delivery
        </button>

        <button onclick="closeModal()">Close</button>
      </div>
    </div>
    `
  );
}

/* ---------- ONLINE PAYMENT ---------- */
function payOnline(amount, product, phone) {
  const upi = upi://pay?pa=9431541689@ibl&pn=LeGifte&am=${amount}&cu=INR;

  window.location.href = upi;

  setTimeout(() => {
    alert(
      "Payment done? Please send screenshot on WhatsApp to confirm your order."
    );

    window.open(
      https://wa.me/919431541689?text=Payment done for ${product}. Phone: ${phone}
    );
  }, 1500);
}

/* ---------- COD ---------- */
function payCOD(product, phone) {
  alert("Order placed with Cash on Delivery");

  window.open(
    https://wa.me/919431541689?text=New COD Order: ${product}, Phone: ${phone}
  );
}

/* ---------- WISHLIST ---------- */
function addToWishlist(id) {
  const p = PRODUCTS.find(x => x.id === id);
  let wl = getWishlist();

  if (!wl.find(x => x.id === id)) {
    wl.push(p);
    saveWishlist(wl);
    alert("Added to Wishlist");
  }
}

function openWishlist() {
  const box = document.getElementById("wishlistItems");
  const wl = getWishlist();

  box.innerHTML = wl.length
    ? wl
        .map(
          (i, idx) =>
            <p>${i.name} <button onclick="removeWishlist(${idx})">Remove</button></p>
        )
        .join("")
    : "<p>No wishlist items</p>";

  document.getElementById("wishlistModal").classList.remove("hidden");
}

function removeWishlist(i) {
  let wl = getWishlist();
  wl.splice(i, 1);
  saveWishlist(wl);
  openWishlist();
}

/* ---------- MODAL ---------- */
function closeModal() {
  document.getElementById("modal")?.remove();
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderProducts);
