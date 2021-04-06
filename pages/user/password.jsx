import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectUser } from '@/store/user';
import LoadingToRedirect from '@/components/lib/LoadingToRedirect';
import UserNav from '@/components/nav/UserNav';
import { auth } from '@/lib/firebase';

const Password = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useSelector(selectUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    auth.currentUser
      .updatePassword(password)
      .then(() => {
        setLoading(false);
        setPassword('');
        toast.success('Password updated');
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  const passwordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Your Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Enter new password"
          disabled={loading}
          value={password}
        />
        <button
          className="btn btn-primary"
          disabled={!password || password.length < 6 || loading}
        >
          Submit
        </button>
      </div>
    </form>
  );

  return Boolean(user.email && user.token) ? (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Password Update</h4>
          )}
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  ) : (
    <LoadingToRedirect />
  );
};

export default Password;
