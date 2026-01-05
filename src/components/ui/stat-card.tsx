"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
    icon: LucideIcon
    value: number
    suffix?: string
    prefix?: string
    label: string
    description?: string
    accentColor?: string
    className?: string
}

function useCountAnimation(end: number, duration: number = 2000) {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)
    const startTimeRef = useRef<number | null>(null)

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp
            }

            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const currentCount = Math.floor(easeOut * end)

            if (currentCount !== countRef.current) {
                countRef.current = currentCount
                setCount(currentCount)
            }

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setCount(end)
            }
        }

        requestAnimationFrame(animate)

        return () => {
            startTimeRef.current = null
        }
    }, [end, duration])

    return count
}

export function StatCard({
    icon: Icon,
    value,
    suffix = "",
    prefix = "",
    label,
    description,
    accentColor = "#15AC9E",
    className
}: StatCardProps) {
    const animatedValue = useCountAnimation(value)

    return (
        <div
            className={cn(
                "relative overflow-hidden bg-white rounded-[40px] p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 group",
                className
            )}
        >
            {/* Accent Top Border */}
            <div
                className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[40px]"
                style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}dd)` }}
            />

            {/* Background Decoration */}
            <div
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{ background: accentColor }}
            />

            {/* Icon */}
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${accentColor}15` }}
            >
                <Icon className="w-7 h-7" style={{ color: accentColor }} />
            </div>

            {/* Value */}
            <div className="mb-2">
                <span className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                    {prefix}{animatedValue}{suffix}
                </span>
            </div>

            {/* Label */}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{label}</h3>

            {/* Description */}
            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}

            {/* Hover Effect */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ background: accentColor }}
            />
        </div>
    )
}

// Compact variant for smaller stat displays
export function StatCardCompact({
    icon: Icon,
    value,
    suffix = "",
    prefix = "",
    label,
    change,
    changeType = "positive",
    accentColor = "#15AC9E",
    className
}: StatCardProps & { change?: string; changeType?: "positive" | "negative" | "neutral" }) {
    const animatedValue = useCountAnimation(value)

    return (
        <div
            className={cn(
                "bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300",
                className
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${accentColor}15` }}
                >
                    <Icon className="w-5 h-5" style={{ color: accentColor }} />
                </div>
                {change && (
                    <span
                        className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full",
                            changeType === "positive" && "bg-green-100 text-green-700",
                            changeType === "negative" && "bg-red-100 text-red-700",
                            changeType === "neutral" && "bg-gray-100 text-gray-700"
                        )}
                    >
                        {change}
                    </span>
                )}
            </div>

            <div className="text-2xl font-bold text-gray-900 mb-1">
                {prefix}{animatedValue}{suffix}
            </div>

            <p className="text-sm text-gray-500">{label}</p>
        </div>
    )
}
