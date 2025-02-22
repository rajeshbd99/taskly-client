import axios from "axios";

export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosSecure.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      {
        window.location.href = "/login";
      }
      console.log("error in interceptor", error);
      return Promise.reject(error);
    }
  }
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
