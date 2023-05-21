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

export const createProductEntry = (
  {name = '', price = '', category_id = '', desc = '', image = ''},
  token,
  controller,
) => {
  const bodyForm = new FormData();
  if (image?.uri && image?.uri !== '') bodyForm.append('image', image);
  bodyForm.append('name', name);
  bodyForm.append('category_id', category_id);
  bodyForm.append('desc', desc);
  bodyForm.append('price', price);

  // const body = {
  //   name,
  //   price,
  //   category_id,
  //   desc,
  //   image,
  // };
  // console.log(image);
  return api.post('/apiv1/products', bodyForm, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    signal: controller.signal,
  });
};

export const editProductEntry = (
  {name = '', price = '', category_id = '', desc = '', image = ''},
  productId,
  token,
  controller,
) => {
  const bodyForm = new FormData();
  if (image?.uri && image?.uri !== '') bodyForm.append('image', image);
  bodyForm.append('name', name);
  bodyForm.append('category_id', category_id);
  bodyForm.append('desc', desc);
  bodyForm.append('price', price);

  // const body = {
  //   name,
  //   price,
  //   category_id,
  //   desc,
  //   image,
  // };
  return api.patch(`/apiv1/products/${productId}`, bodyForm, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    signal: controller.signal,
  });
};

export const deleteProductEntry = (productId, token, controller) => {
  return api.delete(`/apiv1/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: controller.signal,
  });
};
