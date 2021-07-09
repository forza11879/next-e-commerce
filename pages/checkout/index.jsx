import { useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { useRouter } from 'next/router';
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
import { useMutationApplyCoupon } from '@/hooks/query/coupon/index';
import { getCartStoreReseted } from '@/store/cart';
import 'react-quill/dist/quill.snow.css';

const Checkout = ({ userName, token }) => {
  const [address, setAddress] = useState('');
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [totalAfterDiscount, setTotalAfterDiscount] = useState('');
  const [discountError, setDiscountError] = useState('');

  const router = useRouter();

  const getUserCartUseQuery = useQueryGetUserCart(userName, token);
  // const { products, cartTotal } = getUserCartUseQuery.data;
  const dispatch = useDispatch();
  const removeCartUseMutation = useMutationRemoveCart();
  const saveUserAddressMutation = useMutationSaveUserAddress();
  const applyCouponUseMutation = useMutationApplyCoupon();

  console.log('getUserCartUseQuery.data: ', getUserCartUseQuery.data);

  const emptyCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }

    dispatch(getCartStoreReseted());
    setDiscountError('');
    setTotalAfterDiscount(0);

    // setProducts([]);
    // setTotal(0);
    // setTotalAfterDiscount(0);
    // setCoupon("");

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

  const applyDiscountCoupon = () => {
    const options = {
      url: '/user/cart/coupon',
      method: 'post',
      token: token,
      data: { coupon: coupon },
      props: {
        setTotalAfterDiscount: setTotalAfterDiscount,
        setDiscountError: setDiscountError,
      },
    };
    applyCouponUseMutation.mutate(options);

    // console.log('send coupon to backend', coupon);
    // applyCoupon(user.token, coupon).then((res) => {
    //   console.log('RES ON COUPON APPLIED', res.data);
    //   if (res.data) {
    //     setTotalAfterDiscount(res.data);
    //     // update redux coupon applied
    //   }
    //   // error
    //   if (res.data.err) {
    //     setDiscountError(res.data.err);
    //     // update redux coupon applied
    //   }
    // });
  };

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () =>
    getUserCartUseQuery.data.products.map((item, index) => (
      <div key={index}>
        <p>
          {item.product.title} ({item.color}) x {item.count} ={' '}
          {item.product.price * item.count}
        </p>
      </div>
    ));

  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError('');
          setTotalAfterDiscount('');
        }}
        value={coupon}
        type="text"
        className="form-control"
      />
      <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
        Apply
      </button>
    </>
  );

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>

      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {getUserCartUseQuery.data.products.length}</p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Cart Total: {getUserCartUseQuery.data.cartTotal}</p>

        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount Applied: Total Payable: ${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              disabled={
                !addressSaved || !getUserCartUseQuery.data.products.length
              }
              onClick={() => router.push('/payment')}
            >
              Place Order
            </button>
          </div>

          <div className="col-md-6">
            <button
              disabled={!getUserCartUseQuery.data.products.length}
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
    const user = await currentUser(email);

    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(
      userQueryKeys.getUserCart(user.name),
      async () => {
        const cart = await getUserCart(user._id);
        return JSON.stringify(cart);
      }
    );

    return {
      props: {
        token: appToken,
        userName: user.name,
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
