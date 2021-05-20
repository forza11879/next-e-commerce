import { useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

export const useQueryHookArg = (queryKey, queryFn, arg) =>
  useQuery(queryKey, () => queryFn(arg), {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      // console.log(JSON.parse(data));
      return JSON.parse(data);
    }, []),
    // staleTime: Infinity,
  });

export const useQueryHook = (queryKey, queryFn) =>
  useQuery(queryKey, queryFn, {
    // memoizes with useCallback
    select: useCallback((data) => {
      return JSON.parse(data);
    }, []),
    // staleTime: Infinity,
  });

export function useQueryFn(queryKey, queryFn) {
  return useQuery(queryKey, queryFn, {
    // initialData: JSON.parse(categoryList),
    // initialData: () => QueryCache.getQueryData('posts')?.find(post => post.id === postId) //(seeding Initial Query Data from other queries) pooling data aproach vs pushing data(using query data to seed future queries)
    // initialStale: true, // as soon as the initial data is mounted it will fetch up to date data
    // staleTime: 1000, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    // refetchOnWindowFocus: false,
    // cacheTime: 5000, //stays for 5000ms in chache(memory - Inactive state) then gets garbage collected
    // retry: 2, // number of times it will try to re-fetch the data if it fails
    // retryDelay: 1000, // number of 1000ms it will wait between retries
    // enabled: data?.id, //should be used when one query depence on the other one to fetch the data (dependent queries)
    // refetchInterval: 5000, // refetch interval
    // refetchIntervalInBackground: true // refetch interval even if you are not focused on the tab
    // callbacks - (query Side-Effects)
    // onSuccess: (data) => {
    //   // increment()
    // },
    // onError: (error) => {},
    // onSettled: (data, error) => {},
  });
}

// Category Mutations
export const useMutationCreateCategory = (queryClient) => {
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
      onMutate: ({ data: { name } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries('categoryList', { exact: true });

        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('categoryList');
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          _id: Date.now(),
          name: name,
        };
        queryClient.setQueryData('categoryList', (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          const newQueryDataArray = oldQueryDataArray.filter(
            (item) => item.name !== name
          );
          newQueryDataArray.unshift(newObject);
          return JSON.stringify(newQueryDataArray);
        });
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData('categoryList', previousQueryDataArray);
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
          queryClient.setQueryData('categoryList', (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.name !== data.name
            );
            newQueryDataArray.unshift(data);
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
        queryClient.invalidateQueries('categoryList');
      },
    }
  );
};

export const useMutationRemoveCategory = (queryClient) => {
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
        queryClient.cancelQueries('categoryList', { exact: true });
        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('categoryList');
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // queryClient.setQueryData('categoryList', (oldQueryData) => {
        //   const oldQueryDataArray = JSON.parse(oldQueryData);
        //   const newQueryDataArray = oldQueryDataArray.filter(
        //     (item) => item.slug !== slug
        //   );
        //   return JSON.stringify(newQueryDataArray);
        // });
        // if thre is a error return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData('categoryList', previousQueryDataArray);
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
        //   queryClient.setQueryData('categoryList', (oldQueryData) => {
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
          queryClient.setQueryData('categoryList', (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.slug !== data.deleted.slug
            );
            return JSON.stringify(newQueryDataArray);
          });
          toast.error(`${data.deleted.name} deleted`);
        }
        queryClient.invalidateQueries('categoryList');
      },
    }
  );
};

export const useMutationUpdateCategory = (queryClient) => {
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
        queryClient.cancelQueries('categoryList', { exact: true });

        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('categoryList');
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          _id: Date.now(),
          name: name,
        };
        queryClient.setQueryData('categoryList', (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          const newQueryDataArray = oldQueryDataArray.filter(
            (item) => item.slug !== slug
          );
          newQueryDataArray.unshift(newObject);

          return JSON.stringify(newQueryDataArray);
        });
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData('categoryList', previousQueryDataArray);
      },
      onError: (error, variables, rollback) => {
        //   If there is an errror, then we will rollback
        if (rollback) {
          rollback();
          console.log('rollback');
        }

        if (error) {
          toast.error(error.response.data.error);
        }
      },
      onSuccess: ({ data }, { slug }, context) => {
        // Runs only there is a success
        // saves http trip to the back-end
        if (data) {
          queryClient.setQueryData('categoryList', (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.slug !== slug
            );
            newQueryDataArray.unshift(data);
            return JSON.stringify(newQueryDataArray);
          });
          toast.success(`"${data.name}" is created`);
        }
      },
      onSettled: ({ data }, error, variables, context) => {
        if (error) {
          toast.error(error.response.data.error);
        }
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        queryClient.invalidateQueries('categoryList');
      },
    }
  );
};

