import { useCallback, useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

async function postUserCart(body, token) {
  console.log(`${baseURL}/cart`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/cart`,
      method: 'post',
      data: { cart: body },
      headers: { token },
    });

    return data;
  } catch (error) {
    console.log('postUserCart error:', error);
  }
}

export async function fetchUserCart(token) {
  console.log(`${baseURL}/cart`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/cart`,
      method: 'get',
      headers: { token },
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchUserCart error:', error);
  }
}

export const userQueryKeys = {
  user: ['user'],
  userCart: (body) => [...userQueryKeys.user, 'unconfirmed-cart', body],
  getUserCart: (name) => [...userQueryKeys.user, 'confirmed-cart', name],
};

// Queries
export const useQueryUserCart = (body, token) => {
  // const [name, setName] = useState(null);

  // console.log({ name });

  return useQuery(
    userQueryKeys.userCart(body),
    () => postUserCart(body, token),
    {
      // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
      select: useCallback((data) => {
        // selectors will only be called if data exists, so you don't have to care about undefined here.
        // console.log(JSON.parse(data));
        return data;
      }, []),
      // staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      // refetchOnWindowFocus: false,
      enabled: Boolean(body),
      // keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQueryUserCart error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );
};

export const useQueryGetUserCart = (name, token) => {
  return useQuery(userQueryKeys.getUserCart(name), () => fetchUserCart(token), {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      const parsedData = JSON.parse(data);
      if (typeof parsedData === 'string') {
        return { products: [], cartTotal: 0 };
      } else {
        return parsedData;
      }
    }, []),
    // staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    // enabled: Boolean(name),
    // keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
    onError: (error) => {
      console.log('useQueryGetUserCart error: ', error);
    }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
  });
};

// Mutations

export const useMutationRemoveCart = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ url, token }) => {
      return await axios.delete(url, {
        headers: {
          token,
        },
      });
    },
    {
      onMutate: ({ data: { name } }) => {
        // console.log({ name });

        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries(userQueryKeys.getUserCart(name));
        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData(
          userQueryKeys.getUserCart(name)
        );
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // queryClient.setQueryData(
        //   userQueryKeys.getUserCart(name),
        //   (oldQueryData) => {
        //     console.log('oldQueryData: ', JSON.parse(oldQueryData));
        //     const newQueryDataArray = JSON.parse(oldQueryData);
        //     newQueryDataArray._id = '';
        //     newQueryDataArray.products = [];
        //     newQueryDataArray.cartTotal = 0;
        //     newQueryDataArray.orderedBy = '';
        //     console.log('newQueryDataArray.products: ', newQueryDataArray);
        //     return JSON.stringify(newQueryDataArray);
        //   }
        // );
        // if thre is a error return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            userQueryKeys.getUserCart(name),
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
      onSuccess: (data, { data: { name } }, context) => {
        // console.log({ data });
        // console.log({ cartId });
        // console.log({ name });
        // console.log('variables: ', variables);
        // console.log({ variables });
        // Runs only there is a success
        // if (cartId === _id) {
        //   queryClient.setQueryData(
        //     userQueryKeys.getUserCart(name),
        //     (oldQueryData) => {
        //       console.log('oldQueryData: ', JSON.parse(oldQueryData));
        //       const newQueryDataArray = JSON.parse(oldQueryData);
        //       newQueryDataArray._id = '';
        //       newQueryDataArray.products = [];
        //       newQueryDataArray.cartTotal = 0;
        //       newQueryDataArray.orderedBy = '';
        //       console.log('newQueryDataArray.products: ', newQueryDataArray);
        //       return JSON.stringify(newQueryDataArray);
        //     }
        //   );
        //   // toast.error(`${cart._id} deleted`);
        //   toast.success('Cart is emapty. Contniue shopping.');
        // }
      },
      onSettled: (data, error, { data: { name } }, context) => {
        queryClient.setQueryData(
          userQueryKeys.getUserCart(name),
          (oldQueryData) => {
            console.log('oldQueryData: ', JSON.parse(oldQueryData));
            let newQueryDataArray = JSON.parse(oldQueryData);
            newQueryDataArray = '';

            return JSON.stringify(newQueryDataArray);
          }
        );
        // toast.error(`${_id} deleted`);
        toast.success('Cart is empty. Contniue shopping.');

        queryClient.invalidateQueries(userQueryKeys.getUserCart(name));
      },
    }
  );
};
