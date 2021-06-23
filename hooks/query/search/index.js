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
      staleTime: Infinity,
      enabled: Boolean(obj.query),
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
      staleTime: Infinity,
      enabled: obj.category.length > 0,
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
      staleTime: Infinity,
      enabled: Boolean(obj.stars),
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
      staleTime: Infinity,
      enabled: Boolean(obj.subcategory),
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
      staleTime: Infinity,
      enabled: Boolean(obj.brand),
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
      staleTime: Infinity,
      enabled: Boolean(obj.color),
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
      staleTime: Infinity,
      enabled: Boolean(obj.shipping),
    }
  );
