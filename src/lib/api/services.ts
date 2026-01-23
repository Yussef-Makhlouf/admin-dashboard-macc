import api from '@/lib/axios';
import { ServiceSection } from '@/types';

// The backend seems to have a "ServiceSection" model.
// Assuming simple CRUD for now based on standard patterns.
// I will need to verify the routes.

export const getServices = async (): Promise<ServiceSection[]> => {
    const { data } = await api.get('/services');
    return data.services || data; // Adjust based on actual response
}

export const getService = async (id: string): Promise<ServiceSection> => {
    const { data } = await api.get(`/services/${id}`);
    return data.service || data;
}

export const createServiceSection = async (formData: FormData): Promise<ServiceSection> => {
    const { data } = await api.post('/services/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.service;
}

export const updateServiceSection = async (id: string, formData: FormData): Promise<ServiceSection> => {
    const { data } = await api.put(`/services/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.service;
}

export const deleteServiceSection = async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
}

export const bulkDeleteServices = async (ids: string[]): Promise<void> => {
    await api.post('/services/multy', { ids });
}
// 🔹 Service Items
export const addServiceItem = async (sectionId: string, formData: FormData): Promise<ServiceSection> => {
    const { data } = await api.post(`/services/${sectionId}/items`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data; // Backend returns { success: true, message: ..., data: updatedSection }
}

export const updateServiceItem = async (sectionId: string, itemId: string, formData: FormData): Promise<ServiceSection> => {
    const { data } = await api.put(`/services/${sectionId}/items/${itemId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data;
}

export const deleteServiceItem = async (sectionId: string, itemId: string): Promise<ServiceSection> => {
    const { data } = await api.delete(`/services/${sectionId}/items/${itemId}`);
    return data.data;
}
