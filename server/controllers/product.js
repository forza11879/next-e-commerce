import {
  create,
  listProduct,
  listAllByCountProduct,
  remove,
} from '@/Models/Product/index';

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
  try {
    const productList = await listProduct();
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
  console.log({ slug });
  try {
    const deleted = await remove(slug);
    res.status(200).json(deleted);
  } catch (error) {
    console.log('product remove controller error: ', error);
    res.status(400).json('Fetch product remove request failed');
  }
};
