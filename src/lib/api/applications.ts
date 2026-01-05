import api from '@/lib/axios';
import { Application } from '@/types';

export const getApplications = async (): Promise<Application[]> => {
    const { data } = await api.get('/applications');
    return data.applications;
};

export const getApplication = async (id: string): Promise<Application> => {
    const { data } = await api.get(`/applications/${id}`);
    return data.application;
};

export const updateApplicationStatus = async (id: string, status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected'): Promise<Application> => {
    const { data } = await api.patch(`/applications/${id}/status`, { status });
    return data.application;
};

export const deleteApplication = async (id: string): Promise<void> => {
    await api.delete(`/applications/${id}`);
};

export const getCareerApplications = async (careerId: string): Promise<Application[]> => {
    const { data } = await api.get(`/applications/byjob/${careerId}`);
    return data.applications;
};
