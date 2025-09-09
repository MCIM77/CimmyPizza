// Fetch and display all orders
function fetchOrders() {
  fetch('/api/orders').then(r => r.json()).then(orders => {
    if (!orders.length) {
      ordersDiv.innerHTML = '<i>No orders yet.</i>';
      return;
    }
    let html = '<table><tr><th>Name</th><th>Pizza</th><th>Ingredients</th></tr>';
    for (const o of orders) {
      html += `<tr><td>${o.name}</td><td>${o.pizza}</td><td>${[...(o.ingredients||[]), ...(o.customIngredients||[])].join(', ')}</td></tr>`;
    }
    html += '</table>';
    ordersDiv.innerHTML = html;
  });
}
const ordersDiv = document.getElementById('orders');
fetchOrders();
setInterval(fetchOrders, 5000); // Refresh every 5s
