"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { login } from "@/lib/api/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().default(false),
})

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token")
        const cookieToken = document.cookie.includes("token=")
        if (token || cookieToken) {
            // Already logged in, redirect to dashboard
            router.push("/dashboard")
        } else {
            setIsAuthenticated(true)
        }
    }, [router])

    const form = useForm<any>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const res = await login({ email: values.email, password: values.password })
            toast.success("Login successful")

            // Store token
            const token = res.userUpdated.token;

            // In a real app, use HTTP-only cookies or a secure auth library (NextAuth, etc.)
            // For now, based on typical simple JWT setup:
            localStorage.setItem("token", token);

            // Also set as cookie for middleware/server compatibility and easy debugging
            document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 days

            // Store user info
            const { token: _, ...userData } = res.userUpdated; // Exclude token from user data if preferred, or keep it.
            // Using userData to be cleaner
            localStorage.setItem("user", JSON.stringify(userData));

            // Redirect to dashboard
            router.push("/dashboard")
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Invalid email or password")
        } finally {
            setIsLoading(false)
        }
    }

    if (!isAuthenticated) {
        return null // Or a loading spinner
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="relative w-24 h-24 flex items-center justify-center bg-white rounded-2xl shadow-lg shadow-emerald-500/10 p-4 border border-emerald-50">
                                <Image
                                    src="/admin/logo_aqua.png"
                                    alt="MACC Logo"
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
                        <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="admin@macc.com"
                                                className="h-11 rounded-xl"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    className="h-11 rounded-xl pr-10"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-between">
                                <FormField
                                    control={form.control}
                                    name="rememberMe"
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="remember"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <label
                                                htmlFor="remember"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-500"
                                            >
                                                Remember me
                                            </label>
                                        </div>
                                    )}
                                />
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-[#15AC9E] hover:text-[#118B80]"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 rounded-xl bg-[#15AC9E] hover:bg-[#118B80] text-white font-medium"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()} MACC Dashboard. All rights reserved.
            </p>
        </div>
    )
}
