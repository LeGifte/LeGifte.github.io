/* ================= LeGifte – FINAL script.js ================= */

/* ---------- PRODUCTS ---------- */
const PRODUCTS = [
  {
    id: 1,
    name: "Mini Hamper",
    price: 599,
    imgs: ["images/mini-hamper.jpg"],
    category: "hamper",
    customizable: true
  },
  {
    id: 2,
    name: "Make Up Bouquet",
    price: 999,
    imgs: ["images/makeup-bouquet.jpg"],
    category: "beauty",
    customizable: true
  },
  {
    id: 3,
    name: "12 Beauty Products Hamper",
    price: 1299,
    imgs: ["images/beauty-hamper-12.jpg"],
    category: "beauty",
    customizable: true
  },
  {
    id: 4,
    name: "Mini 6 Beauty Item Cup Hamper",
    price: 299,
    imgs: ["images/cup-hamper.jpg"],
    category: "cup",
    customizable: true
  },
  {
    id: 5,
    name: "Men Customizable Hamper",
    price: 2999,
    imgs: ["images/men-hamper.jpg"],
    category: "men",
    customizable: true,
    shirtColors: [
      "Plain Black",
      "Plain White",
      "White & Green Stripe"
    ]
  },
  {
    id: 6,
    name: "Jewellery Bouquets",
    price: 799,
    imgs: ["images/jewellery-bouquet.jpg"],
    category: "jewellery",
    customizable: true
  },
  {
    id: 7,
    name: "Snack Bouquets",
    price: 999,
    imgs: ["images/snack-bouquet.jpg"],
    category: "snack",
    customizable: true
  },
  {
    id: 8,
    name: "Women Hamper",
    price: 1999,
    imgs: ["images/women-hamper.jpg"],
    category: "beauty",
    customizable: true
  }
];

/* ---------- STORAGE ---------- */
const CART_KEY = "legifte_cart";

/* ---------- HELPERS ---------- */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
function saveCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
}

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts() {
  const box = document.getElementById("product-list");
  box.innerHTML = "";

  PRODUCTS.forEach(p => {
    const d = document.createElement("div");
    d.className = "product";
    d.innerHTML = `
      <img src="${p.imgs[0]}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="openProduct(${p.id})">View</button>
    `;
    box.appendChild(d);
  });
}

/* ---------- PRODUCT MODAL ---------- */
function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  let shirtHTML = "";

  if (p.shirtColors) {
    shirtHTML = `
      <label>Shirt Color</label>
      <select id="shirtColor">
        ${p.shirtColors.map(c => `<option>${c}</option>`).join("")}
      </select>
    `;
  }

  document.body.insertAdjacentHTML("beforeend", `
    <div id="modal">
      <div class="modal-box">
        <h2>${p.name}</h2>
        <p>₹${p.price}</p>

        ${shirtHTML}

        <label>Letter / Message (Max 1000 characters)</label>
        <textarea id="letter" maxlength="1000"
          placeholder="Write the message you want inside the hamper"></textarea>

        <button onclick="addToCart(${p.id})">Add to Cart</button>
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
    shirtColor: document.getElementById("shirtColor")?.value || "",
    letter: document.getElementById("letter").value
  });

  saveCart(cart);
  closeModal();
  alert("Added to cart");
}

/* ---------- CHECKOUT ---------- */
function checkout() {
  const cart = getCart();
  if (!cart.length) return alert("Cart empty");

  const total = cart.reduce((s, i) => s + i.price, 0);

  const upi =
    `upi://pay?pa=9431541689@ibl&pn=LeGifte&am=${total}&cu=INR`;

  window.location.href = upi;
}

/* ---------- WHATSAPP ---------- */
function whatsappOrder() {
  const cart = getCart();
  let msg = "New Order:%0A";

  cart.forEach(i => {
    msg += `• ${i.name}%0A`;
    if (i.shirtColor) msg += `  Shirt: ${i.shirtColor}%0A`;
    if (i.letter) msg += `  Message: ${i.letter}%0A`;
  });

  window.open(`https://wa.me/919431541689?text=${msg}`);
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderProducts);

