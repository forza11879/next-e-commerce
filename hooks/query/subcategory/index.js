import { useCallback } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

async function fetchSubCategories() {
  console.log(`${baseURL}/subcategory/all`);
  const { data } = await axios.request({
    baseURL,
    url: '/subcategory/all',
    method: 'get',
  });

  return JSON.stringify(data);
}

async function fetchSubCategory(slug) {
  const { data } = await axios.request({
    baseURL: baseURL,
    url: `/subcategory/${slug}`,
    method: 'get',
  });
  return JSON.stringify(data);
}

const queryKeys = {
  subCategories: ['subCategories'],
  subCategory: (id) => [...queryKeys.subCategories, id],
};

// Queries
export const useQuerySubCategories = () =>
  useQuery(queryKeys.subCategories, fetchSubCategories, {
    select: useCallback((data) => {
      return JSON.parse(data);
    }, []),
  });

export const useQuerySubCategory = (id, slug) =>
  useQuery(queryKeys.subCategory(id), () => fetchSubCategory(slug), {
    select: useCallback((data) => {
      return JSON.parse(data);
    }, []),
  });

// Mutations
export const useMutationCreateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ url, method, token, data }) => {
      return await axios.request({
        baseURL,
        url,
        method,
        data,
        // data: { name: enteredName, parent: category },
        headers: { token },
      });
    },
    {
      onMutate: ({ data: { name } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries('categories', { exact: true });
        queryClient.cancelQueries(queryKeys.subCategories, { exact: true });
        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('categories');
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          _id: Date.now(),
          name: name,
        };
        queryClient.setQueryData(queryKeys.subCategories, (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          // console.log('oldQueryDataArray onMutate: ', oldQueryDataArray);
          const newQueryDataArray = oldQueryDataArray.filter(
            (item) => item.name !== name
          );
          newQueryDataArray.unshift(newObject);
          // console.log(
          //   'newQueryDataArray onMutate after unshift: ',
          //   newQueryDataArray
          // );
          return JSON.stringify(newQueryDataArray);
        });
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            queryKeys.subCategories,
            previousQueryDataArray
          );
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
      onSuccess: ({ data }, variables, context) => {
        // Runs only there is a success
        // saves http trip to the back-end
        if (data) {
          queryClient.setQueryData(queryKeys.subCategories, (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            // console.log(
            //   'oldQueryDataArray onSuccess before filter: ',
            //   oldQueryDataArray
            // );
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.name !== data.name
            );
            newQueryDataArray.unshift(data);
            // console.log(
            //   'newQueryDataArray onSuccess after filter and unshift: ',
            //   newQueryDataArray
            // );
            return JSON.stringify(newQueryDataArray);
          });
          toast.success(`"${data.name}" is created`);
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
        queryClient.invalidateQueries(queryKeys.subCategories);
      },
    }
  );
};

export const useMutationRemoveSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ url, token, data }) => {
      return await axios.delete(url, {
        headers: {
          token,
        },
        data,
      });
    },
    {
      onMutate: ({ data: { slug } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries('categories', { exact: true });
        queryClient.cancelQueries(queryKeys.subCategories, { exact: true });

        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData(
          queryKeys.subCategories
        );
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // queryClient.setQueryData(queryKeys.subCategories, (oldQueryData) => {
        //   const oldQueryDataArray = JSON.parse(oldQueryData);
        //   const newQueryDataArray = oldQueryDataArray.filter(
        //     (item) => item.slug !== slug
        //   );
        //   return JSON.stringify(newQueryDataArray);
        // });
        // if thre is a error return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            queryKeys.subCategories,
            previousQueryDataArray
          );
      },
      onError: (error, variables, rollback) => {
        // Runs on error
        // toast.error(error.response.data.message);
        // console.log('onError error: ', error.response.data.message);
        if (rollback) {
          rollback();
          console.log('delete rollback');
        }
      },
      onSuccess: ({ data }, variables, context) => {
        // Runs only there is a success
        // if (data) {
        //   queryClient.setQueryData(queryKeys.subCategories, (oldQueryData) => {
        //     const oldQueryDataArray = JSON.parse(oldQueryData);
        //     const newQueryDataArray = oldQueryDataArray.filter(
        //       (item) => item.slug !== data.deleted.slug
        //     );
        //     return JSON.stringify(newQueryDataArray);
        //   });
        //   toast.error(`${data.deleted.name} deleted`);
        // }
      },
      onSettled: ({ data }, variables, context) => {
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        if (data) {
          queryClient.setQueryData('categories', (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.slug !== data.deleted.slug
            );
            return JSON.stringify(newQueryDataArray);
          });
          toast.error(`${data.deleted.name} deleted`);
        }
        queryClient.invalidateQueries(queryKeys.subCategories);
        queryClient.invalidateQueries('categories');
      },
    }
  );
};

export const useMutationUpdateSubCategory = () => {
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
      onMutate: ({ name, slug }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries('categories', { exact: true });
        queryClient.cancelQueries(queryKeys.subCategories, { exact: true });

        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData(
          queryKeys.subCategories
        );
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          _id: Date.now(),
          name: name,
        };
        queryClient.setQueryData(queryKeys.subCategories, (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          const newQueryDataArray = oldQueryDataArray.filter(
            (item) => item.slug !== slug
          );
          newQueryDataArray.unshift(newObject);

          return JSON.stringify(newQueryDataArray);
        });
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            queryKeys.subCategories,
            previousQueryDataArray
          );
      },
      onError: (error, variables, rollback) => {
        //   If there is an errror, then we will rollback
        if (rollback) {
          rollback();
          console.log('rollback');
        }

        if (error) {
          toast.error(error.response.data.error);
          toast.error(error.response.data);
        }
      },
      onSuccess: ({ data }, { slug }, context) => {
        // Runs only there is a success
        // saves http trip to the back-end
        if (data) {
          queryClient.setQueryData(queryKeys.subCategories, (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.slug !== slug
            );
            newQueryDataArray.unshift(data);
            return JSON.stringify(newQueryDataArray);
          });
          toast.success(`"${data.name}" is updated`);
        }
      },
      onSettled: ({ data }, error, variables, context) => {
        if (error) {
          toast.error(error.response.data.error);
        }
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        queryClient.invalidateQueries('categories');
        queryClient.invalidateQueries(queryKeys.subCategories);
      },
    }
  );
};
