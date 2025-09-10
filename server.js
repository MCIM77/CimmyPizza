
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render') ? { rejectUnauthorized: false } : false
});

// Ensure orders table exists
async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS orders (
    name TEXT PRIMARY KEY,
    pizza TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    custom_ingredients TEXT NOT NULL
  )`);
}
ensureTable();

// API: Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    const orders = result.rows.map(row => ({
      name: row.name,
      pizza: row.pizza,
      ingredients: JSON.parse(row.ingredients),
      customIngredients: JSON.parse(row.custom_ingredients)
    }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// API: Add new order
app.post('/api/orders', async (req, res) => {
  const order = req.body;
  if (!order || !order.name || !order.pizza) {
    return res.status(400).json({ error: 'Invalid order' });
  }
  try {
    await pool.query(
      'INSERT INTO orders (name, pizza, ingredients, custom_ingredients) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO UPDATE SET pizza = EXCLUDED.pizza, ingredients = EXCLUDED.ingredients, custom_ingredients = EXCLUDED.custom_ingredients',
      [order.name, order.pizza, JSON.stringify(order.ingredients), JSON.stringify(order.customIngredients)]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// API: Delete all orders
app.delete('/api/orders', async (req, res) => {
  try {
    await pool.query('DELETE FROM orders');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
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
