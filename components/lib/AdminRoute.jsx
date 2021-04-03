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

const AdminRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const [ok, setOk] = useState(false);

  useEffect(() => {
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

export default AdminRoute;
