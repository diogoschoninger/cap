export const setLoggedUser = (data: any) =>
  localStorage.setItem('sgp', JSON.stringify(data));

export const getLoggedUser = () => localStorage.getItem('sgp');

export const setLogout = () => localStorage.removeItem('sgp');
