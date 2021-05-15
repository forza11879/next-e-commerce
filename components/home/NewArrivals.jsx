import ProductCard from '@/components/cards/ProductCard';
import LoadingCard from '@/components/cards/LoadingCard';

const NewArrivals = ({ newArrivalsQuery, count }) => {
  const newArrivalsList = JSON.parse(newArrivalsQuery.data);

  return (
    <>
      <div className="container">
        {newArrivalsQuery.isLoading ? (
          <LoadingCard count={count} />
        ) : (
          <div className="row">
            {newArrivalsList.map((item) => (
              <div key={item._id} className="col-md-4">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NewArrivals;
