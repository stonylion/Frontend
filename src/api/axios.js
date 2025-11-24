import axios from "axios";

// 기본 axios 인스턴스 (GET 요청용)
// GET 요청에는 Content-Type 제거 → preflight 방지
const api = axios.create({
    baseURL: "http://3.34.58.51/",
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // POST/PUT/PATCH 요청인 경우만 Content-Type 추가
        if (["post", "put", "patch"].includes(config.method)) {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;