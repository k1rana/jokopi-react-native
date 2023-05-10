import api from './base';

export const getProductById = (product_id, controller) => {
  return api.get(`/apiv1/products/${product_id}`, {signal: controller.signal});
};

export const getProducts = (
  {
    orderBy = 'id',
    sort = 'asc',
    searchByName = '',
    limit = 8,
    page = 1,
    category = '',
  },
  controller,
) => {
  const params = {
    orderBy,
    sort,
    searchByName,
    limit,
    page,
    category,
  };
  return api.get(`/apiv1/products/`, {params, signal: controller.signal});
};

export const getSizePrice = controller => {
  return api.get(`/apiv1/products/prices`, {signal: controller.signal});
};
