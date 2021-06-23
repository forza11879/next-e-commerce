import { useEffect, useState } from 'react';
import axios from 'axios';
import nookies from 'nookies';
import { useDebounce } from 'use-debounce';
import { useSelector, useDispatch } from 'react-redux';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { Menu, Slider, Checkbox, Radio } from 'antd';
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { currentUser } from '@/Models/User/index';
import {
  listAllByCountProduct,
  productBrand,
  productColor,
} from '@/Models/Product/index';
import { listCategory } from '@/Models/Category/index';
import { listSubCategory } from '@/Models/SubCategory/index';
import ProductCard from '@/components/cards/ProductCard';
import Star from '@/components/forms/Star';
import {
  useQueryProducts,
  useQueryProductsBrands,
  useQueryProductsColors,
  productQueryKeys,
} from '@/hooks/query/product';
import { useQueryCategories, categoryQueryKeys } from '@/hooks/query/category';
import {
  useQuerySubCategories,
  subcategoryQueryKeys,
} from '@/hooks/query/subcategory';
import {
  useQuerySearchByText,
  useQuerySearchByPrice,
  useQuerySearchByCategory,
  useQuerySearchByStar,
  useQuerySearchBySubCategory,
  useQuerySearchByBrand,
  useQuerySearchByColor,
  useQuerySearchByShipping,
} from '@/hooks/query/search';
import { selectSearch, getTextQuery } from '@/store/search';

const { SubMenu, ItemGroup } = Menu;