// SubCategory Mutations

export const useMutationCreateSubCategory = (queryClient) => {
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
        queryClient.cancelQueries('categoryList', { exact: true });
        queryClient.cancelQueries('subCategoryList', { exact: true });
        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('categoryList');
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          _id: Date.now(),
          name: name,
        };
        queryClient.setQueryData('subCategoryList', (oldQueryData) => {
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
          queryClient.setQueryData('subCategoryList', previousQueryDataArray);
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
          queryClient.setQueryData('subCategoryList', (oldQueryData) => {
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
        queryClient.invalidateQueries('subCategoryList');
      },
    }
  );
};

export const useMutationRemoveSubCategory = (queryClient) => {
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
        queryClient.cancelQueries('categoryList', { exact: true });
        queryClient.cancelQueries('subCategoryList', { exact: true });

        // Snapshot the previous value
        const previousQueryDataArray =
          queryClient.getQueryData('subCategoryList');
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // queryClient.setQueryData('subCategoryList', (oldQueryData) => {
        //   const oldQueryDataArray = JSON.parse(oldQueryData);
        //   const newQueryDataArray = oldQueryDataArray.filter(
        //     (item) => item.slug !== slug
        //   );
        //   return JSON.stringify(newQueryDataArray);
        // });
        // if thre is a error return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData('subCategoryList', previousQueryDataArray);
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
        //   queryClient.setQueryData('subCategoryList', (oldQueryData) => {
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
          queryClient.setQueryData('categoryList', (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.slug !== data.deleted.slug
            );
            return JSON.stringify(newQueryDataArray);
          });
          toast.error(`${data.deleted.name} deleted`);
        }
        queryClient.invalidateQueries('subCategoryList');
        queryClient.invalidateQueries('categoryList');
      },
    }
  );
};

export const useMutationUpdateSubCategory = (queryClient) => {
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
        queryClient.cancelQueries('categoryList', { exact: true });
        queryClient.cancelQueries('subCategoryList', { exact: true });

        // Snapshot the previous value
        const previousQueryDataArray =
          queryClient.getQueryData('subCategoryList');
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          _id: Date.now(),
          name: name,
        };
        queryClient.setQueryData('subCategoryList', (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          const newQueryDataArray = oldQueryDataArray.filter(
            (item) => item.slug !== slug
          );
          newQueryDataArray.unshift(newObject);

          return JSON.stringify(newQueryDataArray);
        });
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData('subCategoryList', previousQueryDataArray);
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
          queryClient.setQueryData('subCategoryList', (oldQueryData) => {
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
        queryClient.invalidateQueries('categoryList');
        queryClient.invalidateQueries('subCategoryList');
      },
    }
  );
};

// Product Mutations
export const useMutationCreateProduct = (queryClient) => {
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
      onMutate: ({ data: { values } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        // queryClient.cancelQueries('productList', { exact: true });
        console.log('values onMutate: ', values);

        // Snapshot the previous value
        // const previousQueryDataArray = queryClient.getQueryData('productList');
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // const newObject = {
        //   ...values,
        //   _id: Date.now(),
        // };
        // console.log('newObject: ', newObject);
        // queryClient.setQueryData('productList', (oldQueryData) => {
        //   const oldQueryDataArray = JSON.parse(oldQueryData);
        //   console.log('oldQueryDataArray: ', oldQueryDataArray);
        //   const newQueryDataArray = oldQueryDataArray.filter(
        //     (item) => item.title !== values.title
        //   );
        //   console.log('newQueryDataArray before: ', newQueryDataArray);
        //   newQueryDataArray.unshift(newObject);
        //   console.log('newQueryDataArray after: ', newQueryDataArray);
        //   return JSON.stringify(newQueryDataArray);
        // });
        // return will pass the function or the value to the onError third argument:
        // return () =>
        //   queryClient.setQueryData('productList', previousQueryDataArray);
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
        { props: { setValues, initialState } },
        context
      ) => {
        if (data) {
          initialState.images = [];
          setValues((values) => ({ ...values, images: [] }));

          toast.success(`"${data.title}" is created`);
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
        // queryClient.invalidateQueries('productList');
      },
    }
  );
};

