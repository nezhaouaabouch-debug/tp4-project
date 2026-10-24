import { state } from "./state.js";
import { loadData } from "./dataService.js";
import { getCategories } from "./selectors.js";
import { render } from "./view.js";

function renderCategories() {
  const select = document.querySelector("#category-filter");
  const categories = getCategories();

  select.innerHTML = `
    <option value="">Toutes les catégories</option>
    ${categories.map(category => `
      <option value="${category}">${category}</option>
    `).join("")}
  `;
}

function bindEvents() {
  document.querySelector("#search-input").addEventListener("input", event => {
    state.search = event.target.value;
    render();
  });

  document.querySelector("#status-filter").addEventListener("change", event => {
    state.status = event.target.value;
    render();
  });

  document.querySelector("#category-filter").addEventListener("change", event => {
    state.category = event.target.value;
    render();
  });
}

async function init() {
  const errorContainer = document.querySelector("#error-message");

  try {
    const data = await loadData();

    state.customers = data.customers;
    state.products = data.products;
    state.orders = data.orders;

    renderCategories();
    bindEvents();
    render();
  } catch (error) {
    console.error("Échec du chargement des données :", error);
    errorContainer.textContent =
      "Impossible de charger les données. Vérifiez les fichiers JSON et leur chemin.";
    errorContainer.classList.remove("d-none");
  }
}

init();
const cart = [];

const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const clearButton = document.querySelector("#clear-cart");

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    cart.push({ name, price });
    renderCart();
  });
});

clearButton.addEventListener("click", () => {
  cart.length = 0;
  renderCart();
});

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<li class="empty-cart">Votre panier est vide.</li>';
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} — ${item.price} DH`;
      cartItems.appendChild(li);
    });
  }

  cartTotal.textContent = cart.reduce((sum, item) => sum + item.price, 0);
}