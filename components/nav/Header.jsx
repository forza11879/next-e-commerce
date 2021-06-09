import { useState } from 'react';
import Link from 'next/link';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { selectUser, getUserLoggedOut } from '@/store/user';
import Search from '@/components/forms/Search';

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState('home');
  const router = useRouter();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  // console.log('user Select:', !!user.email);

  const handleClick = (e) => {
    // console.log(e.key);
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch(getUserLoggedOut());

    // router.push(`/login`);
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item key="home" icon={<AppstoreOutlined />}>
        <Link href="/">Home</Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link href="/shop">Shop</Link>
      </Item>

      {!Boolean(user.email && user.token) && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link href="/register">Register</Link>
        </Item>
      )}

      {!Boolean(user.email && user.token) && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link href="/login">Login</Link>
        </Item>
      )}

      {Boolean(user.email && user.token) && (
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
          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
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
