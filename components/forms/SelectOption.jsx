import { Select } from 'antd';
import { useQuerySubCategoriesByCategoryId } from '@/hooks/query/subcategory';

const { Option } = Select;

const SelectOption = ({
  setValues,
  subcategories,
  category,
  values,
  arrayOfSubs,
  setArrayOfSubs,
}) => {
  const { data } = useQuerySubCategoriesByCategoryId(category);

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
