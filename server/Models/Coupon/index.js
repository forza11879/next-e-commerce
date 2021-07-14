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

const findCoupon = async (coupon) => {
  const query = { name: coupon };
  try {
    const validCoupon = await Coupon.findOne(query);
    return validCoupon;
  } catch (error) {
    console.log(`findCoupon error: ${error}`);
  }
};

const calculateTotalAfterDiscount = async (
  products,
  cartTotal,
  validCoupon
) => {
  try {
    // console.log('cartTotal', cartTotal, 'discount%', validCoupon.discount);

    // calculate the total after discount
    const totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    return totalAfterDiscount;
  } catch (error) {}
};

export {
  createCoupon,
  listCoupon,
  removeCoupon,
  findCoupon,
  calculateTotalAfterDiscount,
};
