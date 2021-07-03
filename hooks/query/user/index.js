import { useCallback } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

async function fetchProducts(body) {
  console.log(`${baseURL}/product/all`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/all`,
      method: 'post',
      data: body,
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchProducts error:', error);
  }
}

export const userQueryKeys = {
  user: ['user'],
  userAddress: () => [...userQueryKeys.user, 'address'],
};

// Queries
export const useQueryUserAddress = () =>
  useQuery(userQueryKeys.userAddress(), () => fetchPostUserAddress(), {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      // console.log(JSON.parse(data));
      return JSON.parse(data);
    }, []),
    staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    // enabled: Boolean(),
    // keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
    onError: (error) => {
      console.log('useQueryUserAddress error: ', error);
    }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
  });

// export const saveUserAddress = async (authtoken, address) =>
//   await axios.post(
//     `${process.env.REACT_APP_API}/user/address`,
//     { address },
//     {
//       headers: {
//         authtoken,
//       },
//     }
//   );

// Mutations
export const useMutationSaveUserAddress = () => {
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
      onMutate: (data) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        // queryClient.cancelQueries('productList', { exact: true });
        console.log('data onMutate: ', data);

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
      onSuccess: ({ data }, { props: { setAddressSaved } }, context) => {
        console.log({ data });
        if (data.ok) {
          setAddressSaved(true);
          toast.success('Address saved');
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
