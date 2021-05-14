import React, { useEffect, useState } from 'react';
import axios from 'axios';
import nookies from 'nookies';
import { useQuery, QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { useMutationRemoveProduct } from '@/hooks/useQuery';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import AdminProductCard from '@/components/cards/AdminProductCard';
import ProductCard from '@/components/cards/ProductCard';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { listAllByCountProduct } from '@/Models/Product/index';

const baseURL = process.env.api;

async function getProductListByCount(count) {
  console.log(`${baseURL}/product/all/${count}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/all/${count}`,
      method: 'get',
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('getPosts error:', error);
  }
}

const HomePage = ({ count, token, isAdmin }) => {
  const { data, isLoading, isError, error, isFetching } = useQuery(
    'productListByCount',
    () => getProductListByCount(count),
    {
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    }
  );

  const productList = JSON.parse(data);

  return (
    <>
      <div className="jumbotron">
        {isLoading ? <h4>Loading...</h4> : <h4>All Products</h4>}
      </div>

      <div className="container">
        <div className="row">
          {productList.map((item) => (
            <div key={item._id} className="col-md-4">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;
  const { appToken } = nookies.get(context);
  let isAdmin = false;

  const count = 3;

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
    await queryClient.prefetchQuery('productListByCount', () =>
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

export default HomePage;
