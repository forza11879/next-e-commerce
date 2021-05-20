import Image from 'next/image';

const ImageLargeSingleProduct = ({ item, title }) => {
  const { public_id, url } = item;

  return (
    <>
      <Image
        alt={title}
        src={url}
        // src={images && images.length ? images[0].public_id : laptop}
        // layout="fill"
        objectFit="cover"
        quality={100}
        width={520}
        height={520}
        priority
        ///////////////
        //   className="p-1"
        key={public_id}
      />
    </>
  );
};

export default ImageLargeSingleProduct;
