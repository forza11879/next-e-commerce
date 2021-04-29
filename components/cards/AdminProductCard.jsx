import React from 'react';
import Image from 'next/image';
import { Card } from 'antd';

const { Meta } = Card;

const AdminProductCard = ({ product }) => {
  // destructure
  const { title, description, images } = product;

  return (
    <Card
      style={{ height: '200px' }}
      cover={
        <Image
          alt={title}
          //   src={images && images.length ? images[0].url : ''}
          src={images && images.length ? images[0].public_id : ''}
          layout="fill"
          objectFit="cover"
          quality={100}
          //   width={2000}
          //   height={250}
          priority
          ///////////////
          //   //   style={{ objectFit: 'cover' }}
          //   style={{ height: '150px', objectFit: 'cover' }}
          className="m-2"
        />
        // https://stackoverflow.com/questions/64735163/next-js-image-component-doesnt-show-cloudinary-image
        // <img
        //   src={images && images.length ? images[0].url : ''}
        //   style={{ height: '250px', objectFit: 'cover' }}
        //   className="m-2"
        // />
      }
    >
      <Meta title={title} description={description} />
    </Card>
  );
};

export default AdminProductCard;
