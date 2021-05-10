import React from 'react';
import Image from 'next/image';
import { Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Meta } = Card;

const laptop = '/images/laptop.png';
const AdminProductCard = ({ product, handleRemove }) => {
  // destructure
  const { title, description, images, slug } = product;

  return (
    <Card
      style={{ height: '250px' }}
      cover={
        <Image
          alt={title}
          src={images && images.length ? images[0].url : laptop}
          //   src={images && images.length ? images[0].public_id : ''}
          // layout="fill"
          objectFit="cover"
          quality={100}
          width={720}
          height={720}
          priority
          ///////////////
          className="p-1"
        />
        // https://stackoverflow.com/questions/64735163/next-js-image-component-doesnt-show-cloudinary-image
        // <img
        //   src={images && images.length ? images[0].url : laptop}
        //   style={{ height: '250px', objectFit: 'cover' }}
        //   className="p-1"
        // />
      }
      actions={[
        <EditOutlined className="text-warning" />,
        <DeleteOutlined
          onClick={() => handleRemove(slug)}
          className="text-danger"
        />,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 40)}...`}
      />
    </Card>
  );
};

export default AdminProductCard;
