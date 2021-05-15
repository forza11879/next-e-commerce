import React from 'react';
import axios from 'axios';
import { useQuery, QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import Jumbotron from '@/components/cards/Jumbotron';
import NewArrivals from '@/components/home/NewArrivals';
import BestSellers from '@/components/home/BestSellers';
import { listProduct } from '@/Models/Product/index';

const baseURL = process.env.api;

async function getProductList(body) {
  console.log(`${baseURL}/product/all`);
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

const HomePage = ({ newArrivals, bestSellers }) => {
  const newArrivalsQuery = useQuery(
    'productListByNewArrivals',
    () => getProductList(newArrivals),
    {
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    }
  );

  const bestSellersQuery = useQuery(
    'productListByBestSellers',
    () => getProductList(bestSellers),
    {
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    }
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
        newArrivalsQuery={newArrivalsQuery}
        count={newArrivals.limit}
      />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Best Sellers
      </h4>
      <BestSellers
        bestSellersQuery={bestSellersQuery}
        count={bestSellers.limit}
      />

      <br />
      <br />
    </>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;

  const newArrivals = {
    sort: 'createdAt',
    order: 'desc',
    limit: '3',
  };

  const bestSellers = {
    sort: 'sold',
    order: 'desc',
    limit: '3',
  };

  try {
    // Using Hydration
    const queryClient = new QueryClient();

    await Promise.allSettled([
      queryClient.prefetchQuery('productListByNewArrivals', async () => {
        const newArrivalsResult = await listProduct(newArrivals);
        // console.log({ result });
        return JSON.stringify(newArrivalsResult);
      }),
      queryClient.prefetchQuery('productListByBestSellers', async () => {
        const bestSellersResult = await listProduct(bestSellers);
        // console.log({ result });
        return JSON.stringify(bestSellersResult);
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
