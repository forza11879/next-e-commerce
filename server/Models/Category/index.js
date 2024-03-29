import Category from './Category';
import slugify from 'slugify';
import SubCategory from '@/Models/SubCategory/SubCategory';

const create = async (name) => {
  console.log('name: ', name);
  // try {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name),
  });
  // console.log('newCategory: ', newCategory);
  return newCategory;
  // } catch (error) {
  //   console.log('create model error: ', error);
  // }
};

const listCategory = async () => {
  try {
    const query = {};
    const categoryList = await Category.find(query).sort({ createdAt: -1 });
    return categoryList;
  } catch (error) {
    console.log('list model error: ', error);
  }
};

const readCategory = async (slug) => {
  try {
    const query = { slug: slug };
    const category = await Category.findOne(query);
    return category;
  } catch (error) {
    console.log('read model error: ', error);
  }
};

const update = async (slug, name) => {
  const query = { slug };
  const update = { name: name, slug: slugify(name) };
  const options = { new: true };
  try {
    const updated = await Category.findOneAndUpdate(query, update, options);
    return updated;
  } catch (error) {
    console.log('update model error: ', error);
  }
};

const remove = async (slug) => {
  const query = { slug: slug };
  const options = {};
  try {
    const deleted = await Category.findOneAndDelete(query, options);
    return deleted;
  } catch (error) {
    console.log('remove model error: ', error);
  }
};

export { create, listCategory, readCategory, update, remove };
