import api from './base';

export const login = ({email, password}, controller) => {
  return api.post(
    '/apiv1/auth/login',
    {email, password, rememberMe: 'true'},
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

export const logout = (token, controller) => {
  return api.delete(`/apiv1/auth/logout`, {
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const getProfile = (token, controller) => {
  return api.get(`/apiv1/userPanel/profile`, {
    headers: {Authorization: `Bearer ${token}`},
    signal: controller.signal,
  });
};

export const editProfile = (
  {
    image = '',
    display_name = '',
    address = '',
    birthdate = '',
    gender = '',
    email = '',
    phone_number = '',
  },
  token,
  controller,
) => {
  const body = new FormData();
  // append
  console.log(image);
  if (image?.uri !== '') {
    body.append('image', image);
  }
  body.append('display_name', display_name);
  body.append('address', address);
  body.append('birthdate', JSON.stringify(birthdate));
  body.append('gender', gender);
  body.append('email', email);
  body.append('phone_number', phone_number);

  // const bodyObj = {
  //   image,
  //   display_name,
  //   address,
  //   birthdate,
  //   gender,
  //   email,
  //   phone_number,
  // };
  return api.patch(`/apiv1/userPanel/profile`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    signal: controller.signal,
  });
};
