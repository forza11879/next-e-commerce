import React from 'react';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';
import nookies from 'nookies';
import admin from '@/firebase/index';
import { currentUser } from '@/Models/User/index';

const AdminDashboard = ({ isAdmin }) => {
  return (
    <div className="container-fluid">
      <AdminRoute isAdmin={isAdmin}>
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col">admin dashbaord page</div>
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
    return {
      props: { isAdmin: isAdmin }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    console.log('error FIREBASsE: ', error.errorInfo.message);
    if (error) {
      return {
        notFound: true,
      };
    }
  }
}

export default AdminDashboard;
