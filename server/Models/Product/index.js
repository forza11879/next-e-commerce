import mongoose from 'mongoose';
// const { ObjectId } = mongoose.Schema;
import Product from './Product';
import slugify from 'slugify';
const temp = new Product();

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
    // https://stackoverflow.com/questions/67677767/deep-copy-of-the-object-to-add-a-key-value/67677884#67677884
    const product = await Product.findOne(query)
      .lean() // https://mongoosejs.com/docs/tutorials/lean.html
      .populate('category')
      .populate('subcategories');

    // console.log({ product });

    return product;
  } catch (error) {
    console.log('product model read error: ', error);
  }
};

const readByCategory = async (category) => {
  try {
    const query = { category };
    const products = await Product.find(query).populate('category');
    return products;
  } catch (error) {
    console.log('product model readByCategory error: ', error);
  }
};

const readBySubCategory = async (subcategory) => {
  try {
    const query = { subcategories: subcategory };
    const products = await Product.find(query).populate('category');
    return products;
  } catch (error) {
    console.log('product model readByCategory error: ', error);
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
    console.log('productById: ', product);
    return product;
  } catch (error) {
    console.log('product model productStar error: ', error);
  }
};

const addRating = async (productId, userId, star) => {
  const query = { _id: productId };
  const update = {
    $push: { ratings: { star: star, postedBy: userId } },
  };
  const option = { new: true };
  try {
    const ratingAdded = await Product.findByIdAndUpdate(query, update, option);
    return ratingAdded;
  } catch (error) {
    console.log('product model addRating error: ', error);
  }
};

const updateRating = async (userId, star, productId) => {
  console.log({ userId });
  console.log({ productId });

  const query = { _id: productId };
  const update = { $set: { 'ratings.$.star': star } };
  const option = { new: true };
  try {
    const ratingUpdated = await Product.findOneAndUpdate(query, update, option)
      .where('ratings')
      .elemMatch({ postedBy: userId });
    // ratingUpdated.save();
    return ratingUpdated;
  } catch (error) {
    console.log('product model updateRating error: ', error);
  }
};

const cascadeUpdate = async (productId, categoryId) => {
  console.log({ categoryId });
  console.log({ productId });

  const query = { _id: productId };
  // https://stackoverflow.com/questions/5890898/confused-as-to-how-pullall-works-in-mongodb
  const update = { $pullAll: { category: [categoryId] } };
  const option = { new: true };
  try {
    const productUpdated = await Product.findOneAndUpdate(query, update, option)
      .where('category')
      .elemMatch({ _id: categoryId });
    // ratingUpdated.save();
    return productUpdated;
  } catch (error) {
    console.log('product model cascadeUpdate error: ', error);
  }
};

const calculateAvgRating = async (id) => {
  try {
    const stats = await Product.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $addFields: {
          avgRating: {
            $avg: '$ratings.star',
          },
          nRatings: {
            $size: '$ratings',
          },
        },
      },
      {
        $merge: {
          into: 'products',
          // on: ['string'],
          whenMatched: 'replace',
          whenNotMatched: 'insert',
        },
      },
    ]);
    // console.log('stats: ', stats);
  } catch (error) {
    console.log(`calculateAvgRating error: ${error}`);
  }
};

const relatedProduct = async (product) => {
  const query = {
    _id: { $ne: product._id },
    category: product.category,
  };
  try {
    const related = await Product.find(query)
      // .lean()
      .limit(3)
      .populate('category')
      .populate('subcategories')
      .populate('postedBy')
      .exec();
    console.log('related back-end: ', related);
    return related;
  } catch (error) {
    console.log(`relatedProduct error: ${error}`);
  }
};

const handleQuery = async (req, res, text) => {
  const query = { $text: { $search: text } };
  try {
    const products = await Product.find(query)
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.status(200).json(products);
  } catch (error) {
    console.log(`handleQuery error: ${error}`);
  }
};

const handlePrice = async (req, res, price) => {
  console.log('price[0]: ', price[0]);
  console.log('price[1]: ', price[1]);

  const query = {
    price: {
      $gte: price[0],
      $lte: price[1],
    },
  };
  try {
    const products = await Product.find(query)
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name')
      .exec();
    console.log({ products });

    res.status(200).json(products);
  } catch (error) {
    console.log(`handlePrice error: ${error}`);
  }
};

const handleCategory = async (req, res, category) => {
  const query = { category };
  try {
    let products = await Product.find(query)
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.json(products);
  } catch (error) {
    console.log(`handleCategory error: ${error}`);
  }
};

const handleStar = async (req, res, stars) => {
  try {
    const result = await Product.aggregate([
      {
        $project: {
          document: '$$ROOT', // allows to access each field in the document
          // title: "$title",
          floorAverage: {
            $floor: { $avg: '$ratings.star' }, // floor value of 3.33 will be 3
          },
        },
      },
      { $match: { floorAverage: stars } },
    ]).limit(12);

    console.log({ result });

    const products = await Product.find({ _id: result })
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name');

    res.status(200).json(products);
  } catch (error) {
    console.log(`handleStar error: ${error}`);
  }
};

const handleSub = async (req, res, subcategory) => {
  const query = { subcategories: subcategory };
  try {
    const products = await Product.find(query)
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.status(200).json(products);
  } catch (error) {
    console.log(`handleSub error: ${error}`);
  }
};

const handleShipping = async (req, res, shipping) => {
  const query = { shipping };
  try {
    const products = await Product.find(query)
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.status(200).json(products);
  } catch (error) {
    console.log(`handleShipping error: ${error}`);
  }
};

const handleColor = async (req, res, color) => {
  const query = { color };
  try {
    const products = await Product.find(query)
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.status(200).json(products);
  } catch (error) {
    console.log(`handleColor error: ${error}`);
  }
};

const handleBrand = async (req, res, brand) => {
  const query = { brand };
  try {
    const products = await Product.find(query)
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.status(200).json(products);
  } catch (error) {
    console.log(`handleBrand error: ${error}`);
  }
};

const productBrand = () => {
  try {
    // const temp = new Product();
    const brands = temp.schema.path('brand').enumValues;
    return brands;
  } catch (error) {
    console.log(`productBrand error: ${error}`);
  }
};

const productColor = () => {
  try {
    // const temp = new Product();
    const colors = temp.schema.path('color').enumValues;
    return colors;
  } catch (error) {
    console.log(`productColor error: ${error}`);
  }
};

export {
  create,
  listProduct,
  listAllByCountProduct,
  remove,
  read,
  readByCategory,
  readBySubCategory,
  update,
  productsCount,
  productById,
  addRating,
  updateRating,
  calculateAvgRating,
  cascadeUpdate,
  relatedProduct,
  handleQuery,
  handlePrice,
  handleCategory,
  handleStar,
  handleSub,
  handleShipping,
  handleColor,
  handleBrand,
  productBrand,
  productColor,
};
