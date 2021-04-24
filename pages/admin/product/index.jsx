import React, { useState, useRef } from 'react';
import nookies from 'nookies';
import { QueryClient, useQueryClient } from 'react-query';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import { useQueryFn, useMutationCreateProduct } from '@/hooks/useQuery';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';

const initialState = {
  title: 'Macbook Pro',
  description: 'This is the best Apple product',
  price: '45000',
  categories: [],
  category: '',
  subs: [],
  shipping: 'Yes',
  quantity: '50',
  images: [],
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
  color: 'White',
  brand: 'Apple',
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
const ProductCreate = ({ token, isAdmin }) => {
  const [values, setValues] = useState(initialState);

  const formRef = useRef();

  const titleInputRef = useRef();
  const descriptionInputRef = useRef();
  const priceInputRef = useRef();
  const quantityInputRef = useRef();

  const queryClient = useQueryClient();

  const mutationCreateProduct = useMutationCreateProduct(queryClient);

  // destructure
  const {
    title,
    description,
    price,
    categories,
    category,
    subcategories,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values;

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
          shipping,
          quantity: enteredQuantity,
          color,
          brand,
        },
      },
    };
    mutationCreateProduct.mutate(options);
    formRef.current.reset();
    // if (err.response.status === 400) toast.error(err.response.data);
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
            <h4>Product create</h4>
            <hr />
            {JSON.stringify(values)}

            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  ref={titleInputRef}
                  defaultValue={title}
                  // value={title}
                  // onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  className="form-control"
                  ref={descriptionInputRef}
                  defaultValue={description}
                  // value={description}
                  // onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  ref={priceInputRef}
                  defaultValue={price}
                  // value={price}
                  // onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Shipping</label>
                <select
                  name="shipping"
                  className="form-control"
                  onChange={handleChange}
                >
                  <option>Please select</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  ref={quantityInputRef}
                  defaultValue={quantity}
                  // value={quantity}
                  // onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <select
                  name="color"
                  className="form-control"
                  onChange={handleChange}
                >
                  <option>Please select</option>
                  {colors.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Brand</label>
                <select
                  name="brand"
                  className="form-control"
                  onChange={handleChange}
                >
                  <option>Please select</option>
                  {brands.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <button className="btn btn-outline-info">Save</button>
            </form>
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

  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    if (role === 'admin') isAdmin = true;

    // Using Hydration
    //   const queryClient = new QueryClient();
    //   await queryClient.prefetchQuery('categoryList', categoryList, null, {
    //     // force: true, // forced prefetch regadless if the data is stale(forced prefetching)
    //   });

    return {
      props: {
        token: appToken,
        isAdmin: isAdmin,
        //   dehydratedState: dehydrate(queryClient),
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
