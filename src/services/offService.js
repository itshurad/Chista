import http from "./httpService";

// Get all discount codes
export const getOffsApi = () =>
  http.get("/offs").then(({ data }) => data);

// Create discount code
export const createOffApi = (data) =>
  http.post("/offs", data).then(({ data }) => data);

// Set discount on all courses
export const setDiscountOnAllApi = (discount) =>
  http
    .post("/offs/all", { discount })
    .then(({ data }) => data);

// Get one discount code
export const getOffApi = ({ code, course }) =>
  http
    .get(`/offs/${code}`, {
      data: {
        course,
      },
    })
    .then(({ data }) => data);

// Delete discount code
export const deleteOffApi = (id) =>
  http.delete(`/offs/${id}`).then(({ data }) => data);