const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  request_id: String,
  product_name: String,
  input_image_urls: [String],
  output_image_urls: [String],
  webp_image_urls: [String],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;