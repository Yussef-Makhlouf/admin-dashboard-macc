"use client"
import { useEffect, useState } from "react"
import { fetchDashboardStats } from "@/lib/api/statistics"

import { StatCard, StatCardCompact } from "@/components/ui/stat-card"
import {
    Clock,
    FolderKanban,
    ThumbsUp,
    Users,
    Calendar,
    Briefcase,
    TrendingUp,
    ArrowUpRight
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    const [stats, setStats] = useState({
        applications: 0,
        services: 0,
        careers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Welcome back! Here&apos;s what&apos;s happening with MACC today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/services"
                        className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2"
                    >
                        <Briefcase className="w-4 h-4" />
                        Manage Services
                    </Link>
                </div>
            </div>

            {/* Main Stats - Featured */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Users}
                    value={stats.applications}
                    label="Total Applications"
                    description="Pending and processed applications"
                    accentColor="#6C63FF"
                />
                <StatCard
                    icon={Briefcase}
                    value={stats.services}
                    label="Active Services"
                    description="Total services offered"
                    accentColor="#15AC9E"
                />
                <StatCard
                    icon={FolderKanban}
                    value={stats.careers}
                    label="Open Careers"
                    description="Current job openings"
                    accentColor="#D4AF37"
                />
            </div>



            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-[40px] p-6 lg:p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Add Service", href: "/dashboard/services", icon: Briefcase, color: "#15AC9E" },
                            { label: "View Applications", href: "/dashboard/applications", icon: Users, color: "#6C63FF" },
                            { label: "Manage Careers", href: "/dashboard/careers", icon: FolderKanban, color: "#D4AF37" },
                        ].map((action) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                    style={{ background: `${action.color}15` }}
                                >
                                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                    {action.label}
                                </span>
                                <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-[40px] p-6 lg:p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {[
                            { title: "New application received", time: "2 hours ago", type: "application" },
                            { title: "Service updated: Hard Services", time: "5 hours ago", type: "service" },
                            { title: "New appointment scheduled", time: "Yesterday", type: "appointment" },
                            { title: "Career posting published", time: "2 days ago", type: "career" },
                        ].map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className={`w-2 h-2 rounded-full ${activity.type === "application" ? "bg-[#6C63FF]" :
                                    activity.type === "service" ? "bg-[#15AC9E]" :
                                        activity.type === "appointment" ? "bg-[#007ACC]" :
                                            "bg-[#D4AF37]"
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">{activity.title}</p>
                                    <p className="text-xs text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Overview */}
            <div className="bg-white rounded-[40px] p-6 lg:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Services Overview</h2>
                    <Link
                        href="/dashboard/services"
                        className="text-sm font-medium text-[#15AC9E] hover:underline inline-flex items-center gap-1"
                    >
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { name: "Hard Services", count: 3, color: "#5C677D" },
                        { name: "Soft Services", count: 4, color: "#D4AF37" },
                        { name: "Ground Services", count: 2, color: "#4CAF50" },
                        { name: "Special Projects", count: 2, color: "#6C63FF" },
                        { name: "Engineering", count: 1, color: "#007ACC" },
                    ].map((service) => (
                        <div
                            key={service.name}
                            className="text-center p-4 rounded-2xl bg-gray-50 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div
                                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                                style={{ background: `${service.color}20` }}
                            >
                                <span className="text-lg font-bold" style={{ color: service.color }}>
                                    {service.count}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-gray-600">{service.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
