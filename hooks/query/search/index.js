import { useCallback } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

async function fetchProductsByFilter(obj) {
  console.log(`${baseURL}/search/filters`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/search/filters`,
      method: 'post',
      data: obj,
    });
    return data;
  } catch (error) {
    console.log('fetchProductsByFilter error:', error);
  }
}

export const searchQueryKeys = {
  search: ['search'],
  searchByText: (value) => [...searchQueryKeys.search, 'text', value],
  searchByPrice: (value) => [...searchQueryKeys.search, 'price', value],
  searchByCategory: (value) => [...searchQueryKeys.search, 'category', value],
  searchByStar: (value) => [...searchQueryKeys.search, 'star', value],
  searchBySubCategory: (value) => [
    ...searchQueryKeys.search,
    'subcategory',
    value,
  ],
  searchByBrand: (value) => [...searchQueryKeys.search, 'brand', value],
  searchByColor: (value) => [...searchQueryKeys.search, 'color', value],
  searchByShipping: (value) => [...searchQueryKeys.search, 'shipping', value],
};

// Queries
export const useQuerySearchByText = (obj) =>
  useQuery(
    searchQueryKeys.searchByText(obj.query),
    () => fetchProductsByFilter(obj),
    {
      select: useCallback((data) => {
        return data;
      }, []),
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      enabled: Boolean(obj.query),
      keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQuerySearchByText error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );

export const useQuerySearchByPrice = (obj) =>
  useQuery(
    searchQueryKeys.searchByPrice(obj.price),
    () => fetchProductsByFilter(obj),
    {
      // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
      select: useCallback((data) => {
        // selectors will only be called if data exists, so you don't have to care about undefined here.
        // console.log(JSON.parse(data));
        return data;
      }, []),
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      enabled: obj.price[1] !== 0,
      keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQuerySearchByPrice error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );

export const useQuerySearchByCategory = (obj) =>
  useQuery(
    searchQueryKeys.searchByCategory(obj.category),
    () => fetchProductsByFilter(obj),
    {
      select: useCallback((data) => {
        return data;
      }, []),
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      enabled: obj.category.length > 0,
      keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQuerySearchByCategory error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );

export const useQuerySearchByStar = (obj) =>
  useQuery(
    searchQueryKeys.searchByStar(obj.stars),
    () => fetchProductsByFilter(obj),
    {
      select: useCallback((data) => {
        return data;
      }, []),
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      enabled: Boolean(obj.stars),
      keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQuerySearchByStar error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );

export const useQuerySearchBySubCategory = (obj) =>
  useQuery(
    searchQueryKeys.searchBySubCategory(obj.subcategory),
    () => fetchProductsByFilter(obj),
    {
      select: useCallback((data) => {
        return data;
      }, []),
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      enabled: Boolean(obj.subcategory),
      keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQuerySearchBySubCategory error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );

export const useQuerySearchByBrand = (obj) =>
  useQuery(
    searchQueryKeys.searchByBrand(obj.brand),
    () => fetchProductsByFilter(obj),
    {
      select: useCallback((data) => {
        return data;
      }, []),
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      enabled: Boolean(obj.brand),
      keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQuerySearchByBrand error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );

export const useQuerySearchByColor = (obj) =>
  useQuery(
    searchQueryKeys.searchByColor(obj.color),
    () => fetchProductsByFilter(obj),
    {
      select: useCallback((data) => {
        return data;
      }, []),
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      enabled: Boolean(obj.color),
      keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQuerySearchByColor error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );

export const useQuerySearchByShipping = (obj) =>
  useQuery(
    searchQueryKeys.searchByShipping(obj.shipping),
    () => fetchProductsByFilter(obj),
    {
      select: useCallback((data) => {
        return data;
      }, []),
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
      enabled: Boolean(obj.shipping),
      keepPreviousData: true, // to avoid hard loading states between the refetches triggered by a query-key change.
      onError: (error) => {
        console.log('useQuerySearchByShipping error: ', error);
      }, //  Don't `catch` in the queryFn just to log. It will make your errors return as resolved promises, thus they won't be seen as errors by react-query. use the `onError` callback instead.
    }
  );
