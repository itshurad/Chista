import http from "./httpService";

export const COURSES_ENDPOINT = "/courses";

// ======================================================
// Courses
// ======================================================

export const getCoursesApi = (options = {}) =>
  http.get(COURSES_ENDPOINT, options).then(({ data }) => data);

export const getCourseApi = (href, options = {}) =>
  http.get(`${COURSES_ENDPOINT}/${href}`, options).then(({ data }) => data);

export const getCoursesByMenuApi = (menu, options = {}) =>
  http
    .get(`${COURSES_ENDPOINT}/${menu}/list`, options)
    .then(({ data }) => data);

export const getCourseByIdApi = (id, options = {}) =>
  http.get(`${COURSES_ENDPOINT}/admin/${id}`, options).then(({ data }) => data);

export const createCourseApi = (formData) =>
  http.post(COURSES_ENDPOINT, formData).then(({ data }) => data);

export const updateCourseApi = ({ id, formData }) =>
  http.put(`${COURSES_ENDPOINT}/${id}`, formData).then(({ data }) => data);

export const deleteCourseApi = (id) =>
  http.delete(`${COURSES_ENDPOINT}/${id}`).then(({ data }) => data);

// ======================================================
// Sessions
// ======================================================

export const getSessionsApi = (options = {}) =>
  http.get(`${COURSES_ENDPOINT}/sessions`, options).then(({ data }) => data);

export const getSessionApi = (id, options = {}) =>
  http
    .get(`${COURSES_ENDPOINT}/sessions/${id}`, options)
    .then(({ data }) => data);

export const createSessionApi = ({ courseId, formData }) =>
  http
    .post(`${COURSES_ENDPOINT}/${courseId}/sessions`, formData)
    .then(({ data }) => data);

export const deleteSessionApi = (id) =>
  http.delete(`${COURSES_ENDPOINT}/sessions/${id}`).then(({ data }) => data);

export const getCourseSessionsApi = ({ courseId, href, options = {} }) =>
  http
    .get(`${COURSES_ENDPOINT}/${href}/${courseId}`, options)
    .then(({ data }) => data);

// ======================================================
// Course Registration
// ======================================================

export const registerCourseApi = ({ courseId, price }) =>
  http
    .post(`${COURSES_ENDPOINT}/${courseId}/register`, {
      price,
    })
    .then(({ data }) => data);
