import axios from "axios";

// 기본 axios 인스턴스
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

        // POST/PUT/PATCH 요청일 때만 Content-Type 설정
        if (["post", "put", "patch"].includes(config.method)) {

            // FormData면 Content-Type 자동 설정되게 두기
            if (config.data instanceof FormData) {
                delete config.headers["Content-Type"]; 
            } 
            // JSON일 때만 기존 로직 유지
            else {
                config.headers["Content-Type"] = "application/json";
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
