import React, { useState, useRef, useEffect } from 'react';
import nookies from 'nookies';
import axios from 'axios';
import { useQuery, QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import ProductCreateForm from '@/components/forms/ProductCreateForm';
import { useQueryFnById, useMutationCreateProduct } from '@/hooks/useQuery';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { listCategory } from '@/Models/Category/index';

const baseURL = process.env.api;

const initialState = {
  title: 'Macbook Pro',
  description: 'This is the best Apple product',
  price: '45000',
  categories: [],
  category: '',
  subs: [],
  shipping: '',
  quantity: '50',
  images: [],
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
  color: '',
  brand: '',
};
// const initialState = {
//   title: '',
//   description: '',
//   price: '',
//   categories: [],
//   category: '',
//   subs: [],
//   shipping: '',
//   quantity: '',
//   images: [],
//   colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
//   brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
//   color: '',
//   brand: '',
// };

async function getPosts() {
  // await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(`${baseURL}/category/all`);
  // if (true) {
  //   throw new Error('Test error!');
  // }
  try {
    const { data } = await axios.request({
      baseURL,
      url: '/category/all',
      method: 'get',
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('getPosts error:', error);
  }
}

async function getSubCategoryListByCategoryId(id) {
  // await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(`${baseURL}/category/subcategories/${id}`);
  // if (true) {
  //   throw new Error('Test error!');
  // }
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/category/subcategories/${id}`,
      method: 'get',
    });

    return data;
  } catch (error) {
    console.log('getSubCategoryListByCategoryId error:', error);
  }
}
const ProductCreate = ({ token, isAdmin }) => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);

  const formRef = useRef();

  const titleInputRef = useRef();
  const descriptionInputRef = useRef();
  const priceInputRef = useRef();
  const quantityInputRef = useRef();

  const refOptions = {
    formRef,
    titleInputRef,
    descriptionInputRef,
    priceInputRef,
    quantityInputRef,
  };

  const { data, isLoading, isError, error, isFetching } = useQuery(
    'categoryList',
    getPosts,
    {
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    }
  );

  const dataList = JSON.parse(data);

  useEffect(() => {
    setValues({ ...values, categories: dataList });
    console.log('dataList: ', dataList);
  }, []);

  const queryClient = useQueryClient();

  const mutationCreateProduct = useMutationCreateProduct(queryClient);

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredTitle = titleInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const enteredPrice = priceInputRef.current.value;
    const enteredQuantity = quantityInputRef.current.value;

    const options = {
      url: '/product',
      method: 'post',
      token: token,
      data: {
        values: {
          title: enteredTitle,
          description: enteredDescription,
          price: enteredPrice,
          quantity: enteredQuantity,
          shipping: values.shipping,
          color: values.color,
          brand: values.brand,
          category: values.category,
        },
      },
    };
    mutationCreateProduct.mutate(options);
    formRef.current.reset();
    // if (err.response.status === 400) toast.error(err.response.data);
  };

  const handleCatagoryChange = async (e) => {
    e.preventDefault();
    // console.log('CLICKED CATEGORY', e.target.value);
    setValues({ ...values, category: e.target.value });

    const data = await getSubCategoryListByCategoryId(e.target.value);

    setSubOptions(data);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log(e.target.name, ' ----- ', e.target.value);
  };

  return (
    <div className="container-fluid">
      <AdminRoute isAdmin={isAdmin}>
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col-md-10">
            <h4>Product create</h4>
            <hr />
            <ProductCreateForm
              values={values}
              refOptions={refOptions}
              mutation={mutationCreateProduct}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleCatagoryChange={handleCatagoryChange}
              subOptions={subOptions}
              showSub={showSub}
            />
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

  const categoryList = async () => {
    const result = await listCategory();
    console.log('result: ', result);
    return JSON.stringify(result);
  };

  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    if (role === 'admin') isAdmin = true;

    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('categoryList', categoryList);

    return {
      props: {
        token: appToken,
        isAdmin: isAdmin,
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    console.log(
      'error CategoryCreate getServerSideProps: ',
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

export default ProductCreate;
