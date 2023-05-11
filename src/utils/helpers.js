export const n_f = number => {
  if (!number) return 0;
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const sizeName = size_id => {
  switch (size_id) {
    case '3':
      return 'XL';
    case '2':
      return 'L';
    default:
      return 'R';
  }
};

export const sizeLongName = size_id => {
  switch (size_id) {
    case '3':
      return 'Xtra Large';
    case '2':
      return 'Large';
    default:
      return 'Regular';
  }
};

export const deliveryMethods = [
  {id: '2', name: 'Door delivery', fee: 2500},
  {id: '3', name: 'Pick up at store', fee: 0},
  {id: '1', name: 'Dine in', fee: 0},
];
