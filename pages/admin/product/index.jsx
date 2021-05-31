import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import nookies from 'nookies';
import { QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { LoadingOutlined } from '@ant-design/icons';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import ProductCreateForm from '@/components/forms/ProductCreateForm';
import FileUpload from '@/components/forms/FileUpload';
import {
  useMutationPhotoUpload,
  useMutationPhotoRemove,
} from '@/hooks/useQuery';
import { useQueryCategories } from '@/hooks/query/category';
import { useMutationCreateProduct } from '@/hooks/query/product';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { listCategory } from '@/Models/Category/index';

const initialState = {
  title: 'Macbook Pro',
  description: 'This is the best Apple product',
  price: '45000',
  categories: [],
  category: '',
  subcategories: [],
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
//   subcategories: [],
//   shipping: '',
//   quantity: '',
//   images: [],
//   colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
//   brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
//   color: '',
//   brand: '',
// };
const baseURL = process.env.api;

async function getSubCategoriesByCategoryId(id) {
  console.log(`${baseURL}/category/subcategories/${id}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/category/subcategories/${id}`,
      method: 'get',
    });
    return data;
  } catch (error) {
    console.log('getSubCategoriesByCategoryId error:', error);
  }
}

const ProductCreate = ({ token, isAdmin }) => {
  console.log('initialState: ', initialState);
  // initialState.images = [];

  const [values, setValues] = useState(initialState);
  const [showSub, setShowSub] = useState(false);

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

  const { data } = useQueryCategories();

  useEffect(() => {
    setValues({ ...values, categories: data });

    data.map((item) => {
      queryClient.prefetchQuery(['subCategoriesByCategoryId', item._id], () =>
        getSubCategoriesByCategoryId(item._id)
      );
    });
  }, []);

  const mutationCreateProduct = useMutationCreateProduct();

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
    setValues((values) => ({ ...values, subcategories: [] }));
    formRef.current.reset();
    // if (err.response.status === 400) toast.error(err.response.data);
  };

  const handleCatagoryChange = async (e) => {
    e.preventDefault();
    // console.log('CLICKED CATEGORY', e.target.value);
    setValues({ ...values, subcategories: [], category: e.target.value });
    // console.log(e.target.name, ' ----- ', e.target.value);

    setShowSub(true);
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
            {mutationPhotoUpload.isLoading ? (
              <LoadingOutlined className="text-danger h1" />
            ) : (
              <h4>Product Create</h4>
            )}{' '}
            <hr />
            <div className="p-3">
              <FileUpload
                values={values}
                setValues={setValues}
                token={token}
                mutationPhotoUpload={mutationPhotoUpload}
                mutationPhotoRemove={mutationPhotoRemove}
              />
            </div>
            <ProductCreateForm
              values={values}
              setValues={setValues}
              refOptions={refOptions}
              mutation={mutationCreateProduct}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleCatagoryChange={handleCatagoryChange}
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
    await queryClient.prefetchQuery(['categories'], categoryList);

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
