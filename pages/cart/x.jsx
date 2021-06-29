import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectCart } from '@/store/cart';
import { useQueryUserCart } from '@/hooks/query/cart';

const Cart = ({ token, userName }) => {
  const cart = useSelector(selectCart);
  const [data, setName] = useQueryUserCart(cart, token);

  const router = useRouter();

  const saveOrderToDb = () => {
    setName(userName);
    console.log('data: ', data);
    if (data?.ok) router.push('/checkout');
  };

  return (
    <button
      onClick={saveOrderToDb}
      className="btn btn-sm btn-primary mt-2"
      disabled={!cart.length}
    >
      Proceed to Checkout
    </button>
  );
};

export default Cart;
