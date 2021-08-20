import nookies, { destroyCookie, setCookie } from 'nookies';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { getCartStoreReseted } from '@/store/cart';
import { useMutationRemoveCart } from '@/hooks/query/cart';
import { useMutationRemoveStripeCookie } from '@/hooks/query/cookies';

const baseURL = process.env.api;

// async function fetchOrder() {
//   console.log(`${baseURL}/coupon/all`);
//   try {
//     const { data } = await axios.request({
//       baseURL,
//       url: `/coupon/all`,
//       method: 'get',
//     });

//     return JSON.stringify(data);
//   } catch (error) {
//     console.log('fetchCoupons error:', error);
//   }
// }

async function fetchUserOrders(token) {
  console.log(`${baseURL}/admin/orders`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/admin/orders`,
      method: 'get',
      headers: { token },
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchCoupons error:', error);
  }
}

export const orderQueryKeys = {
  order: ['order'],
  userOrders: (id) => [...orderQueryKeys.order, 'user', id],
};

// Queries
export const useQueryUserOrders = (id, token) =>
  useQuery(orderQueryKeys.userOrders(id), () => fetchUserOrders(token), {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      // console.log(JSON.parse(data));
      return JSON.parse(data);
    }, []),
    staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    // enabled: Boolean(count),
    keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
    onError: (error) => {
      console.log('useQueryCoupons error: ', error);
    }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
  });

// Mutations
export const useMutationCreateOrder = () => {
  const removeCartUseMutation = useMutationRemoveCart();
  const removeStripeCookieUseMutation = useMutationRemoveStripeCookie();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
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
      // onMutate: ({
      //   data: { coupon },
      //   props: { setName, setExpiry, setDiscount },
      // }) => {
      //   // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
      //   queryClient.cancelQueries(couponQueryKeys.coupons);
      //   setName('');
      //   setExpiry(new Date());
      //   setDiscount('');
      //   const previousQueryDataArray = queryClient.getQueryData(
      //     couponQueryKeys.coupons
      //   );
      //   // console.log('previousQueryDataArray: ', previousQueryDataArray);
      //   // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
      //   const newObject = {
      //     ...coupon,
      //     _id: Date.now(),
      //   };
      //   // console.log('newObject: ', newObject);
      //   queryClient.setQueryData(couponQueryKeys.coupons, (oldQueryData) => {
      //     const oldQueryDataArray = JSON.parse(oldQueryData);
      //     // console.log('oldQueryDataArray before: ', oldQueryDataArray);
      //     oldQueryDataArray.unshift(newObject);
      //     // console.log('oldQueryDataArray after: ', oldQueryDataArray);
      //     return JSON.stringify(oldQueryDataArray);
      //   });
      //   // return will pass the function or the value to the onError third argument:
      //   return () =>
      //     queryClient.setQueryData(
      //       couponQueryKeys.coupons,
      //       previousQueryDataArray
      //     );
      // },
      // onError: (error, variables, rollback) => {
      //   //   If there is an errror, then we will rollback
      //   // console.log('CreateCategory onError error: ', error.response.data);
      //   if (rollback) {
      //     rollback();
      //     console.log('rollback');
      //   }
      //   if (error) {
      //     toast.error(error.response.data);
      //     // toast.error(error);
      //   }
      // },
      // onSuccess: (data, values, context) => {
      //   // if (data) {
      //   //   toast.success(`"${data.title}" is updated`);
      //   // }
      //   // console.log({ data });
      //   // console.log({ values });
      //   // console.log({ props });
      //   // setName('');
      //   // setExpiry('');
      //   // setDiscount('');
      // },
      onSettled: ({ data }, error, { token, userName }, context) => {
        if (error) {
          toast.error(error.response.data);
        }
        // console.log({ data });
        if (data) {
          //   toast.success(`"${data.name}" was created`);
          // console.log({ data });
        }

        if (data.ok) {
          // empty cart from local storage
          if (typeof window !== 'undefined') localStorage.removeItem('cart');
          // empty cart from database
          const removeCartOptions = {
            url: `${process.env.api}/cart`,
            token: token,
            data: { name: userName },
          };
          removeCartUseMutation.mutate(removeCartOptions);
          // empty cart from redux
          dispatch(getCartStoreReseted());
          // Destroy cookie
          const removeStripeCookieOptions = {
            url: '/cookies',
            token: token,
            method: 'post',
            data: { cookieName: 'appPaymentId' },
          };
          removeStripeCookieUseMutation.mutate(removeStripeCookieOptions);
        }
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        // queryClient.invalidateQueries(couponQueryKeys.coupons);
      },
    }
  );
};

export const useMutationCreateCashOrder = () => {
  const router = useRouter();
  const removeCartUseMutation = useMutationRemoveCart();
  // const removeStripeCookieUseMutation = useMutationRemoveStripeCookie();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
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
      // onMutate: ({
      //   data: { coupon },
      //   props: { setName, setExpiry, setDiscount },
      // }) => {
      //   // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
      //   queryClient.cancelQueries(couponQueryKeys.coupons);
      //   setName('');
      //   setExpiry(new Date());
      //   setDiscount('');
      //   const previousQueryDataArray = queryClient.getQueryData(
      //     couponQueryKeys.coupons
      //   );
      //   // console.log('previousQueryDataArray: ', previousQueryDataArray);
      //   // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
      //   const newObject = {
      //     ...coupon,
      //     _id: Date.now(),
      //   };
      //   // console.log('newObject: ', newObject);
      //   queryClient.setQueryData(couponQueryKeys.coupons, (oldQueryData) => {
      //     const oldQueryDataArray = JSON.parse(oldQueryData);
      //     // console.log('oldQueryDataArray before: ', oldQueryDataArray);
      //     oldQueryDataArray.unshift(newObject);
      //     // console.log('oldQueryDataArray after: ', oldQueryDataArray);
      //     return JSON.stringify(oldQueryDataArray);
      //   });
      //   // return will pass the function or the value to the onError third argument:
      //   return () =>
      //     queryClient.setQueryData(
      //       couponQueryKeys.coupons,
      //       previousQueryDataArray
      //     );
      // },
      // onError: (error, variables, rollback) => {
      //   //   If there is an errror, then we will rollback
      //   // console.log('CreateCategory onError error: ', error.response.data);
      //   if (rollback) {
      //     rollback();
      //     console.log('rollback');
      //   }
      //   if (error) {
      //     toast.error(error.response.data);
      //     // toast.error(error);
      //   }
      // },
      // onSuccess: (data, values, context) => {
      //   // if (data) {
      //   //   toast.success(`"${data.title}" is updated`);
      //   // }
      //   // console.log({ data });
      //   // console.log({ values });
      //   // console.log({ props });
      //   // setName('');
      //   // setExpiry('');
      //   // setDiscount('');
      // },
      onSettled: ({ data }, error, { token, userName }, context) => {
        if (error) {
          toast.error(error.response.data);
        }
        // console.log({ data });
        if (data) {
          //   toast.success(`"${data.name}" was created`);
          // console.log({ data });
        }
        if (data.ok) {
          // empty cart from local storage
          console.log({ data });
          if (typeof window !== 'undefined') localStorage.removeItem('cart');
          // empty cart from database
          const removeCartOptions = {
            url: `${process.env.api}/cart`,
            token: token,
            data: { name: userName },
          };
          removeCartUseMutation.mutate(removeCartOptions);
          // empty cart from redux
          dispatch(getCartStoreReseted());
          // Destroy cookie
          // const removeStripeCookieOptions = {
          //   url: '/cookies',
          //   token: token,
          //   method: 'post',
          //   data: { cookieName: 'appPaymentId' },
          // };
          // removeStripeCookieUseMutation.mutate(removeStripeCookieOptions);
          router.push('/user/history');
        }
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        // queryClient.invalidateQueries(couponQueryKeys.coupons);
      },
    }
  );
};

export const useMutationUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  // const dispatch = useDispatch();
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
      onMutate: ({ userId, data: { orderId, orderStatus } }) => {
        // console.log({ userId });
        // console.log({ orderId, orderStatus });
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries(orderQueryKeys.userOrders(userId));

        const previousQueryDataArray = queryClient.getQueryData(
          orderQueryKeys.userOrders(userId)
        );
        // console.log(
        //   'previousQueryDataArray: ',
        //   JSON.parse(previousQueryDataArray)
        // );
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // const newObject = {
        //   ...coupon,
        //   _id: Date.now(),
        // };
        // console.log('newObject: ', newObject);
        queryClient.setQueryData(
          orderQueryKeys.userOrders(userId),
          (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            // console.log('oldQueryDataArray before: ', oldQueryDataArray);
            const index = oldQueryDataArray.findIndex(
              (item) => item._id === orderId
            );
            // console.log({ index });
            oldQueryDataArray[index].orderStatus = orderStatus;
            // oldQueryDataArray.unshift(newObject);
            // console.log('oldQueryDataArray after: ', oldQueryDataArray);
            return JSON.stringify(oldQueryDataArray);
          }
        );
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            orderQueryKeys.userOrders(userId),
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
          // toast.error(error);
        }
      },
      // onSuccess: (data, values, context) => {
      //   // if (data) {
      //   //   toast.success(`"${data.title}" is updated`);
      //   // }
      //   // console.log({ data });
      //   // console.log({ values });
      //   // console.log({ props });
      //   // setName('');
      //   // setExpiry('');
      //   // setDiscount('');
      // },
      onSettled: ({ data }, error, { userId }, context) => {
        // console.log({ data });
        toast.success('Status updated');
        // if (error) {
        //   toast.error(error.response.data);
        // }
        // // console.log({ data });
        // if (data) {
        //   //   toast.success(`"${data.name}" was created`);
        //   // console.log({ data });
        // }
        // if (data.ok) {
        //   // empty cart from local storage
        //   if (typeof window !== 'undefined') localStorage.removeItem('cart');
        //   // empty cart from database
        //   const removeCartOptions = {
        //     url: `${process.env.api}/cart`,
        //     token: token,
        //     data: { name: userName },
        //   };
        //   removeCartUseMutation.mutate(removeCartOptions);
        //   // empty cart from redux
        //   dispatch(getCartStoreReseted());
        //   // Destroy cookie
        //   const removeStripeCookieOptions = {
        //     url: '/cookies',
        //     token: token,
        //     method: 'post',
        //     data: { cookieName: 'appPaymentId' },
        //   };
        //   removeStripeCookieUseMutation.mutate(removeStripeCookieOptions);
        // }
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        queryClient.invalidateQueries(orderQueryKeys.userOrders(userId));
      },
    }
  );
};
