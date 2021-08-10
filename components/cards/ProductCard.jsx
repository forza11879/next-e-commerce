import { useState } from 'react';
import { Card, Tooltip, Typography } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { getAddProduct } from '@/store/cart';
import { getSetVisibleDrawer } from '@/store/drawer';
import RatingStar from '@/components/starrating/RatingStar';
import _ from 'lodash';

const { Meta } = Card;

const laptop = '/images/laptop.png';

const ProductCard = ({ product }) => {
  const {
    images,
    title,
    description,
    price,
    slug,
    avgRating,
    nRatings,
    quantity,
  } = product;

  const [tooltip, setTooltip] = useState('Click to add');
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(getAddProduct(product, undefined, undefined));
    dispatch(getSetVisibleDrawer(true));
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
            <Typography.Link
              // onClick={quantity < 1 ? null : handleAddToCart}
              onClick={handleAddToCart}
              disabled={quantity < 1}
            >
              <ShoppingCartOutlined className="text-danger" /> <br />
              {quantity < 1 ? 'Out of stock' : 'Add to Cart'}
            </Typography.Link>
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
