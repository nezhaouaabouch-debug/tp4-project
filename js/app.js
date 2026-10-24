import { state } from "./state.js";
import { loadData } from "./dataService.js";
import { render } from "./view.js";
import { getOrderDetails } from "./selectors.js";

async function init() {
  try {
    const data = await loadData();

    state.customers = data.customers;
    state.products = data.products;
    state.orders = data.orders;

    render();
    attachEvents();
  } catch (error) {
    console.error(error);

    const errorBox = document.querySelector("#error-message");
    errorBox.textContent =
      "Les données n’ont pas pu être chargées. Vérifiez les fichiers JSON et le serveur local.";
    errorBox.classList.remove("d-none");
  }
}

function attachEvents() {
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

  document.querySelector("#orders-container").addEventListener("click", event => {
    const button = event.target.closest("[data-order-id]");
    if (!button) return;

    const order = state.orders.find(
      order => order.id === Number(button.dataset.orderId)
    );

    if (order) showOrderDetails(order);
  });
}

function showOrderDetails(order) {
  const details = getOrderDetails(order);

  const lines = details.items.map(item =>
    `${item.product?.name ?? "Produit introuvable"} — ` +
    `${item.product?.price ?? 0} MAD × ${item.quantity} = ` +
    `${item.lineTotal} MAD`
  ).join("\n");

  alert(
    `Commande #${order.id}\n` +
    `Client : ${details.customer?.name ?? "Inconnu"}\n` +
    `Ville : ${details.customer?.city ?? "Inconnue"}\n` +
    `Date : ${order.date}\n` +
    `Statut : ${order.status}\n\n` +
    `${lines}\n\n` +
    `Total : ${details.total} MAD`
  );
}

init();