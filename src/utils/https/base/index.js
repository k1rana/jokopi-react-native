import axios from 'axios';

import {APP_HOST} from '@env';

const api = axios.create({
  baseURL: APP_HOST,
});

export default api;
