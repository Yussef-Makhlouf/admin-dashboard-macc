"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
    LayoutDashboard,
    Briefcase,
    Hammer,
    Sparkles,
    Trees,
    Star,
    Wrench,
    FileText,
    Users,
    Calendar,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
    Building2
} from "lucide-react"

interface NavItem {
    label: string
    icon: React.ElementType
    href: string
    color?: string
    subItems?: NavItem[]
}

const routes: NavItem[] = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "Services Management",
        icon: Briefcase,
        href: "/dashboard/services",

    },

    {
        label: "Careers",
        icon: Building2,
        href: "/dashboard/careers",
    },
    {
        label: "Applications",
        icon: Settings,
        href: "/dashboard/applications",
    },

    {
        label: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
    },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [expandedItems, setExpandedItems] = useState<string[]>(["Services Management"])

    const toggleExpanded = (label: string) => {
        setExpandedItems(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        )
    }

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard"
        }
        return pathname.startsWith(href.split("?")[0])
    }

    return (
        <div className="flex flex-col h-full bg-[#0A0A0A] text-white border-r border-[#1F1F1F]">
            {/* Logo Section */}
            <div className="px-6 py-8">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#15AC9E] to-[#1bc4b3] flex items-center justify-center shadow-[0_0_20px_rgba(21,172,158,0.3)]">
                        <span className="text-white font-bold text-lg font-heading">M</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight font-heading">MACC</h1>
                        <p className="text-xs text-zinc-500 font-medium">Admin Dashboard</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                    {routes.map((route) => (
                        <div key={route.href}>
                            {route.subItems ? (
                                <>
                                    <button
                                        onClick={() => toggleExpanded(route.label)}
                                        className={cn(
                                            "w-full nav-item text-zinc-400 hover:text-white group relative",
                                            isActive(route.href) && "text-white"
                                        )}
                                    >
                                        <route.icon className={cn(
                                            "h-5 w-5 transition-colors duration-300",
                                            isActive(route.href) ? "text-[#15AC9E]" : "text-zinc-500 group-hover:text-[#15AC9E]"
                                        )} />
                                        <span className="flex-1 text-left font-medium">{route.label}</span>
                                        {expandedItems.includes(route.label) ? (
                                            <ChevronDown className="h-4 w-4 text-zinc-600 transition-transform duration-200" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-zinc-600 transition-transform duration-200" />
                                        )}
                                    </button>
                                    <div className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        expandedItems.includes(route.label) ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                                    )}>
                                        <div className="overflow-hidden bg-white/5 rounded-xl mb-2">
                                            <div className="pl-3 py-2 space-y-1">
                                                {route.subItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.href}
                                                        href={subItem.href}
                                                        className={cn(
                                                            "nav-item text-zinc-400 hover:text-white text-sm py-2 relative overflow-hidden transition-all duration-200",
                                                            isActive(subItem.href) && "text-white bg-white/10 shadow-inner"
                                                        )}
                                                    >
                                                        {isActive(subItem.href) && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#15AC9E] rounded-r-full" />
                                                        )}
                                                        <subItem.icon className={cn("h-4 w-4", subItem.color)} />
                                                        <span className="font-medium">{subItem.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={route.href}
                                    className={cn(
                                        "nav-item text-zinc-400 hover:text-white group relative overflow-hidden",
                                        isActive(route.href) && "bg-gradient-to-r from-[#15AC9E] to-[#1bc4b3] text-white shadow-lg shadow-[#15AC9E]/20"
                                    )}
                                >
                                    <route.icon className={cn(
                                        "h-5 w-5 transition-colors",
                                        isActive(route.href) ? "text-white" : "text-zinc-500 group-hover:text-[#15AC9E]"
                                    )} />
                                    <span className="font-medium">{route.label}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-[#1F1F1F] bg-[#0F0F0F]/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1A1A1A] mb-3 border border-[#2A2A2A]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#15AC9E] to-[#6C63FF] p-[2px]">
                        <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
                            {/* Placeholder for user avatar or initial */}
                            <span className="text-white font-bold text-xs">AD</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">Admin User</p>
                        <p className="text-xs text-zinc-500 truncate">admin@macc.com</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        document.cookie = "token=; path=/; max-age=0";
                        window.location.href = "/login";
                    }}
                    className="nav-item w-full text-zinc-400 hover:text-red-400 hover:bg-red-400/10 group justify-center"
                >
                    <LogOut className="h-5 w-5 text-zinc-500 group-hover:text-red-400 transition-colors" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    )
}
