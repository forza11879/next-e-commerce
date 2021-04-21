import React, { useRef } from 'react';
import nookies from 'nookies';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import {
  useQueryFn,
  useMutationCreateCategory,
  useMutationRemoveCategory,
} from '@/hooks/useQuery';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { list } from '@/Models/Category/index';

const baseURL = process.env.api;

async function getPosts() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(`${process.env.api}/category/all`);
  // if (true) {
  //   throw new Error('Test error!');
  // }
  const { data } = await axios.request({
    baseURL: 'http://localhost:3000/api',
    url: '/category/all',
    method: 'get',
  });

  return JSON.stringify(data);
}

const CategoryCreate = ({ token, isAdmin }) => {
  const formRef = useRef();
  const nameInputRef = useRef();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching } = useQueryFn(
    'categoryList',
    getPosts
  );

  const {
    mutate: mutateCreateCategory,
    isLoading: isLoadingCreateCategory,
    isError: isErrorCreateCategory,
    isSuccess: isSuccessCreateCategory,
    error: errorCreateCategory,
  } = useMutationCreateCategory(queryClient);

  const { mutate: mutateRemoveCategory } = useMutationRemoveCategory(
    queryClient
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredName = nameInputRef.current.value;

    const options = {
      url: '/category',
      method: 'post',
      token: token,
    };

    try {
      mutateCreateCategory({ enteredName, options });
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
    };

    if (window.confirm('Delete?')) {
      try {
        mutateRemoveCategory({ slug, options });
      } catch (error) {
        console.log('handleRemove error: ', error);
        // if (err.response.status === 400) {
        // toast.error(error.response.data);
        // }
      }
    }
  };

  const categoryForm = () => (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          ref={nameInputRef}
          autoFocus
          required
        />
        <br />
        <button className="btn btn-outline-primary">
          {isLoadingCreateCategory
            ? 'Saving...'
            : isErrorCreateCategory
            ? 'Error'
            : isSuccessCreateCategory
            ? 'Save'
            : 'Save'}
        </button>
        {isErrorCreateCategory ? (
          <pre>{console.log(errorCreateCategory)}</pre>
        ) : null}
      </div>
    </form>
  );

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
              <h4>Create category</h4>
            )}
            {/* {isFetching ? <h4 className="text-danger">Updating...</h4> : null} */}
            {categoryForm()}
            <hr />
            {isError ? (
              <h4 className="text-danger">{error.message}</h4>
            ) : JSON.parse(data).length ? (
              JSON.parse(data).map((item) => (
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
    const result = await list();
    return JSON.stringify(result);
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
