import React, { useRef, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import nookies from 'nookies';
import {
  useQuerySubCategories,
  useMutationCreateSubCategory,
  useMutationRemoveSubCategory,
  subcategoryQueryKeys,
} from '@/hooks/query/subcategory';
import { useQueryCategories, categoryQueryKeys } from '@/hooks/query/category';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import CategoryForm from '@/components/forms/CategoryForm';
import LocalSearch from '@/components/forms/LocalSearch';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { listSubCategory } from '@/Models/SubCategory/index';
import { listCategory } from '@/Models/Category/index';

const SubCreate = ({ token, isAdmin }) => {
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const formRef = useRef();
  const nameInputRef = useRef();
  // "Parallel" queries are queries that are executed in parallel, or at the same time so as to maximize fetching concurrency.
  // When the number of parallel queries does not change, there is no extra effort to use parallel queries. Just use any number of React Query's useQuery and useInfiniteQuery hooks side-by-side!
  const categoryQuery = useQueryCategories();
  const subCategoryQuery = useQuerySubCategories();

  const mutationCreateSubCategory = useMutationCreateSubCategory();
  const mutationRemoveSubCategory = useMutationRemoveSubCategory();

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

    mutationCreateSubCategory.mutate(options);
    formRef.current.reset();
  };

  const handleRemove = async (slug) => {
    const options = {
      url: `${process.env.api}/subcategory/${slug}`,
      token: token,
      data: { slug },
    };
    if (window.confirm('Delete?')) {
      mutationRemoveSubCategory.mutate(options);
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
            ) : subCategoryQuery.isFetching ? (
              <h4 className="text-danger">Updating...</h4>
            ) : (
              <h4>Create Subcategory</h4>
            )}

            <div className="form-group">
              <label>Parent category</label>
              <select
                name="category"
                className="form-control"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Please select</option>
                {categoryQuery.data.length > 0 &&
                  categoryQuery.data.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            <CategoryForm
              formRef={formRef}
              nameInputRef={nameInputRef}
              mutation={mutationCreateSubCategory}
              handleSubmit={handleSubmit}
            />

            <LocalSearch keyword={keyword} setKeyword={setKeyword} />

            {subCategoryQuery.isError ? (
              <h4 className="text-danger">{error.message}</h4>
            ) : subCategoryQuery.data.length ? (
              subCategoryQuery.data.filter(searched(keyword)).map((item) => (
                <div className="alert alert-secondary" key={item._id}>
                  {item.name}
                  <span
                    onClick={() => handleRemove(item.slug)}
                    className="btn btn-sm float-right"
                  >
                    <DeleteOutlined className="text-danger" />
                  </span>
                  <Link href={`/admin/subcategory/${item.slug}`}>
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
  try {
    // const categoryList = async () => {
    //   const result = await listCategory();
    //   return JSON.stringify(result);
    // };

    // const subCategoryList = async () => {
    //   const result = await listSubCategory();
    //   return JSON.stringify(result);
    // };

    const { email } = await admin.auth().verifyIdToken(appToken);
    const { role } = await currentUser(email);

    if (role === 'admin') isAdmin = true;

    // Using Hydration
    const queryClient = new QueryClient();

    await Promise.allSettled([
      queryClient.prefetchQuery(...categoryQueryKeys.categories, async () => {
        const result = await listCategory();
        return JSON.stringify(result);
      }),
      queryClient.prefetchQuery(
        ...subcategoryQueryKeys.subCategories,
        async () => {
          const result = await listSubCategory();
          return JSON.stringify(result);
        }
      ),
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
