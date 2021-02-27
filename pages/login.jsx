import React, { useState, useEffect } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase.js';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getUserLoggedIn } from '../store/user.js';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/user.js';

const LoginPage = () => {
  const [email, setEmail] = useState('forza1879@gmail.com');
  const [password, setPassword] = useState('test78');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user && user.token) router.push(`/`);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.table(email, password);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      // console.log(result);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      dispatch(
        getUserLoggedIn({
          email: user.email,
          token: idTokenResult.token,
        })
      );
      router.push(`/`);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        dispatch(
          getUserLoggedIn({
            email: user.email,
            token: idTokenResult.token,
          })
        );
        router.push(`/`);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          autoFocus
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </div>

      <br />
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {loginForm()}

          <Button
            onClick={googleLogin}
            type="danger"
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>

          <Link href="/forgot/password" className="float-right text-danger">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
