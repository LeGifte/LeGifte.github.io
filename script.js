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
    name: "Mini 6 Beauty Item Cup Hamper",
    price: 299,
    imgs: ["images/cup-hamper-1.jpg","images/cup-hamper-2.jpg"],
    customizable: true
  },
  {
    id: 3,
    name: "Men Customizable Hamper",
    price: 2999,
    imgs: ["images/men-hamper-1.jpg","images/men-hamper-2.jpg"],
    customizable: true
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function renderProducts() {
  const box = document.getElementById("product-list");
  box.innerHTML = "";

  PRODUCTS.forEach(p => {
    box.innerHTML += `
      <div class="product">
        <img src="${p.imgs[0]}" />
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <textarea id="msg-${p.id}" placeholder="Custom message (optional)"></textarea>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
        <button onclick="addToWishlist(${p.id})">❤ Wishlist</button>
      </div>
    `;
  });
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const msg = document.getElementById(msg-${id}).value;
  cart.push({...p, message: msg});
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

function addToWishlist(id){
  const p = PRODUCTS.find(x=>x.id===id);
  wishlist.push(p);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Added to wishlist");
}

function openCart(){
  document.getElementById("cartModal").classList.remove("hidden");
  document.getElementById("cartItems").innerHTML =
    cart.map(i=><p>${i.name} - ₹${i.price}</p>).join("");
}

function closeCart(){
  document.getElementById("cartModal").classList.add("hidden");
}

function openWishlist(){
  document.getElementById("wishlistModal").classList.remove("hidden");
  document.getElementById("wishlistItems").innerHTML =
    wishlist.map(i=><p>${i.name}</p>).join("");
}

function closeWishlist(){
  document.getElementById("wishlistModal").classList.add("hidden");
}

function checkoutUPI(){
  const total = cart.reduce((s,i)=>s+i.price,0);
  const upi = upi://pay?pa=9431541689@ibl&pn=LeGifte&am=${total}&cu=INR;
  window.location.href = upi;
}

function checkoutCOD(){
  window.open("https://wa.me/919431541689?text=I want Cash on Delivery order");
}

document.addEventListener("DOMContentLoaded", renderProducts);
