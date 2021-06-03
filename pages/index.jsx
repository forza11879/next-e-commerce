import { useState } from 'react';
import nookies from 'nookies';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import Jumbotron from '@/components/cards/Jumbotron';
import NewArrivals from '@/components/home/NewArrivals';
import BestSellers from '@/components/home/BestSellers';
import CategoryList from '@/components/category/CategoryList';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import {
  useQueryProductByNewArrivals,
  useQueryProductByBestSellers,
  useQueryProductsCount,
} from '@/hooks/query/product';
import { useQueryCategories } from '@/hooks/query/category';
import { listProduct, productsCount } from '@/Models/Product/index';
import { listCategory } from '@/Models/Category/index';

const HomePage = ({ newArrivals, bestSellers }) => {
  const [limit] = useState(3);

  const [pageNewArrivals, setPageNewArrivals] = useState(1);
  const [pageBestSellers, setPageBestSellers] = useState(1);

  const arrivals = { ...newArrivals, page: pageNewArrivals };
  const sellers = { ...bestSellers, page: pageBestSellers };

  const productsCountQuery = useQueryProductsCount();

  const newArrivalsQuery = useQueryProductByNewArrivals(
    arrivals.page,
    arrivals
  );
  const bestSellersQuery = useQueryProductByBestSellers(sellers.page, sellers);
  const categoriesQuery = useQueryCategories();
  console.log('categoriesQuery.data: ', categoriesQuery.data);

  return (
    <>
      <div className="jumbotron text-danger h1 font-weight-bold text-center">
        <Jumbotron text={['Latest Products', 'New Arrivals', 'Best Sellers']} />
      </div>

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        New Arrivals
      </h4>
      <NewArrivals
        productsCountQuery={productsCountQuery}
        newArrivalsQuery={newArrivalsQuery}
        count={limit}
        page={pageNewArrivals}
        setPage={setPageNewArrivals}
      />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Best Sellers
      </h4>
      <BestSellers
        productsCountQuery={productsCountQuery}
        bestSellersQuery={bestSellersQuery}
        count={limit}
        page={pageBestSellers}
        setPage={setPageBestSellers}
      />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Categories
      </h4>
      <CategoryList categories={categoriesQuery} />

      <br />
      <br />
    </>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;

  const { appToken } = nookies.get(context);

  const newArrivals = {
    sort: 'createdAt',
    order: 'desc',
    page: 1,
  };

  const bestSellers = {
    sort: 'sold',
    order: 'desc',
    page: 1,
  };

  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    // Using Hydration
    const queryClient = new QueryClient();

    await Promise.allSettled([
      queryClient.prefetchQuery(
        ['productsByNewArrivals', newArrivals.page],
        async () => {
          const newArrivalsResult = await listProduct(newArrivals);
          // console.log({ result });
          return JSON.stringify(newArrivalsResult);
        }
      ),
      queryClient.prefetchQuery(
        ['productsByBestSellers', bestSellers.page],
        async () => {
          const bestSellersResult = await listProduct(bestSellers);
          // console.log({ result });
          return JSON.stringify(bestSellersResult);
        }
      ),
      queryClient.prefetchQuery('productsCount', async () => {
        const productsCountResult = await productsCount();
        console.log({ productsCountResult });
        return JSON.stringify(productsCountResult);
      }),
      queryClient.prefetchQuery(['categories'], async () => {
        const categoryList = await listCategory();
        return JSON.stringify(categoryList);
      }),
    ]);

    return {
      props: {
        newArrivals: newArrivals,
        bestSellers: bestSellers,
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    console.log('error: ', error);
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

export default HomePage;
