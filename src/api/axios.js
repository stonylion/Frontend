import axios from "axios";

const api = axios.create({
    baseURL: "http://3.34.58.51/",
});

// ===== 요청 인터셉터 =====
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (["post", "put", "patch"].includes(config.method)) {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);


// ===== 응답 인터셉터 (자동 토큰 갱신 핵심) =====
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // access token 만료 → 401
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");

                const res = await axios.post(
                    "http://3.34.58.51/api/accounts/token/refresh/",
                    { refresh: refreshToken }
                );

                const newAccessToken = res.data.access;

                // 새 토큰 저장
                localStorage.setItem("access_token", newAccessToken);

                // 헤더 갱신
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // 실패했던 요청 다시 시도
                return api(originalRequest);

            } catch (err) {
                console.error("토큰 갱신 실패 → 로그아웃 처리");
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
