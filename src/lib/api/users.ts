import api from '@/lib/axios';
import { User } from '@/types';

export const getUsers = async (): Promise<User[]> => {
    const { data } = await api.get('/users');
    return data.users;
};

export const getUser = async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return data.user;
}

export const createUser = async (payload: FormData): Promise<User> => {
    const { data } = await api.post('/users/add', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.user;
};

export const updateUser = async (id: string, payload: FormData): Promise<User> => {
    const { data } = await api.put(`/users/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.user;
};

export const deleteUser = async (id: string): Promise<User> => {
    const { data } = await api.delete(`/users/${id}`);
    return data.user;
};

export const deleteUsers = async (ids: string[]): Promise<void> => {
    await api.post('/users/multy', { ids }); // Backend uses POST for multy delete
}
