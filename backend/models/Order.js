import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: String,
  status: String,
  items: [{
    product_id: String,
    quantity: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
