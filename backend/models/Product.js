import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  product_id: String,
  name: String,
  category: String,
  sold: Number,
  stock: Number,
});

export default mongoose.model('Product', productSchema);
