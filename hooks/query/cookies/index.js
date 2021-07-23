import { useCallback, useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

// async function postUserCart(body, token) {
//   console.log(`${baseURL}/cart`);
//   try {
//     const { data } = await axios.request({
//       baseURL,
//       url: `/cart`,
//       method: 'post',
//       data: { cart: body },
//       headers: { token },
//     });

//     return data;
//   } catch (error) {
//     console.log('postUserCart error:', error);
//   }
// }

// Query keys
export const cookieQueryKeys = {
  cookie: ['cookie'],
  //   userCart: (body) => [...userQueryKeys.user, 'unconfirmed-cart', body],
};

// Queries

// Mutations

export const useMutationRemoveStripeCookie = () => {
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
      //   onSettled: ({ data }, error, { token, userName }, context) => {
      //     if (error) {
      //       toast.error(error.response.data);
      //     }
      //     // console.log({ data });
      //     if (data) {
      //       //   toast.success(`"${data.name}" was created`);
      //       // console.log({ data });
      //     }
      //     if (data.ok) {
      //       // empty cart from redux
      //       dispatch(getCartStoreReseted());
      //       // empty cart from local storage
      //       if (typeof window !== 'undefined') localStorage.removeItem('cart');
      //       // empty cart from database
      //       const removeCartOptions = {
      //         url: `${process.env.api}/cart`,
      //         token: token,
      //         data: { name: userName },
      //       };
      //       removeCartUseMutation.mutate(removeCartOptions);
      //       // Destroy
      //       // destroyCookie(null, 'appPaymentId');
      //       const removeStripeCookieOptions = {
      //         url: '/cookie',
      //         token: token,
      //         data: { cookieName: 'appPaymentId' },
      //       };
      //       removeStripeCookieUseMutation.mutate(removeStripeCookieOptions);
      //     }
      //     // Runs on either success or error. It is better to run invalidateQueries
      //     // onSettled in case there is an error to re-fetch the request
      //     // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
      //     // queryClient.invalidateQueries(couponQueryKeys.coupons);
      //   },
    }
  );
};
