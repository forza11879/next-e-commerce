import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart } from '@/store/cart';
import { selectUser } from '@/store/user';

const Cart = () => {
  //   const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length} Product</h4>

          {!cart.length ? (
            <p>
              No products in cart. <Link href="/shop">Continue Shopping.</Link>
            </p>
          ) : (
            'show cart items'
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((item, index) => (
            <div key={index}>
              <p>
                {item.title} x {item.count} = ${item.price * item.count}
              </p>
            </div>
          ))}
          <hr />
          Total: <b>${getTotal()}</b>
          <hr />
          {user ? (
            <button className="btn btn-sm btn-primary mt-2">
              Proceed to Checkout
            </button>
          ) : (
            <button className="btn btn-sm btn-primary mt-2">
              Login to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
