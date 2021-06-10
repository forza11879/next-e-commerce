import { useEffect, useState } from 'react';
import axios from 'axios';
import nookies from 'nookies';
import { useSelector, useDispatch } from 'react-redux';
import { QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { Menu, Slider, Checkbox } from 'antd';
import { DollarOutlined, DownSquareOutlined } from '@ant-design/icons';
import { currentUser } from '@/Models/User/index';
import { listAllByCountProduct } from '@/Models/Product/index';
import { listCategory } from '@/Models/Category/index';
import ProductCard from '@/components/cards/ProductCard';
import { useQueryProducts } from '@/hooks/query/product';
import { useQueryCategories } from '@/hooks/query/category';
import { useQuerySearchText } from '@/hooks/query/search';
import { selectSearch, getTextQuery } from '@/store/search';

const { SubMenu, ItemGroup } = Menu;
const baseURL = process.env.api;

async function fetchProductsByFilter(arg) {
  console.log(`${baseURL}/search/filters`);
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

// export const getCategories = async () =>
//   await axios.get(`${process.env.REACT_APP_API}/categories`);

const Shop = ({ count }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);

  const dispatch = useDispatch();
  const { text } = useSelector(selectSearch);

  const productsQuery = useQueryProducts(count);
  const categoriesQuery = useQueryCategories();
  // 1. on load
  useEffect(() => {
    setProducts(productsQuery.data);
    setCategories(categoriesQuery.data);
    setLoading(false);
  }, []);

  const queryClient = useQueryClient();
  // 2. on text query
  useEffect(() => {
    const delayed = setTimeout(() => {
      queryClient.prefetchQuery(
        ['searchProductsByText'],
        async () => {
          if (text) {
            setCategoryIds([]);
            setPrice([0, 0]);
            const data = await fetchProductsByFilter({ query: text });
            setProducts(data);
            setLoading(false);
            return data;
          }
          if (!text && categoryIds.length < 1) {
            setProducts(productsQuery.data);
          }
        }
        // { staleTime: Infinity }
      );
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. on price query
  useEffect(() => {
    queryClient.prefetchQuery(
      ['searchProductsByPrice'],
      async () => {
        if (price && price[1] !== 0) {
          const data = await fetchProductsByFilter({ price });
          setProducts(data);
          setLoading(false);
          return data;
        } else {
          setProducts(productsQuery.data);
        }
      }
      // { staleTime: Infinity }
    );
  }, [ok]);

  const handleSlider = (value) => {
    dispatch(getTextQuery());
    setCategoryIds([]);
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  // 4. on categories query
  const showCategories = () =>
    categories.map((item) => (
      <div key={item._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={item._id}
          name="category"
          checked={categoryIds.includes(item._id)}
        >
          {item.name}
        </Checkbox>
        <br />
      </div>
    ));

  const handleCheck = (e) => {
    // console.log(e.target.value);
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); // index or -1

    // indexOf method ?? if not found returns -1 else return index [1,2,3,4,5]
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      // if found pull out one item from index
      inTheState.splice(foundInTheState, 1);
    }
    setCategoryIds(inTheState);

    queryClient.prefetchQuery(
      ['searchProductsByCategories', inTheState],
      async () => {
        if (Array.isArray(inTheState) && inTheState.length > 0) {
          dispatch(getTextQuery());
          setPrice([0, 0]);
          const data = await fetchProductsByFilter({ category: inTheState });
          setProducts(data);
          setLoading(false);
          return data;
        } else {
          setProducts(productsQuery.data);
        }
      }
      // { staleTime: Infinity }
    );
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
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }}>{showCategories()}</div>
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

    await Promise.allSettled([
      queryClient.prefetchQuery(['products'], async () => {
        const result = await listAllByCountProduct(count);
        return JSON.stringify(result);
      }),
      queryClient.prefetchQuery(['categories'], async () => {
        const result = await listCategory();
        return JSON.stringify(result);
      }),
    ]);

    const categoryList = await listCategory();

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
