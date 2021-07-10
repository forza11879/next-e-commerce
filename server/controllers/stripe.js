// const User = require('../models/user');
// const Cart = require('../models/cart');
// const Product = require('../models/product');
// const Coupon = require('../models/coupon');
// import Stripe from 'stripe';
import { paymentIntent } from '@/Models/Stripe';

// const stripe = new Stripe(process.env.stripeKey);

// console.log('process.env.STRIPE_SECRET: ', process.env.stripeKey);

export const createPaymentIntentController = async (req, res) => {
  try {
    // later apply coupon
    // later calculate price
    const result = await paymentIntent();

    res.send(result);
  } catch (error) {}
};
