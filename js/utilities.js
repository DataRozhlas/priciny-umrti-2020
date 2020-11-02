// TODO error handling

export const getKebabCase = (category) => {
  return category ? category.replace(/\s+/g, '-').toLowerCase() : undefined
}

export const getSvgElementId = ( type, category ) => {
  return (type && category) ? type + "-" + getKebabCase(category) : undefined
}