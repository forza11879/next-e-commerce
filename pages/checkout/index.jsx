import { useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import nookies from 'nookies';
import admin from '@/firebase/index';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { currentUser } from '@/Models/User/index';
import { getUserCart } from '@/Models/Cart/index';
import {
  userQueryKeys,
  useQueryGetUserCart,
  useMutationRemoveCart,
} from '@/hooks/query/cart/index';
import { useMutationSaveUserAddress } from '@/hooks/query/user/index';
import {
  useMutationApplyCoupon,
  useMutationApplyCouponHeader,
} from '@/hooks/query/coupon/index';
import { useMutationCreateCashOrder } from '@/hooks/query/order';
import { getCartStoreReseted } from '@/store/cart';
import { selectCoupon } from '@/store/coupon';
import { selectCashOnDelivery } from '@/store/cashOnDelivery';
import 'react-quill/dist/quill.snow.css';

const Checkout = ({ userName, token }) => {
  const [address, setAddress] = useState('');
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [totalAfterDiscount, setTotalAfterDiscount] = useState('');
  const [discountError, setDiscountError] = useState('');
  const couponRedux = useSelector(selectCoupon);
  const COD = useSelector(selectCashOnDelivery);

  const router = useRouter();

  const getUserCartUseQuery = useQueryGetUserCart(userName, token);
  const dispatch = useDispatch();
  const removeCartUseMutation = useMutationRemoveCart();
  const saveUserAddressMutation = useMutationSaveUserAddress();
  const applyCouponUseMutation = useMutationApplyCoupon();
  const applyCouponHeaderUseMutation = useMutationApplyCouponHeader();
  const creatCashOrderUseMutation = useMutationCreateCashOrder();

  // console.log('getUserCartUseQuery.data: ', getUserCartUseQuery.data);

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

  const placeOrder = () => {
    const options = {
      url: '/coupon/header',
      method: 'post',
      coupon: couponRedux,
    };
    applyCouponHeaderUseMutation.mutate(options);
  };

  const createCashOrder = () => {
    const options = {
      url: '/user/order-cash',
      method: 'post',
      token,
      userName,
      data: { couponApplied: couponRedux, COD },
    };

    creatCashOrderUseMutation.mutate(options);
    // createCashOrderForUser(user.token, COD, couponTrueOrFalse).then((res) => {
    //   console.log('USER CASH ORDER CREATED RES ', res);
    //   // empty cart form redux, local Storage, reset coupon, reset COD, redirect
    //   if (res.data.ok) {
    //     // empty local storage
    //     if (typeof window !== 'undefined') localStorage.removeItem('cart');
    //     // empty redux cart
    //     dispatch({
    //       type: 'ADD_TO_CART',
    //       payload: [],
    //     });
    //     // empty redux coupon
    //     dispatch({
    //       type: 'COUPON_APPLIED',
    //       payload: false,
    //     });
    //     // empty redux COD
    //     dispatch({
    //       type: 'COD',
    //       payload: false,
    //     });
    //     // mepty cart from backend
    //     emptyUserCart(user.token);
    //     // redirect
    //     setTimeout(() => {
    //       history.push('/user/history');
    //     }, 1000);
    //   }
    // });
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
    getUserCartUseQuery.data?.products.map((item, index) => (
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
        <p>Products {getUserCartUseQuery.data?.products.length}</p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Cart Total: {getUserCartUseQuery.data?.cartTotal}</p>

        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount Applied: Total Payable: ${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            {COD ? (
              <button
                className="btn btn-primary"
                disabled={
                  !addressSaved || !getUserCartUseQuery.data?.products.length
                }
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={
                  !addressSaved || !getUserCartUseQuery.data?.products.length
                }
                // onClick={() => router.push(`/payment/${couponRedux}`)}
                onClick={placeOrder}
              >
                Place Order
              </button>
            )}
          </div>

          <div className="col-md-6">
            <button
              disabled={!getUserCartUseQuery.data?.products.length}
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
