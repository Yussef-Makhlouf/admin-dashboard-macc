"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Career } from "@/types"
import { createCareer, updateCareer } from "@/lib/api/careers"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Editor } from "@/components/ui/editor"

const formSchema = z.object({
    title_en: z.string().min(2),
    title_ar: z.string().min(2),
    department_en: z.string().min(2),
    department_ar: z.string().min(2),
    location_en: z.string().min(2),
    location_ar: z.string().min(2),
    employmentType_en: z.string().min(2),
    employmentType_ar: z.string().min(2),
    shortDescription_en: z.string().optional(),
    shortDescription_ar: z.string().optional(),
    description_en: z.string().optional(),
    description_ar: z.string().optional(),
    responsibilities_en: z.string().optional(), // We'll parse newlines
    responsibilities_ar: z.string().optional(),
    requirements_en: z.string().optional(),
    requirements_ar: z.string().optional(),
    isActive: z.boolean(),
})

interface CareerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    career?: Career | null
    onSuccess: () => void
}

export function CareerDialog({ open, onOpenChange, career, onSuccess }: CareerDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title_en: "",
            title_ar: "",
            department_en: "",
            department_ar: "",
            location_en: "",
            location_ar: "",
            employmentType_en: "Full-Time",
            employmentType_ar: "دوام كامل",
            shortDescription_en: "",
            shortDescription_ar: "",
            description_en: "",
            description_ar: "",
            responsibilities_en: "",
            responsibilities_ar: "",
            requirements_en: "",
            requirements_ar: "",
            isActive: true
        },
        values: career ? {
            title_en: career.title_en,
            title_ar: career.title_ar,
            department_en: career.department_en,
            department_ar: career.department_ar,
            location_en: career.location_en,
            location_ar: career.location_ar,
            employmentType_en: career.employmentType_en,
            employmentType_ar: career.employmentType_ar,
            shortDescription_en: career.shortDescription_en || "",
            shortDescription_ar: career.shortDescription_ar || "",
            description_en: career.description_en || "",
            description_ar: career.description_ar || "",
            responsibilities_en: career.responsibilities_en?.join('\n') || "",
            responsibilities_ar: career.responsibilities_ar?.join('\n') || "",
            requirements_en: career.requirements_en?.join('\n') || "",
            requirements_ar: career.requirements_ar?.join('\n') || "",
            isActive: career.isActive
        } : undefined
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const payload = {
                ...values,
                responsibilities_en: values.responsibilities_en?.split('\n').filter(s => s.trim()),
                responsibilities_ar: values.responsibilities_ar?.split('\n').filter(s => s.trim()),
                requirements_en: values.requirements_en?.split('\n').filter(s => s.trim()),
                requirements_ar: values.requirements_ar?.split('\n').filter(s => s.trim()),
            }

            if (career) {
                await updateCareer(career._id, payload)
            } else {
                await createCareer(payload)
            }

            onSuccess()
            toast.success(career ? "Career updated" : "Career posted")
        } catch (error) {
            console.error(error)
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>{career ? "Edit Job Post" : "Post New Job"}</DialogTitle>
                    <DialogDescription>Add job details below.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="title_en" render={({ field }) => (
                                <FormItem><FormLabel>Title (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="title_ar" render={({ field }) => (
                                <FormItem className="text-right"><FormLabel>Title (AR)</FormLabel><FormControl><Input dir="rtl" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="department_en" render={({ field }) => (
                                <FormItem><FormLabel>Department (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="department_ar" render={({ field }) => (
                                <FormItem className="text-right"><FormLabel>Department (AR)</FormLabel><FormControl><Input dir="rtl" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="location_en" render={({ field }) => (
                                <FormItem><FormLabel>Location (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="location_ar" render={({ field }) => (
                                <FormItem className="text-right"><FormLabel>Location (AR)</FormLabel><FormControl><Input dir="rtl" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="employmentType_en" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type (EN)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Full-Time">Full-Time</SelectItem>
                                            <SelectItem value="Part-Time">Part-Time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="employmentType_ar" render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>Type (AR)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger className="text-right"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                        <SelectContent dir="rtl">
                                            <SelectItem value="دوام كامل">دوام كامل</SelectItem>
                                            <SelectItem value="دوام جزئي">دوام جزئي</SelectItem>
                                            <SelectItem value="عقد">عقد</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Description */}
                        <FormField control={form.control} name="description_en" render={({ field }) => (
                            <FormItem><FormLabel>Description (EN)</FormLabel><FormControl><Editor value={field.value || ""} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description_ar" render={({ field }) => (
                            <FormItem className="text-right"><FormLabel>Description (AR)</FormLabel><FormControl><Editor value={field.value || ""} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                        )} />

                        {/* Arrays (Textarea for now) */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="responsibilities_en" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsibilities (EN) - 1 per line</FormLabel>
                                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="responsibilities_ar" render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>Responsibilities (AR) - 1 per line</FormLabel>
                                    <FormControl><Textarea dir="rtl" className="min-h-[100px]" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="requirements_en" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Requirements (EN) - 1 per line</FormLabel>
                                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="requirements_ar" render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>Requirements (AR) - 1 per line</FormLabel>
                                    <FormControl><Textarea dir="rtl" className="min-h-[100px]" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active</FormLabel>
                                        <FormDescription>
                                            Visible on careers page.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}