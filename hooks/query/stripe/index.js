import { useCallback } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

async function fetchStripePayment(token, coupon) {
  console.log(`${baseURL}/create-payment-intent`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: '/create-payment-intent',
      method: 'post',
      headers: { token },
      data: { couponApplied: coupon },
    });
    // console.log({ data });
    return data;
    // return JSON.stringify(data);
  } catch (error) {
    console.log('fetchStripePayment error:', error);
  }
}

export const stripeQueryKeys = {
  stripe: ['stripe'],
  stripePayment: (name) => [...stripeQueryKeys.stripe, 'payment', name],
};

// Queries
export const useQueryStripePayment = (name, token, coupon) =>
  useQuery(
    stripeQueryKeys.stripePayment(name),
    () => fetchStripePayment(token, coupon),
    {
      // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
      select: useCallback((data) => {
        // selectors will only be called if data exists, so you don't have to care about undefined here.
        // console.log(JSON.parse(data));
        return data;
        // return JSON.parse(data);
      }, []),
      // staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      // enabled: Boolean(count),
      // keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQueryStripePayment error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );
