import React, { useRef, useEffect, useState } from 'react';
import _ from 'lodash';
import { Card, Tabs, Tooltip } from 'antd';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const StarRating = dynamic(() => import('react-star-ratings'), {
  ssr: false,
});
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { getAddProduct } from '@/store/cart';
import ProductListItems from '@/components/cards/ProductListItems';
import RatingModal from '@/components/modal/RatingModal';
import RatingStar from '@/components/starrating/RatingStar';

const { TabPane } = Tabs;

const SingleProduct = ({ product, isUser, token, onStarClick }) => {
  const { title, description, images, slug, _id, star, avgRating, nRatings } =
    product;

  const [tooltip, setTooltip] = useState('Click to add');
  const dispatch = useDispatch();

  const cloudnaryGalleryRef = useRef(null);

  const myGallery = window.cloudinary.galleryWidget({
    container: '#my-gallery',
    cloudName: 'dhvi46rif',
    carouselStyle: 'thumbnails', // default value: included for clarity
    thumbnailProps: {
      width: 75,
      height: 75,
      spacing: 4,
      navigationColor: 'green',
    },
    mediaAssets: [{ tag: slug }],
  });

  useEffect(() => {
    if (!cloudnaryGalleryRef.current && typeof window !== 'undefined') {
      cloudnaryGalleryRef.current = myGallery.render();
    }
    return () => {
      cloudnaryGalleryRef.current = myGallery.destroy(); // Important To avoid memory leaks and performance issues, make sure to use the destroy method before removing the Product Gallery widget container element from your DOM.
    };
  }, [slug]);

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== 'undefined') {
      // if cart is in local storage GET it
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // (Array): Returns the new duplicate free array.
      let unique = _.uniqWith(cart, _.isEqual);
      // save to local storage
      // console.log('unique', unique)
      localStorage.setItem('cart', JSON.stringify(unique));
      setTooltip('Added');
      dispatch(getAddProduct(unique));
    }
  };

  return (
    <>
      <div className="col-md-7">
        {/* <div id="my-gallery" className="gallery"></div> */}
        <div id="my-gallery"></div>
        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call use on xxxx xxx xxx to learn more about this product.
          </TabPane>
        </Tabs>
      </div>
      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>
        {product && avgRating && nRatings > 0 ? (
          <RatingStar product={product} />
        ) : (
          <div className="text-center pt-1 pb-3">No rating yet</div>
        )}

        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-success" /> <br />
                Add to Cart
              </a>
            </Tooltip>,
            <Link href="/">
              <a>
                <HeartOutlined className="text-info" /> <br /> Add to Wishlist
              </a>
            </Link>,
            <RatingModal isUser={isUser} token={token}>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
