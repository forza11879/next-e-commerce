import Link from 'next/link';

const CategoryList = ({ categories }) => {
  const showCategories = () =>
    categories.data.map((item) => (
      <div
        key={item._id}
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
      >
        <Link href={`/category/${item.slug}`}>{item.name}</Link>
      </div>
    ));

  return (
    <div className="container">
      <div className="row">
        {categories.isLoading ? (
          <h4 className="text-center">Loading...</h4>
        ) : (
          showCategories()
        )}
      </div>
    </div>
  );
};

export default CategoryList;
