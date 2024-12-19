import axios from './axios'
export const registerRequest = user => axios.post(`/register`, user);
export const loginRequest = user => axios.post(`/login`, user);
export const resetPasswordRequest = user => axios.post(`/reset-password`, user);
export const resetPasswordVerify = user => axios.post(`/verify`, user);
export const passwordReset = user => axios.post(`/passwordReset`, user);
export const logoutRequest = user => axios.post(`/logout`, user);
export const verifyTokenRequest = () => axios.get(`/tokenVerify`);
export const googleLoginRequest = user => axios.post(`/google-login`, user);