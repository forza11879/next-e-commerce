// const User = require('../models/user');
// const Cart = require('../models/cart');
// const Product = require('../models/product');
// const Coupon = require('../models/coupon');
// import Stripe from 'stripe';
import { paymentIntent } from '@/Models/Stripe';
import { cartByUser } from '@/Models/Cart';
import { currentUser } from '@/Models/User';

// const stripe = new Stripe(process.env.stripeKey);

// console.log('process.env.STRIPE_SECRET: ', process.env.stripeKey);

export const createPaymentIntentController = async (req, res) => {
  const { email } = req.user;
  const { couponApplied } = req.body;

  try {
    // later apply coupon
    // later calculate price

    // 1 find user
    // const user = await User.findOne({ email: req.user.email }).exec();
    const user = await currentUser(email);
    // 2 get user cart total
    // const { cartTotal } = await Cart.findOne({ orderdBy: user._id }).exec();
    const cart = await cartByUser(user._id);
    const result = await paymentIntent(cart, couponApplied);

    res.send(result);
  } catch (error) {
    console.log(`createPaymentIntentController error: ${error}`);
  }
};
