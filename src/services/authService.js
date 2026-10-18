import http from "./httpService";

// =========================
// Auth
// =========================

export async function registerApi(data) {
  const response = await http.post("/auth/register", data);
  return response.data;
}

export async function loginApi(data) {
  const response = await http.post("/auth/login", data);
  return response.data;
}

export async function logoutApi() {
  const response = await http.post("/auth/logout");
  return response.data;
}

// =========================
// Profile
// =========================

export async function getProfileApi() {
  const response = await http.get("/auth/me");
  return response.data;
}

// =========================
// Users
// =========================

export async function getUsersApi() {
  const response = await http.get("/users");
  return response.data;
}

export async function banUser(id) {
  const response = await http.post(`/users/ban/${id}`);
  return response.data;
}

export async function unBanUser(id) {
  const response = await http.post(`/users/unban/${id}`);
  return response.data;
}

export async function removeUser(id) {
  const response = await http.delete(`/users/${id}`);
  return response.data;
}

export async function updateUser({ id, data }) {
  const response = await http.put(`/users/${id}`, data);
  return response.data;
}

export async function changeRole(id) {
  const response = await http.put(`/users/role/${id}`);
  return response.data;
}
