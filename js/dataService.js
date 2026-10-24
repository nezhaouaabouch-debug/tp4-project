async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors du chargement de ${path}`);
  }

  return response.json();
}

export async function loadData() {
  const [customers, products, orders] = await Promise.all([
    loadJson("./data/customers.json"),
    loadJson("./data/products.json"),
    loadJson("./data/orders.json")
  ]);

  return { customers, products, orders };
}

