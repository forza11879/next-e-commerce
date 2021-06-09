import { handleQuery, handlePrice } from '@/Models/Product/index';

export const searchFiltersController = async (req, res) => {
  try {
    const { query, price } = req.body;
    if (query) {
      console.log('query', query);
      await handleQuery(req, res, query);
    }

    // price [20, 200]
    if (price !== undefined) {
      console.log('price ---> ', price);
      await handlePrice(req, res, price);
    }
  } catch (error) {
    console.log('product searchFiltersController controller error: ', error);
  }
};
