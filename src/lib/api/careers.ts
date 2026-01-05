import api from '@/lib/axios';
import { Career } from '@/types';

export const getCareers = async (): Promise<Career[]> => {
    const { data } = await api.get('/careers');
    return data.careers || data;
}

export const getCareer = async (id: string): Promise<Career> => {
    const { data } = await api.get(`/careers/one/${id}`);
    return data.career || data;
}

export const createCareer = async (careerData: Partial<Career>): Promise<Career> => {
    const { data } = await api.post('/careers/create', careerData);
    return data.career;
}

export const updateCareer = async (id: string, careerData: Partial<Career>): Promise<Career> => {
    const { data } = await api.put(`/careers/${id}`, careerData);
    return data.career;
}

export const toggleCareerStatus = async (id: string): Promise<void> => {
    await api.patch(`/careers/${id}/toggle`);
}
