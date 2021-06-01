import Resizer from 'react-image-file-resizer';
import { Avatar, Badge } from 'antd';

const FileUpload = ({
  values,
  setValues,
  token,
  mutationPhotoUpload,
  mutationPhotoRemove,
}) => {
  const fileUploadAndResize = (e) => {
    // console.log(e.target.files);
    // resize
    let files = e.target.files; // 3

    if (files) {
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          'JPEG',
          100,
          0,
          (uri) => {
            console.log({ uri });
            const options = {
              url: '/uploadimages',
              method: 'post',
              token: token,
              data: {
                image: uri,
              },
              props: {
                values,
                setValues,
              },
            };
            try {
              mutationPhotoUpload.mutate(options);
            } catch (error) {
              console.log('CLOUDINARY UPLOAD ERR', error);
            }
          },
          'base64'
        );
      }
    }
  };

  const handleImageRemove = (public_id) => {
    const options = {
      url: '/removeimage',
      method: 'post',
      token: token,
      data: {
        public_id,
      },
      props: {
        setValues,
        values,
        id: public_id,
      },
    };
    try {
      mutationPhotoRemove.mutate(options);
    } catch (error) {
      console.log('CLOUDINARY UPLOAD ERR', error);
    }

    const { images } = values;
    let filteredImages = images.filter((item) => {
      return item.public_id !== public_id;
    });
    setValues({ ...values, images: filteredImages });
  };

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Badge
              count="X"
              key={image.public_id}
              onClick={() => handleImageRemove(image.public_id)}
              style={{ cursor: 'pointer' }}
            >
              <Avatar
                src={image.url}
                size={100}
                shape="square"
                className="ml-3"
              />
            </Badge>
          ))}
      </div>
      <br />
      <div className="row">
        <label className="btn btn-primary btn-raised mt-3">
          Choose File
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
