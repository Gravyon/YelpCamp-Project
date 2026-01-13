import api from "./axiosClient";
export const createReview = async (campgroundId: string, reviewData: any) => {
  const { data } = await api.post(`/campgrounds/${campgroundId}/reviews`, {
    review: reviewData,
  });
  return data;
};

export const deleteReview = async (campgroundId: string, reviewId: string) => {
  const { data } = await api.delete(
    `/campgrounds/${campgroundId}/reviews/${reviewId}`
  );
  return data;
};
