import api from './base';

export const login = () => {
  return api.post('/auth/login');
};

export const register = ({email, password, phone_number}, controller) => {
  const body = {email, password, phone_number};
  return api.post('/apiv1/auth/register', body, {signal: controller.signal});
};

export const requestResetPass = () => {
  return api.post('/auth/login');
};
