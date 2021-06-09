import { useEffect, useState } from 'react';
import axios from 'axios';
import nookies from 'nookies';
import { useSelector, useDispatch } from 'react-redux';
import { QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { Menu, Slider } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { currentUser } from '@/Models/User/index';
import { listAllByCountProduct } from '@/Models/Product/index';
import ProductCard from '@/components/cards/ProductCard';
import { useQueryProducts } from '@/hooks/query/product';
import { useQuerySearchText } from '@/hooks/query/search';
import { selectSearch, getTextQuery } from '@/store/search';

const { SubMenu, ItemGroup } = Menu;
const baseURL = process.env.api;

async function fetchProductsByFilter(arg) {
  console.log(`${baseURL}/search/filters`);
  console.log({ arg });
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/search/filters`,
      method: 'post',
      data: arg,
    });
    return data;
  } catch (error) {
    console.log('fetchProductsByFilter error:', error);
  }
}

const Shop = ({ count }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);

  const dispatch = useDispatch();
  const { text } = useSelector(selectSearch);

  const productsQuery = useQueryProducts(count);
  // 1. on load
  useEffect(() => {
    setProducts(productsQuery.data);
    setLoading(false);
  }, []);

  const queryClient = useQueryClient();
  // 2. on text query
  useEffect(() => {
    const delayed = setTimeout(() => {
      queryClient.prefetchQuery(['searchProductsByText'], async () => {
        if (text) {
          const data = await fetchProductsByFilter({ query: text });
          setProducts(data);
          setLoading(false);
          return data;
        }
      });
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. on price query
  useEffect(() => {
    console.log('ok to request');
    queryClient.prefetchQuery(['searchProductsByPrice'], async () => {
      if (price && price[1] !== 0) {
        const data = await fetchProductsByFilter({ price });
        setProducts(data);
        setLoading(false);
        return data;
      }
    });
  }, [ok]);

  const handleSlider = (value) => {
    dispatch(getTextQuery());
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />

          <Menu defaultOpenKeys={['1', '2']} mode="inline">
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined /> Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `$${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="4999"
                />
              </div>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {products.map((item) => (
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
