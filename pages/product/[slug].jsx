import { useState } from 'react';
import nookies from 'nookies';
import axios from 'axios';
import { QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { read } from '@/Models/Product/index';
import { useQueryHookTwoArg } from '@/hooks/useQuery';
import {
  useQueryProductStar,
  useMutationStarProduct,
} from '@/hooks/query/product';
import SingleProduct from '@/components/cards/SingleProduct';

const baseURL = process.env.api;

// async function getProductSlugStarByUserId(slug, userId) {
//   console.log(`${baseURL}/product/${slug}`);
//   try {
//     const { data } = await axios.request({
//       baseURL,
//       url: `/product/${slug}`,
//       method: 'get',
//     });

//     const existingRatingObject = data.ratings.find(
//       (item) => item.postedBy.toString() === userId.toString()
//     );

//     if (existingRatingObject) {
//       data.star = existingRatingObject.star;
//     } else {
//       data.star = 0;
//     }

//     // console.log('data', data);
//     return JSON.stringify(data);
//   } catch (error) {
//     console.log('getProductSlug error:', error);
//   }
// }

const Product = ({ userId, slug, isUser, token }) => {
  const [star, setStar] = useState(0);
  const id = JSON.parse(userId);

  const productSlugQuery = useQueryProductStar(slug, id);
  // useQueryHookTwoArg(
  //   ['productSlug', slug],
  //   getProductSlugStarByUserId,
  //   slug,
  //   JSON.parse(userId)
  // );

  const mutationStarProduct = useMutationStarProduct();

  const onStarClick = (newRating, productId) => {
    setStar(newRating);
    console.log(`/product/star/${productId}`);
    const options = {
      url: `/product/star/${productId}`,
      method: 'put',
      slug: slug,
      token: token,
      data: { star: newRating, slug: slug },
    };
    mutationStarProduct.mutate(options);
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          isUser={isUser}
          token={token}
          product={productSlugQuery.data}
          onStarClick={onStarClick}
        />
      </div>

      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
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

    // Using Hydration
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(['productStar', slug], async () => {
      const product = await read(slug);

      const existingRatingObject = product.ratings.find(
        (item) => item.postedBy.toString() === user._id.toString()
      );

      if (existingRatingObject) {
        product.star = existingRatingObject.star;
      } else {
        product.star = 0;
      }

      // console.log({ product });
      return JSON.stringify(product);
    });

    return {
      props: {
        userId: JSON.stringify(user._id),
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

export default Product;
