import nookies from 'nookies';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import {
  useQueryProducts,
  useMutationRemoveProduct,
  productQueryKeys,
} from '@/hooks/query/product';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import AdminProductCard from '@/components/cards/AdminProductCard';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { listAllByCountProduct } from '@/Models/Product/index';

const AllProducts = ({ count, token, isAdmin }) => {
  const { data, isLoading } = useQueryProducts(count);

  const mutationRemoveProduct = useMutationRemoveProduct();

  const handleRemove = (slug) => {
    const options = {
      url: `/api/product/${slug}`,
      token: token,
      data: {
        slug,
      },
    };
    try {
      if (window.confirm('Delete?')) {
        mutationRemoveProduct.mutate(options);
        // toast.error(`${res.data.title} is deleted`);
      }
    } catch (error) {
      console.log('handleRemove error: ', error);
      // if (error.response.status === 400) toast.error(error.response.data);
    }
  };

  return (
    <div className="container-fluid">
      <AdminRoute isAdmin={isAdmin}>
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>

          <div className="col">
            {isLoading ? (
              <h4 className="text-danger">Loading...</h4>
            ) : (
              <h4>All Products</h4>
            )}
            <div className="row">
              {data.map((item) => (
                <div key={item._id} className="col-md-4 pb-3">
                  <AdminProductCard
                    product={item}
                    handleRemove={handleRemove}
                  />
                </div>
              ))}
            </div>
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

  const count = 100;

  const productListByCount = async (count) => {
    const result = await listAllByCountProduct(count);
    console.log('result: ', result);
    return JSON.stringify(result);
  };
  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    if (role === 'admin') isAdmin = true;

    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(productQueryKeys.products, () =>
      productListByCount(count)
    );

    return {
      props: {
        count: count,
        token: appToken,
        isAdmin: isAdmin,
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    console.log('error FIREBASsE: ', error.errorInfo.message);
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

export default AllProducts;
