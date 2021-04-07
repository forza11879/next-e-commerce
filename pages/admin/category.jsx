import React, { useState, useEffect } from 'react';
import nookies from 'nookies';
import { toast } from 'react-toastify';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import { fetchApiData } from '@/store/saga/user';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';
import { list } from '@/Models/Category/index';

const CategoryCreate = ({ token, isAdmin, data }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(JSON.parse(data));
    // console.log('data: ', JSON.parse(data));
    console.log('token: ', token);
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);

    const options = {
      url: 'category',
      method: 'post',
      token: token,
    };

    try {
      const { data } = await fetchApiData({ name }, options);
      // console.log('data.category.name: ', data.category.name);
      setLoading(false);
      setName('');
      toast.success(`"${data.category.name}" is created`);
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response.status === 400) toast.error(error.response.data);
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
            {JSON.stringify(categories)}
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
    const user = await currentUser(email);
    // console.log('user getServerSideProps: ', user);
    // console.log(typeof user.role);
    // console.log('user.role getServerSideProps: ', user.role);

    if (user.role === 'admin') {
      isAdmin = true;
    } else {
      isAdmin = false;
    }
    // console.log('isAdmin getServerSideProps: ', isAdmin);
    const categoryList = await list();
    // console.log('categoryList: ', categoryList);
    return {
      props: {
        token: appToken,
        isAdmin: isAdmin,
        data: JSON.stringify(categoryList),
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
