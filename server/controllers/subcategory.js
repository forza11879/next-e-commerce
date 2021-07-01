import {
  create,
  listSubCategory,
  readSubCategory,
  update,
  remove,
  getSubCategories,
} from '@/Models/SubCategory/index';
import { readBySubCategory } from '@/Models/Product/index';

export const createController = async (req, res) => {
  try {
    const { name, parent } = req.body;
    // console.log('name: ', name);
    const newCategory = await create(name, parent);
    res.status(201).json(newCategory);

    // res.status(201).json({ category: newCategory });
  } catch (error) {
    console.log('create controller error: ', error);
    res.status(400).json(`Create category failed. ${error}`);
  }
};

export const listController = async (req, res) => {
  try {
    const subCategories = await listSubCategory();
    res.status(200).json(subCategories);
  } catch (error) {
    console.log('list controller error: ', error);
    res.status(400).json('Fetch list request failed');
  }
};

export const readController = async (req, res) => {
  const { slug } = req.query;
  try {
    const subcategory = await readSubCategory(slug);
    const products = await readBySubCategory(subcategory);

    res.status(200).json({ subcategory, products });
  } catch (error) {
    console.log('read controller error: ', error);
    res.status(400).json('read request failed');
  }
};

export const updateController = async (req, res) => {
  const { name, parent } = req.body;
  const { slug } = req.query;
  try {
    const updated = await update(slug, name, parent);
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
    res.status(200).json({ deleted: deleted });
  } catch (error) {
    console.log('remove controller error: ', error);
    res.status(400).send('Delete request failed');
  }
};

export const getSubCategoriesController = async (req, res) => {
  const { id } = req.query;
  try {
    const subCategoriesList = await getSubCategories(id);
    res.status(200).json(subCategoriesList);
  } catch (error) {
    console.log('getSubCategoriesController error: ', error);
    res.status(400).send('getSubCategoriesController request failed');
  }
};
