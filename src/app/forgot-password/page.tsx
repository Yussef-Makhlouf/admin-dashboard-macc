"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, ArrowLeft, Mail } from "lucide-react"
import { toast } from "sonner"
import { forgotPassword } from "@/lib/api/auth"

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

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            await forgotPassword(values.email)
            setIsSent(true)
            toast.success("Reset link sent to your email")
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to send reset link")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSent) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                    <p className="text-gray-500 mb-8">
                        We've sent a password reset link to <span className="font-semibold text-gray-900">{form.getValues("email")}</span>
                    </p>
                    <Link href="/login">
                        <Button variant="outline" className="w-full h-11 rounded-xl">
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-20 h-20 flex items-center justify-center bg-white rounded-2xl shadow-lg shadow-emerald-500/10 p-3 border border-emerald-50">
                            <Image
                                src="/admin/logo_aqua.png"
                                alt="MACC Logo"
                                width={60}
                                height={60}
                                className="w-full h-full object-contain"
                                priority
                            />
                        </div>
                    </div>
                    <Link
                        href="/login"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Login
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                        <p className="text-gray-500 mt-2">
                            Enter your email details to receive a reset link
                        </p>
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

                            <Button
                                type="submit"
                                className="w-full h-11 rounded-xl bg-[#15AC9E] hover:bg-[#118B80] text-white font-medium"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Reset Link
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
