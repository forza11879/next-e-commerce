import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { auth, googleAuthProvider } from '@/lib/firebase';
import { getUserLoggedIn } from '@/store/user';
import { selectUser } from '@/store/user';

const LoginPage = () => {
  const [email, setEmail] = useState('forza11879@gmail.com');
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
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      // const { token } = await user.getIdTokenResult();

      // dispatch(
      //   getUserLoggedIn({
      //     token: token,
      //   })
      // );
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
      // .then(async ({ user }) => {
      //   const { token } = await user.getIdTokenResult();
      //   dispatch(
      //     getUserLoggedIn({
      //       token: token,
      //     })
      //   );
      //   router.push(`/`);
      // })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });

    router.push(`/`);
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
