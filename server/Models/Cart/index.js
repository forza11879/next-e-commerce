import Cart from './Cart';
import { currentUser } from '@/Models/User/index';
import { productPriceById } from '@/Models/Product/index';

const getUserCart = async (userId) => {
  try {
    const query = { orderedBy: userId };
    const cart = await Cart.findOne(query).populate(
      'products.product',
      '_id title price totalAfterDiscount'
    );
    return cart;
    // return { products, cartTotal, totalAfterDiscount };
  } catch (error) {
    console.log('cart getUserCart error: ', error);
  }
};

const cartByUser = async (userId) => {
  try {
    const query = { orderedBy: userId };
    const cartByUser = await Cart.findOne(query);
    return cartByUser;
  } catch (error) {
    console.log('cart cartByUser error: ', error);
  }
};

const userCart = async (cart, cartOfUser, userId) => {
  try {
    if (cartOfUser) {
      cartOfUser.remove();
      console.log('removed old cart');
    }

    const newCartObj = await cart.reduce(
      async (acc, obj) => {
        const newObj = await acc;
        let object = {};

        object.product = obj._id;
        object.count = obj.count;
        object.color = obj.color;

        const price = await productPriceById(obj._id);
        object.price = price;

        newObj['products'].push(object);
        newObj['cartTotal'] = newObj['cartTotal'] + price * obj.count;

        return newObj;
      },
      { products: [], cartTotal: 0 }
    );

    const newCart = await new Cart({
      products: newCartObj.products,
      cartTotal: newCartObj.cartTotal,
      orderedBy: userId,
    }).save();

    // console.log('new -----> cart', newCart);
    return true;
  } catch (error) {
    console.log('cart userCart error: ', error);
  }
};

const emptyCart = async (email) => {
  try {
    const user = await currentUser(email);
    // console.log('user._id: ', user._id);
    const query = { orderedBy: user._id };
    const cart = await Cart.findOneAndRemove(query);
    // const cart = await Cart.deleteMany(query);
    // console.log({ cart });
    return cart;
  } catch (error) {
    console.log('cart emptyCart error: ', error);
  }
};

const updateTotalAfterDiscountCart = async (userId, totalAfterDiscount) => {
  const query = { orderedBy: userId };
  const update = { totalAfterDiscount };
  const options = { new: true };
  try {
    const result = await Cart.findOneAndUpdate(query, update, options);
    return result;
  } catch (error) {
    console.log('cart updateTotalAfterDiscountCart error: ', error);
  }
};

export {
  getUserCart,
  userCart,
  emptyCart,
  updateTotalAfterDiscountCart,
  cartByUser,
};
