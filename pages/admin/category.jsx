import React, { useRef } from 'react';
import nookies from 'nookies';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { QueryClient, useMutation, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { useQueryFn } from '@/hooks/useQuery';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
// import { list } from '@/Models/Category/index';

const baseURL = process.env.api;

async function getPosts() {
  console.log(`${process.env.api}/category/all`);
  // await new Promise((resolve) => setTimeout(resolve, 1000));
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

  const dataList = JSON.parse(data);
  // console.log('dataList use query: ', dataList);

  const mutationCreateCategory = useMutation(
    async ({ enteredName, options: { url, method, token } }) =>
      axios.request({
        baseURL: baseURL,
        url,
        method,
        data: { name: enteredName },
        headers: { token },
      }),
    {
      onMutate: ({ enteredName, options }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries('categoryList');

        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('categoryList');
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          _id: Date.now(),
          name: enteredName,
        };
        // console.log('newObject: ', newObject);
        queryClient.setQueryData('categoryList', (oldQueryData) => {
          // console.log('oldQueryData: ', oldQueryData);
          const oldQueryDataArray = JSON.parse(oldQueryData);
          oldQueryDataArray.unshift(newObject);
          // const newQueryDataArray = [newObject, ...oldQueryDataArray];
          // console.log('oldQueryDataArray onMutate: ', oldQueryDataArray);
          return JSON.stringify(oldQueryDataArray);
        });
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData('categoryList', previousQueryDataArray);
      },
      onError: (error, variables, rollback) => {
        //   If there is an errror, then we will rollback
        console.log('error onError: ', error);
        // Runs on error
        // console.log(`rolling back optimistic update with context ${context}`);
        if (rollback) {
          console.log('rollback');
          rollback();
        }
      },
      onSuccess: ({ data }, variables, context) => {
        // console.log('onSuccess data: ', data);
        // Runs only there is a success
        // toast.success(`"${data.category.name}" is created`);
        // saves http trip to the back-end
        if (data) {
          queryClient.setQueryData('categoryList', (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            // console.log('oldQueryDataArray before filter: ', oldQueryDataArray);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.name !== data.name
            );
            // console.log('newQueryDataArray after filter: ', newQueryDataArray);
            newQueryDataArray.unshift(data);
            // console.log('newQueryDataArray onSuccess: ', newQueryDataArray);
            return JSON.stringify(newQueryDataArray);
          });
        }
      },
      onSettled: ({ data }, error, variables, context) => {
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered after using setQueryData inside onSuccess: because you are getting the latest data from the server
        queryClient.invalidateQueries('categoryList');
      },
    }
  );

  // console.log('mutationCreateCategory: ', mutationCreateCategory.error);

  const mutationRemoveCategory = useMutation(
    ({ slug, options: { url, token } }) =>
      axios.delete(url, {
        headers: {
          token,
        },
        data: { slug },
      }),
    {
      onMutate: ({ slug, options }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries('categoryList', { exact: true });
        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('categoryList');
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        queryClient.setQueryData('categoryList', (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          const newQueryDataArray = oldQueryDataArray.filter(
            (item) => item.slug !== slug
          );
          console.log('newQueryDataArray: ', newQueryDataArray);
          return JSON.stringify(newQueryDataArray);
        });
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData('categoryList', previousQueryDataArray);
      },
      onError: (error, variables, rollback) => {
        // Runs on error
        // toast.error(error.response.data.message);
        if (rollback) {
          rollback();
          console.log('delete rollback');
        }
      },
      onSuccess: (data, variables, context) => {
        // Runs only there is a success
        if (data.data.deleted) {
          // toast.error(`${data.deleted.name} deleted`);
          console.log('data.data.deleted: ', data.data.deleted);
          queryClient.setQueryData('categoryList', (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.slug !== data.data.deleted.slug
            );
            console.log(
              'RemoveCategory newQueryDataArray onSuccess : ',
              newQueryDataArray
            );
            return JSON.stringify(newQueryDataArray);
          });
        }
      },
      onSettled: (data, variables, context) => {
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        queryClient.invalidateQueries('categoryList');
      },
    }
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
      mutationCreateCategory.mutate({ enteredName, options });
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
        mutationRemoveCategory.mutate({ slug, options });
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
          {mutationCreateCategory.isLoading
            ? 'Saving...'
            : mutationCreateCategory.isError
            ? 'Error'
            : mutationCreateCategory.isSuccess
            ? 'Save'
            : 'Save'}
        </button>
        {mutationCreateCategory.isError ? (
          <pre>{console.log(mutationCreateCategory.error)}</pre>
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
            ) : dataList.length ? (
              dataList.map((c) => (
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
  const list = async () => {
    const { data } = await axios.request({
      baseURL: 'http://localhost:3000/api',
      url: '/category/all',
      method: 'get',
    });
    // console.log('data axios typeof: ', typeof data);
    // console.log('data axios: ', data);
    return JSON.stringify(data);
  };

  try {
    // await db(req, res, next);
    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    if (role === 'admin') isAdmin = true;

    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('categoryList', list, null, {
      // force: true, // forced prefetch regadless if the data is stale(forced prefetching)
    });
    // const QueryDataObj = queryClient.getQueryData('categoryList');
    // console.log('queryClient: ', typeof QueryDataObj);

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
