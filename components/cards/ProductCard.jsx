import { useState } from 'react';
import { Card, Tooltip } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { getAddProduct } from '@/store/cart';
import RatingStar from '@/components/starrating/RatingStar';
import _ from 'lodash';

const { Meta } = Card;

const laptop = '/images/laptop.png';

const ProductCard = ({ product }) => {
  const { images, title, description, price, slug, avgRating, nRatings } =
    product;

  const [tooltip, setTooltip] = useState('Click to add');
  const dispatch = useDispatch();

  // const handleAddToCart = () => {
  //   // create cart array
  //   let cart = [];
  //   if (typeof window !== 'undefined') {
  //     // if cart is in local storage GET it
  //     if (localStorage.getItem('cart')) {
  //       cart = JSON.parse(localStorage.getItem('cart'));
  //     }
  //     // push new product to cart
  //     cart.push({
  //       ...product,
  //       count: 1,
  //     });
  //     // (Array): Returns the new duplicate free array.
  //     let unique = _.uniqWith(cart, _.isEqual);
  //     // save to local storage
  //     // console.log('unique', unique)
  //     localStorage.setItem('cart', JSON.stringify(unique));
  //     setTooltip('Added');
  //     dispatch(getAddProduct(unique));
  //   }
  // };

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== 'undefined') {
      // if cart is in local storage GET it
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      console.log({ cart });
      console.log({ product });
      // push new product to cart
      const duplicate = cart.find(
        (item) => item._id === product._id
        // && item.color === product.color
      );

      if (!duplicate) {
        cart.push({
          ...product,
          count: 1,
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        setTooltip('Added');
        dispatch(getAddProduct(cart));
      } else {
        const newCart = cart.map((item) =>
          item._id === product._id ? { ...item, count: item.count + 1 } : item
        );

        console.log({ newCart });
        setTooltip('Duplicate');
        localStorage.setItem('cart', JSON.stringify(newCart));
        dispatch(getAddProduct(newCart));
      }
    }
  };
  return (
    <>
      {product && avgRating && nRatings > 0 ? (
        <RatingStar product={product} />
      ) : (
        <div className="text-center pt-1 pb-3">No rating yet</div>
      )}
      <Card
        cover={
          <Image
            alt={title}
            src={images && images.length ? images[0].url : laptop}
            // src={images && images.length ? images[0].public_id : laptop}
            // layout="fill"
            objectFit="cover"
            quality={100}
            width={720}
            height={720}
            priority
            ///////////////
            className="p-1"
          />
        }
        actions={[
          <Link href={`/product/${slug}`}>
            <a>
              <EyeOutlined className="text-warning" /> <br /> View Product
            </a>
          </Link>,
          <Tooltip title={tooltip}>
            <a onClick={handleAddToCart}>
              <ShoppingCartOutlined className="text-danger" /> <br /> Add to
              Cart
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - $${price}`}
          description={`${description && description.substring(0, 40)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
