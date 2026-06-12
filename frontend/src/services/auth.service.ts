import api from '@/lib/axios';
import config from '../config';
import type { User } from '@/types/auth';

const authService = {
  async requestOtp(phone_number: string, purpose: 'signup' | 'password_reset') {
    const res = await api.post(config.auth.otpRequestEndpoint, { phone_number, purpose });
    return res.data;
  },

  async verifyOtp(phone_number: string, otp: string, purpose: 'signup' | 'password_reset') {
    const res = await api.post(config.auth.otpVerifyEndpoint, { phone_number, otp, purpose });
    return res.data.data.ephemeral_token as string;
  },

  async signupComplete(ephemeralToken: string, payload: {
    full_name: string;
    password: string;
    marketing_consent: boolean;
  }) {
    const res = await api.post(config.auth.signupCompleteEndpoint, payload, {
      headers: { Authorization: `Bearer ${ephemeralToken}` },
    });
    return res.data.data as { access_token: string; user: User };
  },

  async login(phone_number: string, password: string) {
    const res = await api.post(config.auth.loginEndpoint, { phone_number, password });
    return res.data.data as { access_token: string; user: User };
  },

  async logout() {
    await api.post(config.auth.logoutEndpoint);
  },

  async getProfile() {
    const res = await api.get(config.auth.profileEndpoint);
    return res.data.data as User;
  },

  async updateProfile(data: FormData) {
    const res = await api.patch(config.auth.profileStep1Endpoint, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data as User;
  },

  async submitIdentity(data: FormData) {
    const res = await api.post(config.auth.profileStep2Endpoint, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async updateFullName(full_name: string) {
    const res = await api.patch(config.auth.profileEndpoint, { full_name });
    return res.data.data as User;
  },

  async passwordResetComplete(ephemeralToken: string, password: string) {
    const res = await api.post(config.auth.passwordResetCompleteEndpoint, { password }, {
      headers: { Authorization: `Bearer ${ephemeralToken}` },
    });
    return res.data;
  },
};

export default authService;
