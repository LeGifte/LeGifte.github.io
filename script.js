// 🔴 PASTE YOUR GOOGLE SHEET WEB APP URL HERE
const SHEET_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

let products = [];
let cart = [];
let wishlist = [];

/* LOAD PRODUCTS */
fetch(SHEET_URL)
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts();
  })
  .catch(err => console.error("Sheet error", err));

function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  products.forEach(p => {
    list.innerHTML += `
      <div class="product-card">
        <img src="${p.image}">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <button onclick="addToCart('${p.name}', '${p.price}')">Add to Cart</button>
        <button onclick="addToWishlist('${p.name}')">Wishlist</button>
      </div>
    `;
  });
}

/* CART */
function addToCart(name, price) {
  cart.push({ name, price });
  alert("Added to cart");
}

function openCart() {
  const box = document.getElementById("cartItems");
  box.innerHTML = "";
  cart.forEach(i => box.innerHTML += `<p>${i.name} – ₹${i.price}</p>`);
  document.getElementById("cartModal").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cartModal").classList.add("hidden");
}

/* WISHLIST */
function addToWishlist(name) {
  wishlist.push(name);
  alert("Added to wishlist");
}

function openWishlist() {
  const box = document.getElementById("wishlistItems");
  box.innerHTML = "";
  wishlist.forEach(i => box.innerHTML += `<p>${i}</p>`);
  document.getElementById("wishlistModal").classList.remove("hidden");
}

function closeWishlist() {
  document.getElementById("wishlistModal").classList.add("hidden");
}

/* CHECKOUT */
function checkout() {
  let msg = "Order Details:%0A";
  cart.forEach(i => msg += `${i.name} - ₹${i.price}%0A`);
  window.open(`https://wa.me/919431541689?text=${msg}`, "_blank");
}
