import React, { useRef } from 'react';
const SingleProduct = ({ product }) => {
  const { slug } = product;
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
          mediaAssets: [{ tag: slug }],
        })
        .render();
    }
    console.log({ slug });
  }, [slug]);

  return <div id="my-gallery" />;
};

export default SingleProduct;
