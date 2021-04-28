import React from 'react';
import Resizer from 'react-image-file-resizer';

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
      setLoading(true);
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

              // console.log('IMAGE UPLOAD RES DATA', data);
              // setLoading(false);
              // allUploadedFiles.push(data);

              // setValues({ ...values, images: allUploadedFiles });
            } catch (error) {
              // setLoading(false);
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
  );
};

export default FileUpload;
