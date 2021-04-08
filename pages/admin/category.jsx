import React, { useState, useEffect } from 'react';
import nookies from 'nookies';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import { fetchApiData, fetchDeleteApiData } from '@/store/saga/user';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { list } from '@/Models/Category/index';

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
  // console.log(process.env.HOST);
  const { data } = await axios.request({
    baseURL: process.env.api,
    url: '/category/all',
    method: 'get',
  });
  const { list } = data;
  console.log('list getPosts: ', list);
  return list;
}

const CategoryCreate = ({ token, isAdmin, categoryList }) => {
  console.log('JSON.parse(categoryList): ', JSON.parse(categoryList));
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { data, isLoading, error } = useQuery('categoryList', getPosts, {
    initialData: JSON.parse(categoryList),
    // initialStale: true,
  });

  useEffect(() => {
    setCategories(data);
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);

    const options = {
      url: '/category',
      method: 'post',
      token: token,
    };

    try {
      const categoryData = await createCategory(name, options);
      // console.log('data.category.name: ', data.category.name);
      setLoading(false);
      setName('');
      toast.success(`"${categoryData.category.name}" is created`);
    } catch (error) {
      console.log('handleSubmit CategoryCreate error: ', error);
      setLoading(false);
      // if (error.response.status === 400) toast.error(error.response.data);
    }
  };

  const handleRemove = async (slug) => {
    const options = {
      url: `${process.env.api}/category/${slug}`,
      token: token,
    };

    if (window.confirm('Delete?')) {
      setLoading(true);
      try {
        const removeCategoryData = await removeCategory(slug, options);

        setLoading(false);
        toast.error(`${removeCategoryData.deleted.name} deleted`);
        // loadCategories();
      } catch (error) {
        setLoading(false);
        console.log('handleRemove error: ', error);
        // if (err.response.status === 400) {
        // toast.error(error.response.data);
        // }
      }
    }
  };

  const categoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          value={name}
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
            {loading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <h4>Create category</h4>
            )}
            {categoryForm()}
            <hr />
            {categories.map((c) => (
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
            ))}
          </div>
        </div>
      </AdminRoute>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;
  const { appToken } = nookies.get(context);
  let isAdmin;
  try {
    const { email } = await admin.auth().verifyIdToken(appToken);

    const user = currentUser(email);
    const categoryList = list();

    const promises = [user, categoryList];

    const [userResult, categoryListResult] = await Promise.allSettled(promises);
    const { role } = userResult.value;

    if (role === 'admin') {
      isAdmin = true;
    } else {
      isAdmin = false;
    }

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('categoryList', list());

    return {
      props: {
        token: appToken,
        isAdmin: isAdmin,
        categoryList: JSON.stringify(categoryListResult.value),
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    console.log(
      'error CategoryCreate getServerSideProps: ',
      error.errorInfo.message
    );
    if (error) {
      return {
        notFound: true,
      };
    }
  }
}

export default CategoryCreate;

// return (
//   <div className="container-fluid">
//     <AdminRoute isAdmin={isAdmin}>
//       <div className="row">
//         <div className="col-md-2">
//           <AdminNav />
//         </div>
//         <div className="col">admin category page</div>
//       </div>
//     </AdminRoute>
//   </div>
// );
