import nookies from 'nookies';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { findUserOrders } from '@/Models/Order/index';
import UserNav from '@/components/nav/UserNav';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useQueryUserOrders, userQueryKeys } from '@/hooks/query/user';

const History = ({ token }) => {
  const userOrdersUseQuery = useQueryUserOrders(token);

  const showOrderInTable = (order) => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
        </tr>
      </thead>

      <tbody>
        {order.products.map((item, index) => (
          <tr key={index}>
            <td>
              <b>{item.product.title}</b>
            </td>
            <td>{item.product.price}</td>
            <td>{item.product.brand}</td>
            <td>{item.color}</td>
            <td>{item.count}</td>
            <td>
              {item.product.shipping === 'Yes' ? (
                <CheckCircleOutlined style={{ color: 'green' }} />
              ) : (
                <CloseCircleOutlined style={{ color: 'red' }} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const showEachOrders = () =>
    userOrdersUseQuery.data.map((item, idex) => (
      <div key={idex} className="m-5 p-3 card">
        <p>show payment info</p>
        {showOrderInTable(item)}
        <div className="row">
          <div className="col">
            <p>PDF download</p>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col text-center">
          <h4>
            {userOrdersUseQuery.data.length > 0
              ? 'User purchase orders'
              : 'No purchase orders'}
          </h4>
          {showEachOrders()}
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

    await queryClient.prefetchQuery(userQueryKeys.userOrders(), async () => {
      const userOrders = await findUserOrders(user._id);
      return JSON.stringify(userOrders);
    });

    return {
      props: {
        token: appToken,
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    console.log(
      'error Product getServerSideProps: ',
      // error.errorInfo.message
      error
    );
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

export default History;
