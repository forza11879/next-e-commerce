import React, { useRef, useState } from 'react';
import nookies from 'nookies';
import axios from 'axios';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import serialize from 'serialize-javascript';
import {
  useQueryFn,
  useMutationCreateCategory,
  useMutationRemoveCategory,
} from '@/hooks/useQuery';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import CategoryForm from '@/components/forms/CategoryForm';
import LocalSearch from '@/components/forms/LocalSearch';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { listCategory } from '@/Models/Category/index';

const baseURL = process.env.api;

async function getPosts() {
  // await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(`${baseURL}/category/all`);
  // if (true) {
  //   throw new Error('Test error!');
  // }
  const { data } = await axios.request({
    baseURL,
    url: '/category/all',
    method: 'get',
  });

  return JSON.stringify(data);
}

const CategoryCreate = ({ token, isAdmin }) => {
  const [keyword, setKeyword] = useState('');
  const formRef = useRef();
  const nameInputRef = useRef();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching } = useQueryFn(
    'categoryList',
    getPosts
  );

  const mutationCreateCategory = useMutationCreateCategory(queryClient);

  const mutationRemoveCategory = useMutationRemoveCategory(queryClient);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredName = nameInputRef.current.value;

    const options = {
      url: '/category',
      method: 'post',
      token: token,
      data: { name: enteredName },
    };

    try {
      mutationCreateCategory.mutate(options);
      formRef.current.reset();
    } catch (error) {
      console.log('handleSubmit CategoryCreate error: ', error);
      // if (error.response.status === 400) toast.error(error.response.data);
    }
  };

  const handleRemove = async (slug) => {
    const options = {
      url: `${process.env.api}/category/${slug}`,
      token: token,
      data: { slug },
    };

    if (window.confirm('Delete?')) {
      try {
        mutationRemoveCategory.mutate(options);
      } catch (error) {
        console.log('handleRemove error: ', error);
        // if (err.response.status === 400) {
        // toast.error(error.response.data);
        // }
      }
    }
  };

  const searched = (keyword) => (item) =>
    item.name.toLowerCase().includes(keyword);

  return (
    <div className="container-fluid">
      <AdminRoute isAdmin={isAdmin}>
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col">
            {isLoading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : isFetching ? (
              <h4 className="text-danger">Updating...</h4>
            ) : (
              <h4>Create Category</h4>
            )}
            {/* {isFetching ? <h4 className="text-danger">Updating...</h4> : null} */}
            {/* {categoryForm()} */}
            <CategoryForm
              formRef={formRef}
              nameInputRef={nameInputRef}
              mutation={mutationCreateCategory}
              handleSubmit={handleSubmit}
            />
            <LocalSearch keyword={keyword} setKeyword={setKeyword} />

            {isError ? (
              <h4 className="text-danger">{error.message}</h4>
            ) : JSON.parse(data).length ? (
              JSON.parse(data)
                .filter(searched(keyword))
                .map((item) => (
                  <div className="alert alert-secondary" key={item._id}>
                    {item.name}
                    <span
                      onClick={() => handleRemove(item.slug)}
                      className="btn btn-sm float-right"
                    >
                      <DeleteOutlined className="text-danger" />
                    </span>
                    <Link href={`/admin/category/${item.slug}`}>
                      <span className="btn btn-sm float-right">
                        <EditOutlined className="text-warning" />
                      </span>
                    </Link>
                  </div>
                ))
            ) : (
              <p>No Data</p>
            )}
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
    // return JSON.stringify(result);
    return serialize(result, { isJSON: true });
  };

  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    if (role === 'admin') isAdmin = true;

    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('categoryList', categoryList, null, {
      // force: true, // forced prefetch regadless if the data is stale(forced prefetching)
    });

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

export default CategoryCreate;
