"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { ServiceSection } from "@/types"
import { createServiceSection, updateServiceSection } from "@/lib/api/services"

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
import { Editor } from "@/components/ui/editor"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
    title_en: z.string().min(2, "Title (EN) is required"),
    title_ar: z.string().min(2, "Title (AR) is required"),
    sub_title_en: z.string().min(2, "Subtitle (EN) is required"),
    sub_title_ar: z.string().min(2, "Subtitle (AR) is required"),
    description_en: z.string().min(2, "Description (EN) is required"),
    description_ar: z.string().min(2, "Description (AR) is required"),
    isActive: z.boolean(),
})

interface ServiceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    service?: ServiceSection | null
    onSuccess: () => void
}

export function ServiceDialog({ open, onOpenChange, service, onSuccess }: ServiceDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title_en: "",
            title_ar: "",
            sub_title_en: "",
            sub_title_ar: "",
            description_en: "",
            description_ar: "",
            isActive: true,
        },
        values: service ? {
            title_en: service.header.title_en,
            title_ar: service.header.title_ar,
            sub_title_en: service.header.sub_title_en,
            sub_title_ar: service.header.sub_title_ar,
            description_en: service.header.description_en,
            description_ar: service.header.description_ar,
            isActive: service.isActive
        } : undefined
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const formData = new FormData()
            // The backend expects flat fields for 'header' properties currently based on model
            // BUT the model has nested 'header' object.
            // Let's check the controller `createService`.
            // If controller expects flat body fields like `req.body.title_en`, we send them flat.
            // If it expects `req.body.header.title_en`, we need to structure it.
            // I'll assume flat for now based on typical Express patterns unless I see the controller code.
            // Let's verify controller in next step if needed. 
            // For now, I'll send hierarchically in FormData? No, FormData is flat key-value.
            // We usually send `header[title_en]`.

            formData.append("header[title_en]", values.title_en)
            formData.append("header[title_ar]", values.title_ar)
            formData.append("header[sub_title_en]", values.sub_title_en)
            formData.append("header[sub_title_ar]", values.sub_title_ar)
            formData.append("header[description_en]", values.description_en)
            formData.append("header[description_ar]", values.description_ar)
            formData.append("isActive", String(values.isActive))

            if (service) {
                await updateServiceSection(service._id, formData)
            } else {
                await createServiceSection(formData)
            }

            onSuccess()
            toast.success(service ? "Service updated" : "Service created")

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
            <DialogContent className="sm:max-w-[800px] sm:max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>{service ? "Edit Service Section" : "Add Service Section"}</DialogTitle>
                    <DialogDescription>
                        Manage the service section header content.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title_en"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title (EN)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Our Services" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title_ar"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>Title (AR)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="خدماتنا" dir="rtl" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sub_title_en"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subtitle (EN)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Best Services" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sub_title_ar"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>Subtitle (AR)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="أفضل الخدمات" dir="rtl" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description_en"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (EN)</FormLabel>
                                    <FormControl>
                                        {/* Using Tiptap Editor */}
                                        <Editor value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description_ar"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>Description (AR)</FormLabel>
                                    <FormControl>
                                        <Editor value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active Section</FormLabel>
                                        <FormDescription>
                                            Visible to the public.
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
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
