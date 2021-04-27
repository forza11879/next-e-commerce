import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

const baseURL = process.env.api;

async function getSubCategoryListByCategoryId(id) {
  // await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(`${baseURL}/category/subcategories/${id}`);
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/category/subcategories/${id}`,
      method: 'get',
    });
    console.log('data getSubCategoryListByCategoryId index: ', data);
    return JSON.stringify(data);
  } catch (error) {
    console.log('getSubCategoryListByCategoryId error:', error);
  }
}

// const initialState = {

// };

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching } = useQuery(
    'categoryList',
    getPosts
  );

  const dataList = JSON.parse(data);

  useEffect(() => {
    setValues({ ...values, categories: dataList });

    dataList.map((item) => {
      console.log('useEffect values.categories item.id: ', item._id);
      queryClient.prefetchQuery(
        ['subCategoryListByCategoryId', item._id],
        getSubCategoryListByCategoryId(item._id)
      );
    });
  }, []);

  return <h1>Hello</h1>;
};

export default ProductCreate;
