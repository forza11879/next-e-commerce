import { currentUser } from '@/Models/User/index';
import { cartByUser } from '@/Models/Cart/index';
import { createOrder, createCashOrder } from '@/Models/Order/index';
import { decrementQuantityIncrementSoldProduct } from '@/Models/Product';

export const createOrderController = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const { email } = req.user;

  try {
    const { _id } = await currentUser(email);
    const { products } = await cartByUser(_id);

    const args = {
      products,
      orderedBy: _id,
      paymentIntent,
    };
    const resultRes = await createOrder(args);

    await decrementQuantityIncrementSoldProduct(products);

    res.status(200).json(resultRes);
  } catch (error) {
    console.log('order createOrderController error: ', error);
  }
};

export const createCashOrderController = async (req, res) => {
  const { couponApplied, COD } = req.body;
  const { email } = req.user;
  let finalAmount = 0;

  try {
    if (!COD) return res.status(400).send('Create cash order failed');

    const { _id } = await currentUser(email);
    const { totalAfterDiscount, cartTotal, products } = await cartByUser(_id);

    if (couponApplied && totalAfterDiscount) {
      finalAmount = totalAfterDiscount * 100;
    } else {
      finalAmount = cartTotal * 100;
    }

    const args = {
      products,
      amount: finalAmount,
      orderedBy: _id,
    };
    const resultRes = await createCashOrder(args);

    await decrementQuantityIncrementSoldProduct(products);

    res.status(200).json(resultRes);
  } catch (error) {
    console.log('order createCashOrderController error: ', error);
  }
};
