import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
const handleRefreshToken = async () => {
  const accessToken = localStorage.getItem("token");
  const res = await instance.post("/api/Authentication/RefreshToken", {
    accessToken,
  });
  if (res) return res.access_token;
  else return null;
};
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    const auth = token ? `Bearer ${token}` : "";
    config.headers["Authorization"] = auth;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response?.data) return response.data;
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if (error.config && error.response && +error.response.status === 401) {
      const access_token = await handleRefreshToken();
      if (access_token) {
        error.config.headers["Authorization"] = `Bearer ${access_token}`;
        localStorage.setItem("token", access_token);
        return instance.request(error.config);
      }
    }

    if (error && error.response) {
      return error.response;
    }
    return Promise.reject(error);
  }
);
export default instance;
