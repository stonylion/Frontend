import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000", // 공통 주소
    headers: {
        "Content-Type": "application/json"
    }
});

// 요청 인터셉터 (request 보내기 전 자동 실행)
api.interceptors.request.use(
    (config) => {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
