import api from './base';

export const login = ({email, password}, controller) => {
  return api.post(
    '/apiv1/auth/login',
    {email, password, rememberMe: true},
    {signal: controller.signal},
  );
};

export const register = ({email, password, phone_number}, controller) => {
  const body = {email, password, phone_number};
  return api.post('/apiv1/auth/register', body, {signal: controller.signal});
};

export const requestResetPass = (email, controller) => {
  return api.post(
    '/apiv1/auth/forgotPass/',
    {email},
    {signal: controller.signal},
  );
};

export const getProfile = (token, controller) => {
  return api.get(`/apiv1/userPanel/profile`, {
    headers: {Authorization: `Bearer ${token}`},
    signal: controller.signal,
  });
};
