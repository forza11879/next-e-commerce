import { useCallback, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

const baseURL = process.env.api;

async function fetchUserCart(body, token) {
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
    console.log('fetchUserCart error:', error);
  }
}

export const userQueryKeys = {
  user: ['user'],
  userCart: (name) => [...userQueryKeys.user, 'cart', name],
};

// Queries
export const useQueryUserCart = (body, token) => {
  const [name, setName] = useState(null);

  const { data } = useQuery(
    userQueryKeys.userCart(name),
    () => fetchUserCart(body, token),
    {
      select: useCallback((data) => {
        return data;
      }, []),
      enabled: Boolean(name),
      onError: (error) => {
        console.log('useQueryUserCart error: ', error);
      },
    }
  );
  return [data, setName];
};
