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

    return data;
  } catch (error) {
    console.log('fetchUserCart error:', error);
  }
}

export const getUserCart = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/user/cart`, {
    headers: {
      authtoken,
    },
  });

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
      // console.log('data: ', data);
      return data;
    }, []),
    staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    enabled: Boolean(name),
    // keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
    onError: (error) => {
      console.log('useQueryGetUserCart error: ', error);
    }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
  });
};
