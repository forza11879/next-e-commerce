import {
  create,
  listCategory,
  readCategory,
  update,
  remove,
} from '@/Models/Category/index';
import { cascadeDelete } from '@/Models/SubCategory/index';
import { readByCategory, cascadeUpdate } from '@/Models/Product/index';

export const createController = async (req, res) => {
  try {
    const { name } = req.body;
    // console.log('name: ', name);
    const newCategory = await create(name);
    res.status(201).json(newCategory);

    // res.status(201).json({ category: newCategory });
  } catch (error) {
    console.log('create controller error: ', error);
    res.status(400).json(`Create category failed. ${error}`);
  }
};

export const listController = async (req, res) => {
  try {
    const categoryList = await listCategory();
    res.status(200).json(categoryList);
  } catch (error) {
    console.log('list controller error: ', error);
    res.status(400).json('Fetch list request failed');
  }
};

export const readController = async (req, res) => {
  const { slug } = req.query;
  try {
    const category = await readCategory(slug);
    const products = await readByCategory(category);
    res.status(200).json({ category, products });
  } catch (error) {
    console.log('read controller error: ', error);
    res.status(400).json('reead request failed');
  }
};

export const updateController = async (req, res) => {
  const { name } = req.body;
  const { slug } = req.query;
  try {
    const updated = await update(slug, name);
    // console.log('updated: ', updated);
    res.status(200).json(updated);
  } catch (error) {
    console.log('update controller error: ', error);
    res.status(400).json('Create update failed');
  }
};

export const removeController = async (req, res) => {
  const { slug } = req.query;
  try {
    const deleted = await remove(slug);
    const { _id } = deleted;
    // await cascadeDelete(_id);
    // await cascadeUpdate(_id);
    res.status(200).json({ deleted: deleted });
  } catch (error) {
    console.log('remove controller error: ', error);
    res.status(400).send('Delete request failed');
  }
};
