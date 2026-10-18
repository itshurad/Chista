import axios from "axios";

const app = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

const http = {
  get: app.get.bind(app),
  patch: app.patch.bind(app),
  put: app.put.bind(app),
  delete: app.delete.bind(app),
  post: app.post.bind(app),
};

export default http;
