import { create, listProduct } from '@/Models/Product/index';

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
