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
    console.log('newProduct: ', newProduct);
    return newProduct;
  } catch (error) {
    console.log('create Product model error : ', error);
  }
};

const listProduct = async () => {
  try {
    const query = {};
    const productList = await Product.find(query).sort({ createdAt: -1 });
    return productList;
  } catch (error) {
    console.log('product list model error: ', error);
  }
};

export { create, listProduct };
