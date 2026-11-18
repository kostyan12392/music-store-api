const Product = require('../models/ProductMongo');

// GET /api/products
exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    next(err);
  }
};

// POST /api/products
exports.create = async (req, res, next) => {
  try {
    const { title, artist, price, tags, reviews, stockByFormat} = req.body;
    
    if (!title || !artist || !price) {
      return res.status(400).json({ error: 'Title, artist and price are required' });
    }

    const product = await Product.create({
      title,
      artist,
      price,
      tags: tags || [],
      reviews: reviews || [],
      stockByFormat: stockByFormat || []
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id
exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: true — вернуть обновленный документ
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid ID format' });
    next(err);
  }
};

// DELETE /api/products/:id
exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid ID format' });
    next(err);
  }
};

// === ГЛАВНОЕ ДЛЯ ЛАБЫ: Работа с вложенным массивом ===
// POST /api/products/:id/reviews
exports.addReview = async (req, res, next) => {
  try {
    const { userName, rating, comment } = req.body;

    if (!userName || !rating) {
      return res.status(400).json({ error: 'userName and rating are required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Добавляем отзыв в массив
    product.reviews.push({ userName, rating, comment });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid ID format' });
    next(err);
  }
};

// PATCH /api/products/:id/stock
exports.updateStock = async (req, res, next) => {
  try {
    const { format, amount } = req.body; 

    if (!format || !amount) {
      return res.status(400).json({ error: 'format and amount are required' });
    }


    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, "stockByFormat.format": format },
      { $inc: { "stockByFormat.$.quantity": amount } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product or format not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};