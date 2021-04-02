import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/user';
import LoadingToRedirect from '@/components/lib/LoadingToRedirect';

const History = () => {
  const user = useSelector(selectUser);

  return user.email && user.token ? (
    <div className="container-fluid">
      <div className="row">
        <div className="col">user history page</div>
      </div>
    </div>
  ) : (
    <LoadingToRedirect />
  );
};

export default History;
