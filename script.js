/*************** CONFIG ***************/
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtd00FIPgoYL-XrtfwKGqBlM6_WwaTOq9NymQWQ9pKzU2tIRLsUBmu13h21GKF98gU/exec";
const SELLER_PHONE = "919431541689";
const UPI_ID = "9431541689@ibl";

/*************** PRODUCTS ***************/
const PRODUCTS = [
  { id: 1, name: "Mini Hamper", price: 599, customizable: true },
  { id: 2, name: "Make Up Bouquet", price: 999, customizable: false },
  { id: 3, name: "12 Beauty Products Hamper", price: 1299, customizable: false },
  { id: 4, name: "Mini 6 Beauty Item Cup Hamper", price: 299, customizable: true },
  { id: 5, name: "Men Customizable Hamper", price: 2999, customizable: true }
];

let selectedProduct = null;

/*************** BUY NOW ***************/
function buyNow(id) {
  selectedProduct = PRODUCTS.find(p => p.id === id);
  openOrderForm();
}

/*************** ORDER FORM ***************/
function openOrderForm() {
  closeModal();

  const msgBox = selectedProduct.customizable
    ? <textarea id="giftMsg" placeholder="Gift Message (optional)"></textarea>
    : ``;

  document.body.insertAdjacentHTML("beforeend", `
    <div id="modal" class="modal">
      <div class="modal-box">
        <h2>${selectedProduct.name}</h2>
        <p>₹${selectedProduct.price}</p>

        <input id="custName" placeholder="Name" required>
        <input id="custPhone" placeholder="Phone" required>
        <textarea id="custAddress" placeholder="Full Address" required></textarea>

        ${msgBox}

        <select id="paymentMode">
          <option value="Online">Online Payment</option>
          <option value="COD">Cash on Delivery</option>
        </select>

        <button onclick="placeOrder()">Order Now</button>
        <button onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
}

/*************** PLACE ORDER ***************/
function placeOrder() {
  const data = {
    product: selectedProduct.name,
    price: selectedProduct.price,
    name: document.getElementById("custName").value,
    phone: document.getElementById("custPhone").value,
    address: document.getElementById("custAddress").value,
    paymentMode: document.getElementById("paymentMode").value,
    message: document.getElementById("giftMsg")?.value || ""
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(res => {
    closeModal();
    if (data.paymentMode === "Online") {
      openUPI(data);
    } else {
      openCOD(data);
    }
  });
}

/*************** ONLINE PAYMENT ***************/
function openUPI(data) {
  const upiURL = upi://pay?pa=${UPI_ID}&pn=LeGifte&am=${data.price}&cu=INR;
  window.location.href = upiURL;

  setTimeout(() => {
    const msg = Hi, I have paid ₹${data.price} for ${data.product}. Please find payment screenshot.;
    window.location.href =
      https://wa.me/${SELLER_PHONE}?text=${encodeURIComponent(msg)};
  }, 3000);
}

/*************** COD ***************/
function openCOD(data) {
  const msg = New COD Order\n\nProduct: ${data.product}\nPrice: ₹${data.price}\nName: ${data.name}\nPhone: ${data.phone}\nAddress: ${data.address};
  window.location.href =
    https://wa.me/${SELLER_PHONE}?text=${encodeURIComponent(msg)};
}

/*************** UTIL ***************/
function closeModal() {
  document.getElementById("modal")?.remove();
}
