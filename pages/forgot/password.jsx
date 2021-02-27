import React, { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase.js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import getConfig from 'next/config';
import { selectUser } from '../../store/user.js';
import { useRouter } from 'next/router';

const { publicRuntimeConfig } = getConfig();

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (user && user.token) router.push(`/`);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(
      'publicRuntimeConfig.forgotPasswordRedirect: ',
      publicRuntimeConfig.forgotPasswordRedirect
    );
    const config = {
      url: publicRuntimeConfig.forgotPasswordRedirect,
      handleCodeInApp: true,
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail('');
        setLoading(false);
        toast.success('Check your email for password reset link');
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
        console.log('ERROR MSG IN FORGOT PASSWORD', error);
      });
  };

  return (
    <div className="container col-md-6 offset-md-3 p-5">
      {loading ? (
        <h4 className="text-danger">Loading</h4>
      ) : (
        <h4>Forgot Password</h4>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type your email"
          autoFocus
        />
        <br />
        <button className="btn btn-raised" disabled={!email}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
