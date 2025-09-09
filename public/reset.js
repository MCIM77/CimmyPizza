document.getElementById('resetBtn').onclick = function() {
  if (confirm('Are you sure you want to delete all orders?')) {
    fetch('/api/orders', { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        document.getElementById('result').textContent = data.success ? 'All orders have been reset.' : 'Failed to reset orders.';
      });
  }
};
