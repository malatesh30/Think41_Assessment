import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';

import Product from '../models/Product.js';
import Order from '../models/Order.js';

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected for ingestion');

async function loadProducts(csvPath) {
  const rows = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', async () => {
        // Map to your schema
        const docs = rows.map(r => ({
          product_id: r.product_id,
          name: r.name,
          category: r.category,
          sold: Number(r.sold),
          stock: Number(r.stock)
        }));
        await Product.deleteMany({});
        await Product.insertMany(docs);
        console.log(`Inserted ${docs.length} products`);
        resolve();
      })
      .on('error', reject);
  });
}

async function loadOrders(csvPath) {
  const rows = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', async () => {
        // You may need to reshape depending on the dataset
        const docs = rows.map(r => ({
          orderId: r.order_id,
          status: r.status,
          items: JSON.parse(r.items_json || '[]'),
          createdAt: new Date(r.created_at)
        }));
        await Order.deleteMany({});
        await Order.insertMany(docs);
        console.log(`Inserted ${docs.length} orders`);
        resolve();
      })
      .on('error', reject);
  });
}

(async () => {
  try {
    await loadProducts('../data/products.csv'); // <- fix paths
    await loadOrders('../data/orders.csv');
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.connection.close();
    console.log('Done.');
  }
})();
