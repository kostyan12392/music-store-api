const Product = require('../models/productModel');

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

exports.getAll = (req, res) => {
  res.json(Product.findAll());
};

exports.getById = (req, res) => {
  const product = Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
};

exports.create = (req, res) => {
  const error = validateProduct(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  const product = Product.create(req.body);
  res.status(201).json(product);
};

exports.update = (req, res) => {
  const error = validateProduct(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  const product = Product.update(req.params.id, req.body);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
};

exports.remove = (req, res) => {
  const deleted = Product.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(204).send();
};