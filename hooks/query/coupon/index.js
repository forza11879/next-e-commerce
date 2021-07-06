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
  coupon: (id) => [...couponQueryKeys.coupons, id],
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
        queryClient.cancelQueries('products', { exact: true });
        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('products');
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
          queryClient.setQueryData('products', previousQueryDataArray);
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
          queryClient.setQueryData('products', (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            const newQueryDataArray = oldQueryDataArray.filter(
              (item) => item.slug !== slug
            );
            return JSON.stringify(newQueryDataArray);
          });
          toast.error(`${slug} deleted`);
        }
        queryClient.invalidateQueries('products');
      },
    }
  );
};

export const useMutationCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ url, method, token, data, props }) => {
      // console.log({ url });
      // console.log({ method });
      // console.log({ data });
      // console.log({ props });

      return await axios.request({
        baseURL,
        url,
        method,
        data,
        headers: { token },
      });
    },
    {
      // onMutate: ({ data: { values } }) => {
      onMutate: ({ props: { setName, setExpiry, setDiscount } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        setName('');
        setExpiry(new Date());
        setDiscount('');
        // queryClient.cancelQueries(couponQueryKeys.coupons);
        // console.log('values onMutate: ', values);
        // console.log('data onMutate: ', data);
        // Snapshot the previous value
        // const previousQueryDataArray = queryClient.getQueryData('products');
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
      // onError: (error, variables, rollback) => {
      //   //   If there is an errror, then we will rollback
      //   // console.log('CreateCategory onError error: ', error.response.data);
      //   if (rollback) {
      //     rollback();
      //     console.log('rollback');
      //   }
      //   if (error) {
      //     toast.error(error.response.data);
      //   }
      // },
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
          // console.log(
          //   'CreateCategory onSettled error: ',
          //   error.response.data.error
          // );
          toast.error(error.response.data.error);
        }
        // console.log({ data });
        if (data) {
          toast.success(`"${data.name}" was created`);
        }

        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        // queryClient.invalidateQueries('products');
        // router.push(`/admin/products`);
      },
    }
  );
};
