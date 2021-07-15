import nookies, { setCookie } from 'nookies';
import {
  createCoupon,
  listCoupon,
  removeCoupon,
  findCoupon,
  calculateTotalAfterDiscount,
} from '@/Models/Coupon/index';
import { getUserCart, updateTotalAfterDiscountCart } from '@/Models/Cart/index';
import { currentUser } from '@/Models/User/index';

export const createController = async (req, res) => {
  const { coupon } = req.body;
  console.log({ coupon });
  try {
    const newCoupon = await createCoupon(coupon);
    console.log({ newCoupon });
    res.status(201).json(newCoupon);
  } catch (error) {
    console.log('coupon createController error: ', error);
    res.status(400).json(`Create coupon failed. ${error}`);
  }
};

export const listController = async (req, res) => {
  try {
    const allCoupons = await listCoupon();
    res.status(201).json(allCoupons);
  } catch (error) {
    console.log('coupon listController error: ', error);
    res.status(400).json(`List all coupons failed. ${error}`);
  }
};

export const removeController = async (req, res) => {
  const { couponId } = req.query;
  console.log({ couponId });
  try {
    const result = await removeCoupon(couponId);
    res.status(201).json(result);
  } catch (error) {
    console.log('coupon removeController error: ', error);
    res.status(400).json(`Remove coupon failed. ${error}`);
  }
};

export const couponSessionController = async (req, res) => {
  const { coupon } = req.headers;
  try {
    setCookie({ res }, 'appCoupon', coupon, {
      // maxAge: 72576000,
      httpOnly: true,
      path: '/',
    });
    res.status(201).json({ ok: true });
  } catch (error) {
    console.log('coupon couponSessionController error: ', error);
  }
};

export const applyCouponToUserCartController = async (req, res) => {
  try {
    const { coupon } = req.body;
    const { email } = req.user;

    const validCoupon = await findCoupon(coupon);

    if (validCoupon === null) {
      return res.status(404).json({
        error: 'Invalid coupon',
      });
    }

    const user = await currentUser(email);
    const { products, cartTotal } = await getUserCart(user._id);

    const totalAfterDiscount = await calculateTotalAfterDiscount(
      products,
      cartTotal,
      validCoupon
    );

    await updateTotalAfterDiscountCart(user._id, totalAfterDiscount);

    res.status(201).json(totalAfterDiscount);
  } catch (error) {
    console.log('coupon applyCouponToUserCartController error: ', error);
  }
};
