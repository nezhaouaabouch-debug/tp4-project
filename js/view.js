import {
  getFilteredOrders,
  getOrderDetails,
  getStatistics
} from "./selectors.js";

const money = value =>
  `${new Intl.NumberFormat("fr-MA").format(value)} MAD`;

export function render() {
  renderStatistics();
  renderOrders();
}

export function renderStatistics() {
  const stats = getStatistics();
  const container = document.querySelector("#statistics");

  container.innerHTML = `
    <div class="col-md-3">
      <div class="card card-body h-100">Clients : ${stats.customers}</div>
    </div>
    <div class="col-md-3">
      <div class="card card-body h-100">Produits : ${stats.products}</div>
    </div>
    <div class="col-md-3">
      <div class="card card-body h-100">Commandes : ${stats.orders}</div>
    </div>
    <div class="col-md-3">
      <div class="card card-body h-100">
        Montant cumulé : ${money(stats.totalAmount)}
      </div>
    </div>
  `;
}

export function renderOrders() {
  const container = document.querySelector("#orders-container");
  const orders = getFilteredOrders();

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <p class="alert alert-info">Aucune commande trouvée.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    const details = getOrderDetails(order);

    const itemsHtml = details.items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${money(item.price)}</td>
        <td>${item.quantity}</td>
        <td>${money(item.lineTotal)}</td>
      </tr>
    `).join("");

    return `
      <div class="col-md-6">
        <article class="card h-100">
          <div class="card-body">
            <h3 class="h5">Commande #${order.id}</h3>
            <p><strong>Client :</strong>
              ${details.customer?.name ?? "Client introuvable"}
            </p>
            <p><strong>Ville :</strong>
              ${details.customer?.city ?? "—"}
            </p>
            <p><strong>Date :</strong> ${order.date}</p>
            <p><strong>Statut :</strong> ${order.status}</p>

            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>Quantité</th>
                    <th>Total ligne</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>
            </div>

            <p class="fw-bold mb-0">
              Total : ${money(details.total)}
            </p>
          </div>
        </article>
      </div>
    `;
  }).join("");
}