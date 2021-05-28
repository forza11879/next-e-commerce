import { useCallback } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// const queryKeys = {
//   todos: ['todos'],
//   todo: (id) => [...queryKeys.todos, id],
// };
// export const useTodos = () => useQuery(queryKeys.todos, fetchTodos);
// export const useTodo = (id) =>
//   useQuery(queryKeys.todo(id), () => fetchTodo(id));
const baseURL = process.env.api;

async function fetchCategories() {
  console.log(`${baseURL}/category/all`);
  const { data } = await axios.request({
    baseURL,
    url: '/category/all',
    method: 'get',
  });

  return JSON.stringify(data);
}

const queryKeys = {
  categories: ['categories'],
  category: (id) => [...queryKeys.categories, id],
};

export const useQueryCategories = () =>
  useQuery(queryKeys.categories, fetchCategories, {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      // console.log(JSON.parse(data));
      return JSON.parse(data);
    }, []),
    // staleTime: Infinity,
  });

export const useQueryCategory = (id) =>
  useQuery(queryKeys.category(id), () => fetchCategory(id), {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      // console.log(JSON.parse(data));
      return JSON.parse(data);
    }, []),
    // staleTime: Infinity,
  });

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.todos);
    },
  });
};
