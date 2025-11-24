import axios from "axios";

// 기본 axios 인스턴스 (GET 요청용)
// GET 요청에는 Content-Type 제거 → preflight 방지
const api = axios.create({
    baseURL: "http://3.34.58.51/",
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {

        // 1️⃣ 토큰을 붙이지 않을 API들 (비로그인 요청)
        const noAuthUrls = [
            "/api/accounts/signup/",
            "/api/accounts/login/",
        ];

        // 2️⃣ 해당 요청은 Authorization 헤더 제거
        if (noAuthUrls.includes(config.url)) {
            if (config.headers?.Authorization) {
                delete config.headers.Authorization;
            }
            return config;
        }

        // 3️⃣ 나머지 요청에는 토큰 자동 추가
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 4️⃣ POST/PUT/PATCH 요청에만 Content-Type 추가
        if (["post", "put", "patch"].includes(config.method)) {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
