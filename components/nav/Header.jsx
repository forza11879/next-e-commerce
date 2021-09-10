import React, { useState } from 'react';
import Link from 'next/link';
import firebase from 'firebase';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Menu, Badge, Typography } from 'antd';
// import dynamic from 'next/dynamic';
// const { Badge } = dynamic(() => import('antd'), {
//   ssr: false,
// });
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { selectUser, getUserLoggedOut } from '@/store/user';
import { selectCart } from '@/store/cart';
import Search from '@/components/forms/Search';
import ColumnGroup from 'antd/lib/table/ColumnGroup';

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState('home');
  const [session, loading] = useSession();
  console.log({ session, loading });
  const router = useRouter();
  // console.log({ router });

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const cart = useSelector(selectCart);

  const MyBadge = React.forwardRef(({ onClick, href }, ref) => {
    return (
      <a href={href} onClick={onClick} ref={ref}>
        <Badge count={cart.length} offset={[9, 0]}>
          Cart
        </Badge>
      </a>
    );
  });

  const handleClick = (e) => {
    // console.log(e.key);
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch(getUserLoggedOut());
  };

  return (
    <Menu
      // defaultOpenKeys={['1']}
      onClick={handleClick}
      selectedKeys={[current]}
      mode="horizontal"
    >
      <Item key="home" icon={<AppstoreOutlined />}>
        <Link href="/">Home</Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link href="/shop">Shop</Link>
      </Item>

      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link href="/cart">
          {/* <MyBadge /> */}
          <a>
            {/* <span>
              <sup> */}
            <Badge
              count={cart.reduce((acc, currentValue) => {
                return (acc = acc + currentValue.count);
              }, 0)}
              offset={[9, 0]}
            >
              Cart
            </Badge>
            {/* </sup>
            </span> */}
          </a>

          {/* fix Badge TODO */}
        </Link>
      </Item>

      {/* {!Boolean(user.email && user.token) && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link href="/register">Register</Link>
        </Item>
      )} */}

      {!Boolean(loading) && !Boolean(session) && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link href="/register">Register</Link>
        </Item>
      )}

      {/* {!Boolean(user.email && user.token) && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link href="/login">Login</Link>
        </Item>
      )} */}
      {/* {!Boolean(user.email && user.token) && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link href="/login">Login</Link>
          <Link href="/api/auth/signin">
            <a
              onClick={(e) => {
                e.preventDefault();
                signIn('google');
              }}
            >
              Sign In
            </a>
          </Link>
        </Item>
      )} */}
      {!Boolean(loading) &&
        !Boolean(session) &&
        Boolean(router.pathname !== '/login') && (
          <Item key="login" icon={<UserOutlined />} className="float-right">
            <Link href="/login">Login</Link>
          </Item>
        )}

      {Boolean(session) && (
        <SubMenu
          icon={<SettingOutlined />}
          title={user.email && user.email.split('@')[0]}
          className="float-right"
        >
          {Boolean(user.token) && user.role === 'subscriber' && (
            <Item>
              <Link href="/user/history">Dashboard</Link>
            </Item>
          )}

          {Boolean(user.token) && user.role === 'admin' && (
            <Item>
              <Link href="/admin/dashboard">Dashboard</Link>
            </Item>
          )}
          {/* <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item> */}
          <Item icon={<LogoutOutlined />}>
            <Link href="/api/auth/signout">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                  logout();
                }}
              >
                Sign Out
              </a>
            </Link>
          </Item>
        </SubMenu>
      )}
      <span className="float-right p-1">
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
