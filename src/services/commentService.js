import http from "./httpService";

export const getCommentsApi = () =>
  http.get("/comments").then(({ data }) => data);

export const getCommentApi = (id) =>
  http.get(`/comments/${id}`).then(({ data }) => data);

export const createCommentApi = (data) =>
  http.post("/comments", data).then(({ data }) => data);

export const answerCommentApi = ({ id, body }) =>
  http.post(`/comments/${id}/answer`, { body }).then(({ data }) => data);

export const acceptCommentApi = (id) =>
  http.put(`/comments/${id}/accept`).then(({ data }) => data);

export const rejectCommentApi = (id) =>
  http.put(`/comments/${id}/reject`).then(({ data }) => data);

export const deleteCommentApi = (id) =>
  http.delete(`/comments/${id}`).then(({ data }) => data);
