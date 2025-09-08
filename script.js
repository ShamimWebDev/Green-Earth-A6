const categoryContainer = document.getElementById("categoryContainer");
const plantsContainer = document.getElementById("plantsContainer");
const plantsDetailsModal = document.getElementById("plants-details-modal");
const modalContainer = document.getElementById("modalContainer");

let cart = [];
let totalPrice = 0;

//Load Categories
const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => showCategory(data.categories))
    .catch(() => console.log("Category load error"));
};

const showCategory = (categories) => {
  categoryContainer.innerHTML = "";
  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
      <li onclick="loadPlantsByCategory(${cat.id}, this)"
          class="category-plants cursor-pointer hover:bg-[#15803D] rounded-sm px-2 py-1">
        ${cat.category_name}
      </li>
    `;
  });
};

// Load Plants by Category
const loadPlantsByCategory = (categoryId, element) => {
  document
    .querySelectorAll(".category-plants")
    .forEach((cat) =>
      cat.classList.remove("bg-[#15803D]", "text-white", "font-bold")
    );

  if (element) element.classList.add("bg-[#15803D]", "text-white", "font-bold");

  plantsContainer.innerHTML =
    '<div class="col-span-3  p-3 text-center rounded"> <span class="loading loading-dots loading-lg"></span></div>';

  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => showPlants(data.plants))
    .catch(() => console.log("Plant load error"));
};

// Show all Plants
const showPlants = (plants) => {
  plantsContainer.innerHTML = "";
  plants.forEach((plant) => {
    plantsContainer.innerHTML += `
      <div class="card bg-white shadow-sm w-full">
        <figure>
          <img src="${plant.image}" alt="${plant.name}" class="w-full h-48 object-cover"/>
        </figure>
        <div id="${plant.id}" class="card-body">
          <h2 class="card-title cursor-pointer">${plant.name}</h2>
          <p>${plant.description}</p>
          <div class="flex justify-between items-center gap-4">
            <button class="bg-[#DCFCE7] text-[#15803D] rounded-full px-2 py-1">${plant.category}</button>
            <p class="font-bold">৳ ${plant.price}</p>
          </div>
          <div class="card-actions">
            <button class="btn bg-[#15803D] w-full text-white rounded-full">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
};

// Event Listener
plantsContainer.addEventListener("click", (e) => {
  const cardBody = e.target.closest(".card-body");
  if (!cardBody) return;

  const id = cardBody.id;
  const plantName = cardBody.querySelector(".card-title").innerText;
  const plantPrice = parseFloat(
    cardBody.querySelector("p.font-bold").innerText.replace("৳", "").trim()
  );

  // Open Plant  Modal
  if (e.target.classList.contains("card-title")) {
    fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
      .then((res) => res.json())
      .then((data) => showDetailsPlants(data.plants))
      .catch((err) => console.log(err));
  }

  // Add to Cart
  if (e.target.tagName === "BUTTON" && e.target.innerText.includes("Add")) {
    addToCart(id, plantName, plantPrice);
  }
});

// Add to Cart button - alert
const addToCart = (id, name, price) => {
  alert(`${name} has been added to the cart!`);

  let existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }

  totalPrice += price;
  showCart();
};

// Show Cart on the right//
const showCart = () => {
  const cartContainer = document.getElementById("cartContainer");
  const cartTotalDiv = document.getElementById("cartTotalDiv");
  const cartTotal = document.getElementById("cartTotal");

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartTotalDiv.style.display = "none";
  } else {
    cartTotalDiv.style.display = "flex";

    cart.forEach((item, index) => {
      cartContainer.innerHTML += `
        <div class="flex justify-between items-center bg-green-50 px-4 py-2 rounded">
          <div>
            <p class="font-medium text-gray-800">${item.name}</p>
            <p class="text-sm text-gray-500">৳${item.price} × ${item.qty}</p>
          </div>
          <button onclick="removeFromCart(${index})" 
            class=" text-red-500 text-xl leading-none">&times;
          </button>
        </div>
      `;
    });

    cartTotal.innerText = `৳${totalPrice}`;
  }
};

//  Remove from Cart
const removeFromCart = (index) => {
  totalPrice -= cart[index].price * cart[index].qty;
  cart.splice(index, 1);
  showCart();
};

//Plants  Modal
const showDetailsPlants = (plant) => {
  plantsDetailsModal.showModal();
  modalContainer.innerHTML = `
    <h1 class="text-2xl font-bold mb-2">${plant.name}</h1>
    <img src="${plant.image}" alt="${plant.name}" class="w-full h-64 object-cover mb-2"/>
    <p><span class="font-semibold">Category:</span> ${plant.category}</p>
    <p><span class="font-semibold">Price:</span> ৳${plant.price}</p>
    <p class="mb-2"><span class="font-semibold">Description:</span> ${plant.description}</p>
  `;
};

// . Load All Plants  automatically
const loadAllPlants = () => {
  plantsContainer.innerHTML = `
    <div class="col-span-3 p-3 text-center rounded">
      <span class="loading loading-dots loading-lg"></span>
    </div>
  `;

  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => showPlants(data.plants))
    .catch(() => console.log("All plants load error"));
};

loadCategory();
loadAllPlants();
