const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

const stockSchema = new mongoose.Schema({
  format: { type: String, required: true }, // Например: "Vinyl", "CD", "Cassette"
  quantity: { type: Number, required: true, default: 0 }
});


const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  price: { type: Number, required: true },
  
  tags: [String],
  
  reviews: [reviewSchema],

  stockByFormat: [stockSchema]
  
}, { timestamps: true }); 

module.exports = mongoose.model('Product', productSchema);