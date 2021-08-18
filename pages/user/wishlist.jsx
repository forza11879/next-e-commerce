import nookies from 'nookies';
import Link from 'next/link';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
// import { currentUser } from '@/Models/User/index';
import { currentUser, findUserWishList } from '@/Models/User/index';
import UserNav from '@/components/nav/UserNav';
import { userQueryKeys, useQueryUserWishList } from '@/hooks/query/user';
import { DeleteOutlined } from '@ant-design/icons';

const Wishlist = ({ token }) => {
  const userWishListUseQuery = useQueryUserWishList(token);
  console.log('userWishListUseQuery.data: ', userWishListUseQuery.data);

  const handleRemove = (productId) => {};
  // removeWishlist(productId, user.token).then((res) => {
  //   loadWishlist();
  // });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>

          {userWishListUseQuery.data.wishlist.map((item) => (
            <div key={item._id} className="alert alert-secondary">
              <Link href={`/product/${item.slug}`}>{item.title}</Link>
              <span
                onClick={() => handleRemove(item._id)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
            </div>
          ))}
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

    await queryClient.prefetchQuery(userQueryKeys.userWishList(), async () => {
      const userWishList = await findUserWishList(email);
      return JSON.stringify(userWishList);
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

export default Wishlist;
