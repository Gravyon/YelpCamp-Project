import api from "./axiosClient";

export const getCampgrounds = async (page: number = 1, search: string = "") => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  if (search) params.append("search", search);
  // const { data } = await api.get(`/campgrounds?page=${page}`);
  const { data } = await api.get(`/campgrounds?${params.toString()}`);

  return data;
};

export const getCampgroundById = async (id: String) => {
  const { data } = await api.get(`/campgrounds/${id}`);
  return data;
};

export const createCampground = async (campData: any) => {
  const { data } = await api.post(`/campgrounds`, campData);
  return data;
};

export const updateCampground = async (id: String, payload: any) => {
  const { data } = await api.put(`/campgrounds/${id}`, payload);
  return data;
};

export const deleteCampground = async (id: String) => {
  const { data } = await api.delete(`/campgrounds/${id}`);
  return data;
};
