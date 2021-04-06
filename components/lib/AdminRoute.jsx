import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingToRedirect from './LoadingToRedirect';
import { fetchApi } from '@/store/saga/user';
import { selectUser } from '@/store/user';

async function isAdmin(token) {
  const options = {
    url: '/user/admin',
    method: 'post',
    token: token,
  };
  const { data } = await fetchApi(options);
  const { user } = data;
  return user;
}

const AdminRoute = ({ children, token }) => {
  const user = useSelector(selectUser);
  const [ok, setOk] = useState(false);
  // console.log('token AdminRoute: ', token);
  // console.log('user.token AdminRoute: ', user.token);

  useEffect(() => {
    // console.log('props AdminRoute: ', username);
    if (Boolean(user.email && user.token)) {
      isAdmin(user.token)
        .then((res) => {
          console.log('CURRENT ADMIN RES', res);
          setOk(true);
        })
        .catch((err) => {
          console.log('ADMIN ROUTE ERR', err);
          setOk(false);
        });
    } else {
      setOk(false);
    }
  }, [user]);

  return ok ? <>{children}</> : <LoadingToRedirect />;
};

// export async function getServerSideProps(context) {
//   const { req, res } = context;
//   console.log('getServerSideProps req: ', req);
//   // const { token } = req.headers;
//   // console.log('getServerSideProps token: ', token);
//   // const response = await getPosts();
//   // console.log('response', response);
//   // if (!response) {
//   //   return {
//   //     notFound: true,
//   //   };
//   // }

//   return {
//     props: { username: 'max' }, // will be passed to the page component as props. always return an object with the props key
//   };
// }

export default AdminRoute;
