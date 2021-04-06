import React from 'react';
// import nookies, { parseCookies, setCookie, destroyCookie } from 'nookies';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';

const AdminCategory = ({ token }) => {
  // console.log('token AdminCategory: ', token);
  return (
    <AdminRoute token={token}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col">admin category page</div>
        </div>
      </div>
    </AdminRoute>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  // const { appToken } = nookies.get(context);
  // console.log('cookies nookies appToken: ', appToken);
  // console.log('getServerSideProps req.headers: ', req);
  // const { token } = req.token;
  console.log('getServerSideProps token: ', req.token);
  // const { token } = req.headers;
  // console.log('getServerSideProps token: ', token);
  // const response = await getPosts();
  // console.log('response', response);
  // if (!response) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return {
    props: { token: 'sfd' }, // will be passed to the page component as props. always return an object with the props key
  };
}

export default AdminCategory;
