import React, { useState, useRef } from 'react';
import nookies from 'nookies';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { isError, QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { useQueryFn } from '@/hooks/useQuery';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import { fetchApi, fetchApiData, fetchDeleteApiData } from '@/store/saga/user';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { list } from '@/Models/Category/index';
import db from '@/middleware/db';

const createCategory = async (name, options) => {
  try {
    const { data } = await fetchApiData({ name }, options);
    return data;
  } catch (error) {
    console.log('createCategory error: ', error);
    if (error.response.status === 400) toast.error(error.response.data);
    if (error.response.status === 401) toast.error(error.response.data);
  }
};

const removeCategory = async (slug, options) => {
  try {
    const { data } = await fetchDeleteApiData({ slug }, options);
    console.log('removeCategory data: ', data);
    return data;
  } catch (error) {
    console.log('removeCategory error: ', error);
    // if (error.response.status === 400) toast.error(error.response.data);
    // if (error.response.status === 401) toast.error(error.response.data);
  }
};

async function getPosts() {
  console.log(`${process.env.api}/category/all`);
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // if (true) {
  //   throw new Error('Test error!');
  // }
  const {
    data: { list },
  } = await axios.request({
    baseURL: process.env.api,
    url: '/category/all',
    method: 'get',
  });
  console.log('useQuery getPosts: ');
  return list;
}

const CategoryCreate = ({ token, isAdmin }) => {
  const formRef = useRef();
  const nameInputRef = useRef();
  const { data, isLoading, isError, error, isFetching } = useQueryFn(
    'categoryList',
    getPosts
  );
  // console.log('data hydration: ', data);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredName = nameInputRef.current.value;

    const options = {
      url: '/category',
      method: 'post',
      token: token,
    };

    try {
      const categoryData = await createCategory(enteredName, options);
      toast.success(`"${categoryData.category.name}" is created`);
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
        const removeCategoryData = await removeCategory(slug, options);
        toast.error(`${removeCategoryData.deleted.name} deleted`);
        await getPosts();
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
        <button className="btn btn-outline-primary">Save</button>
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
            ) : (
              JSON.parse(data).map((c) => (
                <div className="alert alert-secondary" key={c._id}>
                  {c.name}
                  <span
                    onClick={() => handleRemove(c.slug)}
                    className="btn btn-sm float-right"
                  >
                    <DeleteOutlined className="text-danger" />
                  </span>
                  <Link href={`/admin/category/${c.slug}`}>
                    <span className="btn btn-sm float-right">
                      <EditOutlined className="text-warning" />
                    </span>
                  </Link>
                </div>
              ))
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
  try {
    // await db(req, res, next);
    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    if (role === 'admin') isAdmin = true;

    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('categoryList', list);

    return {
      props: {
        token: appToken,
        isAdmin: isAdmin,
        // categoryList: JSON.stringify(categoryListResult.value),
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
