import http from "./httpService";

// فقط Department هایی که parent = null هستند
export const getDepartmentsApi = () =>
  http.get("/departments").then(({ data }) => data);

// Get one department
// برای Main یا Sub Department
export const getDepartmentApi = (id) =>
  http.get(`/departments/${id}`).then(({ data }) => data);

// Get sub departments of a main department
export const getDepartmentSubsApi = (id) =>
  http.get(`/departments/${id}/subs`).then(({ data }) => data);

// Get all sub departments
export const getDepartmentSubsApiAll = () =>
  http.get("/departments/departments-subs").then(({ data }) => data);

// Get all departments
// شامل Main و Sub
export const getAllDepartmentsInPanelApi = () =>
  http.get("/departments/panel-departments").then(({ data }) => data);

// Get one department for panel
// برای Main یا Sub
export const getDepartmentInPanelApi = (id) =>
  http.get(`/departments/panel-department/${id}`).then(({ data }) => data);

// Create department
//
// Main:
// { title: "IT" }
//
// Sub:
// { title: "Software", parent: "MAIN_DEPARTMENT_ID" }
export const createDepartmentApi = (data) =>
  http.post("/departments", data).then(({ data }) => data);

// Update department
//
// Main:
// { title: "IT" }
//
// Sub:
// { title: "Software", parent: "MAIN_DEPARTMENT_ID" }
export const updateDepartmentApi = ({ id, data }) =>
  http.put(`/departments/${id}`, data).then(({ data }) => data);

// Delete department
export const deleteDepartmentApi = (id) =>
  http.delete(`/departments/${id}`).then(({ data }) => data);
