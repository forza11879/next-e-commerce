import React, { useRef } from 'react';
const SingleProduct = ({ product }) => {
  const { slug } = product;
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

  return <div id="my-gallery" />;
};

export default SingleProduct;
