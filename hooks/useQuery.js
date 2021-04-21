import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

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

export const useMutationCreateCategory = (queryClient) => {
  return useMutation(
    async ({ enteredName, options: { url, method, token } }) => {
      return await axios.request({
        baseURL: baseURL,
        url,
        method,
        data: { name: enteredName },
        headers: { token },
      });
    },
    {
      onMutate: ({ enteredName, options }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries('categoryList', { exact: true });

        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('categoryList');
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          _id: Date.now(),
          name: enteredName,
        };
        queryClient.setQueryData('categoryList', (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          oldQueryDataArray.unshift(newObject);
          return JSON.stringify(oldQueryDataArray);
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
    async ({ slug, options: { url, token } }) => {
      return await axios.delete(url, {
        headers: {
          token,
        },
        data: { slug },
      });
    },
    {
      onMutate: ({ slug, options }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries('categoryList', { exact: true });
        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('categoryList');
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        queryClient.setQueryData('categoryList', (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          const newQueryDataArray = oldQueryDataArray.filter(
            (item) => item.slug !== slug
          );
          return JSON.stringify(newQueryDataArray);
        });
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
      },
      onSettled: (data, variables, context) => {
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        queryClient.invalidateQueries('categoryList');
      },
    }
  );
};

export const useMutationUpdateCategory = (queryClient) => {
  return useMutation(
    async ({ url, method, name, token }) => {
      return await axios.request({
        baseURL,
        url,
        method,
        data: { name },
        headers: { token },
      });
    },
    {
      onMutate: ({ name, slug }) => {
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
        console.log('slug onMutate: ', slug);
        queryClient.setQueryData('categoryList', (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          console.log('oldQueryDataArray onMutate: ', oldQueryDataArray);
          const newQueryDataArray = oldQueryDataArray.filter(
            (item) => item.slug !== slug
          );
          console.log('newQueryDataArray onMutate: ', newQueryDataArray);
          newQueryDataArray.unshift(newObject);
          console.log(
            'newQueryDataArray onMutate unshift: ',
            newQueryDataArray
          );
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
      onSuccess: ({ data }, { slug }, context) => {
        // Runs only there is a success
        // saves http trip to the back-end
        console.log('data onSuccess: ', data);
        console.log('name onSuccess: ', name);
        if (data) {
          queryClient.setQueryData('categoryList', (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            console.log('oldQueryDataArray onSuccess: ', oldQueryDataArray);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.slug !== slug
            );
            console.log('newQueryDataArray onSuccess: ', newQueryDataArray);
            newQueryDataArray.unshift(data);
            console.log(
              'newQueryDataArray onSuccess unshift: ',
              newQueryDataArray
            );
            return JSON.stringify(newQueryDataArray);
          });
          toast.success(`"${data.name}" is created`);
        }
      },
      onSettled: ({ data }, error, variables, context) => {
        // console.log('data onSettled: ', data);
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
