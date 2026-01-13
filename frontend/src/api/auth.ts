import api from "./axiosClient";

export const loginUser = async (userData: any) => {
  const { data } = await api.post(`/users/login`, userData);
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post(`/users/logout`);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get(`/users/me`);
  return data;
};
