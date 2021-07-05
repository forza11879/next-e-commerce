import { createCoupon, listCoupon } from '@/Models/Coupon/index';

export const createController = async (req, res) => {
  const { coupon } = req.body;
  try {
    const newCoupon = await createCoupon(coupon);
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
  try {
    const result = await removeCoupon(couponId);
    res.status(201).json(result);
  } catch (error) {
    console.log('coupon removeController error: ', error);
    res.status(400).json(`Remove coupon failed. ${error}`);
  }
};
