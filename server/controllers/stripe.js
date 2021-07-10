// const User = require('../models/user');
// const Cart = require('../models/cart');
// const Product = require('../models/product');
// const Coupon = require('../models/coupon');
import Stripe from 'stripe';
import { paymentIntent } from '@/Models/Stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);

console.log('process.env.STRIPE_SECRET: ', process.env.STRIPE_SECRET);

export const removeController = async (req, res) => {
  try {
    // later apply coupon
    // later calculate price
    const result = await paymentIntent(stripe);

    res.send({
      clientSecret: result,
    });
  } catch (error) {}
};
exports.createPaymentIntentController = async (req, res) => {
  // later apply coupon
  // later calculate price

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100,
    currency: 'usd',
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
