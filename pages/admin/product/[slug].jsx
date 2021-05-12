import React, { useState, useRef, useEffect } from 'react';
import nookies from 'nookies';
import axios from 'axios';
import { useQuery, QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { LoadingOutlined } from '@ant-design/icons';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import ProductUpdateForm from '@/components/forms/update/ProductUpdateForm';
import FileUpload from '@/components/forms/FileUpload';
import {
  useMutationPhotoUpload,
  useMutationPhotoRemove,
  useMutationCreateProduct,
} from '@/hooks/useQuery';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { read } from '@/Models/Product/index';
import { listCategory } from '@/Models/Category/index';

const baseURL = process.env.api;

const initialState = {
  title: '',
  description: '',
  price: '',
  categories: [],
  subcategories: [],
  shipping: '',
  quantity: '',
  images: [],
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
  color: '',
  brand: '',
};

async function getCategories() {
  // await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(`${baseURL}/category/all`);
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

async function getProduct(slug) {
  // await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(`${baseURL}/product/${slug}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/${slug}`,
      method: 'get',
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('getPosts error:', error);
  }
}

async function getSubCategoryListByCategoryId(id) {
  // await new Promise((resolve) => setTimeout(resolve, 300));
  // console.log(`${baseURL}/category/subcategories/${id}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/category/subcategories/${id}`,
      method: 'get',
    });
    // console.log('data getSubCategoryListByCategoryId index: ', data);
    return data;
  } catch (error) {
    console.log('getSubCategoryListByCategoryId error:', error);
  }
}
const ProductUpdate = ({ slug, token, isAdmin }) => {
  // console.log('initialState: ', initialState);

  const [values, setValues] = useState(initialState);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [arrayOfSubs, setArrayOfSubs] = useState([]);

  const queryClient = useQueryClient();

  const formRef = useRef();

  const titleInputRef = useRef();
  const descriptionInputRef = useRef();
  const priceInputRef = useRef();
  const quantityInputRef = useRef();
  // const shippingInputRef = useRef();
  // const colorInputRef = useRef();
  // const brandInputRef = useRef();
  // const categoryInputRef = useRef();
  // const subcategoriesInputRef = useRef();
  // const imagesInputRef = useRef();

  const refOptions = {
    formRef,
    titleInputRef,
    descriptionInputRef,
    priceInputRef,
    quantityInputRef,
    // shippingInputRef,
    // colorInputRef,
    // brandInputRef,
    // categoryInputRef,
    // subcategoriesInputRef,
    // imagesInputRef,
  };

  const productReadQuery = useQuery(
    ['productRead', slug],
    () => getProduct(slug),
    {
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    }
  );

  // console.log('data: ', JSON.parse(productReadQuery.data));

  const { data, isLoading, isError, error, isFetching } = useQuery(
    'categoryListUpdate',
    getCategories,
    {
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    }
  );

  const dataList = JSON.parse(data);
  const productData = JSON.parse(productReadQuery.data);

  useEffect(() => {
    setValues((values) => ({
      ...values,
      ...productData,
      categories: dataList,
    }));

    setSelectedCategory(productData.category._id);

    const arrayOfSubcategories = productData.subcategories.map((item) => {
      return item._id;
    });
    setArrayOfSubs((arrayOfSubs) => arrayOfSubcategories);

    dataList.map((item) => {
      queryClient.prefetchQuery(
        ['subCategoryListByCategoryIdUpdate', item._id],
        () => getSubCategoryListByCategoryId(item._id)
      );
    });
  }, []);

  const mutationCreateProduct = useMutationCreateProduct(queryClient);
  const mutationPhotoUpload = useMutationPhotoUpload(queryClient);
  const mutationPhotoRemove = useMutationPhotoRemove(queryClient);

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredTitle = titleInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const enteredPrice = priceInputRef.current.value;
    const enteredQuantity = quantityInputRef.current.value;
    // const enteredShipping = shippingInputRef.current.value;
    // const enteredColor = colorInputRef.current.value;
    // const enteredBrand = brandInputRef.current.value;
    // const enteredCategory = categoryInputRef.current.value;
    // const enteredSubcategories = subcategoriesInputRef.current.value;
    // const enteredImages = imagesInputRef.current.value;
    // console.log({ enteredShipping });

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
          // shipping: enteredShipping,
          color: values.color,
          // color: enteredColor,
          brand: values.brand,
          // brand: enteredBrand,
          category: values.category,
          // category: enteredCategory,
          subcategories: values.subcategories,
          // subcategories: enteredSubcategories,
          images: values.images,
          // images: enteredImages,
        },
      },
      props: {
        setValues,
        values,
        initialState,
      },
    };
    mutationCreateProduct.mutate(options);
    formRef.current.reset();
    // if (err.response.status === 400) toast.error(err.response.data);
  };

  const handleCatagoryChange = async (e) => {
    e.preventDefault();

    setSelectedCategory(e.target.value);

    if (values.category._id === e.target.value) {
      const arrayOfSubcategories = values.subcategories.map((item) => {
        return item._id;
      });
      setArrayOfSubs((arrayOfSubs) => arrayOfSubcategories);
    } else {
      // console.log(e.target.name, ' ----- ', e.target.value);
      setArrayOfSubs([]);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    // console.log(e.target.name, ' ----- ', e.target.value);
  };

  return (
    <div className="container-fluid">
      <AdminRoute isAdmin={isAdmin}>
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col-md-10">
            {/* {mutationPhotoUpload.isLoading ? (
              <LoadingOutlined className="text-danger h1" />
            ) : (
              <>
                <h4>Product Update</h4>
                <p> {JSON.stringify(productReadQuery.data)}</p>
              </>
            )}{' '} */}
            <>
              <h4>Product Update</h4>
            </>
            <hr />
            <div className="p-3">
              {/* <FileUpload
                values={values}
                setValues={setValues}
                token={token}
                mutationPhotoUpload={mutationPhotoUpload}
                mutationPhotoRemove={mutationPhotoRemove}
              /> */}
            </div>
            <ProductUpdateForm
              values={values}
              setValues={setValues}
              arrayOfSubs={arrayOfSubs}
              setArrayOfSubs={setArrayOfSubs}
              selectedCategory={selectedCategory}
              refOptions={refOptions}
              mutation={mutationCreateProduct}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleCatagoryChange={handleCatagoryChange}
            />
          </div>
        </div>
      </AdminRoute>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;
  const {
    params: { slug },
  } = context;

  const { appToken } = nookies.get(context);
  let isAdmin = false;

  const productRead = async (slug) => {
    const result = await read(slug);
    console.log('result: ', result);
    return JSON.stringify(result);
  };

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

    await Promise.allSettled([
      queryClient.prefetchQuery(['productRead', slug], () => productRead(slug)),
      queryClient.prefetchQuery('categoryListUpdate', categoryList),
    ]);

    return {
      props: {
        slug: slug,
        token: appToken,
        isAdmin: isAdmin,
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    console.log(
      'error ProductUpdate getServerSideProps: ',
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

export default ProductUpdate;
