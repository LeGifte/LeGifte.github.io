/* ================= LeGifte FINAL script.js ================= */

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
    imgs: ["images/makeup-bouquet-1.jpg", "images/makeup-bouquet-2.jpg"],
    customizable: true
  },
  {
    id: 3,
    name: "12 Beauty Products Hamper",
    price: 1299,
    imgs: ["images/beauty-hamper-12-1.jpg", "images/beauty-hamper-12-2.jpg"],
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
      <button onclick="buyNow(${p.id})">Buy Now</button>
      <button onclick="addToWishlist(${p.id})">❤ Wishlist</button>
    `;
    box.appendChild(d);
  });
}

/* ---------- BUY / CUSTOMIZATION ---------- */
function buyNow(id) {
  const p = PRODUCTS.find(x => x.id === id);
  closeModal();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h2>${p.name}</h2>
        <p><b>₹${p.price}</b></p>

        <label>Gift Message</label>
        <textarea id="giftMsg" placeholder="Write message (optional)"></textarea>

        <button onclick="orderNow(${p.id})">Order Now</button>
        <button onclick="closeModal()">Close</button>
      </div>
    </div>
    `
  );
}

function closeModal() {
  document.getElementById("modal")?.remove();
}

/* ---------- ORDER NOW ---------- */
function orderNow(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const msg = document.getElementById("giftMsg").value || "";

  const cart = [{
    id: p.id,
    name: p.name,
    price: p.price,
    message: msg
  }];

  saveCart(cart);
  closeModal();
  openCart();
}

/* ---------- CART ---------- */
function openCart() {
  const cart = getCart();
  const box = document.getElementById("cartItems");
  box.innerHTML = "";

  if (!cart.length) {
    box.innerHTML = "<p>Cart is empty</p>";
  } else {
    cart.forEach((i, idx) => {
      box.innerHTML += `
        <p>
          ${i.name} – ₹${i.price}<br>
          <small>${i.message || ""}</small><br>
          <button onclick="removeFromCart(${idx})">Remove</button>
        </p>
      `;
    });
  }
  document.getElementById("cartModal").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cartModal").classList.add("hidden");
}

function removeFromCart(i) {
  const cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  openCart();
}

/* ---------- WISHLIST ---------- */
function addToWishlist(id) {
  let wl = getWishlist();
  if (!wl.find(x => x.id === id)) {
    wl.push(PRODUCTS.find(x => x.id === id));
    saveWishlist(wl);
    alert("Added to wishlist");
  }
}

function openWishlist() {
  const wl = getWishlist();
  const box = document.getElementById("wishlistItems");
  box.innerHTML = "";

  if (!wl.length) {
    box.innerHTML = "<p>No items in wishlist</p>";
  } else {
    wl.forEach((i, idx) => {
      box.innerHTML += `
        <p>
          ${i.name}
          <button onclick="removeFromWishlist(${idx})">Remove</button>
        </p>
      `;
    });
  }
  document.getElementById("wishlistModal").classList.remove("hidden");
}

function closeWishlist() {
  document.getElementById("wishlistModal").classList.add("hidden");
}

function removeFromWishlist(i) {
  let wl = getWishlist();
  wl.splice(i, 1);
  saveWishlist(wl);
  openWishlist();
}

/* ---------- PAYMENTS ---------- */
function checkoutUPI() {
  const cart = getCart();
  if (!cart.length) return alert("Cart empty");

  const total = cart.reduce((s, i) => s + i.price, 0);

  const upi = `upi://pay?pa=9431541689@ibl&pn=LeGifte&am=${total}&cu=INR`;
  window.location.href = upi;

  sendWhatsApp("Paid Online (UPI)");
}

function checkoutCOD() {
  sendWhatsApp("Cash on Delivery");
  alert("Order placed successfully!");
}

/* ---------- WHATSAPP CONFIRM ---------- */
function sendWhatsApp(mode) {
  const cart = getCart();
  let msg = "🛍️ New Order%0A";

  cart.forEach(i => {
    msg += `• ${i.name} – ₹${i.price}%0A`;
    if (i.message) msg += `  Message: ${i.message}%0A`;
  });

  msg += `%0APayment: ${mode}`;

  window.open(`https://wa.me/919431541689?text=${msg}`);
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderProducts);
