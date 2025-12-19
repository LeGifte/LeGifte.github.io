// ✅ GOOGLE SHEET WEB APP URL (CONFIRMED)
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxtd00FIPgoYL-XrtfwKGqBlM6_WwaTOq9NymQWQ9pKzU2tIRLsUBmu13h21GKF98gU/exec";

let products = [];
let cart = [];
let wishlist = [];

// 🔹 Load products when page loads
document.addEventListener("DOMContentLoaded", loadProducts);

// 🔹 Fetch data from Google Sheet
async function loadProducts() {
  try {
    const response = await fetch(SHEET_URL);
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Sheet data is not an array:", data);
      return;
    }

    products = data;
    renderProducts();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// 🔹 PRODUCT LISTING (MAIN PART)
function renderProducts() {
  const container = document.getElementById("product-list");

  if (!container) {
    console.error("❌ product-list div not found in HTML");
    return;
  }

  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products available</p>";
    return;
  }

  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>

      <button onclick="addToCart(${index})">Add to Cart</button>
      <button onclick="addToWishlist(${index})">💛 Wishlist</button>
    `;

    container.appendChild(card);
  });
}

// 🔹 CART FUNCTIONS
function addToCart(index) {
  cart.push(products[index]);
  alert("Added to cart");
}

function openCart() {
  const box = document.getElementById("cartItems");
  box.innerHTML = "";

  if (cart.length === 0) {
    box.innerHTML = "<p>Your cart is empty</p>";
  }

  cart.forEach(item => {
    box.innerHTML += `<p>${item.name} – ₹${item.price}</p>`;
  });

  document.getElementById("cartModal").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cartModal").classList.add("hidden");
}

// 🔹 WISHLIST FUNCTIONS
function addToWishlist(index) {
  wishlist.push(products[index]);
  alert("Added to wishlist");
}

function openWishlist() {
  const box = document.getElementById("wishlistItems");
  box.innerHTML = "";

  if (wishlist.length === 0) {
    box.innerHTML = "<p>No items in wishlist</p>";
  }

  wishlist.forEach(item => {
    box.innerHTML += `<p>${item.name}</p>`;
  });

  document.getElementById("wishlistModal").classList.remove("hidden");
}

function closeWishlist() {
  document.getElementById("wishlistModal").classList.add("hidden");
}

// 🔹 WHATSAPP CHECKOUT
function checkout() {
  let message = "Order Details:%0A";

  cart.forEach(item => {
    message += `${item.name} - ₹${item.price}%0A`;
  });

  window.open(
    `https://wa.me/919431541689?text=${message}`,
    "_blank"
  );
}
