import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

// Photo Upload Mutations

export const useMutationPhotoUpload = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ url, method, token, data }) => {
      return await axios.request({
        baseURL,
        url,
        method,
        data,
        headers: { token },
      });
    },
    {
      // data
      onMutate: ({ data: { image } }) => {
        // console.log({ image });
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        // queryClient.cancelQueries('categoryList', { exact: true });
        // queryClient.cancelQueries('subCategoryList', { exact: true });
        // Snapshot the previous value
        // const previousQueryDataArray =
        //   queryClient.getQueryData('productsCount');
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // return will pass the function or the value to the onError third argument:
        // return () =>
        //   queryClient.setQueryData('subCategories', previousQueryDataArray);
      },
      // error, variablrs, rollback
      onError: (error, variables, rollback) => {
        //   If there is an errror, then we will rollback
        // console.log('CreateCategory onError error: ', error.response.data);
        // if (rollback) {
        //   rollback();
        //   console.log('rollback');
        // }
        // if (error) {
        //   toast.error(error.response.data);
        // }
      },
      // data from hhtp response, variables, context
      onSuccess: ({ data }, { props: { values, setValues } }, context) => {
        // Runs only there is a success
        // saves http trip to the back-end
        // const previousQueryDataArray =
        //   queryClient.getQueryData('productsCount');
        console.log({ data });

        // queryClient.setQueryData('productsCount', (oldQueryData) => {
        //   const oldQueryDataArray = JSON.parse(oldQueryData);
        //   console.log('oldQueryDataArray onSuccess: ', oldQueryDataArray);
        //   console.log('image onSuccess: ', data);
        //   console.log('index onSuccess: ', values.index);
        //   const idx = values.index;

        //   const newQueryDataArray = oldQueryDataArray.filter((item) => {
        //     return item.slug !== values.slug;
        //   });

        //   const [result] = oldQueryDataArray
        //     .filter((item) => {
        //       return item.slug === values.slug;
        //     })
        //     .map((item) => {
        //       item.images[idx] = data;
        //       return item;
        //     });

        //   newQueryDataArray.push(result);

        //   console.log('newQueryDataArray: ', newQueryDataArray);

        //   return JSON.stringify(newQueryDataArray);
        // });

        if (data) {
          console.log('onSuccess data from back-end: ', data);

          setValues((values) => {
            const allUploadedFiles = values.images;
            allUploadedFiles.push(data);
            return { ...values, images: allUploadedFiles };
          });
          toast.success(`picture is uploaded`);
        }
      },
      onSettled: (data, error, variables, context) => {
        if (error) {
          // console.log(
          //   'CreateCategory onSettled error: ',
          //   error.response.data.error
          // );
          toast.error(error.response.data.error);
        }
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        // queryClient.invalidateQueries('subCategoryList');
      },
    }
  );
};

export const useMutationPhotoRemove = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ url, method, token, data }) => {
      return await axios.request({
        baseURL,
        url,
        method,
        data,
        headers: { token },
      });
    },
    {
      onMutate: ({ data: { image } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        // queryClient.cancelQueries('categoryList', { exact: true });
        // queryClient.cancelQueries('subCategoryList', { exact: true });
        // // Snapshot the previous value
        // const previousQueryDataArray = queryClient.getQueryData('categoryList');
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // const newObject = {
        //   _id: Date.now(),
        //   name: name,
        // };
        // queryClient.setQueryData('subCategoryList', (oldQueryData) => {
        //   const oldQueryDataArray = JSON.parse(oldQueryData);
        //   // console.log('oldQueryDataArray onMutate: ', oldQueryDataArray);
        //   const newQueryDataArray = oldQueryDataArray.filter(
        //     (item) => item.name !== name
        //   );
        //   newQueryDataArray.unshift(newObject);
        //   // console.log(
        //   //   'newQueryDataArray onMutate after unshift: ',
        //   //   newQueryDataArray
        //   // );
        //   return JSON.stringify(newQueryDataArray);
        // });
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData('subCategories', previousQueryDataArray);
      },
      onError: (error, variables, rollback) => {
        //   If there is an errror, then we will rollback
        // console.log('CreateCategory onError error: ', error.response.data);
        if (rollback) {
          rollback();
          console.log('rollback');
        }
        if (error) {
          toast.error(error.response.data);
        }
      },
      onSuccess: (
        { data },
        { data: { public_id }, props: { setValues, values, id } },
        context
      ) => {
        queryClient.setQueryData('productsCount', (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          console.log('oldQueryDataArray onSuccess: ', oldQueryDataArray);

          const [result] = oldQueryDataArray
            .filter((item) => {
              return item.slug === values.slug;
            })
            .map((item) => {
              for (const [key, value] of Object.entries(item)) {
                if (key === 'images') {
                  const idx = value.findIndex((item) => item.public_id === id);
                  return idx;
                }
              }
            });
          setValues({ ...values, index: result });

          console.log('result: ', result);

          return JSON.stringify(oldQueryDataArray);
        });
        console.log('onSuccess data from back-end: ', data);
        const { images } = values;
        let filteredImages = images.filter((item) => {
          return item.public_id !== public_id;
        });
        setValues((values) => ({ ...values, images: filteredImages }));

        if (data) {
          // queryClient.setQueryData('subCategoryList', (oldQueryData) => {
          //   const oldQueryDataArray = JSON.parse(oldQueryData);
          //   // console.log(
          //   //   'oldQueryDataArray onSuccess before filter: ',
          //   //   oldQueryDataArray
          //   // );
          //   const newQueryDataArray = oldQueryDataArray.filter(
          //     (item) => item.name !== data.name
          //   );
          //   newQueryDataArray.unshift(data);
          //   // console.log(
          //   //   'newQueryDataArray onSuccess after filter and unshift: ',
          //   //   newQueryDataArray
          //   // );
          //   return JSON.stringify(newQueryDataArray);
          // });
          // toast.success(`"${data.name}" is created`);
        }
      },
      onSettled: (data, error, variables, context) => {
        if (error) {
          // console.log(
          //   'CreateCategory onSettled error: ',
          //   error.response.data.error
          // );
          toast.error(error.response.data.error);
        }
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        // queryClient.invalidateQueries('subCategoryList');
      },
    }
  );
};
