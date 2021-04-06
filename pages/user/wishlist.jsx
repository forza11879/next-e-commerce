import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/user';
import LoadingToRedirect from '@/components/lib/LoadingToRedirect';
import UserNav from '@/components/nav/UserNav';

const Wishlist = () => {
  const user = useSelector(selectUser);
  return Boolean(user.email && user.token) ? (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">user wishlist page</div>
      </div>
    </div>
  ) : (
    <LoadingToRedirect />
  );
};

export default Wishlist;
