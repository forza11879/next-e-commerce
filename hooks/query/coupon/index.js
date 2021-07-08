import { useCallback } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

async function fetchCoupons() {
  console.log(`${baseURL}/coupon/all`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/coupon/all`,
      method: 'get',
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchCoupons error:', error);
  }
}

export const couponQueryKeys = {
  coupons: ['coupon'],
  coupon: (name) => [...couponQueryKeys.coupons, name],
  //   productStar: (slug) => [...productQueryKeys.products, 'star', slug],
};

// Queries
export const useQueryCoupons = () =>
  useQuery(couponQueryKeys.coupons, () => fetchCoupons(), {
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
export const useMutationRemoveCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ url, token }) => {
      console.log({ url });
      return await axios.delete(url, {
        headers: {
          token,
        },
      });
    },
    {
      onMutate: ({ data: { couponId } }) => {
        // console.log({ couponId });
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries(couponQueryKeys.coupons);
        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData(
          couponQueryKeys.coupons
        );
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        queryClient.setQueryData(couponQueryKeys.coupons, (oldQueryData) => {
          let oldQueryDataArray = JSON.parse(oldQueryData);
          console.log({ oldQueryDataArray });
          const newQueryDataArray = oldQueryDataArray.filter(
            (item) => item._id !== couponId
          );

          console.log({ newQueryDataArray });
          return JSON.stringify(newQueryDataArray);
        });
        // if thre is a error return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            couponQueryKeys.coupons,
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
      // onSuccess: ({ data }, variables, context) => {
      //   // Runs only there is a success
      //   // if (data) {
      //   //   queryClient.setQueryData('categoryList', (oldQueryData) => {
      //   //     const oldQueryDataArray = JSON.parse(oldQueryData);
      //   //     const newQueryDataArray = oldQueryDataArray.filter(
      //   //       (item) => item.slug !== data.deleted.slug
      //   //     );
      //   //     return JSON.stringify(newQueryDataArray);
      //   //   });
      //   //   toast.error(`${data.deleted.name} deleted`);
      //   // }
      // },
      onSettled: ({ data }, error, variables, context) => {
        // console.log({ variables });
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // const { slug } = data;
        if (data) {
          // console.log({ data });
          //   queryClient.setQueryData('products', (oldQueryData) => {
          //     const oldQueryDataArray = JSON.parse(oldQueryData);
          //     const newQueryDataArray = oldQueryDataArray.filter(
          //       (item) => item.slug !== slug
          //     );
          //     return JSON.stringify(newQueryDataArray);
          //   });
          toast.error(`Coupon ${data.name} deleted`);
        }
        queryClient.invalidateQueries(couponQueryKeys.coupons);
      },
    }
  );
};

export const useMutationCreateCoupon = () => {
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
      onMutate: ({
        data: { coupon },
        props: { setName, setExpiry, setDiscount },
      }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries(couponQueryKeys.coupons);

        setName('');
        setExpiry(new Date());
        setDiscount('');

        const previousQueryDataArray = queryClient.getQueryData(
          couponQueryKeys.coupons
        );
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        const newObject = {
          ...coupon,
          _id: Date.now(),
        };
        // console.log('newObject: ', newObject);
        queryClient.setQueryData(couponQueryKeys.coupons, (oldQueryData) => {
          const oldQueryDataArray = JSON.parse(oldQueryData);
          // console.log('oldQueryDataArray before: ', oldQueryDataArray);

          oldQueryDataArray.unshift(newObject);

          // console.log('oldQueryDataArray after: ', oldQueryDataArray);
          return JSON.stringify(oldQueryDataArray);
        });
        // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            couponQueryKeys.coupons,
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
      onSuccess: (data, values, context) => {
        // if (data) {
        //   toast.success(`"${data.title}" is updated`);
        // }
        // console.log({ data });
        // console.log({ values });
        // console.log({ props });
        // setName('');
        // setExpiry('');
        // setDiscount('');
      },
      onSettled: ({ data }, error, values, context) => {
        if (error) {
          toast.error(error.response.data);
        }
        // console.log({ data });
        if (data) {
          toast.success(`"${data.name}" was created`);
        }

        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        queryClient.invalidateQueries(couponQueryKeys.coupons);
      },
    }
  );
};

export const useMutationApplyCoupon = () => {
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
      onMutate: ({
        data: { coupon },
        props: { setTotalAfterDiscount, setDiscountError },
      }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        // queryClient.cancelQueries(couponQueryKeys.coupon(coupon));
        console.log({ coupon });
        console.log({ setTotalAfterDiscount });
        console.log({ setDiscountError });

        // const previousQueryDataArray = queryClient.getQueryData(
        //   couponQueryKeys.coupons
        // );
        // console.log('previousQueryDataArray: ', previousQueryDataArray);
        // In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.
        // const newObject = {
        //   ...coupon,
        //   _id: Date.now(),
        // };
        // console.log('newObject: ', newObject);
        // queryClient.setQueryData(couponQueryKeys.coupons, (oldQueryData) => {
        //   const oldQueryDataArray = JSON.parse(oldQueryData);
        //   // console.log('oldQueryDataArray before: ', oldQueryDataArray);

        //   oldQueryDataArray.unshift(newObject);

        //   // console.log('oldQueryDataArray after: ', oldQueryDataArray);
        //   return JSON.stringify(oldQueryDataArray);
        // });
        // return will pass the function or the value to the onError third argument:
        // return () =>
        //   queryClient.setQueryData(
        //     couponQueryKeys.coupons,
        //     previousQueryDataArray
        //   );
      },
      onError: (
        error,
        { props: { setTotalAfterDiscount, setDiscountError } },
        rollback
      ) => {
        //   If there is an errror, then we will rollback
        // console.log('CreateCategory onError error: ', error.response.data);
        if (rollback) {
          rollback();
          console.log('rollback');
        }
        if (error) {
          // toast.error(error.response.data);
          // toast.error(error);
          // console.log({ error });
          console.log('error.response.data.error: ', error.response.data.error);
          // setTotalAfterDiscount('');
          setDiscountError(error.response.data.error);
          // console.log('error.response.error: ', error.response.error);
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
      onSettled: (
        { data },
        error,
        { props: { setTotalAfterDiscount, setDiscountError } },
        context
      ) => {
        // console.log({ data });
        if (data) {
          console.log({ data });
          // setDiscountError('');
          setTotalAfterDiscount(data);
          // toast.success(`"${data.name}" was created`);
        }

        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        // queryClient.invalidateQueries(couponQueryKeys.coupons);
      },
    }
  );
};
