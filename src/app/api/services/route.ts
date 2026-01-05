import { NextResponse } from 'next/server';
import { ServiceSection } from '@/types';

const MOCK_SERVICES: ServiceSection[] = [
    {
        _id: '1',
        header: {
            title_en: 'Water Insulation',
            title_ar: 'العزل المائي',
            sub_title_en: 'Advanced Protection',
            sub_title_ar: 'حماية متقدمة',
            description_en: 'Complete water insulation solutions for all surfaces',
            description_ar: 'حلول عزل مائي متكاملة لجميع الأسطح'
        },
        services: [
            {
                title_en: 'Roof Insulation',
                title_ar: 'عزل الأسطح',
                category_en: 'Water',
                category_ar: 'مائي',
                description_en: 'Professional roof insulation service',
                description_ar: 'خدمة عزل أسطح احترافية',
                image: {
                    imageLink: '/services/roof-insulation.jpg',
                    public_id: 'roof-1'
                },
                order: 1
            }
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: '2',
        header: {
            title_en: 'Thermal Insulation',
            title_ar: 'العزل الحراري',
            sub_title_en: 'Energy Efficiency',
            sub_title_ar: 'كفاءة الطاقة',
            description_en: 'Best thermal insulation for your building',
            description_ar: 'أفضل عزل حراري لمبناك'
        },
        services: [
            {
                title_en: 'Foam Insulation',
                title_ar: 'عزل الفوم',
                category_en: 'Thermal',
                category_ar: 'حراري',
                description_en: 'High quality foam insulation',
                description_ar: 'عزل فوم عالي الجودة',
                order: 2
            }
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export async function GET() {
    return NextResponse.json({
        services: MOCK_SERVICES
    });
}
