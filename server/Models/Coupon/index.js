import Coupon from './Coupon';

const createCoupon = async (coupon) => {
  const { name, expiry, discount } = coupon;
  try {
    const newCoupon = await new Coupon({ name, expiry, discount }).save();
    return newCoupon;
  } catch (error) {
    console.log(`createCoupon error: ${error}`);
  }
};

const listCoupon = async () => {
  const query = {};
  try {
    const listCoupon = await Coupon.find(query).sort({ createdAt: -1 });
    return listCoupon;
  } catch (error) {
    console.log(`listCoupon error: ${error}`);
  }
};

const removeCoupon = async (couponId) => {
  const query = { _id: couponId };
  try {
    const result = await Coupon.findOneAndDelete(query);
    return result;
  } catch (error) {
    console.log(`removeCoupon error: ${error}`);
  }
};

export { createCoupon, listCoupon, removeCoupon };
