import { useState } from 'react';
import { getSession } from 'next-auth/client';
// import nookies from 'nookies';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
// import admin from '@/firebase/index';
// import { currentUser } from '@/Models/User/index';
import { read, relatedProduct } from '@/Models/Product/index';
import {
  useQueryProductStar,
  useQueryProductRelated,
  useMutationStarProduct,
  productQueryKeys,
} from '@/hooks/query/product';
import SingleProduct from '@/components/cards/SingleProduct';
import ProductCard from '@/components/cards/ProductCard';

const Product = ({ productId, userId, slug, isUser }) => {
  const [star, setStar] = useState(0);

  const productSlugQuery = useQueryProductStar(slug, JSON.parse(userId));
  const productRelatedQuery = useQueryProductRelated(slug, productId);

  const mutationStarProduct = useMutationStarProduct();

  const onStarClick = (newRating, productId) => {
    setStar(newRating);
    // console.log(`/product/star/${productId}`);
    const options = {
      url: `/product/star/${productId}`,
      method: 'put',
      slug: slug,
      // token: token,
      data: { star: newRating, slug: slug },
    };
    mutationStarProduct.mutate(options);
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          isUser={isUser}
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

      <div className="row pb-5">
        {productRelatedQuery.data.length ? (
          productRelatedQuery.data.map((item) => (
            <div key={item._id} className="col-md-4">
              <ProductCard product={item} />
            </div>
          ))
        ) : (
          <div className="text-center col">No Products Found</div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;
  let userId;
  let isUser = false;

  const {
    params: { slug },
  } = context;

  try {
    const session = await getSession(context);
    if (session) {
      userId = session.user.id;
      isUser = true;
    } else {
      userId = null;
    }

    const product = await read(slug);

    // Using Hydration
    const queryClient = new QueryClient();

    await Promise.allSettled([
      queryClient.prefetchQuery(
        productQueryKeys.productStar(slug),
        async () => {
          const existingRatingObject = product.ratings.find((item) => {
            if (userId) {
              return item.postedBy.toString() === userId.toString();
            }
          });

          if (existingRatingObject) {
            product.star = existingRatingObject.star;
          } else {
            product.star = 0;
          }

          // console.log({ product });
          return JSON.stringify(product);
        }
      ),
      queryClient.prefetchQuery(
        productQueryKeys.productRelated(slug),
        async () => {
          const related = await relatedProduct(product);
          return JSON.stringify(related);
        }
      ),
    ]);

    return {
      props: {
        productId: JSON.parse(JSON.stringify(product._id)),
        userId: JSON.stringify(userId),
        slug: slug,
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
