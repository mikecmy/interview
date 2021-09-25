import axios from "axios";

const service = axios.create({
  baseURL: process.env.VUE_APP_SERVICE_BASE_URL, // api 的 base_url
  timeout: 5000, // request timeout  设置请求超时时间
  responseType: "json",
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

export default service;

//to do: 统一的service，较宽泛的错误处理都在这里做的
