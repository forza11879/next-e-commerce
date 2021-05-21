import Product from './Product';
import slugify from 'slugify';

const create = async (values) => {
  // console.log('values: ', values);

  // const {
  //   title,
  //   description,
  //   price,
  //   category,
  //   subcategories,
  //   quantity,
  //   sold,
  //   images,
  //   shipping,
  //   color,
  //   brand,
  // } = values;
  try {
    const newProduct = await Product.create({
      ...values,
      // title,
      slug: slugify(values.title),
      // description,
      // price,
      // category,
      // subcategories,
      // quantity,
      // sold,
      // images,
      // shipping,
      // color,
      // brand,
    });
    // console.log('newProduct: ', newProduct);
    return newProduct;
  } catch (error) {
    console.log('create Product model error : ', error);
  }
};

const listProduct = async (body) => {
  const { sort, order, page } = body;
  const currentPage = parseInt(page) || 1;
  const perPage = 3; // 3

  console.log('sort', sort);
  console.log('order', order);
  console.log('page', page);

  try {
    const query = {};
    const productList = await Product.find(query)
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subcategories')
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    return productList;
  } catch (error) {
    console.log('product list model error: ', error);
  }
};

const listAllByCountProduct = async (count) => {
  const query = {};
  try {
    const productAllList = await Product.find(query)
      .limit(parseInt(count))
      .populate('category')
      .populate('subcategories')
      .sort([['createdAt', 'desc']])
      .exec();
    return productAllList;
  } catch (error) {
    console.log('product model listAllByCountProduct error: ', error);
  }
};

const remove = async (slug) => {
  const query = { slug };
  try {
    const deleted = await Product.findOneAndRemove(query);
    return deleted;
  } catch (error) {
    console.log('product model remove error: ', error);
  }
};

const read = async (slug) => {
  const query = { slug: slug };
  console.log({ slug });
  try {
    const product = await Product.findOne(query)
      .populate('category')
      .populate('subcategories')
      .exec();
    console.log({ product });

    return product;
  } catch (error) {
    console.log('product model read error: ', error);
  }
};

const update = async (values, slug) => {
  const { title } = values;

  if (title) {
    values.slug = slugify(title);
  }

  const query = { slug: slug };
  const update = values;
  const options = { new: true };

  try {
    const updated = await Product.findOneAndUpdate(query, update, options);
    return updated;
  } catch (error) {
    console.log('product model update error: ', error);
  }
};

const productsCount = async () => {
  const query = {};
  try {
    const total = await Product.find(query).estimatedDocumentCount();
    return total;
  } catch (error) {
    console.log('product model productsCount error: ', error);
  }
};

const productById = async (productId) => {
  const query = { _id: productId };
  try {
    const product = await Product.findById(query);
    return product;
  } catch (error) {
    console.log('product model productStar error: ', error);
  }
};

const addRating = async (product, user, star) => {
  const query = { _id: product._id };
  const update = {
    $push: { ratings: { star: star, postedBy: user._id } },
  };
  const option = { new: true };
  try {
    const ratingAdded = await Product.findByIdAndUpdate(query, update, option);
    return ratingAdded;
  } catch (error) {
    console.log('product model addRating error: ', error);
  }
};

const updateRating = async (existingRatingObject, star) => {
  const query = {
    ratings: { $elemMatch: existingRatingObject },
  };
  const update = { $set: { 'ratings.$.star': star } };
  const option = { new: true };
  try {
    const ratingUpdated = await Product.updateOne(query, update, option);
    return ratingUpdated;
  } catch (error) {
    console.log('product model updateRating error: ', error);
  }
};

export {
  create,
  listProduct,
  listAllByCountProduct,
  remove,
  read,
  update,
  productsCount,
  productById,
  addRating,
  updateRating,
};
