import nookies from 'nookies';
import axios from 'axios';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { read } from '@/Models/Product/index';
import { useQueryHook, useQueryHookArg } from '@/hooks/useQuery';
import SingleProduct from '@/components/cards/SingleProduct';

const baseURL = process.env.api;

async function getProductSlug(slug) {
  console.log(`${baseURL}/product/${slug}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/${slug}`,
      method: 'get',
    });
    console.log('data', data);
    return JSON.stringify(data);
  } catch (error) {
    console.log('getProductSlug error:', error);
  }
}

const Product = ({ slug, isUser, token }) => {
  const productSlugQuery = useQueryHookArg(
    ['productSlug', slug],
    getProductSlug,
    slug
  );

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          isUser={isUser}
          token={token}
          product={productSlugQuery.data}
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

    await queryClient.prefetchQuery(['productSlug', slug], async () => {
      const result = await read(slug);
      return JSON.stringify(result);
    });

    return {
      props: {
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
