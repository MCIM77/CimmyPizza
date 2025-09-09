// Simple SPA logic for login, pizza selection, customization, and order summary
const pizzas = [
  { name: 'Margherita', ingredients: ['tomato', 'mozzarella', 'basil', 'olive oil'] },
  { name: 'Marinara', ingredients: ['tomato', 'garlic', 'oregano', 'olive oil'] },
  { name: 'Diavola', ingredients: ['tomato', 'mozzarella', 'Nduja', 'olive oil'] },
  { name: 'Quattro Formaggi', ingredients: ['mozzarella', 'gorgonzola', 'Pecorino abbuzzese', 'parmesan'] },
  { name: 'Mimosa', ingredients: ['panna', 'mozzarella', 'olive oil', 'corn', ' basil ', 'parmesan'] },  
  { name: 'Bianca Base', ingredients: ['panna', 'mozzarella', 'olive oil', 'parmesan'] },
  { name: 'Rossa Base', ingredients: ['tomato', 'mozzarella', 'olive oil', 'parmesan'] }
];
const allIngredients = [
  'tomato', 'mozzarella', 'basil', 'olive oil', 'olives', 'mushrooms', 'ham', 'Nduja', 'aubergines',
  'Peperoni', 'oregano', 'gorgonzola', 'Pecorino abbuzzese','garlic', 'parmesan', 'corn', 'zucchini', 'panna'
];
let user = { name: '', pizza: '', ingredients: [], customIngredients: [] };

function renderLogin() {
  app.innerHTML = `<h1>Pizza Order</h1>
    <label>Your name:<br><input id="name" /></label><br>
    <button id="loginBtn">Login</button>`;
  document.getElementById('loginBtn').onclick = () => {
    const name = document.getElementById('name').value.trim();
    if (name) {
      user.name = name;
      renderPizzaSelect();
    }
  };
}

function renderPizzaSelect() {
  app.innerHTML = `<h2>Hi, ${user.name}!</h2>
    <label>Choose your pizza:<br>
      <select id="pizzaSel">
        <option value="">-- Select --</option>
        ${pizzas.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
      </select>
    </label><br>
    <button id="nextBtn" disabled>Next</button>`;
  const pizzaSel = document.getElementById('pizzaSel');
  pizzaSel.onchange = () => {
    document.getElementById('nextBtn').disabled = !pizzaSel.value;
  };
  document.getElementById('nextBtn').onclick = () => {
    user.pizza = pizzaSel.value;
    user.ingredients = pizzas.find(p => p.name === user.pizza).ingredients.slice();
    user.customIngredients = [];
    renderCustomize();
  };
}

function renderCustomize() {
  const pizza = pizzas.find(p => p.name === user.pizza);
  app.innerHTML = `<h2>${user.pizza}</h2>
    <div>Standard ingredients:</div>
    <ul>${pizza.ingredients.map(ing => `<li><label><input type="checkbox" class="ing" value="${ing}" checked> ${ing}</label></li>`).join('')}</ul>
    <div>Add more ingredients:</div>
    <ul>${allIngredients.filter(ing => !pizza.ingredients.includes(ing)).map(ing => `<li><label><input type="checkbox" class="add-ing" value="${ing}"> ${ing}</label></li>`).join('')}</ul>
    <label>Custom ingredient: <input id="customIng" placeholder="Type and press Enter"></label>
    <div style="font-size:0.95em;color:#666;margin-bottom:0.5em">(A discrezione della direzione i custom ingredient ve li dovete portare da casa!!! )</div>
    <ul id="customList"></ul>
    <button id="orderBtn">Submit Order</button>`;
  // Remove ingredients
  document.querySelectorAll('.ing').forEach(cb => {
    cb.onchange = () => {
      if (cb.checked) {
        if (!user.ingredients.includes(cb.value)) user.ingredients.push(cb.value);
      } else {
        user.ingredients = user.ingredients.filter(i => i !== cb.value);
      }
    };
  });
  // Add ingredients
  document.querySelectorAll('.add-ing').forEach(cb => {
    cb.onchange = () => {
      if (cb.checked) {
        if (!user.ingredients.includes(cb.value)) user.ingredients.push(cb.value);
      } else {
        user.ingredients = user.ingredients.filter(i => i !== cb.value);
      }
    };
  });
  // Custom ingredient
  document.getElementById('customIng').onkeydown = e => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (val && !user.customIngredients.includes(val)) {
        user.customIngredients.push(val);
        updateCustomList();
        e.target.value = '';
      }
    }
  };
  function updateCustomList() {
    document.getElementById('customList').innerHTML = user.customIngredients.map((ing, i) => `<li>${ing} <button onclick="removeCustom(${i})">x</button></li>`).join('');
  }
  window.removeCustom = i => {
    user.customIngredients.splice(i, 1);
    updateCustomList();
  };
  document.getElementById('orderBtn').onclick = submitOrder;
}

function submitOrder() {
  const order = {
    name: user.name,
    pizza: user.pizza,
    ingredients: user.ingredients,
    customIngredients: user.customIngredients
  };
  fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  }).then(res => res.json()).then(() => {
    renderSummary();
  });
}

function renderSummary() {
  app.innerHTML = `<h2>Order Summary</h2>
    <div><b>Name:</b> ${user.name}</div>
    <div><b>Pizza:</b> ${user.pizza}</div>
    <div><b>Ingredients:</b> ${user.ingredients.concat(user.customIngredients).join(', ')}</div>
    <a href="/admin" target="_blank">See all orders (admin)</a><br>
    <button id="newOrderBtn">New Order</button>`;
  document.getElementById('newOrderBtn').onclick = () => {
    user = { name: '', pizza: '', ingredients: [], customIngredients: [] };
    renderLogin();
  };
}

const app = document.getElementById('app');
renderLogin();
