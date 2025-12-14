/* ================= LeGifte FINAL script.js ================= */

/* ---------- PRODUCTS ---------- */
const PRODUCTS = [
  {
    id: 1,
    name: "Mini Hamper",
    price: 599,
    imgs: ["images/mini-hamper.jpg"]
  },
  {
    id: 2,
    name: "Make Up Bouquet",
    price: 999,
    imgs: ["images/makeup-bouquet.jpg"]
  },
  {
    id: 3,
    name: "12 Beauty Products Hamper",
    price: 1299,
    imgs: ["images/beauty-hamper-12.jpg"]
  },
  {
    id: 4,
    name: "Mini 6 Beauty Item Cup Hamper",
    price: 299,
    imgs: ["images/cup-hamper.jpg"]
  },
  {
    id: 5,
    name: "Men Customizable Hamper",
    price: 2999,
    imgs: ["images/men-hamper.jpg"]
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

      <button onclick="openProduct(${p.id})">View</button>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
      <button onclick="addToWishlist(${p.id})">❤ Wishlist</button>
    `;

    box.appendChild(d);
  });
}

/* ---------- PRODUCT MODAL ---------- */
function openProduct(id) {
  closeModal();
  const p = PRODUCTS.find(x => x.id === id);

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h2>${p.name}</h2>
        <img src="${p.imgs[0]}" style="width:100%;border-radius:8px">
        <p><b>₹${p.price}</b></p>

        <label>Gift Message</label>
        <textarea id="giftMsg" placeholder="Write message (optional)"></textarea>

        <button onclick="addToCart(${p.id})">Add to Cart</button>
        <button onclick="closeModal()">Close</button>
      </div>
    </div>
    `
  );
}

function closeModal() {
  document.getElementById("modal")?.remove();
}

/* ---------- CART ---------- */
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const cart = getCart();

  cart.push({
    id: p.id,
    name: p.name,
    price: p.price,
    message: document.getElementById("giftMsg")?.value || ""
  });

  saveCart(cart);
  closeModal();
  alert("Added to Cart");
}

function openCart() {
  const cart = getCart();
  const box = document.getElementById("cartItems");
  box.innerHTML = "";

  if (!cart.length) {
    box.innerHTML = "<p>Cart is empty</p>";
  } else {
    cart.forEach(i => {
      box.innerHTML += `
        <p>${i.name} – ₹${i.price}</p>
      `;
    });
  }

  document.getElementById("cartModal").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cartModal").classList.add("hidden");
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
  const wl = getWishlist();
  const box = document.getElementById("wishlistItems");
  box.innerHTML = "";

  if (!wl.length) {
    box.innerHTML = "<p>No items in wishlist</p>";
  } else {
    wl.forEach(i => {
      box.innerHTML += `<p>${i.name}</p>`;
    });
  }

  document.getElementById("wishlistModal").classList.remove("hidden");
}

function closeWishlist() {
  document.getElementById("wishlistModal").classList.add("hidden");
}

/* ---------- PAYMENTS ---------- */
function checkoutUPI() {
  const cart = getCart();
  if (!cart.length) {
    alert("Cart empty");
    return;
  }

  const total = cart.reduce((s, i) => s + i.price, 0);
  const upi = `upi://pay?pa=9431541689@ibl&pn=LeGifte&am=${total}&cu=INR`;

  window.location.href = upi;
}

function checkoutCOD() {
  window.open(
    "https://wa.me/919431541689?text=I want to place a Cash on Delivery order"
  );
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderProducts);
