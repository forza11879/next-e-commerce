import React, { useState, useEffect } from 'react';
import nookies from 'nookies';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { readCategory } from '@/Models/Category/index';
import { readByCategory } from '@/Models/Product/index';
import { useQueryProductsByCategoryId } from '@/hooks/query/product';

const CategoryHome = ({ id, slug }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const useProductsByCategoryIdQuery = useQueryProductsByCategoryId(id, slug);
  console.log(
    'useProductsByCategoryIdQuery.data: ',
    useProductsByCategoryIdQuery.data
  );

  return <p>{slug}</p>;
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

    await queryClient.prefetchQuery(['productsByCategoryId', id], async () => {
      const products = await readByCategory(category);
      return JSON.stringify(products);
    });

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
