import { useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import nookies from 'nookies';
import admin from '@/firebase/index';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { useDispatch } from 'react-redux';
import { currentUser } from '@/Models/User/index';
import { getUserCart } from '@/Models/Cart/index';
import {
  userQueryKeys,
  useQueryGetUserCart,
  useMutationRemoveCart,
} from '@/hooks/query/cart/index';
import { useMutationSaveUserAddress } from '@/hooks/query/user/index';
import { getCartStoreReseted } from '@/store/cart';
import 'react-quill/dist/quill.snow.css';

const Checkout = ({ userName, token }) => {
  const [address, setAddress] = useState('');
  const [addressSaved, setAddressSaved] = useState(false);
  const getUserCartUseQuery = useQueryGetUserCart(userName, token);
  const { products, cartTotal } = getUserCartUseQuery.data;
  const dispatch = useDispatch();
  const removeCartUseMutation = useMutationRemoveCart();
  const saveUserAddressMutation = useMutationSaveUserAddress();

  console.log('getUserCartUseQuery.data: ', getUserCartUseQuery.data);

  const emptyCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }

    dispatch(getCartStoreReseted());

    const options = {
      url: `${process.env.api}/cart`,
      token: token,
      data: { name: userName },
    };
    removeCartUseMutation.mutate(options);
  };

  const saveAddressToDb = () => {
    const options = {
      url: '/user/address',
      method: 'post',
      token: token,
      data: { address: address },
      props: { setAddressSaved: setAddressSaved },
    };
    saveUserAddressMutation.mutate(options);
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
          Save
        </button>
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        coupon input and apply button
      </div>

      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {products.map((item, index) => (
          <div key={index}>
            <p>
              {item.product.title} ({item.color}) x {item.count} ={' '}
              {item.product.price * item.count}
            </p>
          </div>
        ))}
        <hr />
        <p>Cart Total: {cartTotal}</p>

        <div className="row">
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              disabled={!addressSaved || !products.length}
            >
              Place Order
            </button>
          </div>

          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;
  const { appToken } = nookies.get(context);

  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const { name } = await currentUser(email);

    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(
      userQueryKeys.getUserCart(name),
      async () => {
        const cart = await getUserCart(email);
        return JSON.stringify(cart);
      }
    );

    return {
      props: {
        token: appToken,
        userName: name,
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    // console.log('error FIREBASsE: ', error.errorInfo.message);
    console.log('error FIREBASsE: ', error);

    if (error) {
      return {
        // notFound: true,
        redirect: {
          destination: '/login',
          permanent: false,
          // statusCode - In some rare cases, you might need to assign a custom status code for older HTTP Clients to properly redirect. In these cases, you can use the statusCode property instead of the permanent property, but not both.
        },
      };
    }
  }
}

export default Checkout;
