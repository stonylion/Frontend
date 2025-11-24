import axios from "axios";

// 기본 axios 인스턴스
const api = axios.create({
  baseURL: "http://3.34.58.51/",
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 1️⃣ 인증 제외 API
    const noAuthUrls = [
      "/api/accounts/signup/",
      "/api/accounts/login/",
    ];

    if (noAuthUrls.includes(config.url)) {
      if (config.headers?.Authorization) {
        delete config.headers.Authorization;
      }
      return config;
    }

    // 2️⃣ 토큰 자동 추가
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3️⃣ FormData일 경우 → Content-Type 제거 (브라우저가 자동 설정해야 함)
    const isFormData =
      config.data instanceof FormData;

    if (isFormData) {
      // Content-Type 지우기 (multipart 자동 처리)
      if (config.headers["Content-Type"]) {
        delete config.headers["Content-Type"];
      }
      return config;
    }

    // 4️⃣ 그 외 JSON 요청만 Content-Type 넣기
    if (["post", "put", "patch"].includes(config.method)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
