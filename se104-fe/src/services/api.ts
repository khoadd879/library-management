import axios from "services/axios.customize";

export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/Authentication/SignIn";
  return axios.post<IBackendRes<ISignIn>>(urlBackend, { username, password });
};
export const signUpSendOtpAPI = (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const urlBackend = "/api/Authentication/SignUpSendOtp";
  return axios.post<IBackendRes<any>>(urlBackend, {
    email,
    password,
    confirmPassword,
  });
};
export const signUpWithOtpAPI = (email: string, otp: string) => {
  const urlBackend = "/api/Authentication/SignUpWithReceivedOtp";
  return axios.post<IBackendRes<any>>(urlBackend, {
    email,
    otp,
  });
};

export const authenticateAPI = (token: string | null) => {
  const urlBackend = "/api/Authentication/Authentication";
  return axios.post<IBackendRes<any>>(urlBackend, token, {
    headers: { "Content-Type": "application/json" },
  });
};

export const refreshTokenAPI = (refreshToken: string) => {
  const urlBackend = "/api/Authentication/RefreshToken";
  return axios.post<IBackendRes<any>>(urlBackend, refreshToken, {
    headers: { "Content-Type": "application/json" },
  });
};
