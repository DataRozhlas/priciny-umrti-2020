import kebabCase from 'lodash/kebabCase';

// TODO error handling

export const getKebabCase = (category) => {
  return category ? category.replace(/\s+/g, '-').toLowerCase() : undefined;
};

export const getCategoryId = (categoryName) => kebabCase(categoryName);

export const getSvgElementId = (type, categoryName) => {
  return type && categoryName ? type + '-' + getCategoryId(categoryName) : undefined;
};
