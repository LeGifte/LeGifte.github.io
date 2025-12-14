/* ================= LeGifte CSP SAFE FINAL SCRIPT ================= */

const PRODUCTS = [
  { id: 1, name: "Mini Hamper", price: 599, customizable: true },
  { id: 2, name: "Make Up Bouquet", price: 999, customizable: false },
  { id: 3, name: "12 Beauty Products Hamper", price: 1299, customizable: true },
  { id: 4, name: "Mini 6 Beauty Item Cup Hamper", price: 299, customizable: true },
  { id: 5, name: "Men Customizable Hamper", price: 2999, customizable: true }
];

const ORDER_API = "https://script.google.com/macros/s/AKfycbxtd00FIPgoYL-XrtfwKGqBlM6_WwaTOq9NymQWQ9pKzU2tIRLsUBmu13h21GKF98gU/exec";
const UPI_ID = "9431541689@ibl";
const WHATSAPP = "919431541689";

/* ---------- HELPERS ---------- */
function qs(id) {
  return document.getElementById(id);
}

/* ---------- BUY FLOW ---------- */
function buyNow(id) {
  const product = PRODUCTS.find(p => p.id === id);
  localStorage.setItem("currentProduct", JSON.stringify(product));
  openOrderForm(product);
}

function openOrderForm(product) {
  const msgBox = product.customizable
    ? <textarea id="giftMsg" placeholder="Gift Message"></textarea>
    : "";

  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal" id="orderModal">
      <div class="modal-box">
        <h2>${product.name}</h2>
        <p>₹${product.price}</p>
        ${msgBox}

        <input id="custName" placeholder="Name" required>
        <input id="custPhone" placeholder="Phone" required>
        <textarea id="custAddress" placeholder="Full Address" required></textarea>

        <button id="payOnline">Pay Online</button>
        <button id="payCOD">Cash on Delivery</button>
        <button onclick="closeModal()">Close</button>
      </div>
    </div>
  `);

  qs("payOnline").addEventListener("click", () => submitOrder("ONLINE"));
  qs("payCOD").addEventListener("click", () => submitOrder("COD"));
}

function closeModal() {
  qs("orderModal")?.remove();
}

/* ---------- ORDER SUBMIT ---------- */
function submitOrder(mode) {
  const product = JSON.parse(localStorage.getItem("currentProduct"));

  const data = {
    product: product.name,
    price: product.price,
    name: qs("custName").value,
    phone: qs("custPhone").value,
    address: qs("custAddress").value,
    message: qs("giftMsg")?.value || "",
    paymentMode: mode
  };

  fetch(ORDER_API, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(r => {
    saveCustomerOrder(r.orderId, data);

    if (mode === "ONLINE") {
      const upi = upi://pay?pa=${UPI_ID}&pn=LeGifte&am=${product.price}&cu=INR;
      window.location.href = upi;
    } else {
      alert("Order placed successfully (COD)");
    }

    showOrderSuccess(r.orderId);
  });
}

/* ---------- CUSTOMER ORDERS ---------- */
function saveCustomerOrder(id, data) {
  const orders = JSON.parse(localStorage.getItem("myOrders") || "[]");
  orders.push({
    id,
    ...data,
    status: "Order Received",
    eta: new Date(Date.now() + 7*86400000).toDateString()
  });
  localStorage.setItem("myOrders", JSON.stringify(orders));
}

function showOrderSuccess(orderId) {
  closeModal();
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal">
      <div class="modal-box">
        <h3>Order Received ✅</h3>
        <p>Order ID: ${orderId}</p>
        <p>Delivery in 7 days</p>

        <button onclick="shareScreenshot()">Share Payment Screenshot</button>
        <button onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    </div>
  `);
}

function shareScreenshot() {
  window.open(https://wa.me/${WHATSAPP}?text=Payment%20screenshot%20for%20my%20LeGifte%20order);
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-buy]").forEach(btn => {
    btn.addEventListener("click", () => buyNow(Number(btn.dataset.buy)));
  });
});
