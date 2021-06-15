import { useCallback } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const baseURL = process.env.api;

async function fetchProducts(body) {
  console.log(`${baseURL}/product/all`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/all`,
      method: 'post',
      data: body,
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchProducts error:', error);
  }
}

async function fetchProductsByCount(count) {
  console.log(`${baseURL}/product/all/${count}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/all/${count}`,
      method: 'get',
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchProductsByCount error:', error);
  }
}

async function fetchProduct(slug) {
  console.log(`${baseURL}/product/${slug}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/${slug}`,
      method: 'get',
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchProduct error:', error);
  }
}

async function fetchProductStarByUserId(slug, userId) {
  console.log(`${baseURL}/product/${slug}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/${slug}`,
      method: 'get',
    });

    const existingRatingObject = data.ratings.find(
      (item) => item.postedBy.toString() === userId.toString()
    );

    if (existingRatingObject) {
      data.star = existingRatingObject.star;
    } else {
      data.star = 0;
    }

    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchProductStarByUserId error:', error);
  }
}

async function fetchProductsCount() {
  console.log(`${baseURL}/product/all/total`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/all/total`,
      method: 'get',
    });

    return data;
  } catch (error) {
    console.log('fetchProductsCount error:', error);
  }
}

async function fetchProductRelated(productId) {
  console.log(`${baseURL}/product/related/${productId}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/related/${productId}`,
      method: 'get',
    });
    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchProductRelated error:', error);
  }
}

async function fetchProductsByCategory(slug) {
  console.log(`${baseURL}/product/all/category/${slug}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/product/all/category/${slug}`,
      method: 'get',
    });
    return JSON.stringify(data);
  } catch (error) {
    console.log('fetchProductsByCategory error:', error);
  }
}

// const todoKeys = {
//   all: ['todos'] as const,
//   lists: () => [...todoKeys.all, 'list'] as const,
//   list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
//   details: () => [...todoKeys.all, 'detail'] as const,
//   detail: (id: number) => [...todoKeys.details(), id] as const,
// }

export const productQueryKeys = {
  products: ['product'],
  product: (id) => [...productQueryKeys.products, id],
  productStar: (slug) => [...productQueryKeys.products, 'star', slug],
  productsByNewArrivals: (page) => [
    ...productQueryKeys.products,
    'newArrivals',
    page,
  ],
  productsByBestSellers: (page) => [
    ...productQueryKeys.products,
    'bestSellers',
    page,
  ],
  productsCount: () => [...productQueryKeys.products, 'count'],
  productRelated: (slug) => [...productQueryKeys.products, 'related', slug],
  productsByCategoryId: (id) => [
    ...productQueryKeys.products,
    'byCategoryId',
    id,
  ],
};

// Queries
export const useQueryProducts = (count) =>
  useQuery(productQueryKeys.products, () => fetchProductsByCount(count), {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      // console.log(JSON.parse(data));
      return JSON.parse(data);
    }, []),
    staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
  });

export const useQueryProduct = (slug) =>
  useQuery(productQueryKeys.product(slug), () => fetchProduct(slug), {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      // console.log(JSON.parse(data));
      return JSON.parse(data);
    }, []),
    // staleTime: Infinity,
  });

export const useQueryProductStar = (slug, userId) =>
  useQuery(
    productQueryKeys.productStar(slug),
    () => fetchProductStarByUserId(slug, userId),
    {
      // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
      select: useCallback((data) => {
        // selectors will only be called if data exists, so you don't have to care about undefined here.
        // console.log(JSON.parse(data));
        return JSON.parse(data);
      }, []),
      // staleTime: Infinity,
    }
  );

export const useQueryProductByNewArrivals = (page, body) =>
  useQuery(
    productQueryKeys.productsByNewArrivals(page),
    () => fetchProducts(body),
    {
      // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
      select: useCallback((data) => {
        // selectors will only be called if data exists, so you don't have to care about undefined here.
        // console.log(JSON.parse(data));
        return JSON.parse(data);
      }, []),
      // staleTime: Infinity,
    }
  );

export const useQueryProductByBestSellers = (page, body) =>
  useQuery(
    productQueryKeys.productsByBestSellers(page),
    () => fetchProducts(body),
    {
      // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
      select: useCallback((data) => {
        // selectors will only be called if data exists, so you don't have to care about undefined here.
        // console.log(JSON.parse(data));
        return JSON.parse(data);
      }, []),
      // staleTime: Infinity,
    }
  );

export const useQueryProductsCount = () =>
  useQuery(productQueryKeys.productsCount(), () => fetchProductsCount(), {
    // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
    select: useCallback((data) => {
      // selectors will only be called if data exists, so you don't have to care about undefined here.
      // console.log(JSON.parse(data));
      return JSON.parse(data);
    }, []),
    staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
  });

