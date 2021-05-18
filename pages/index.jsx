import { useState, useEffect, useCallback } from 'react';
import nookies from 'nookies';
import axios from 'axios';
import { useQuery, QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import Jumbotron from '@/components/cards/Jumbotron';
import NewArrivals from '@/components/home/NewArrivals';
import BestSellers from '@/components/home/BestSellers';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { useQueryHook, useQueryHookArg } from '@/hooks/useQuery';
import { listProduct, productsCount } from '@/Models/Product/index';

const baseURL = process.env.api;

async function getProductList(body) {
  console.log(`${baseURL}/product/all`);
  console.log({ body });
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/all`,
      method: 'post',
      data: body,
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('getPosts error:', error);
  }
}

async function getproductsCount() {
  console.log(`${baseURL}/product/all/total`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/all/total`,
      method: 'get',
    });

    return data;
  } catch (error) {
    console.log('getPosts error:', error);
  }
}

const HomePage = ({ newArrivals, bestSellers }) => {
  const [limit] = useState(3);
  const [page, setPage] = useState(1);
  const arrivals = { ...newArrivals, page: page };

  const productsCountQuery = useQueryHook(['productsCount'], getproductsCount);

  const newArrivalsQuery = useQueryHookArg(
    ['productListByNewArrivals', arrivals.page],
    getProductList,
    arrivals
  );

  const bestSellersQuery = useQueryHookArg(
    ['productListByBestSellers'],
    getProductList,
    bestSellers
  );

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
        page={page}
        setPage={setPage}
      />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Best Sellers
      </h4>
      <BestSellers bestSellersQuery={bestSellersQuery} count={limit} />

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
  };

  const bestSellers = {
    sort: 'sold',
    order: 'desc',
  };

  const page = 1;

  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    // Using Hydration
    const queryClient = new QueryClient();

    await Promise.allSettled([
      queryClient.prefetchQuery(
        ['productListByNewArrivals', page],
        async () => {
          const newArrivalsResult = await listProduct(newArrivals);
          // console.log({ result });
          return JSON.stringify(newArrivalsResult);
        }
      ),
      queryClient.prefetchQuery('productListByBestSellers', async () => {
        const bestSellersResult = await listProduct(bestSellers);
        // console.log({ result });
        return JSON.stringify(bestSellersResult);
      }),
      queryClient.prefetchQuery('productsCount', async () => {
        const productsCountResult = await productsCount();
        console.log({ productsCountResult });
        return JSON.stringify(productsCountResult);
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
