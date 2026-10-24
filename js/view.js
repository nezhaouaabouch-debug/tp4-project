import { getFilteredOrders, getOrderDetails, getStatistics } from "./selectors.js";

const money = value =>
  `${new Intl.NumberFormat("fr-MA").format(value)} MAD`;

export function render() {
  renderStatistics();
  renderOrders();
}

function renderStatistics() {
  const stats = getStatistics();
  const container = document.querySelector("#statistics");

  container.innerHTML = `
    <div class="col-md-3"><div class="card card-body">
      Clients : ${stats.customers}
    </div></div>
    <div class="col-md-3"><div class="card card-body">
      Produits : ${stats.products}
    </div></div>
    <div class="col-md-3"><div class="card card-body">
      Commandes : ${stats.orders}
    </div></div>
    <div class="col-md-3"><div class="card card-body">
      Montant cumulé : ${money(stats.totalAmount)}
    </div></div>
  `;
}

function renderOrders() {
  const container = document.querySelector("#orders-container");
  const orders = getFilteredOrders();

  container.innerHTML = orders.map(order => {
    const details = getOrderDetails(order);

    return `
      <div class="col-md-6">
        <article class="card h-100">
          <div class="card-body">
            <h2 class="h5">Commande #${order.id}</h2>
            <p>Client : ${details.customer?.name ?? "Client introuvable"}</p>
            <p>Date : ${order.date}</p>
            <p>Statut : ${order.status}</p>
            <p>Total : ${money(details.total)}</p>
            <button class="btn btn-primary" data-order-id="${order.id}">
              Détail
            </button>
          </div>
        </article>
      </div>
    `;
  }).join("");
}