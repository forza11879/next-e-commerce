import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import { getTextQuery, selectSearch } from '@/store/search';

const Search = () => {
  const dispatch = useDispatch();
  const { text } = useSelector(selectSearch);

  const router = useRouter();

  const handleChange = (e) => {
    dispatch(getTextQuery(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/shop?${text}`);
  };

  return (
    <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        type="search"
        value={text}
        className="form-control mr-sm-2"
        placeholder="Search"
      />
      <SearchOutlined onClick={handleSubmit} style={{ cursor: 'pointer' }} />
    </form>
  );
};

export default Search;
