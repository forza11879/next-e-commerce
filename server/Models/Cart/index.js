import Cart from './Cart';
import { currentUser } from '@/Models/User/index';
import { productPriceById } from '@/Models/Product/index';

const userCart = async (cart, email) => {
  try {
    let products = [];
    // console.log({ cart });
    const user = await currentUser(email);
    // check if cart with logged in user id already exist
    const queryCart = { orderedBy: user._id };
    const cartByUser = await Cart.findOne(queryCart);
    console.log({ cartByUser });

    if (cartByUser) {
      cartByUser.remove();
      console.log('removed old cart');
    }
    // console.log({ cart });

    // const newCartObj = cart.reduce(
    //   async (acc, obj) => {
    //     // console.log({ obj });
    //     let object = {};

    //     object.product = obj._id;
    //     object.count = obj.count;
    //     object.color = obj.color;

    //     const price = await productPriceById(obj._id);
    //     object.price = price;
    //     console.log({ object });
    //     acc.push(object);

    //     // acc['products'].push(object);
    //     // acc['cartTotal'] + price * obj.count;

    //     return acc;
    //   },
    //   // { products: [], cartTotal: 0 }
    //   []
    // );

    // const result = Promise.all(newCartObj);

    // console.log({ result });

    // const cartTotal = result.reduce((acc, newValue) => {
    //   const total = acc + newValue.price * newValue.count;
    //   return total;
    // }, 0);

    for (let i = 0; i < cart.length; i++) {
      let object = {};

      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      // get price for creating total

      let price = await await productPriceById(cart[i]._id);
      object.price = price;

      products.push(object);
    }

    // console.log('products', products);

    const cartTotal = products.reduce((acc, newValue) => {
      const total = acc + newValue.price * newValue.count;
      return total;
    }, 0);

    // let cartTotal = 0;
    // for (let i = 0; i < products.length; i++) {
    //   cartTotal = cartTotal + products[i].price * products[i].count;
    // }

    console.log('cartTotal', cartTotal);

    let newCart = await new Cart({
      products: products,
      cartTotal: cartTotal,
      orderedBy: user._id,
    }).save();

    // let newCart = await new Cart({
    //   products: newCartObj.products,
    //   cartTotal: newCartObj.cartTotal,
    //   orderedBy: user._id,
    // }).save();

    console.log('new -----> cart', newCart);
    return true;
  } catch (error) {
    console.log('cart userCart error: ', error);
  }
};

export { userCart };
