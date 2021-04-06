import React from 'react';
import AdminRoute from '@/components/lib/AdminRoute';
import AdminNav from '@/components/nav/AdminNav';

const AdminDashboard = () => {
  return (
    <AdminRoute>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col">admin dashbaord page</div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;
