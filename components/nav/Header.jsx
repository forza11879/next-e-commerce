import React, { useState } from 'react';
import Link from 'next/link';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { selectUser, getUserLoggedOut } from '@/store/user';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

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
          <Item key="setting:1">Option 1</Item>
          <Item key="setting:2">Option 2</Item>
          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}
    </Menu>
  );
};

export default Header;
