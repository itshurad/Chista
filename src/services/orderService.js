import http from "./httpService";

export const getOrdersApi = () =>
  http.get("/orders").then(({ data }) => data);

export const getOrderApi = (id) =>
  http.get(`/orders/${id}`).then(({ data }) => data);