const Shop = ({ count }) => {
  const [price, setPrice] = useState([0, 0]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [shipping, setShipping] = useState('');

  const dispatch = useDispatch();
  const { text } = useSelector(selectSearch);

  const [textValue] = useDebounce(text, 300);
  const [priceValue] = useDebounce(price, 300);

  const productsQuery = useQueryProducts(count);
  const categoriesQuery = useQueryCategories();
  const subCategoriesQuery = useQuerySubCategories();
  const brandsProductQuery = useQueryProductsBrands();
  const colorsProductQuery = useQueryProductsColors();

  // query filters
  const searchQuery = useQuerySearchByText({ query: textValue });
  const priceQuery = useQuerySearchByPrice({ price: priceValue });
  const checkedQuery = useQuerySearchByCategory({ category: categoryIds });
  const starQuery = useQuerySearchByStar({ stars: star });
  const subCategoryQuery = useQuerySearchBySubCategory({
    subcategory: subCategory,
  });
  const brandQuery = useQuerySearchByBrand({ brand: brand });
  const colorQuery = useQuerySearchByColor({ color: color });
  const shippingQuery = useQuerySearchByShipping({ shipping: shipping });

  // 2. on text query
  useEffect(() => {
    if (textValue) {
      setCategoryIds([]);
      setPrice([0, 0]);
      setStar('');
      setSubCategory('');
      setBrand('');
      setColor('');
      setShipping('');
    }
  }, [textValue]);

  // 3. on price query
  const handleSlider = (value) => {
    dispatch(getTextQuery());
    setCategoryIds([]);
    setStar('');
    setSubCategory('');
    setBrand('');
    setColor('');
    setShipping('');
    setPrice(value);
  };

  // 4. on categories query
  const showCategories = () =>
    categoriesQuery.data.map((item) => (
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
    dispatch(getTextQuery());
    setPrice([0, 0]);
    setStar('');
    setSubCategory('');
    setBrand('');
    setColor('');
    setShipping('');
    setCategoryIds(inTheState);
  };
  // 5. show products by star rating
  const handleStarClick = (num) => {
    dispatch(getTextQuery());
    setPrice([0, 0]);
    setCategoryIds([]);
    setSubCategory('');
    setBrand('');
    setColor('');
    setShipping('');
    setStar(num);
  };

  const showStars = () => {
    const starArray = Array.from({ length: 5 }, (_, i) => i + 1); //=> [1, 2, 3, 4, 5]
    return starArray.map((item) => (
      <Star key={item} starClick={handleStarClick} numberOfStars={item} />
    ));
  };

  // 6. show products by sub category
  const showSubs = () =>
    subCategoriesQuery.data.map((item) => (
      <div
        key={item._id}
        onClick={() => handleSub(item)}
        className="p-1 m-1 badge badge-secondary"
        style={{ cursor: 'pointer' }}
      >
        {item.name}
      </div>
    ));

  const handleSub = async (subcategory) => {
    dispatch(getTextQuery());
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar('');
    setBrand('');
    setColor('');
    setShipping('');
    setSubCategory(subcategory._id);
  };

  // 7. show products based on brand name
  const showBrands = () =>
    brandsProductQuery.data.map((item) => (
      <Radio
        key={item}
        value={item}
        name={item}
        checked={item === brand}
        onChange={handleBrand}
        className="pb-1 pl-4 pr-4"
      >
        {item}
      </Radio>
    ));

  const handleBrand = (e) => {
    setSubCategory('');
    dispatch(getTextQuery());
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar('');
    setColor('');
    setShipping('');
    setBrand(e.target.value);
  };

  // 8. show products based on color
  const showColors = () =>
    colorsProductQuery.data.map((item) => (
      <Radio
        key={item}
        value={item}
        name={item}
        checked={item === color}
        onChange={handleColor}
        className="pb-1 pl-4 pr-4"
      >
        {item}
      </Radio>
    ));

  const handleColor = (e) => {
    setSubCategory('');
    dispatch(getTextQuery());
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar('');
    setBrand('');
    setShipping('');
    setColor(e.target.value);
  };

  // 9. show products based on shipping yes/no
  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="Yes"
        checked={shipping === 'Yes'}
      >
        Yes
      </Checkbox>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="No"
        checked={shipping === 'No'}
      >
        No
      </Checkbox>
    </>
  );

  const handleShippingchange = (e) => {
    setSubCategory('');
    dispatch(getTextQuery());
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar('');
    setBrand('');
    setColor('');
    setShipping(e.target.value);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />

          <Menu
            defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']}
            mode="inline"
          >
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

            {/* stars */}
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined /> Rating
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }}>
                <div className="pr-4 pl-4 pb-2">{showStars()}</div>
              </div>
            </SubMenu>

            {/* sub category */}
            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Sub Categories
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }} className="pl-4 pr-4">
                {showSubs()}
              </div>
            </SubMenu>

            {/* brands */}
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Brands
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }} className="pr-5">
                {showBrands()}
              </div>
            </SubMenu>

            {/* colors */}
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Colors
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }} className="pr-5">
                {showColors()}
              </div>
            </SubMenu>

            {/* shipping */}
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }} className="pr-5">
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>

        <div className="col-md-9 pt-2">
          {textValue && searchQuery.isLoading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : priceValue[1] !== 0 && priceQuery.isLoading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : categoryIds.length > 0 && checkedQuery.isLoading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : star && starQuery.isLoading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : subCategory && subCategoryQuery.isLoading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : brand && brandQuery.isLoading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : color && colorQuery.isLoading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : shipping && shippingQuery.isLoading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : !textValue &&
            priceValue[1] === 0 &&
            categoryIds.length < 1 &&
            !star &&
            productsQuery.isLoading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}

          {textValue && searchQuery.data?.length > 0 ? (
            <div className="row pb-5">
              {searchQuery.data.map((item) => (
                <div key={item._id} className="col-md-4 mt-3">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : priceValue[1] !== 0 && priceQuery.data?.length > 0 ? (
            <div className="row pb-5">
              {priceQuery.data.map((item) => (
                <div key={item._id} className="col-md-4 mt-3">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : categoryIds.length > 0 && checkedQuery.data?.length > 0 ? (
            <div className="row pb-5">
              {checkedQuery.data.map((item) => (
                <div key={item._id} className="col-md-4 mt-3">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : star && starQuery.data?.length > 0 ? (
            <div className="row pb-5">
              {starQuery.data.map((item) => (
                <div key={item._id} className="col-md-4 mt-3">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : subCategory && subCategoryQuery.data?.length > 0 ? (
            <div className="row pb-5">
              {subCategoryQuery.data.map((item) => (
                <div key={item._id} className="col-md-4 mt-3">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : brand && brandQuery.data?.length > 0 ? (
            <div className="row pb-5">
              {brandQuery.data.map((item) => (
                <div key={item._id} className="col-md-4 mt-3">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : color && colorQuery.data?.length > 0 ? (
            <div className="row pb-5">
              {colorQuery.data.map((item) => (
                <div key={item._id} className="col-md-4 mt-3">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : shipping && shippingQuery.data?.length > 0 ? (
            <div className="row pb-5">
              {shippingQuery.data.map((item) => (
                <div key={item._id} className="col-md-4 mt-3">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : !textValue &&
            priceValue[1] === 0 &&
            categoryIds.length < 1 &&
            !star &&
            !subCategory &&
            !brand &&
            !color &&
            !shipping ? (
            <div className="row pb-5">
              {productsQuery.data.map((item) => (
                <div key={item._id} className="col-md-4 mt-3">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : (
            <p>No products found</p>
          )}
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
      queryClient.prefetchQuery(productQueryKeys.products, async () => {
        const result = await listAllByCountProduct(count);
        return JSON.stringify(result);
      }),
      queryClient.prefetchQuery(...categoryQueryKeys.categories, async () => {
        const result = await listCategory();
        return JSON.stringify(result);
      }),
      queryClient.prefetchQuery(
        ...subcategoryQueryKeys.subCategories,
        async () => {
          const result = await listSubCategory();
          return JSON.stringify(result);
        }
      ),
      queryClient.prefetchQuery(productQueryKeys.productBrands(), () => {
        const result = productBrand();
        return JSON.stringify(result);
      }),
      queryClient.prefetchQuery(productQueryKeys.productColors(), () => {
        const result = productColor();
        return JSON.stringify(result);
      }),
    ]);

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
