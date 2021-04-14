import { QueryCache, useQuery } from 'react-query';

export function useQueryFn(queryKey, queryFn) {
  return useQuery(queryKey, queryFn, {
    // initialData: JSON.parse(categoryList),
    // initialData: () => QueryCache.getQueryData('posts')?.find(post => post.id === postId) //(seeding Initial Query Data from other queries) pooling data aproach vs pushing data(using query data to seed future queries)
    initialStale: true, // as soon as the initial data is mounted it will fetch up to date data
    // staleTime: 1000, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    // refetchOnWindowFocus: false,
    // cacheTime: 5000, //stays for 5000ms in chache(memory - Inactive state) then gets garbage collected
    retry: 2, // number of times it will try to re-fetch the data if it fails
    retryDelay: 1000, // number of 1000ms it will wait between retries
    // enabled: data?.id, //should be used when one query depence on the other one to fetch the data (dependent queries)
    // refetchInterval: 5000, // refetch interval
    // refetchIntervalInBackground: true // refetch interval even if you are not focused on the tab
    // callbacks - (query Side-Effects)
    // onSuccess: (data) => {
    //   // increment()
    // },
    // onError: (error) => {},
    // onSettled: (data, error) => {},
  });
}
