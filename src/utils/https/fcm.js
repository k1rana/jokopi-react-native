import api from './base';

export const linkFcm = (fcm_token, token, controller) => {
  return api.post(
    '/apiv1/auth/link-fcm',
    {
      token: fcm_token,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    },
  );
};

export const unlinkFcm = (fcm_token, token, controller) => {
  return api.delete('/apiv1/auth/unlink-fcm', {
    data: {
      token: fcm_token,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: controller.signal,
  });
};
