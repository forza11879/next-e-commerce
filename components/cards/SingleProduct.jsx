import React, { useRef, useEffect, useState } from 'react';
import _ from 'lodash';
import { Card, Tabs, Tooltip, Typography } from 'antd';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const StarRating = dynamic(() => import('react-star-ratings'), {
  ssr: false,
});
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { getAddProduct } from '@/store/cart';
import { getSetVisibleDrawer } from '@/store/drawer';
import ProductListItems from '@/components/cards/ProductListItems';
import RatingModal from '@/components/modal/RatingModal';
import RatingStar from '@/components/starrating/RatingStar';
import { useMutationAddToWishList } from '@/hooks/query/user';

const { TabPane } = Tabs;

const SingleProduct = ({ product, isUser, onStarClick }) => {
  const {
    title,
    description,
    images,
    slug,
    _id,
    star,
    avgRating,
    nRatings,
    quantity,
  } = product;
  const [loaded, setLoaded] = useState(false);
  const [tooltip, setTooltip] = useState('Click to add');
  const dispatch = useDispatch();

  const addToWishListUseMutation = useMutationAddToWishList();

  const cloudnaryGalleryRef = useRef(null);

  useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://product-gallery.cloudinary.com/all.js';
    scriptTag.addEventListener('load', () => setLoaded(true));
    document.body.appendChild(scriptTag);
  }, []);

  useEffect(() => {
    if (!loaded) return;
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
    if (!cloudnaryGalleryRef.current && typeof window !== 'undefined') {
      cloudnaryGalleryRef.current = myGallery.render();
    }
    return () => {
      cloudnaryGalleryRef.current = myGallery.destroy(); // Important To avoid memory leaks and performance issues, make sure to use the destroy method before removing the Product Gallery widget container element from your DOM.
    };
  }, [loaded, slug]);

  const handleAddToCart = () => {
    dispatch(getAddProduct(product, undefined, undefined));
    dispatch(getSetVisibleDrawer(true));
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    const options = {
      url: '/user/wishlist',
      method: 'post',
      // token,
      data: { productId: _id },
    };
    addToWishListUseMutation.mutate(options);
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
              <Typography.Link
                onClick={handleAddToCart}
                disabled={quantity < 1}
              >
                <ShoppingCartOutlined className="text-success" /> <br />
                {quantity < 1 ? 'Out of stock' : 'Add to Cart'}
              </Typography.Link>
            </Tooltip>,
            <a onClick={handleAddToWishlist}>
              <HeartOutlined className="text-info" /> <br /> Add to Wishlist
            </a>,
            <RatingModal isUser={isUser}>
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
