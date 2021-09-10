import { useEffect } from 'react';
// import nookies from 'nookies';
import { useSession } from 'next-auth/client';
// import { getSession, useSession } from 'next-auth/client';
// import admin from '@/firebase/index';
// import { currentUser } from '@/Models/User/index';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart } from '@/store/cart';
import { selectUser } from '@/store/user';
import {
  getCashOnDeliveryApplied,
  cashOnDeliveryStoreReseted,
} from '@/store/cashOnDelivery';
import { couponStoreReseted } from '@/store/coupon';
import ProductCardInCheckout from '@/components/cards/ProductCardInCheckout';
import { useQueryUserCart } from '@/hooks/query/cart';
import { useMutationRemoveStripeCookie } from '@/hooks/query/cookies';

const Cart = () => {
  const [session] = useSession();
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);

  const userCartUseQuery = useQueryUserCart(cart);
  const removeStripeCookieUseMutation = useMutationRemoveStripeCookie();
  useEffect(() => {
    // Destroy cookie
    const removeStripeCookieOptions = {
      url: '/cookies',
      // token: token,
      method: 'post',
      data: { cookieName: 'appPaymentId' },
    };
    removeStripeCookieUseMutation.mutate(removeStripeCookieOptions);
    dispatch(cashOnDeliveryStoreReseted());
    dispatch(couponStoreReseted());
  }, []);

  const router = useRouter();
  const { asPath } = router;

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    if (userCartUseQuery.data?.ok) router.push('/checkout');
  };

  const saveCashOrderToDb = () => {
    // console.log("cart", JSON.stringify(cart, null, 4));
    dispatch(getCashOnDeliveryApplied(true));

    if (userCartUseQuery.data?.ok) router.push('/checkout');
  };

  const showCartItems = () => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>

      {cart.map((item, index) => (
        <ProductCardInCheckout key={item._id} product={item} />
      ))}
    </table>
  );

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
            showCartItems()
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
          {session ? (
            <>
              <button
                onClick={saveOrderToDb}
                className="btn btn-sm btn-primary mt-2"
                disabled={!cart.length}
              >
                Proceed to Checkout
              </button>
              <br />
              <button
                onClick={saveCashOrderToDb}
                className="btn btn-sm btn-warning mt-2"
                disabled={!cart.length}
              >
                Pay Cash on Delivery
              </button>
            </>
          ) : (
            <button className="btn btn-sm btn-primary mt-2">
              <Link
                href={{
                  pathname: '/login',
                  query: { from: asPath },
                }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// export async function getServerSideProps(context) {
//   // const { req, res } = context;

//   // const session = await getSession(context);
//   // if (!session) {
//   //   return {
//   //     redirect: {
//   //       destination: `/api/auth/signin?callbackUrl=${process.env.host}${context.resolvedUrl}`,
//   //       permanent: false, // redirect is not permanent
//   //     },
//   //   };
//   // }

//   try {
//     // Using Hydration
//     // const queryClient = new QueryClient();
//     // await queryClient.prefetchQuery(productQueryKeys.products, () =>
//     //   productListByCount(count)
//     // );

//     return {
//       props: {
//         // token: appToken,
//         // userName: session.user.name,
//         session,
//         // dehydratedState: dehydrate(queryClient),
//       }, // will be passed to the page component as props. always return an object with the props key
//     };
//   } catch (error) {
//     console.log('error FIREBASsE: ', error.errorInfo.message);
//     if (error) {
//       return {
//         // notFound: true,
//         redirect: {
//           destination: '/login',
//           permanent: false,
//           // statusCode - In some rare cases, you might need to assign a custom status code for older HTTP Clients to properly redirect. In these cases, you can use the statusCode property instead of the permanent property, but not both.
//         },
//       };
//     }
//   }
// }

export default Cart;
