import api from './base';

export const getMonthlyReport = (token, controller) => {
  return api.get('/apiv1/adminPanel/monthlyReport', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: controller.signal,
  });
};

export const getDailyAverage = (token, controller) => {
  return api.get('/apiv1/adminPanel/dailyAverage', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: controller.signal,
  });
};
