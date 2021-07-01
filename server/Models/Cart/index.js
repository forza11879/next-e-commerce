import Cart from './Cart';
import { currentUser } from '@/Models/User/index';
import { productPriceById } from '@/Models/Product/index';

const userCart = async (cart, email) => {
  try {
    const user = await currentUser(email);
    const queryCart = { orderedBy: user._id };
    const cartByUser = await Cart.findOne(queryCart);

    if (cartByUser) {
      cartByUser.remove();
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
      orderedBy: user._id,
    }).save();

    // console.log('new -----> cart', newCart);
    return true;
  } catch (error) {
    console.log('cart userCart error: ', error);
  }
};

export { userCart };
