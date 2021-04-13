import { useQuery } from 'react-query';

export function useQueryFn(queryKey, queryFn) {
  return useQuery(queryKey, queryFn, {
    // initialData: JSON.parse(categoryList),
    // initialStale: true,
    staleTime: 100, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    // refetchOnWindowFocus: false,
    cacheTime: 5000, //stays for 5000ms in chache(memory - Inactive state) then gets garbage collected
  });
}
