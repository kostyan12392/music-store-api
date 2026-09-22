const express = require('express');
const app = express();

const productsRouter = require('./routes/products');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/products', productsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});