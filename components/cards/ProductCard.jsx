import { Card } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import RatingStar from '@/components/starrating/RatingStar';

const { Meta } = Card;

const laptop = '/images/laptop.png';

const ProductCard = ({ product }) => {
  const { images, title, description, price, slug, avgRating, nRatings } =
    product;
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
          <>
            <ShoppingCartOutlined className="text-danger" /> <br /> Add to Cart
          </>,
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
