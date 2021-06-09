import { Select } from 'antd';
import { useQuerySubCategoriesByCategoryId } from '@/hooks/query/subcategory';

const { Option } = Select;

const SelectOptionUpdate = ({
  selectedCategory,
  arrayOfSubs,
  setArrayOfSubs,
}) => {
  const { data } = useQuerySubCategoriesByCategoryId(selectedCategory);

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
