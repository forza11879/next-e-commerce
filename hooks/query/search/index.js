import { useCallback } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

async function fetchProductsByFilter(text) {
  console.log(`${baseURL}/search/filters`);
  console.log('text react-query: ', text);

  try {
    const { data } = await axios.request({
      baseURL,
      url: `/search/filters`,
      method: 'post',
      data: { query: text },
    });
    console.log({ data });
    return data;
  } catch (error) {
    console.log('fetchProducts error:', error);
  }
}

const queryKeys = {
  //   products: ['products'],
  //   product: (id) => [...queryKeys.products, id],
  searchText: ['searchText'],
};

// Queries
export const useQuerySearchText = (text) =>
  useQuery(queryKeys.searchText, () => fetchProductsByFilter(text), {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      //   console.log({ data });
      return data;
    }, []),
    staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
  });
