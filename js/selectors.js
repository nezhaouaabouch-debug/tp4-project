import { state } from "./state.js";

export function getOrderDetails(order) {
  const customer = state.customers.find(
    item => item.id === order.customerId
  );

  const items = order.items.map(item => {
    const product = state.products.find(
      productItem => productItem.id === item.productId
    );

    if (!product) {
      return {
        name: "Produit introuvable",
        category: "",
        price: 0,
        quantity: item.quantity,
        lineTotal: 0
      };
    }

    return {
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity
    };
  });

  let total = 0;
  items.forEach(item => {
    total += item.lineTotal;
  });

  return { customer, items, total };
}

export function getFilteredOrders() {
  const search = state.search.trim().toLowerCase();

  return state.orders.filter(order => {
    const details = getOrderDetails(order);
    const customerName = details.customer?.name.toLowerCase() ?? "";

    const matchesSearch = customerName.includes(search);
    const matchesStatus = !state.status || order.status === state.status;

    const matchesCategory =
      !state.category ||
      details.items.some(item => item.category === state.category);

    return matchesSearch && matchesStatus && matchesCategory;
  });
}

export function getStatistics() {
  let totalAmount = 0;

  state.orders.forEach(order => {
    totalAmount += getOrderDetails(order).total;
  });

  return {
    customers: state.customers.length,
    products: state.products.length,
    orders: state.orders.length,
    totalAmount
  };
}

export function getCategories() {
  return [...new Set(state.products.map(product => product.category))];
}

