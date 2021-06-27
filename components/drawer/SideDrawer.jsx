import React from 'react';
import { Drawer, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { selectCart } from '@/store/cart';
import { selectDrawer, getSetVisibleDrawer } from '@/store/drawer';

const laptop = '/images/laptop.png';

const SideDrawer = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const drawer = useSelector(selectDrawer);

  const imageStyle = {
    width: '100%',
    height: '50px',
    objectFit: 'cover',
  };

  return (
    <Drawer
      className="text-center"
      title={`Cart / ${cart.length} Product`}
      placement="right"
      closable={true}
      onClose={() => {
        dispatch(getSetVisibleDrawer(false));
      }}
      visible={drawer}
    >
      {cart.map((item) => (
        <div key={item._id} className="row">
          <div className="col">
            {item.images[0] ? (
              <>
                <img src={item.images[0].url} style={imageStyle} />
                <p className="text-center bg-secondary text-light">
                  {item.title} x {item.count}
                </p>
              </>
            ) : (
              <>
                <img src={laptop} style={imageStyle} />
                <p className="text-center bg-secondary text-light">
                  {item.title} x {item.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}

      <Link href="/cart">
        <button
          onClick={() => dispatch(getSetVisibleDrawer(false))}
          className="text-center btn btn-primary btn-raised btn-block"
        >
          Go To Cart
        </button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
