import { useEffect, useState } from 'react';
import axios from 'axios';
// import debounce from 'lodash.debounce';
// import _ from 'lodash';
import nookies from 'nookies';
import { useSelector, useDispatch } from 'react-redux';
import { QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { listAllByCountProduct } from '@/Models/Product/index';
import ProductCard from '@/components/cards/ProductCard';
import { useQueryProducts } from '@/hooks/query/product';
import { useQuerySearchText } from '@/hooks/query/search';
import { selectSearch } from '@/store/search';

const baseURL = process.env.api;

async function fetchProductsByFilter(text) {
  console.log(`${baseURL}/search/filters`);
  console.log('text front-end: ', text);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/search/filters`,
      method: 'post',
      data: { query: text },
    });
    // console.log('data: ', data);
    return data;
  } catch (error) {
    console.log('fetchProductsByFilter error:', error);
  }
}

const Shop = ({ count }) => {
  const [textValue, setTextValue] = useState([]);

  const { text } = useSelector(selectSearch);
  // const text = 'lenovo';

  const queryClient = useQueryClient();

  useEffect(() => {
    const delayed = setTimeout(async () => {
      await queryClient.prefetchQuery(['searchText'], async () => {
        if (text) {
          const data = await fetchProductsByFilter(text);
          queryClient.setQueryData(['products'], (oldQueryData) => {
            return JSON.stringify(data);
          });
          return data;
        }
      });
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  console.log('textValue: ', textValue);

  const productsQuery = useQueryProducts(count);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">search/filter menu</div>

        <div className="col-md-9">
          {productsQuery.isLoading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}

          {productsQuery.data.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {productsQuery.data.map((item) => (
              <div key={item._id} className="col-md-4 mt-3">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;

  const { appToken } = nookies.get(context);

  const count = 12;

  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    // Using Hydration
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(['products'], async () => {
      const result = await listAllByCountProduct(count);
      // console.log({ productAllList });
      return JSON.stringify(result);
    });

    return {
      props: {
        count: count,
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

export default Shop;
