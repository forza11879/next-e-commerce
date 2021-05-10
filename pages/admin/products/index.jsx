import React from 'react';
import axios from 'axios';
import nookies from 'nookies';
import { useQuery, QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { useMutationRemoveProduct } from '@/hooks/useQuery';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import AdminProductCard from '@/components/cards/AdminProductCard';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { listAllByCountProduct } from '@/Models/Product/index';

const baseURL = process.env.api;

async function getProductListByCount(count) {
  // await new Promise((resolve) => setTimeout(resolve, 300));
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

const AllProducts = ({ count, token, isAdmin }) => {
  const queryClient = useQueryClient();

  const mutationRemoveProduct = useMutationRemoveProduct(queryClient);

  const { data, isLoading, isError, error, isFetching } = useQuery(
    'productListByCount',
    () => getProductListByCount(count),
    {
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    }
  );

  // const handleRemove = (slug) => {
  //   // let answer = window.confirm("Delete?");
  //   if (window.confirm('Delete?')) {
  //     // console.log("send delete request", slug);
  //     removeProduct(slug, user.token)
  //       .then((res) => {
  //         loadAllProducts();
  //         toast.error(`${res.data.title} is deleted`);
  //       })
  //       .catch((err) => {
  //         if (err.response.status === 400) toast.error(err.response.data);
  //         console.log(err);
  //       });
  //   }
  // };

  const handleRemove = (slug) => {
    const options = {
      url: `/api/product/${slug}`,
      token: token,
      data: {
        slug,
      },
      // props: {
      //   setValues,
      //   values,
      // },
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

    // const { images } = values;
    // let filteredImages = images.filter((item) => {
    //   return item.public_id !== slug;
    // });
    // setValues({ ...values, images: filteredImages });
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
              {JSON.parse(data).map((item) => (
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

export default AllProducts;
