import { useState } from 'react';
import Link from 'next/link';
import { Menu, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState('home');

  const cart = [1, 2, 3];

  const handleClick = (e) => {
    // console.log(e.key);
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link href="/cart">
          <a>
            <Badge count={cart.length} offset={[9, 0]}>
              Cart
            </Badge>
          </a>
        </Link>
      </Item>
    </Menu>
  );
};

export default Header;

<Item key="cart" icon={<ShoppingCartOutlined />}>
  <Link href="/cart" passHref>
    <MyBadge />
  </Link>
</Item>;
