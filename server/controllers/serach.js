import { handleSearchQuery } from '@/Models/Product/index';

export const searchFiltersController = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) return;
    console.log('query', query);
    const products = await handleSearchQuery(req, res, query);
    res.status(200).json(products);
  } catch (error) {
    console.log('product searchFiltersController controller error: ', error);
  }
};
