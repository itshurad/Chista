import http from "./httpService";

// Get all notifications
export const getNotificationsApi = () =>
  http.get("/notifications").then(({ data }) => data);

// Get admins
export const getNotificationAdminsApi = () =>
  http.get("/notifications/admins").then(({ data }) => data);

// Create notification
export const createNotificationApi = (data) =>
  http.post("/notifications", data).then(({ data }) => data);

// Delete notification
export const deleteNotificationApi = (id) =>
  http.delete(`/notifications/${id}`).then(({ data }) => data);

// Mark notification as seen
export const seeNotificationApi = (id) =>
  http.put(`/notifications/${id}/see`).then(({ data }) => data);
