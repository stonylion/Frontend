import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// fallback: 실수로 환경변수 없을 때 경고
if (!BASE_URL) {
    console.warn("⚠️ VITE_API_URL 환경변수가 설정되지 않았습니다!");
}

// 기본 axios 인스턴스
const api = axios.create({
    baseURL: BASE_URL,
});

// ===== 요청 인터셉터 =====
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

                // refreshToken 요청도 baseURL + endpoint 조합으로 호출
                const refreshResponse = await axios.post(
                    `${BASE_URL}/api/accounts/token/refresh/`,
                    { refresh: refreshToken }
                );

                const newAccessToken = refreshResponse.data.access;

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
