import {
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
} from '@/Models/Product/index';
import { currentUser } from '@/Models/User/index';

export const createController = async (req, res) => {
  try {
    const { values } = req.body;
    const newProduct = await create(values);
    res.status(201).json(newProduct);
  } catch (error) {
    console.log('Create product controller error: ', error);
    res.status(400).json(`Create product failed. ${error}`);
  }
};

export const listController = async (req, res) => {
  // const { body } = req;
  console.log('req.body', req.body);
  try {
    const productList = await listProduct(req.body);
    res.status(200).json(productList);
  } catch (error) {
    console.log('product List controller error: ', error);
    res.status(400).json('Fetch product list request failed');
  }
};

export const listAllController = async (req, res) => {
  const { count } = req.query;

  try {
    const productAllList = await listAllByCountProduct(count);
    res.status(200).json(productAllList);
  } catch (error) {
    console.log('product List controller error: ', error);
    res.status(400).json('Fetch product list request failed');
  }
};

export const removeController = async (req, res) => {
  const { slug } = req.query;
  // console.log({ slug });
  try {
    const deleted = await remove(slug);
    res.status(200).json(deleted);
  } catch (error) {
    console.log('product remove controller error: ', error);
    res.status(400).json('Fetch product remove request failed');
  }
};

export const readController = async (req, res) => {
  const { slug } = req.query;
  console.log({ slug });
  try {
    const product = await read(slug);
    res.status(200).json(product);
  } catch (error) {
    console.log('product read controller error: ', error);
    res.status(400).json('Fetch product read request failed');
  }
};

export const updateController = async (req, res) => {
  const { values } = req.body;
  const { slug } = req.query;
  try {
    const updated = await update(values, slug);
    res.status(200).json(updated);
  } catch (error) {
    console.log('product update controller error: ', error);
    res.status(400).json('Fetch product update request failed');
  }
};

export const productsCountController = async (req, res) => {
  try {
    const total = await productsCount();
    res.status(200).json(total);
  } catch (error) {
    console.log('product productsCount controller error: ', error);
    res.status(400).json('Fetch product productsCount request failed');
  }
};

export const productStarController = async (req, res) => {
  const { productId } = req.query;
  const { email } = req.user;
  const { star } = req.body;

  console.log({ productId });
  console.log({ email });
  console.log({ star });

  try {
    const product = await productById(productId);
    const user = await currentUser(email);

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    const existingRatingObject = product.ratings.find(
      (item) => item.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
      const ratingAdded = await addRating(product, user, star);
      console.log('ratingAdded', ratingAdded);
      res.status(200).json(ratingAdded);
    } else {
      // if user have already left rating, update it
      const ratingUpdated = await updateRating(existingRatingObject, star);

      console.log('ratingUpdated', ratingUpdated);
      res.status(200).json(ratingUpdated);
    }
  } catch (error) {
    console.log('product productStar controller error: ', error);
    res.status(400).json('Fetch product productStar request failed');
  }
};
