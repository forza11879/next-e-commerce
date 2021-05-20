import { Pagination } from 'antd';
import ProductCard from '@/components/cards/ProductCard';
import LoadingCard from '@/components/cards/LoadingCard';

const BestSellers = ({
  productsCountQuery,
  bestSellersQuery,
  count,
  page,
  setPage,
}) => {
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
      <div className="row">
        <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
          <Pagination
            current={page}
            total={(productsCountQuery.data / 3) * 10}
            onChange={(value) => setPage(value)}
          />
        </nav>
      </div>
    </>
  );
};

export default BestSellers;
