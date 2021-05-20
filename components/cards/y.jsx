import React, { useRef } from 'react';

const SingleProduct = ({ product }) => {
  const { slug } = product;
  const cloudnaryGalleryRef = useRef(null);

  if (!cloudnaryGalleryRef.current) {
    cloudnaryGalleryRef.current = window.cloudinary
      .galleryWidget({
        container: '#my-gallery',
        cloudName: 'cloudName',
        carouselStyle: 'thumbnails',
        thumbnailProps: {
          width: 75,
          height: 75,
          spacing: 4,
          navigationColor: 'green',
        },
        mediaAssets: [{ tag: slug }],
      })
      .render();
  }

  return <div id="my-gallery" className="gallery"></div>;
};

export default SingleProduct;
