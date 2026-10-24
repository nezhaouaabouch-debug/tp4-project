import { state } from "./state.js";

export function getCustomer(order) {
  return state.customers.find(customer => customer.id === order.customerId);
}

export function getOrderItems(order) {
  return order.items.map(item => {
    const product = state.products.find(product => product.id === item.productId);

    return {
      product,
      quantity: item.quantity,
      lineTotal: product ? product.price * item.quantity : 0
    };
  });
}

export function getOrderTotal(order) {
  return getOrderItems(order).reduce(
    (total, item) => total + item.lineTotal,
    0
  );
}