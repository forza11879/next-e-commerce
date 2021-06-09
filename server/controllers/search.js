import { handleSearchQuery } from '@/Models/Product/index';

export const searchFiltersController = async (req, res) => {
  try {
    const { query } = req.body;
    // console.log('req.body: ', req.body);
    console.log('query: ', query);

    if (query) {
      console.log('query', query);
      await handleSearchQuery(req, res, query);
    }
  } catch (error) {
    console.log('product searchFiltersController controller error: ', error);
  }
};
