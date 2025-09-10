// Fetch and display all orders
function fetchOrders() {
  fetch('/api/orders').then(r => r.json()).then(orders => {
    if (!orders.length) {
      ordersDiv.innerHTML = '<i>No orders yet.</i>';
      return;
    }
    let html = '<table><tr><th class="name-col">Name</th><th class="pizza-col">Pizza</th><th class="ing-col">Ingredients</th></tr>';
    for (const o of orders) {
      html += `<tr><td class="name-col">${o.name}</td><td class="pizza-col">${o.pizza}</td><td class="ing-col">${[...(o.ingredients||[]), ...(o.customIngredients||[])].join(', ')}</td></tr>`;
    }
    html += '</table>';
    ordersDiv.innerHTML = html;
  });
}
const ordersDiv = document.getElementById('orders');
fetchOrders();
setInterval(fetchOrders, 5000); // Refresh every 5s
