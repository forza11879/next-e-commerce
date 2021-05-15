import { useRef } from 'react';
import axios from 'axios';
import { QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import nookies from 'nookies';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { read } from '@/Models/Category/index';
import AdminNav from '@/components/nav/AdminNav';
import CategoryForm from '@/components/forms/CategoryForm';
import { useQueryFn, useMutationUpdateCategory } from '@/hooks/useQuery';

const baseURL = process.env.api;

async function getPost(slug) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  //   console.log(`${baseURL}/category/${slug}`);
  const { data } = await axios.request({
    baseURL: baseURL,
    url: `/category/${slug}`,
    method: 'get',
  });
  //   console.log('getPost data.name:', data.name);
  return JSON.stringify(data);
}

const CategoryUpdate = ({ id, token, slug }) => {
  const formRef = useRef();
  const nameInputRef = useRef();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError, error, isFetching } = useQueryFn(
    ['categorySlug', id],
    () => getPost(slug)
  );

  const { name } = JSON.parse(data);

  const mutationUpdateCategory = useMutationUpdateCategory(queryClient);

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredName = nameInputRef.current.value;

    const options = {
      url: `/category/${slug}`,
      method: 'put',
      token: token,
      slug: slug,
      data: { name: enteredName },
    };

    try {
      mutationUpdateCategory.mutate(options);
      router.push('/admin/category');
      //   formRef.current.reset();
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) toast.error(error.response.data);
    }

    // toast.success(`"${res.data.name}" is updated`);
    // history.push('/admin/category');
  };

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
            <h4>Update Category</h4>
          )}
          {/* {categoryForm()} */}
          <CategoryForm
            formRef={formRef}
            nameInputRef={nameInputRef}
            mutation={mutationUpdateCategory}
            name={name}
            handleSubmit={handleSubmit}
          />
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

  const result = await read(slug);

  const newObj = {
    id: result._id,
    name: result.name,
    slug: result.slug,
  };

  const id = JSON.parse(JSON.stringify(newObj.id));

  const categoryRead = () => {
    return JSON.stringify(newObj);
  };

  try {
    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(['categorySlug', id], categoryRead, null, {
      // force: true, // forced prefetch regadless if the data is stale(forced prefetching)
    });

    return {
      props: {
        id: id,
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
