import React from 'react';
import Resizer from 'react-image-file-resizer';
import { Avatar } from 'antd';

const FileUpload = ({
  values,
  setValues,
  setLoading,
  token,
  mutationPhotoUpload,
}) => {
  const fileUploadAndResize = (e) => {
    // console.log(e.target.files);
    // resize
    let files = e.target.files; // 3
    let allUploadedFiles = values.images;

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
            // console.log(uri);
            const options = {
              url: '/uploadimages',
              method: 'post',
              token: token,
              data: {
                image: uri,
              },
              props: {
                setValues,
                values,
                allUploadedFiles,
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
    // send back to server to upload to cloudinary
    // set url to images[] in the parent component state - ProductCreate
  };

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Avatar
              key={image.public_id}
              src={image.url}
              size={100}
              className="m-3"
            />
          ))}
      </div>
      <div className="row">
        <label className="btn btn-primary">
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
