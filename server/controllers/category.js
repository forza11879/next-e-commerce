import { create, list, read, update, remove } from '@/Models/Category/index';

export const createController = async (req, res) => {
  try {
    const { name } = req.body;
    console.log('name: ', name);
    const newCategory = await create(name, req, res);
    res.status(201).json(newCategory);

    // res.status(201).json({ category: newCategory });
  } catch (error) {
    console.log('create controller error: ', error);
    res.status(400).json(`Create category failed. ${error}`);
  }
};

export const listController = async (req, res) => {
  try {
    const categoryList = await list();
    res.status(200).json(categoryList);
  } catch (error) {
    console.log('list controller error: ', error);
    res.status(400).json('Fetch list request failed');
  }
};

export const readController = async (req, res) => {
  const { slug } = req.query;
  try {
    const category = await read(slug);
    res.status(200).json({ category: category });
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
    res.status(200).json({ updated: updated });
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
