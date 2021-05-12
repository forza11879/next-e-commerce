import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Select } from 'antd';

const { Option } = Select;

const baseURL = process.env.api;

async function getSubCategoryListByCategoryId(id) {
  try {
    const { data } = await axios.request({
      baseURL,
      url: `/category/subcategories/${id}`,
      method: 'get',
    });
    return data;
  } catch (error) {
    console.log('getSubCategoryListByCategoryId error:', error);
  }
}

const SelectOptionUpdate = ({
  selectedCategory,
  arrayOfSubs,
  setArrayOfSubs,
}) => {
  const { data, isLoading, isError, error, isFetching } = useQuery(
    ['subCategoryListByCategoryIdUpdate', selectedCategory],
    () => getSubCategoryListByCategoryId(selectedCategory)
  );

  return (
    <div>
      <label>Sub Categories</label>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select"
        value={arrayOfSubs}
        onChange={(value) => setArrayOfSubs(value)}
      >
        {data &&
          data.map((item) => (
            <Option key={item._id} value={item._id}>
              {item.name}
            </Option>
          ))}
      </Select>
    </div>
  );
};

export default SelectOptionUpdate;
