import axios from 'axios';

import APP_HOST from '@env';

const api = () => {
  return axios.create({
    baseURL: APP_HOST,
    headers: {
      Authorization: `Bearer ${APP_HOST}`,
    },
  });
};

export default api;
