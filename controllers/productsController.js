const { Product } = require('../models');

// Валидация входных данных
function validateProduct(body) {
  const { title, artist, price, stock } = body;

  if (!title || typeof title !== 'string') {
    return 'title is required and must be a string';
  }

  if (!artist || typeof artist !== 'string') {
    return 'artist is required and must be a string';
  }

  if (typeof price !== 'number' || price <= 0) {
    return 'price must be a positive number';
  }

  if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
    return 'stock must be a non-negative integer';
  }

  return null;
}

// GET /api/products
exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST /api/products
exports.create = async (req, res, next) => {
  try {
    const error = validateProduct(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id
exports.update = async (req, res, next) => {
  try {
    const error = validateProduct(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};