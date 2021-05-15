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
  const { sort, order, limit } = body;
  console.log('sort', sort);
  console.log('order', order);
  console.log('limit', limit);

  try {
    const query = {};
    const productList = await Product.find(query)
      .limit(parseInt(limit))
      .populate('category')
      .populate('subcategories')
      .sort([[sort, order]]);

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
  try {
    const product = await Product.findOne(query)
      .populate('category')
      .populate('subcategories')
      .exec();
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

export { create, listProduct, listAllByCountProduct, remove, read, update };
