import api from '../axios';

export interface DashboardStats {
    applications: number;
    services: number;
    careers: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get('/statistics');
    return response.data.stats;
};
