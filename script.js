// 1.Category Loading Load Tree Categories dynamically on the left side.
const categoryContainer = document.getElementById("categoryContainer");
const plantsContainer = document.getElementById("plantsContainer");
const plantsDetailsModal = document.getElementById("plants-details-modal");
const modalContainer = document.getElementById("modalContainer");

const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;

      showCategory(categories);
    })
    .catch((err) => {
      console.log(err);
    });
};

const showCategory = (categories) => {
  categoryContainer.innerHTML = "";
  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
            
            <li onclick="loadPlantsByCategory(${cat.id}, this)" class=" category-plants cursor-pointer hover:bg-[#15803D] rounded-sm">${cat.category_name}</li>
        `;
  });
};

// 2. Category Click → Tree Data On clicking a category: load trees of that category

const loadPlantsByCategory = (categoryId, element) => {
  //   console.log(categoryId);
  const allCategories = document.querySelectorAll(".category-plants");
  allCategories.forEach((cat) =>
    cat.classList.remove(
      "bg-[#15803D]",
      "rounded-sm",
      "text-[#FFFFFF]",
      "font-bold"
    )
  );

  if (element) {
    element.classList.add(
      "bg-[#15803D]",
      "rounded-sm",
      "text-[#FFFFFF]",
      "font-bold"
    );
  }

  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => {
      showPlantsByCategory(data.plants);
    })
    .catch((err) => {
      showError();
    });
};

const showPlantsByCategory = (plants) => {
  if (plants.length === 0) {
    showEmptyMessage();
    // alert('No news found for this category!')
    return;
  }
  plantsContainer.innerHTML = "";
  plants.forEach((plants) => {
    plantsContainer.innerHTML += `
        <div class="card bg-base-100 shadow-sm w-full">
            <figure>
              <img
                src="${plants.image}"
                alt="Mango Tree"
                class="w-full h-48 object-cover"
              />
            </figure>
            <div id="${plants.id}" class="card-body">
              <h2
               class="card-title">${plants.name}</h2>
              <p>
                ${plants.description}
              </p>
                        <div class="flex justify-between items-center gap-4">
                            <!-- Button -->
                            <button class="bg-[#DCFCE7] text-[#15803D] rounded-full px-2 py-2">
                                ${plants.category}
                            </button>

                            <!-- Price -->
                            <p class="font-bold"> ৳ ${plants.price} </p>
                        </div>
              <div class="card-actions">
                <button class="btn bg-[#15803D] w-full text-white rounded-full">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        `;
  });
};

//  automitically load all plants

const loadAllPlants = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      showPlantsByCategory(data.plants);
    })
    .catch((err) => {
      showError();
    });
};

// show plants modal
plantsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("card-title")) {
    const cardBody = e.target.parentNode;
    const id = cardBody.id;

    fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const plant = data.plants;
        showDetailsPlants(plant);
      })
      .catch((err) => console.log(err));
  }
});

const showDetailsPlants = (plant) => {
  plantsDetailsModal.showModal();
  modalContainer.innerHTML = `
    <h1 class="text-2xl font-bold mb-2">${plant.name}</h1>
    <img src="${plant.image}" alt="${plant.name}" class="w-full h-64 object-cover mb-2"/>
    
    <p><span class="font-semibold">Category:</span> ${plant.category}</p>
    <p><span class="font-semibold">Price:</span> ৳ ${plant.price}</p>
    <p class="mb-2"><span class="font-semibold">Description:</span> ${plant.description}</p>
  `;
};

loadCategory();
loadPlantsByCategory();
loadAllPlants();
