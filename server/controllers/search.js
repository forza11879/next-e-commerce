import {
  handleQuery,
  handlePrice,
  handleCategory,
  handleStar,
  handleSub,
} from '@/Models/Product/index';

export const searchFiltersController = async (req, res) => {
  try {
    const { query, price, category, stars, subcategory } = req.body;
    if (query) {
      console.log('query --->', query);
      await handleQuery(req, res, query);
    }

    // price [20, 200]
    if (price !== undefined) {
      console.log('price ---> ', price);
      await handlePrice(req, res, price);
    }

    if (category) {
      console.log('category ---> ', category);
      await handleCategory(req, res, category);
    }

    if (stars) {
      console.log('stars ---> ', stars);
      await handleStar(req, res, stars);
    }

    if (subcategory) {
      console.log('subcategory ---> ', subcategory);
      await handleSub(req, res, subcategory);
    }
  } catch (error) {
    console.log('product searchFiltersController controller error: ', error);
  }
};
