/* ================= LeGifte FINAL SCRIPT ================= */

/* ---------- PRODUCTS ---------- */
/* customizable: true => message screen first
   customizable: false => direct payment mode */

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

/* ---------- GLOBAL TEMP ORDER ---------- */
let CURRENT_ORDER = {};

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
      </div>
    `;
  });
}

/* ---------- BUY NOW ---------- */
function buyNow(id) {
  const p = PRODUCTS.find(x => x.id === id);
  CURRENT_ORDER = { product: p };

  if (p.customizable) {
    openMessageScreen(p);
  } else {
    openAddressScreen();
  }
}

/* ---------- MESSAGE CUSTOMIZATION ---------- */
function openMessageScreen(p) {
  closeModal();
  document.body.insertAdjacentHTML("beforeend", `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h2>${p.name}</h2>
        <p><b>₹${p.price}</b></p>

        <label>Gift Message</label>
        <textarea id="giftMsg" placeholder="Write your message"></textarea>

        <button onclick="saveMessage()">Order Now</button>
        <button onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function saveMessage() {
  CURRENT_ORDER.message = document.getElementById("giftMsg").value || "";
  openAddressScreen();
}

/* ---------- ADDRESS FORM (MANDATORY) ---------- */
function openAddressScreen() {
  closeModal();
  document.body.insertAdjacentHTML("beforeend", `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h3>Delivery Details</h3>

        <input id="custName" placeholder="Full Name">
        <input id="custPhone" placeholder="Mobile Number">
        <textarea id="custAddress" placeholder="Full Address"></textarea>
        <input id="custCity" placeholder="City / Village">
        <input id="custState" placeholder="State">
        <input id="custPincode" placeholder="Pincode">
        <input id="custLandmark" placeholder="Landmark (optional)">

        <button onclick="saveAddress()">Continue to Payment</button>
        <button onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function saveAddress() {
  const name = custName.value.trim();
  const phone = custPhone.value.trim();
  const address = custAddress.value.trim();
  const city = custCity.value.trim();
  const state = custState.value.trim();
  const pincode = custPincode.value.trim();

  if (!name || !phone || !address || !city || !state || !pincode) {
    alert("Please fill all mandatory fields");
    return;
  }

  CURRENT_ORDER.customer = {
    name,
    phone,
    address,
    city,
    state,
    pincode,
    landmark: custLandmark.value.trim()
  };

  openPaymentMode();
}

/* ---------- PAYMENT MODE ---------- */
function openPaymentMode() {
  closeModal();
  const p = CURRENT_ORDER.product;

  document.body.insertAdjacentHTML("beforeend", `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h3>Payment Method</h3>
        <p><b>${p.name}</b> – ₹${p.price}</p>

        <button onclick="payOnline()">Pay Online (UPI)</button>
        <button onclick="payCOD()">Cash on Delivery</button>
        <button onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

/* ---------- ONLINE PAYMENT ---------- */
function payOnline() {
  const p = CURRENT_ORDER.product;
  sendWhatsApp("Online (Payment Pending)");

  const upi = `upi://pay?pa=9431541689@ibl&pn=LeGifte&am=${p.price}&cu=INR`;
  window.location.href = upi;

  alert(
    "Payment window opened.\n" +
    "After payment, we will verify and confirm your order on WhatsApp."
  );
}

/* ---------- COD ---------- */
function payCOD() {
  sendWhatsApp("Cash on Delivery");
  alert("Order placed successfully.\nWe will contact you shortly on WhatsApp.");
}

/* ---------- WHATSAPP MESSAGE TO SELLER ---------- */
function sendWhatsApp(paymentMode) {
  const o = CURRENT_ORDER;
  const c = o.customer;
  const p = o.product;

  let msg =
`🛒 NEW ORDER

Product: ${p.name}
Price: ₹${p.price}
Message: ${o.message || "N/A"}

Customer Details:
Name: ${c.name}
Phone: ${c.phone}
Address: ${c.address}
City/Village: ${c.city}
State: ${c.state}
Pincode: ${c.pincode}
Landmark: ${c.landmark || "N/A"}

Payment Mode: ${paymentMode}`;

  window.open(`https://wa.me/919431541689?text=${encodeURIComponent(msg)}`);
}

/* ---------- MODAL CLOSE ---------- */
function closeModal() {
  document.getElementById("modal")?.remove();
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderProducts);
