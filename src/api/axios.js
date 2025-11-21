import axios from "axios";

// 기본 axios 인스턴스 (GET 요청용)
// GET 요청에는 Content-Type 제거 → preflight 방지
const api = axios.create({
    baseURL: "https://7e1de0687300.ngrok-free.app/",
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }

        // POST/PUT/PATCH 요청인 경우만 Content-Type 추가
        if (["post", "put", "patch"].includes(config.method)) {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 시 토큰 자동 갱신
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh_token = localStorage.getItem("refresh_token");
            if (refresh_token) {
                try {
                    const res = await axios.post(
                        "https://7e1de0687300.ngrok-free.app/api/token/refresh/",
                        { refresh: refresh_token },
                        { headers: { "Content-Type": "application/json" } } // JSON body용
                    );
                    localStorage.setItem("access_token", res.data.access);
                    originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error("토큰 갱신 실패", err);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
