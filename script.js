// 1.Category Loading Load Tree Categories dynamically on the left side.
const categoryContainer = document.getElementById("categoryContainer");
const plantsContainer = document.getElementById("plantsContainer");

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
            
            <li onclick="loadPlantsByCategory(${cat.id})" class="cursor-pointer hover:text-[#15803D]">${cat.category_name}</li>
        `;
  });
};

// 2. Category Click → Tree Data On clicking a category: load trees of that category

const loadPlantsByCategory = (categoryId) => {
  //   console.log(categoryId);
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
              <h2 class="card-title">${plants.name}</h2>
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

loadCategory();
loadPlantsByCategory();
