import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingToRedirect from './LoadingToRedirect';
import { selectUser } from '@/store/user';

const AdminRoute = ({ children, isAdmin }) => {
  const user = useSelector(selectUser);
  const [ok, setOk] = useState(false);
  // console.log('isAdmin AdminRoute: ', isAdmin);

  useEffect(() => {
    if (Boolean(user.token) && isAdmin) {
      setOk(true);
    } else {
      setOk(false);
    }
  }, [user, isAdmin]);

  return ok ? <>{children}</> : <LoadingToRedirect />;
};

export default AdminRoute;
