import api from './base';

export const getProductById = (product_id, controller) => {
  return api.get(`/apiv1/products/${product_id}`, {signal: controller.signal});
};

export const getProducts = (
  {
    sort = 'asc',
    order_by = '',
    search = '',
    limit = 8,
    page = 1,
    category = '',
  },
  controller,
) => {
  const params = {
    orderBy: order_by,
    sort,
    searchByName: search,
    limit,
    page,
    category,
  };
  return api.get(`/apiv1/products/`, {params, signal: controller.signal});
};

export const getSizePrice = controller => {
  return api.get(`/apiv1/products/prices`, {signal: controller.signal});
};
