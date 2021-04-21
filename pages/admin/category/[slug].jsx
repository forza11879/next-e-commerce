import React, { useRef } from 'react';
import axios from 'axios';
import { useQuery, QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import nookies from 'nookies';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { read } from '@/Models/Category/index';
import AdminNav from '@/components/nav/AdminNav';
import { useQueryFn, useMutationUpdateCategory } from '@/hooks/useQuery';

const baseURL = process.env.api;

async function getPost(slug) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log(`${baseURL}/category/${slug}`);
  const { data } = await axios.request({
    baseURL: baseURL,
    url: `/category/${slug}`,
    method: 'get',
  });
  console.log('getPost data.name:', data.name);
  return JSON.stringify(data);
}

const CategoryUpdate = ({ token, slug }) => {
  const formRef = useRef();
  const nameInputRef = useRef();
  const queryClient = useQueryClient();
  const router = useRouter();

  //   const { data, isLoading, isError, error, isFetching } = useQueryFn(
  //     ['categorySlug', slug],
  //     getPost(slug)
  //   );
  const { data, isLoading, isError, error, isFetching } = useQuery(
    ['categorySlug', slug],
    getPost(slug)
  );
  const { name } = JSON.parse(data);
  console.log('data.name: ', name);
  //   console.log('token: ', token);

  const {
    mutate: mutateUpdateCategory,
    isLoading: isLoadingUpdateCategor,
    isError: isErrorUpdateCategory,
    isSuccess: isSuccessUpdateCategory,
  } = useMutationUpdateCategory(queryClient);

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredName = nameInputRef.current.value;
    console.log('enteredName: ', enteredName);
    const options = {
      url: `/category/${slug}`,
      method: 'put',
      name: enteredName,
      token: token,
      slug: slug,
    };

    try {
      mutateUpdateCategory(options);
      router.push('/admin/category');
      //   console.log('isSuccessUpdateCategory: ', isSuccessUpdateCategory);
      //   formRef.current.reset();
    } catch (error) {
      console.log(error);
      //   if (error.response.status === 400) toast.error(error.response.data);
    }

    // toast.success(`"${res.data.name}" is updated`);
    // history.push('/admin/category');
  };

  const categoryForm = () => (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          ref={nameInputRef}
          defaultValue={name}
          autoFocus
          required
        />
        <br />
        <button className="btn btn-outline-primary">
          {isLoadingUpdateCategor
            ? 'Saving...'
            : isErrorUpdateCategory
            ? 'Error'
            : isSuccessUpdateCategory
            ? 'Save'
            : 'Save'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {isLoading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Update category</h4>
          )}
          {categoryForm()}
          <hr />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;
  const {
    params: { slug },
  } = context;
  const { appToken } = nookies.get(context);
  // let isAdmin = false;

  const categoryRead = async () => {
    const result = await read(slug);
    return JSON.stringify(result);
  };

  try {
    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(
      ['categorySlug', slug],
      categoryRead,
      null,
      {
        // force: true, // forced prefetch regadless if the data is stale(forced prefetching)
      }
    );

    return {
      props: {
        token: appToken,
        slug: slug,
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    console.log(
      'error CategoryUpdate getServerSideProps: ',
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

export default CategoryUpdate;
