import nookies from 'nookies';
import admin from '@/firebase/index';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { currentUser } from '@/Models/User/index';
import { getUserCart } from '@/Models/Cart/index';
import { userQueryKeys, useQueryGetUserCart } from '@/hooks/query/cart/index';

const Checkout = ({ userName, token }) => {
  const getUserCartUseQuery = useQueryGetUserCart(userName, token);
  const { products, cartTotal, totalAfterDiscount } = JSON.parse(
    getUserCartUseQuery.data
  );
  // console.log(
  //   'getUserCartUseQuery.data: ',
  //   JSON.parse(getUserCartUseQuery.data)
  // );
  // products, cartTotal, totalAfterDiscount

  const saveAddressToDb = () => {
    //
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        textarea
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
            <button className="btn btn-primary">Place Order</button>
          </div>

          <div className="col-md-6">
            <button className="btn btn-primary">Empty Cart</button>
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
