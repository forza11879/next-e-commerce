const FullProduct = () => {
  const cloudnaryGalleryRef = useRef(null);

  useEffect(() => {
    if (!cloudnaryGalleryRef.current) {
      cloudnaryGalleryRef.current = cloudinary.galleryWidget({
        container: '#my-gallery',
        cloudName: 'dhvi46rif',
        mediaAssets: [
          { tag: 'electric_car_product_gallery_demo' },
          { tag: 'electric_car_product_gallery_demo', mediaType: 'video' },
          { tag: 'electric_car_360_product_gallery_demo', mediaType: 'spin' },
        ],
      });
    }
  }, []);

  return <div id="my-gallery" />;
};
