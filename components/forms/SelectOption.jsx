import axios from 'axios';
import { useQuery } from 'react-query';
import { Select } from 'antd';
import ColumnGroup from 'antd/lib/table/ColumnGroup';

const { Option } = Select;

const baseURL = process.env.api;

async function getSubCategoryListByCategoryId(id) {
  // await new Promise((resolve) => setTimeout(resolve, 300));
  console.log('SelectOption url', `${baseURL}/category/subcategories/${id}`);
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

const SelectOption = ({ setValues, subcategories, category, values }) => {
  const { data, isLoading, isError, error, isFetching } = useQuery(
    ['subCategoryListByCategoryId', category],
    () => getSubCategoryListByCategoryId(category),
    {
      // staleTime: Infinity, // stays in fresh State for ex:1000ms(or Infinity) then turns into Stale State
    }
  );

  return (
    <div>
      <label>Sub Categories</label>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select"
        value={subcategories}
        onChange={(value) => setValues({ ...values, subcategories: value })}
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

export default SelectOption;
