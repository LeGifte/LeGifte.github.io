/* ================= LeGifte – FINAL PAYMENT ENABLED script.js ================= */

/* ---------- PRODUCTS ---------- */
const PRODUCTS = [
  {
    id: 1,
    name: "Mini Hamper",
    price: 599,
    imgs: ["images/mini-hamper-1.jpg", "images/mini-hamper-2.jpg"],
    video: "images/mini-hamper.mp4"
  },
  {
    id: 2,
    name: "Make Up Bouquet",
    price: 999,
    imgs: ["images/makeup-bouquet-1.jpg", "images/makeup-bouquet-2.jpg"],
    video: ""
  },
  {
    id: 3,
    name: "12 Beauty Products Hamper",
    price: 1299,
    imgs: ["images/beauty-hamper-12-1.jpg", "images/beauty-hamper-12-2.jpg"],
    video: ""
  },
  {
    id: 4,
    name: "Mini 6 Beauty Item Cup Hamper",
    price: 299,
    imgs: ["images/cup-hamper-6-1.jpg", "images/cup-hamper-6-2.jpg"],
    video: ""
  },
  {
    id: 5,
    name: "Men Customizable Hamper",
    price: 2999,
    imgs: ["images/men-custom-hamper-1.jpg", "images/men-custom-hamper-2.jpg"],
    video: ""
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
  box.innerHTML = "";

  PRODUCTS.forEach(p => {
    const d = document.createElement("div");
    d.className = "product";

    d.innerHTML = `
      <img src="${p.imgs[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>

      <small>✔ Cash on Delivery | ✔ Online UPI</small>

      <button onclick="openProduct(${p.id})">View / Customize</button>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
      <button onclick="orderCOD(${p.id})">Order – COD</button>
      <button onclick="payUPI(${p.id})">Pay Online (UPI)</button>

      <div style="text-align:right;margin-top:6px">
        <span onclick="toggleWishlist(${p.id})" style="cursor:pointer">❤ Wishlist</span>
      </div>
    `;
    box.appendChild(d);
  });
}

/* ---------- PRODUCT MODAL ---------- */
function openProduct(id) {
  closeModal();
  const p = PRODUCTS.find(x => x.id === id);

  document.body.insertAdjacentHTML("beforeend", `
    <div id="modal">
      <div class="modal-box">

        <h2>${p.name}</h2>

        ${p.video ? `
          <video controls style="width:100%;border-radius:6px;margin-bottom:8px">
            <source src="${p.video}" type="video/mp4">
          </video>
        ` : ""}

        <img src="${p.imgs[0]}" style="width:100%;border-radius:6px">
        <img src="${p.imgs[1]}" style="width:100%;margin-top:8px;border-radius:6px">

        <p><b>₹${p.price}</b></p>
        <p><small>✔ COD | ✔ UPI (PhonePe / Paytm / GPay)</small></p>

        <label>Custom Letter / Message</label>
        <textarea id="customMessage"
          placeholder="Write your message (optional)"></textarea>

        <button onclick="addToCart(${p.id})">Add to Cart</button>
        <button onclick="orderCOD(${p.id})">Order – COD</button>
        <button onclick="payUPI(${p.id})">Pay Online (UPI)</button>
        <button onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
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
    message: document.getElementById("customMessage")?.value || ""
  });

  saveCart(cart);
  closeModal();
  alert("Added to Cart");
}

/* ---------- WISHLIST ---------- */
function toggleWishlist(id) {
  let wl = getWishlist();
  if (wl.includes(id)) {
    wl = wl.filter(x => x !== id);
    alert("Removed from Wishlist");
  } else {
    wl.push(id);
    alert("Added to Wishlist");
  }
  saveWishlist(wl);
}

/* ---------- COD ORDER (WHATSAPP) ---------- */
function orderCOD(id) {
  const p = PRODUCTS.find(x => x.id === id);

  const msg =
`Hi LeGifte,
I want to order:
${p.name}
Price: ₹${p.price}

Payment Mode: Cash on Delivery`;

  window.open(https://wa.me/919431541689?text=${encodeURIComponent(msg)});
}

/* ---------- ONLINE PAYMENT (UPI) ---------- */
function payUPI(id) {
  const p = PRODUCTS.find(x => x.id === id);

  const upiLink =
    upi://pay?pa=9431541689@ibl&pn=LeGifte&am=${p.price}&cu=INR;

  window.location.href = upiLink;
}

/* ---------- FLOATING WHATSAPP ---------- */
document.body.insertAdjacentHTML("beforeend", `
  <a href="https://wa.me/919431541689" class="wa-btn" target="_blank">
    💬 WhatsApp Help
  </a>
`);

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderProducts);
