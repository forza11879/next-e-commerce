import Link from 'next/link';
// import { getSubs } from '../../functions/sub';

// export const getSubs = async () =>
//   await axios.get(`${process.env.REACT_APP_API}/subs`);

const SubCategoryList = ({ subcategories }) => {
  const showSubCategories = () =>
    subcategories.data.map((item) => (
      <div
        key={item._id}
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
      >
        <Link href={`/subcategory/${item.slug}`}>{item.name}</Link>
      </div>
    ));

  return (
    <div className="container">
      <div className="row">
        {subcategories.isLoading ? (
          <h4 className="text-center">Loading...</h4>
        ) : (
          showSubCategories()
        )}
      </div>
    </div>
  );
};

export default SubCategoryList;
