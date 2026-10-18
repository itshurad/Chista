import http from "./httpService";

export const getMenusApi = () => http.get("/menus").then(({ data }) => data);
export const getMenuApi = (id) =>
  http.get(`/menus/${id}`).then(({ data }) => data);
export const createMenuApi = (data) =>
  http.post("/menus", data).then(({ data }) => data);
export const updateMenuApi = ({ id, data }) =>
  http.put(`/menus/${id}`, data).then(({ data }) => data);
export const deleteMenuApi = (id) =>
  http.delete(`/menus/${id}`).then(({ data }) => data);

export const getAllInPanel = () =>
  http.get("/menus/all").then(({ data }) => data);
