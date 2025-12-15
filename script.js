/* ========= LeGifté – FINAL STABLE script.js ========= */
/* Works with your existing HTML & CSS (NO CHANGES REQUIRED) */

/* ---------- CONFIG ---------- */
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxtd00FIPgoYL-XrtfwKGqBlM6_WwaTOq9NymQWQ9pKzU2tIRLsUBmu13h21GKF98gU/exec";
const SELLER_WHATSAPP = "919431541689";
const UPI_MAIN = "9431541689@ibl"; // PhonePe / UPI
const UPI_PAYTM = "9431541689@axl"; // Paytm

/* ---------- PRODUCTS (2 IMAGES EACH) ---------- */
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
    customizable: false
  },
  {
    id: 3,
    name: "12 Beauty Products Hamper",
    price: 1299,
    imgs: ["images/beauty-hamper-1.jpg", "images/beauty-hamper-2.jpg"],
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

/* ---------- STATE ---------- */
let selectedProduct = null;

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  injectProductSectionBelowTopBar();
  renderProducts();
});

/* ---------- INJECT SECTION (below top bar) ---------- */
function injectProductSectionBelowTopBar() {
  const topBar = document.querySelector(".top-bar");
  if (!topBar) return;

  const section = document.createElement("section");
  section.id = "products";
  section.style.padding = "24px";
  section.innerHTML = `
    <div id="product-grid" style="
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
      gap:20px;">
    </div>
  `;

  topBar.insertAdjacentElement("afterend", section);
}

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  PRODUCTS.forEach(p => {
    const card = document.createElement("div");
    card.style.border = "1px solid #d4af37";
    card.style.borderRadius = "10px";
    card.style.padding = "14px";
    card.style.textAlign = "center";

    card.innerHTML = `
      <img src="${p.imgs[0]}" style="width:100%;border-radius:8px;margin-bottom:10px">
      <h3 style="margin:8px 0">${p.name}</h3>
      <p style="margin:6px 0;font-weight:bold">₹${p.price}</p>
      <button class="nav-btn" data-id="${p.id}">Buy Now</button>
    `;

    card.querySelector("button").addEventListener("click", () => openOrderModal(p.id));
    grid.appendChild(card);
  });
}

/* ---------- ORDER MODAL ---------- */
function openOrderModal(id) {
  closeModal();
  selectedProduct = PRODUCTS.find(p => p.id === id);
  if (!selectedProduct) return;

  const msgBox = selectedProduct.customizable
    ? `<textarea id="giftMsg" placeholder="Gift message (optional)" style="width:100%;margin-top:8px"></textarea>`
    : "";

  document.body.insertAdjacentHTML("beforeend", `
    <div id="lg-modal" style="
      position:fixed;inset:0;background:rgba(0,0,0,.7);
      display:flex;align-items:center;justify-content:center;z-index:9999;">
      <div style="background:#000;border:1px solid #d4af37;color:#d4af37;
        padding:18px;border-radius:10px;width:92%;max-width:420px">
        <h2 style="margin-top:0">${selectedProduct.name}</h2>
        <p><b>₹${selectedProduct.price}</b></p>

        <input id="custName" placeholder="Full Name" style="width:100%;margin:6px 0">
        <input id="custPhone" placeholder="Phone Number" style="width:100%;margin:6px 0">
        <textarea id="custAddress" placeholder="Full Address (City, State, Pincode, Landmark)" style="width:100%;margin:6px 0"></textarea>

        ${msgBox}

        <div style="display:flex;gap:10px;margin-top:10px">
          <button class="nav-btn" onclick="payOnline()">Pay Online</button>
          <button class="nav-btn" onclick="payCOD()">COD</button>
        </div>

        <button class="nav-btn" style="margin-top:10px" onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
}

function closeModal() {
  document.getElementById("lg-modal")?.remove();
}

/* ---------- DATA COLLECT ---------- */
function collectData(mode) {
  return {
    product: selectedProduct.name,
    price: selectedProduct.price,
    name: document.getElementById("custName").value || "",
    phone: document.getElementById("custPhone").value || "",
    address: document.getElementById("custAddress").value || "",
    message: document.getElementById("giftMsg")?.value || "",
    paymentMode: mode,
    status: "Pending",
    date: new Date().toLocaleString()
  };
}

/* ---------- SAVE TO SHEET ---------- */
function saveToSheet(data) {
  fetch(SHEET_URL, {
    method: "POST",
    body: JSON.stringify(data)
  }).catch(() => {});
}

/* ---------- PAYMENTS ---------- */
function payOnline() {
  const data = collectData("Online");
  saveToSheet(data);

  const upiLink = `upi://pay?pa=${UPI_MAIN}&pn=LeGifte&am=${data.price}&cu=INR`;
  window.location.href = upiLink;

  setTimeout(() => {
    const msg =
      `Payment done for ${data.product} (₹${data.price}).%0A` +
      `Name: ${data.name}%0APhone: ${data.phone}%0A` +
      `Please find payment screenshot attached.`;
    window.open(`https://wa.me/${SELLER_WHATSAPP}?text=${msg}`);
  }, 3000);

  closeModal();
}

function payCOD() {
  const data = collectData("COD");
  saveToSheet(data);

  const msg =
    `NEW COD ORDER%0A` +
    `Product: ${data.product}%0A₹${data.price}%0A` +
    `Name: ${data.name}%0APhone: ${data.phone}%0A` +
    `Address: ${data.address}`;
  window.open(`https://wa.me/${SELLER_WHATSAPP}?text=${msg}`);

  alert("Order received. We will confirm shortly.");
  closeModal();
}
