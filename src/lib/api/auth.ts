import api from '@/lib/axios';
import { User } from '@/types';

interface LoginResponse {
    message: string;
    userUpdated: {
        token: string;
        [key: string]: any;
    };
}

interface ForgotPasswordResponse {
    message: string;
    resetToken?: string; // Sometimes returned, or just sent via email
}

export const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
    const res = await api.post('/users/login', data);
    return res.data;
};

export const logout = async (token: string): Promise<void> => {
    await api.post('/users/logout', { token });
};

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
    const res = await api.post('/users/forget-password', { email });
    return res.data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    await api.post(`/users/reset/${token}`, { newPassword });
};

export const changePassword = async (data: { email: string; newPassword: string }): Promise<void> => {
    await api.post('/users/change_password', data);
};
