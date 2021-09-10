import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { auth, googleAuthProvider } from '@/lib/firebase';
import { selectUser } from '@/store/user';
import { fetchApi } from '@/store/saga/user';

// const roleBasedRedirect = (user, router) => {
//   console.log('router login: ', router);
//   console.log('user roleBasedRedirect: ', user);
//   if (user.role === 'admin') {
//     router.push(`/admin/dashboard`);
//   } else {
//     router.push('/user/history');
//   }
// };

const roleBasedRedirect = (user, router, intented) => {
  if (intented) {
    router.push(intented);
  } else {
    if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/user/history');
    }
  }
};

function redirect(token, router, intented) {
  const options = {
    url: '/user',
    method: 'get',
    token: token,
  };
  fetchApi(options).then(({ data: { user } }) => {
    roleBasedRedirect(user, router, intented);
  });
}

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('forza11879@gmail.com');
  const [password, setPassword] = useState('test78');
  const [loading, setLoading] = useState(false);
  const [session, loadingNextAuth] = useSession();
  console.log({ session, loadingNextAuth });
  console.log('session boolean', Boolean(session));
  // console.log({ loadingNextAuth });

  const intented = router.query.from;
  console.log({ intented });

  useEffect(() => {
    // if (intented) {
    //   router.push(intented);
    // }
    if (session && !intented) {
      console.log('!intented: ', !intented);
      router.push('/');
    } else {
      console.log('page');
    }

    console.log('page2');
    // const session2 = await getSession();
    // console.log({ session2 });
  }, [session]);

  const userResult = useSelector(selectUser);

  // console.log({ intented });

  // useEffect(() => {
  //   if (userResult && userResult.token) router.push(`/`);
  // }, [userResult]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      const { token } = await user.getIdTokenResult();
      redirect(token, router, intented);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const { user } = await auth.signInWithPopup(googleAuthProvider);
      const { token } = await user.getIdTokenResult();
      redirect(token, router, intented);
    } catch (error) {
      console.log('googleLogin error: ', error);
      toast.error(error.message);
    }
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
          {loadingNextAuth ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {loginForm()}

          {/* <Button
          // onClick={googleLogin}
          type="danger"
          className="mb-3"
          block
          shape="round"
          icon={<GoogleOutlined />}
          size="large"
        > */}
          {/* {!session && ( */}
          <Link href="/api/auth/signin">
            <Button
              onClick={(e) => {
                e.preventDefault();
                signIn('google', {
                  callbackUrl: `${process.env.host}${
                    !intented ? '' : intented
                  }`,
                });
              }}
              // onClick={googleLogin}
              type="danger"
              className="mb-3"
              block
              shape="round"
              icon={<GoogleOutlined />}
              size="large"
            >
              {/* Sign In */}
              Login with Google
            </Button>
          </Link>
          {/* )} */}

          {/* Login with Google
        </Button> */}

          <Link href="/forgot/password" className="float-right text-danger">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
