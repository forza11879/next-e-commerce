import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import nookies from 'nookies';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { findAllOrders } from '@/Models/Order/index';
import Orders from '@/components/order/Orders';
import {
  orderQueryKeys,
  useQueryUserOrders,
  useMutationUpdateOrderStatus,
} from '@/hooks/query/order';

const AdminDashBoard = ({ token, isAdmin, userId }) => {
  const userOrdersUseQuery = useQueryUserOrders(userId, token);
  const updateOrderStatusUseMutation = useMutationUpdateOrderStatus();

  const handleStatusChange = (orderId, orderStatus) => {
    const updateOrderStatusOptions = {
      url: '/admin/order-status',
      method: 'put',
      token,
      userId,
      data: { orderId, orderStatus },
    };
    updateOrderStatusUseMutation.mutate(updateOrderStatusOptions);
  };

  return (
    <div className="container-fluid">
      <AdminRoute isAdmin={isAdmin}>
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col-md-10">
            <h4>Admin Dashboard</h4>
            <Orders
              orders={userOrdersUseQuery.data}
              handleStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </AdminRoute>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;
  const { appToken } = nookies.get(context);
  let isAdmin = false;

  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const user = await currentUser(email);

    if (user.role === 'admin') isAdmin = true;

    const userId = JSON.parse(JSON.stringify(user._id));

    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(
      orderQueryKeys.userOrders(userId),
      async () => {
        const orders = await findAllOrders(user._id);
        return JSON.stringify(orders);
      }
    );

    return {
      props: {
        token: appToken,
        isAdmin: isAdmin,
        userId,
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
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

export default AdminDashBoard;
