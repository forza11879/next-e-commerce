import ProductCard from '@/components/cards/ProductCard';
import LoadingCard from '@/components/cards/LoadingCard';

const BestSellers = ({ bestSellersQuery, count }) => {
  return (
    <>
      <div className="container">
        {bestSellersQuery.isLoading ? (
          <LoadingCard count={count} />
        ) : (
          <div className="row">
            {bestSellersQuery.data.map((item) => (
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

export default BestSellers;
