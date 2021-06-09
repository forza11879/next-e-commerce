import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import ProductCard from '@/components/cards/ProductCard';
import { useQueryProducts } from '@/hooks/query/product';
import { selectSearch } from '@/store/search';

// function fetchProductsByFilter(text){}

const Shop = ({ count }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { text } = useSelector(selectSearch);

  const productsQuery = useQueryProducts(count);

  useEffect(() => {
    setProducts(productsQuery.data);
    setLoading(false);
  }, []);

  const queryClient = useQueryClient();

  useEffect(() => {
    const delayed = setTimeout(() => {
      queryClient.prefetchQuery(['searchText'], async () => {
        if (text) {
          const data = await fetchProductsByFilter(text);
          setProducts(data);
          setLoading(false);
          return data;
        }
      });
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">search/filter menu</div>

        <div className="col-md-9">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {products.map((item) => (
              <div key={item._id} className="col-md-4 mt-3">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// async function getServerSideProps(context) {}

export default Shop;
