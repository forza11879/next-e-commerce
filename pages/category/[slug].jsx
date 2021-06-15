import nookies from 'nookies';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { readCategory } from '@/Models/Category/index';
import { readByCategory } from '@/Models/Product/index';
import {
  useQueryProductsByCategory,
  categoryQueryKeys,
} from '@/hooks/query/category';
import ProductCard from '@/components/cards/ProductCard';

const CategoryHome = ({ id, slug }) => {
  const useProductsByCategoryQuery = useQueryProductsByCategory(id, slug);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          {useProductsByCategoryQuery.isLoading ? (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              Loading...
            </h4>
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              {useProductsByCategoryQuery.data.products.length} Products in "
              {useProductsByCategoryQuery.data.category.name}" category
            </h4>
          )}
        </div>
      </div>

      <div className="row">
        {useProductsByCategoryQuery.data.products.map((item) => (
          <div className="col-md-4" key={item._id}>
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;
  const {
    params: { slug },
  } = context;

  const { appToken } = nookies.get(context);
  let isUser = false;

  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const user = await currentUser(email);
    if (user) isUser = true;

    const category = await readCategory(slug);
    const id = JSON.parse(JSON.stringify(category._id));

    // Using Hydration
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(
      categoryQueryKeys.productsByCategory(id),
      async () => {
        const products = await readByCategory(category);
        return JSON.stringify({ category, products });
      }
    );

    return {
      props: {
        id: id,
        slug: slug,
        token: appToken,
        isUser: isUser,
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

export default CategoryHome;
