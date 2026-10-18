import http from "./httpService";

// دریافت همه دسته‌بندی‌ها
export async function getCategoriesApi() {
  return http.get("/categories").then(({ data }) => data);
}
export async function getCategoryById(id) {
  return http.get(`/categories/${id}`).then(({ data }) => data);
}

// ساخت دسته‌بندی جدید
export async function createCategoryApi(data) {
  return http.post("/categories", data).then(({ data }) => data);
}

// ویرایش دسته‌بندی
export async function updateCategoryApi({ id, data }) {
  return http.put(`/categories/${id}`, data).then(({ data }) => data);
}

// حذف دسته‌بندی
export async function deleteCategoryApi(id) {
  return http.delete(`/categories/${id}`).then(({ data }) => data);
}
