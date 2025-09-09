const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory order storage
let orders = [];

// API: Get all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// API: Add new order
app.post('/api/orders', (req, res) => {
  const order = req.body;
  if (!order || !order.name || !order.pizza) {
    return res.status(400).json({ error: 'Invalid order' });
  }
  orders = orders.filter(o => o.name !== order.name); // Overwrite previous order by same name
  orders.push(order);
  res.json({ success: true });
});

// API: Delete all orders
app.delete('/api/orders', (req, res) => {
  orders = [];
  res.json({ success: true });
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve reset page
app.get('/reset', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset.html'));
});

app.listen(PORT, () => {
  console.log(`Pizza order app running at http://localhost:${PORT}`);
});
