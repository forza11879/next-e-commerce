import React, { useRef, useState, useEffect } from 'react';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import nookies from 'nookies';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { listCategory } from '@/Models/Category/index';
import { read } from '@/Models/SubCategory/index';
import AdminNav from '@/components/nav/AdminNav';
import CategoryForm from '@/components/forms/CategoryForm';
import {
  useQuerySubCategory,
  useMutationUpdateSubCategory,
  subcategoryQueryKeys,
} from '@/hooks/query/subcategory';
import { useQueryCategories, categoryQueryKeys } from '@/hooks/query/category';

const SubUpdate = ({ id, token, slug }) => {
  const [parentInput, setParentInput] = useState('');
  const formRef = useRef();
  const nameInputRef = useRef();
  const router = useRouter();

  const categoryQuery = useQueryCategories();
  const slugSubCategoryQuery = useQuerySubCategory(id, slug);

  const { name, parent } = slugSubCategoryQuery.data;

  useEffect(() => {
    setParentInput(parent);
  }, []);

  const mutationUpdateSubCategory = useMutationUpdateSubCategory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredName = nameInputRef.current.value;

    const options = {
      url: `/subcategory/${slug}`,
      method: 'put',
      token: token,
      slug: slug,
      data: { name: enteredName, parent: parentInput },
    };

    try {
      mutationUpdateSubCategory.mutate(options);
      router.push('/admin/subcategory');
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
          {slugSubCategoryQuery.isLoading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Update Subcategory</h4>
          )}

          <div className="form-group">
            <label>Parent category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setParentInput(e.target.value)}
            >
              <option>Please select</option>
              {categoryQuery.data.length > 0 &&
                categoryQuery.data.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                    // defaultValue={item._id === parentInput}
                    selected={item._id === parentInput}
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          <CategoryForm
            formRef={formRef}
            nameInputRef={nameInputRef}
            mutation={mutationUpdateSubCategory}
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
  try {
    const result = await read(slug);

    const newObj = {
      id: result._id,
      name: result.name,
      parent: result.parent,
      slug: result.slug,
    };

    const id = JSON.parse(JSON.stringify(newObj.id));

    const subCategoryRead = () => {
      return JSON.stringify(newObj);
    };

    const categoryList = async () => {
      const result = await listCategory();
      return JSON.stringify(result);
    };

    // Using Hydration
    const queryClient = new QueryClient();

    await Promise.allSettled([
      queryClient.prefetchQuery(...categoryQueryKeys.categories, categoryList),
      queryClient.prefetchQuery(
        subcategoryQueryKeys.subCategory(id),
        subCategoryRead
      ),
    ]);

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

export default SubUpdate;
