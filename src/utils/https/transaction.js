import api from './base';

export const createTransaction = (
  {payment_id = 1, delivery_id = 1, status_id = 3},
  products = [],
  controller,
) => {
  const body = {
    payment_id,
    delivery_id,
    status_id,
    products,
  };
  return api.post(`/apiv1/transactions`, body, {signal: controller.signal});
};
