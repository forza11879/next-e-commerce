import React, { useRef, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import Link from 'next/link';
import StarRating from 'react-star-ratings';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { SideBySideMagnifier, GlassMagnifier } from 'react-image-magnifiers';
// import Image from 'next/image';
// import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';

// import ImageSingleProduct from '@/components/images/ImageSingleProduct';
// import ImageLargeSingleProduct from '@/components/images/ImageLargeSingleProduct';
import ProductListItems from '@/components/cards/ProductListItems';
import RatingModal from '@/components/modal/RatingModal';

const { TabPane } = Tabs;

const SingleProduct = ({ product, isUser, token }) => {
  const { title, description, images, slug, _id } = product;

  console.log('slug', slug);
  const cloudnaryGalleryRef = useRef(null);

  useEffect(() => {
    if (!cloudnaryGalleryRef.current && typeof window !== 'undefined') {
      cloudnaryGalleryRef.current = window.cloudinary
        .galleryWidget({
          container: '#my-gallery',
          cloudName: 'dhvi46rif',
          carouselStyle: 'thumbnails', // default value: included for clarity
          thumbnailProps: {
            width: 75,
            height: 75,
            spacing: 4,
            navigationColor: 'green',
          },
          mediaAssets: [
            { tag: slug },
            // { tag: 'electric_car_product_gallery_demo', mediaType: 'video' },
            // { tag: 'electric_car_360_product_gallery_demo', mediaType: 'spin' },
          ],
        })
        .render();
    }
  }, []);

  // const renderCustomThumbs = (title, images) => {
  //   const thumbList = images.map((item) => (
  //     <picture key={item.public_id}>
  //       <source srcSet={`${item.url}`} type="image/webp" />
  //       <Image
  //         alt={title}
  //         src={item.url}
  //         // src={images && images.length ? images[0].public_id : laptop}
  //         // layout="fill"
  //         objectFit="cover"
  //         quality={100}
  //         width={70}
  //         height={70}
  //         priority
  //         ///////////////
  //         // className="p-1"
  //         // key={item.public_id}
  //       />
  //     </picture>
  //   ));

  //   return thumbList;
  // };

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
        <StarRating
          name={_id}
          numberOfStars={5}
          rating={2}
          changeRating={(newRating, name) =>
            console.log('newRating', newRating, 'name', name)
          }
          isSelectable={true}
          starRatedColor="red"
        />

        <Card
          actions={[
            <>
              <ShoppingCartOutlined className="text-success" /> <br />
              Add to Cart
            </>,
            <Link href="/">
              <a>
                <HeartOutlined className="text-info" /> <br /> Add to Wishlist
              </a>
            </Link>,
            <RatingModal isUser={isUser} token={token}>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={2}
                changeRating={(newRating, name) =>
                  console.log('newRating', newRating, 'name', name)
                }
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
