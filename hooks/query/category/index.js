import { useCallback } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

async function fetchCategories() {
  console.log(`${baseURL}/category/all`);
  const { data } = await axios.request({
    baseURL,
    url: '/category/all',
    method: 'get',
  });

  return JSON.stringify(data);
}

async function fetchCategory(slug) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log(`${baseURL}/category/${slug}`);
  const { data } = await axios.request({
    baseURL: baseURL,
    url: `/category/${slug}`,
    method: 'get',
  });
  // console.log('fetchCategory data:', data);
  return JSON.stringify(data.category);
}

async function fetchProductsByCategory(slug) {
  console.log(`${baseURL}/category/${slug}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/category/${slug}`,
      method: 'get',
    });
    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchProductsByCategory error:', error);
  }
}

export const categoryQueryKeys = {
  categories: ['categories'],
  category: (id) => [...categoryQueryKeys.categories, id],
  productsByCategory: (id) => [...categoryQueryKeys.categories, 'products', id],
};

// Queries
export const useQueryCategories = () =>
  useQuery(...categoryQueryKeys.categories, fetchCategories, {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      // console.log(JSON.parse(data));
      return JSON.parse(data);
    }, []),
    staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    onError: (error) => {
      console.log('useQueryCategories error: ', error);
    }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
  });

export const useQueryCategory = (id, slug) =>
  useQuery(categoryQueryKeys.category(id), () => fetchCategory(slug), {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      console.log(JSON.parse(data));
      return JSON.parse(data);
    }, []),
    staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    enabled: Boolean(id),
    keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
    onError: (error) => {
      console.log('useQueryCategory error: ', error);
    }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
  });

export const useQueryProductsByCategory = (id, slug) =>
  useQuery(
    categoryQueryKeys.productsByCategory(id),
    () => fetchProductsByCategory(slug),
    {
      // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
      select: useCallback((data) => {
        // selectors will only be called if data exists, so you don't have to care about undefined here.
        // console.log(JSON.parse(data));
        return JSON.parse(data);
      }, []),
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      enabled: Boolean(id),
      keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQueryProductsByCategory error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );

// Mutations
export const useMutationCreateCategory = () => {
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
      onMutate: ({ data: { name } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries(...categoryQueryKeys.categories);

        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData(
          ...categoryQueryKeys.categories
        );
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          _id: Date.now(),
          name: name,
        };
        queryClient.setQueryData(
          ...categoryQueryKeys.categories,
          (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.name !== name
            );
            newQueryDataArray.unshift(newObject);
            return JSON.stringify(newQueryDataArray);
          }
        );
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            ...categoryQueryKeys.categories,
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
          queryClient.setQueryData(
            ...categoryQueryKeys.categories,
            (oldQueryData) => {
              const oldQueryDataArray = JSON.parse(oldQueryData);
              const newQueryDataArray = oldQueryDataArray.filter(
                (item) => item.name !== data.name
              );
              newQueryDataArray.unshift(data);
              return JSON.stringify(newQueryDataArray);
            }
          );
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
        queryClient.invalidateQueries(...categoryQueryKeys.categories);
      },
    }
  );
};

export const useMutationRemoveCategory = () => {
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
        queryClient.cancelQueries(queryKeys.categories);
        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData(
          ...categoryQueryKeys.categories
        );
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
            ...categoryQueryKeys.categories,
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
        if (data) {
          queryClient.setQueryData(
            ...categoryQueryKeys.categories,
            (oldQueryData) => {
              const oldQueryDataArray = JSON.parse(oldQueryData);
              const newQueryDataArray = oldQueryDataArray.filter(
                (item) => item.slug !== data.deleted.slug
              );
              return JSON.stringify(newQueryDataArray);
            }
          );
          toast.error(`${data.deleted.name} deleted`);
        }
        queryClient.invalidateQueries(...categoryQueryKeys.categories);
      },
    }
  );
};

export const useMutationUpdateCategory = () => {
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
        queryClient.cancelQueries(...categoryQueryKeys.categories);

        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData(
          ...categoryQueryKeys.categories
        );
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          _id: Date.now(),
          name: name,
        };
        queryClient.setQueryData(
          ...categoryQueryKeys.categories,
          (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.slug !== slug
            );
            newQueryDataArray.unshift(newObject);

            return JSON.stringify(newQueryDataArray);
          }
        );
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            ...categoryQueryKeys.categories,
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
        }
      },
      onSuccess: ({ data }, { slug }, context) => {
        // Runs only there is a success
        // saves http trip to the back-end
        if (data) {
          queryClient.setQueryData(
            ...categoryQueryKeys.categories,
            (oldQueryData) => {
              const oldQueryDataArray = JSON.parse(oldQueryData);
              const newQueryDataArray = oldQueryDataArray.filter(
                (item) => item.slug !== slug
              );
              newQueryDataArray.unshift(data);
              return JSON.stringify(newQueryDataArray);
            }
          );
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
        queryClient.invalidateQueries(...categoryQueryKeys.categories);
      },
    }
  );
};
