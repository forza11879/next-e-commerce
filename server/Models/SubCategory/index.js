import SubCategory from './SubCategory';
import slugify from 'slugify';

const create = async (name, parent) => {
  // try {
  const newSubCategory = await SubCategory.create({
    name: name,
    parent: parent,
    slug: slugify(name),
  });
  // console.log('newSubCategory: ', newSubCategory);
  return newSubCategory;
  // } catch (error) {
  //   console.log('create model error SubCategory: ', error);
  // }
};

const listSubCategory = async () => {
  try {
    const query = {};
    const subCategoryList = await SubCategory.find(query).sort({
      createdAt: -1,
    });
    return subCategoryList;
  } catch (error) {
    console.log('list model error SubCategory: ', error);
  }
};

const readSubCategory = async (slug) => {
  try {
    const query = { slug: slug };
    const subCategory = await SubCategory.findOne(query);
    return subCategory;
  } catch (error) {
    console.log('read model error subCategory: ', error);
  }
};

const update = async (slug, name, parent) => {
  const query = { slug };
  const update = { name: name, parent: parent, slug: slugify(name) };
  const options = { new: true };
  // try {
  const updated = await SubCategory.findOneAndUpdate(query, update, options);
  return updated;
  // } catch (error) {
  //   console.log('update model error subCategory: ', error);
  // }
};

const remove = async (slug) => {
  const query = { slug: slug };
  const options = {};
  try {
    const deleted = await SubCategory.findOneAndDelete(query, options);
    return deleted;
  } catch (error) {
    console.log('remove model error subCategory: ', error);
  }
};

const getSubCategories = async (id) => {
  const query = { parent: id };
  // console.log('getSubCategories id', id);
  try {
    const subCategoriesList = await SubCategory.find(query);
    return subCategoriesList;
  } catch (error) {
    console.log('SubCategories model getSubCategories error: ', error);
  }
};

const cascadeDelete = async function (id) {
  try {
    const filter = { parent: id };
    await SubCategory.deleteMany(filter);
  } catch (err) {
    console.log(`deleteMany error: ${err}`);
  }
};

export {
  create,
  listSubCategory,
  readSubCategory,
  update,
  remove,
  getSubCategories,
  cascadeDelete,
};