export const useMutationRemoveProduct = (queryClient) => {
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
        queryClient.cancelQueries('productListByCount', { exact: true });
        // Snapshot the previous value
        const previousQueryDataArray =
          queryClient.getQueryData('productListByCount');
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // queryClient.setQueryData('categoryList', (oldQueryData) => {
        //   const oldQueryDataArray = JSON.parse(oldQueryData);
        //   const newQueryDataArray = oldQueryDataArray.filter(
        //     (item) => item.slug !== slug
        //   );
        //   return JSON.stringify(newQueryDataArray);
        // });
        // if thre is a error return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            'productListByCount',
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
        //   queryClient.setQueryData('categoryList', (oldQueryData) => {
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
        const { slug } = data;
        if (data) {
          // console.log({ slug });
          queryClient.setQueryData('productListByCount', (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.slug !== slug
            );
            return JSON.stringify(newQueryDataArray);
          });
          toast.error(`${slug} deleted`);
        }
        queryClient.invalidateQueries('productListByCount');
      },
    }
  );
};

// Photo Upload Mutations

export const useMutationPhotoUpload = (queryClient) => {
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
        // Snapshot the previous value
        const previousQueryDataArray =
          queryClient.getQueryData('productListByCount');
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.

        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData('subCategoryList', previousQueryDataArray);
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
      onSuccess: ({ data }, { props: { values, setValues } }, context) => {
        // Runs only there is a success
        // saves http trip to the back-end
        const previousQueryDataArray =
          queryClient.getQueryData('productListByCount');
        console.log({ data });

        queryClient.setQueryData('productListByCount', (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          console.log('oldQueryDataArray onSuccess: ', oldQueryDataArray);
          console.log('image onSuccess: ', data);
          console.log('index onSuccess: ', values.index);
          const idx = values.index;

          const newQueryDataArray = oldQueryDataArray.filter((item) => {
            return item.slug !== values.slug;
          });

          const [result] = oldQueryDataArray
            .filter((item) => {
              return item.slug === values.slug;
            })
            .map((item) => {
              item.images[idx] = data;
              return item;
            });

          newQueryDataArray.push(result);

          console.log('newQueryDataArray: ', newQueryDataArray);

          return JSON.stringify(newQueryDataArray);
        });

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

export const useMutationPhotoRemove = (queryClient) => {
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
          queryClient.setQueryData('subCategoryList', previousQueryDataArray);
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
        queryClient.setQueryData('productListByCount', (oldQueryData) => {
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

// Product Update Mutations
export const useMutationUpdateProduct = (queryClient) => {
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
      onMutate: ({ data: { values } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries('productListByCount', { exact: true });
        console.log('values onMutate: ', values);

        // Snapshot the previous value
        const previousQueryDataArray =
          queryClient.getQueryData('productListByCount');
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // const newObject = {
        //   ...values,
        //   _id: Date.now(),
        // };
        // console.log('newObject: ', newObject);
        // queryClient.setQueryData('productList', (oldQueryData) => {
        //   const oldQueryDataArray = JSON.parse(oldQueryData);
        //   console.log('oldQueryDataArray: ', oldQueryDataArray);
        //   const newQueryDataArray = oldQueryDataArray.filter(
        //     (item) => item.title !== values.title
        //   );
        //   console.log('newQueryDataArray before: ', newQueryDataArray);
        //   newQueryDataArray.unshift(newObject);
        //   console.log('newQueryDataArray after: ', newQueryDataArray);
        //   return JSON.stringify(newQueryDataArray);
        // });
        // return will pass the function or the value to the onError third argument:
        // return () =>
        //   queryClient.setQueryData('productList', previousQueryDataArray);
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
        { props: { setValues, initialState } },
        context
      ) => {
        if (data) {
          toast.success(`"${data.title}" is updated`);
        }
      },
      onSettled: (data, error, { props: { router } }, context) => {
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
        queryClient.invalidateQueries('productListByCount');
        router.push(`/admin/products`);
      },
    }
  );
};