export const useQueryProductRelated = (slug, productId) =>
  useQuery(
    productQueryKeys.productRelated(slug),
    () => fetchProductRelated(productId),
    {
      // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
      select: useCallback((data) => {
        // selectors will only be called if data exists, so you don't have to care about undefined here.
        // console.log(JSON.parse(data));
        return JSON.parse(data);
      }, []),

      // staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    }
  );

export const useQueryProductsByCategoryId = (id, slug) =>
  useQuery(
    productQueryKeys.productsByCategoryId(id),
    () => fetchProductsByCategory(slug),
    {
      // Selectors like the one bellow will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference
      select: useCallback((data) => {
        // selectors will only be called if data exists, so you don't have to care about undefined here.
        // console.log(JSON.parse(data));
        return JSON.parse(data);
      }, []),
      staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    }
  );

// Mutations
export const useMutationCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ url, method, token, data }) => {
      return await axios.request({
        baseURL,
        url,
        method,
        data,
        headers: { token },
      });
    },
    {
      onMutate: ({ data: { values } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        // queryClient.cancelQueries('productList', { exact: true });
        console.log('values onMutate: ', values);

        // Snapshot the previous value
        // const previousQueryDataArray = queryClient.getQueryData('productList');
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
      onError: (error, variables, rollback) => {
        //   If there is an errror, then we will rollback
        // console.log('CreateCategory onError error: ', error.response.data);
        if (rollback) {
          rollback();
          console.log('rollback');
        }
        if (error) {
          toast.error(error.response.data);
        }
      },
      onSuccess: (
        { data },
        { props: { setValues, initialState } },
        context
      ) => {
        if (data) {
          initialState.images = [];
          setValues((values) => ({ ...values, images: [] }));

          toast.success(`"${data.title}" is created`);
        }
      },
      onSettled: (data, error, variables, context) => {
        if (error) {
          // console.log(
          //   'CreateCategory onSettled error: ',
          //   error.response.data.error
          // );
          toast.error(error.response.data.error);
        }
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        // queryClient.invalidateQueries('productList');
      },
    }
  );
};

export const useMutationRemoveProduct = () => {
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

export const useMutationUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ url, method, token, data }) => {
      return await axios.request({
        baseURL,
        url,
        method,
        data,
        headers: { token },
      });
    },
    {
      onMutate: ({ data: { values } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        queryClient.cancelQueries('products', { exact: true });
        console.log('values onMutate: ', values);

        // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData('products');
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
      onError: (error, variables, rollback) => {
        //   If there is an errror, then we will rollback
        // console.log('CreateCategory onError error: ', error.response.data);
        if (rollback) {
          rollback();
          console.log('rollback');
        }
        if (error) {
          toast.error(error.response.data);
        }
      },
      onSuccess: (
        { data },
        { props: { setValues, initialState } },
        context
      ) => {
        if (data) {
          toast.success(`"${data.title}" is updated`);
        }
      },
      onSettled: (data, error, { props: { router } }, context) => {
        if (error) {
          // console.log(
          //   'CreateCategory onSettled error: ',
          //   error.response.data.error
          // );
          toast.error(error.response.data.error);
        }
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        queryClient.invalidateQueries('products');
        router.push(`/admin/products`);
      },
    }
  );
};

export const useMutationStarProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ url, method, token, data }) => {
      return await axios.request({
        baseURL,
        url,
        method,
        data,
        headers: { token },
      });
    },
    {
      onMutate: ({ data: { star, slug } }) => {
        // Cancel any outgoing refetches (so they don't overwrite(race condition) our optimistic update)
        // console.log({ star });
        // console.log({ slug });
        queryClient.cancelQueries(productQueryKeys.productStar(slug));
        // queryClient.cancelQueries(['productStar', slug]);
        // // // Snapshot the previous value
        const previousQueryDataArray = queryClient.getQueryData([
          'products',
          slug,
        ]);
        queryClient.setQueryData(
          productQueryKeys.productStar(slug),
          (oldQueryData) => {
            const oldQueryDataArray = JSON.parse(oldQueryData);
            oldQueryDataArray.star = star;
            console.log('oldQueryDataArray: ', oldQueryDataArray);
            return JSON.stringify(oldQueryDataArray);
          }
        );
        // // return will pass the function or the value to the onError third argument:
        return () =>
          queryClient.setQueryData(
            productQueryKeys.productStar(slug),
            previousQueryDataArray
          );
      },
      onError: (error, variables, rollback) => {
        //   If there is an errror, then we will rollback
        // console.log('CreateCategory onError error: ', error.response.data);
        if (rollback) {
          rollback();
          console.log('rollback');
        }
        // if (error) {
        //   toast.error(error.response.data);
        // }
      },
      // onSuccess: ({ data }, variables, context) => {
      //   // Runs only there is a success
      //   // saves http trip to the back-end
      //   if (data) {
      //     queryClient.setQueryData('categoryList', (oldQueryData) => {
      //       const oldQueryDataArray = JSON.parse(oldQueryData);
      //       const newQueryDataArray = oldQueryDataArray.filter(
      //         (item) => item.name !== data.name
      //       );
      //       newQueryDataArray.unshift(data);
      //       return JSON.stringify(newQueryDataArray);
      //     });
      //     toast.success(`"${data.name}" is created`);
      //   }
      // },
      onSettled: (data, error, { slug }, context) => {
        // console.log({ slug });
        // if (error) {
        //   // console.log(
        //   //   'CreateCategory onSettled error: ',
        //   //   error.response.data.error
        //   // );
        //   toast.error(error.response.data.error);
        // }
        // Runs on either success or error. It is better to run invalidateQueries
        // onSettled in case there is an error to re-fetch the request
        // it is prefered to invalidateQueries  after using setQueryData inside onSuccess: because you are getting the latest data from the server
        queryClient.invalidateQueries(productQueryKeys.productStar(slug));
      },
    }
  );
};
