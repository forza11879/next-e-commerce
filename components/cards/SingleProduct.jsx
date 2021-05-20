import React, { useRef, useEffect } from 'react';
import { Card } from 'antd';
import Link from 'next/link';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { SideBySideMagnifier, GlassMagnifier } from 'react-image-magnifiers';
// import Image from 'next/image';
// import { CloudinaryContext, Transformation, Image } from 'cloudinary-react';

// import ImageSingleProduct from '@/components/images/ImageSingleProduct';
// import ImageLargeSingleProduct from '@/components/images/ImageLargeSingleProduct';

const { Meta } = Card;

const SingleProduct = ({ product }) => {
  const { title, description, images, slug } = product;
  console.log('slug', slug);
  const cloudnaryGalleryRef = useRef(null);

  if (!cloudnaryGalleryRef.current) {
    if (typeof window !== 'undefined') {
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
  }

  // useEffect(() => {

  // }, []);

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
      </div>

      <div className="col-md-5">
        <Card
          actions={[
            <>
              <ShoppingCartOutlined className="text-success" /> <br />
              Add to Cart
            </>,
            <Link href="/">
              <>
                <HeartOutlined className="text-info" /> <br /> Add to Wishlist
              </>
            </Link>,
          ]}
        >
          <Meta title={title} description={description} />
          <p>
            price/category/subs/shipping/color/brand/quantity available/sold
          </p>
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
