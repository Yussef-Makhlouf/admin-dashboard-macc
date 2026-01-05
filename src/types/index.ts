export type UserRole = 'user' | 'admin';

export interface User {
    _id: string;
    userName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    image?: {
        imageLink: string;
        public_id: string;
    };
    createdAt: string;
    updatedAt: string;
}

export type CreateUserDTO = {
    userName: string;
    email: string;
    password?: string;
    role: UserRole;
    isActive?: boolean;
}


export interface ServiceItem {
    _id?: string;
    title_en: string;
    title_ar: string;
    category_en: string;
    category_ar: string;
    description_en: string;
    description_ar: string;
    image?: {
        imageLink: string;
        public_id: string;
    };
    customId?: string;
    order: number;
}

export interface ServiceSection {
    _id: string;
    header: {
        title_en: string;
        title_ar: string;
        sub_title_en: string;
        sub_title_ar: string;
        description_en: string;
        description_ar: string;
        image?: {
            imageLink: string;
            public_id: string;
        };
    };
    services: ServiceItem[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface Career {
    _id: string;
    title_en: string;
    title_ar: string;
    department_en: string;
    department_ar: string;
    location_en: string;
    location_ar: string;
    employmentType_en: string;
    employmentType_ar: string;
    shortDescription_en?: string;
    shortDescription_ar?: string;
    description_en?: string;
    description_ar?: string;
    responsibilities_en?: string[];
    responsibilities_ar?: string[];
    requirements_en?: string[];
    requirements_ar?: string[];
    isActive: boolean;
    order?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Application {
    _id: string;
    career: Career | string;
    fullName: string;
    email: string;
    phone: string;
    cv: {
        fileUrl: string;
        public_id: string;
    };
    status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
    createdAt: string;
}
