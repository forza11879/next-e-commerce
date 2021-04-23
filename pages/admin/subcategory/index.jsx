import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import nookies from 'nookies';
import {
  useQueryFn,
  useMutationCreateSubCategory,
  useMutationRemoveCategory,
} from '@/hooks/useQuery';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import CategoryForm from '@/components/forms/CategoryForm';
import LocalSearch from '@/components/forms/LocalSearch';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { listSubCategory } from '@/Models/SubCategory/index';
import { listCategory } from '@/Models/Category/index';

const baseURL = process.env.api;

async function getPostsCategory() {
  await new Promise((resolve) => setTimeout(resolve, 500));
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

async function getPostsSubCategory() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`${baseURL}/subcategory/all`);
  // if (true) {
  //   throw new Error('Test error!');
  // }
  const { data } = await axios.request({
    baseURL,
    url: '/subcategory/all',
    method: 'get',
  });

  return JSON.stringify(data);
}

const SubCreate = ({ token, isAdmin }) => {
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const formRef = useRef();
  const nameInputRef = useRef();
  const queryClient = useQueryClient();
  // "Parallel" queries are queries that are executed in parallel, or at the same time so as to maximize fetching concurrency.
  // When the number of parallel queries does not change, there is no extra effort to use parallel queries. Just use any number of React Query's useQuery and useInfiniteQuery hooks side-by-side!
  const categoryQuery = useQueryFn('categoryList', getPostsCategory);
  const subCategoryQuery = useQueryFn('subCategoryList', getPostsSubCategory);

  const mutationCreateSubCategory = useMutationCreateSubCategory(queryClient);
  const mutationRemoveSubCategory = useMutationRemoveCategory(queryClient);

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredName = nameInputRef.current.value;

    const options = {
      url: '/subcategory',
      method: 'post',
      token: token,
      data: {
        name: enteredName,
        parent: category,
      },
    };

    // const dataLoad = {
    //   name: enteredName,
    //   parent: category,
    // };

    mutationCreateSubCategory.mutate(options);
    // mutationCreateSubCategory.mutate({ enteredName, category, options });
    formRef.current.reset();
    // toast.success(`"${res.data.name}" is created`);
    // if (err.response.status === 400) toast.error(err.response.data);
  };

  const handleRemove = async (slug) => {
    const options = {
      url: `${process.env.api}/subcategory/${slug}`,
      token: token,
    };
    // let answer = window.confirm("Delete?");
    // console.log(answer, slug);
    if (window.confirm('Delete?')) {
      mutationRemoveSubCategory.mutate({ slug, options });
      //   toast.error(`${res.data.name} deleted`);
      //   if (err.response.status === 400) {
      //     toast.error(err.response.data);
      //   }
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
            {subCategoryQuery.isLoading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <h4>Create sub category</h4>
            )}

            <div className="form-group">
              <label>Parent category</label>
              <select
                name="category"
                className="form-control"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Please select</option>
                {JSON.parse(categoryQuery.data).length > 0 &&
                  JSON.parse(categoryQuery.data).map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* {category} */}

            {JSON.stringify(categoryQuery.data)}

            <CategoryForm
              formRef={formRef}
              nameInputRef={nameInputRef}
              mutation={mutationCreateSubCategory}
              handleSubmit={handleSubmit}
            />

            {/* step 2 and step 3 */}
            <LocalSearch keyword={keyword} setKeyword={setKeyword} />

            {JSON.stringify(subCategoryQuery.data)}

            {/* step 5 */}
            {/* {categories.filter(searched(keyword)).map((c) => (
            <div className="alert alert-secondary" key={c._id}>
              {c.name}
              <span
                onClick={() => handleRemove(c.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/category/${c.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
            </div>
          ))} */}
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
    const categoryList = async () => {
      const result = await listCategory();
      return JSON.stringify(result);
    };

    const subCategoryList = async () => {
      const result = await listSubCategory();
      return JSON.stringify(result);
    };

    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    if (role === 'admin') isAdmin = true;

    // Using Hydration
    const queryClient = new QueryClient();

    await Promise.allSettled([
      queryClient.prefetchQuery('categoryList', categoryList),
      queryClient.prefetchQuery('subCategoryList', subCategoryList),
    ]);

    return {
      props: {
        token: appToken,
        isAdmin: isAdmin,
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    console.log(
      'error SubCreate getServerSideProps: ',
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
export default SubCreate;

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     isFetching,
//   }
