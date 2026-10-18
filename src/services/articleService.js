import http from "./httpService";

// ==========================================
// Get all articles
// ==========================================

export const getArticlesApi = () =>
  http.get("/articles").then(({ data }) => data);

// ==========================================
// Get one article
// ==========================================

export const getArticleApi = (id) =>
  http.get(`/articles/id/${id}`).then(({ data }) => data);

export const getArticleByHrefApi = (href) =>
  http.get(`/articles/href/${href}`).then(({ data }) => data);

// ==========================================
// Create article
// ==========================================

export const createArticleApi = (data) =>
  http.post("/articles", data).then(({ data }) => data);

// ==========================================
// Create draft
// ==========================================

export const createArticleDraftApi = (data) =>
  http.post("/articles/draft", data).then(({ data }) => data);

// ==========================================
// Update article
// ==========================================

export const updateArticleApi = ({ id, data }) =>
  http.put(`/articles/${id}`, data).then(({ data }) => data);

// ==========================================
// Delete article
// ==========================================

export const deleteArticleApi = (id) =>
  http.delete(`/articles/${id}`).then(({ data }) => data);
