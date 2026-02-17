"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        const cookieToken = document.cookie.includes("token=")

        if (!token && !cookieToken) {
            router.push("https://macc-fm.com/admin/login")
        }
    }, [router])

    return <>{children}</>
}
