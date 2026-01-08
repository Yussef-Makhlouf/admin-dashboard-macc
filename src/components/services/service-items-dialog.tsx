"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2, ImageIcon } from "lucide-react"
import { ServiceSection, ServiceItem } from "@/types"
import { addServiceItem, updateServiceItem, deleteServiceItem } from "@/lib/api/services"
import Image from "next/image"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { DeleteModal } from "@/components/ui/delete-modal"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
    title_en: z.string().min(2, "Title (EN) is required"),
    title_ar: z.string().min(2, "Title (AR) is required"),
    category_en: z.string().min(2, "Category (EN) is required"),
    category_ar: z.string().min(2, "Category (AR) is required"),
    description_en: z.string().min(2, "Description (EN) is required"),
    description_ar: z.string().min(2, "Description (AR) is required"),
    order: z.coerce.number().min(1, "Order must be at least 1"),
})

interface ServiceItemsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    serviceSection: ServiceSection | null
    onSuccess: () => void
}

export function ServiceItemsDialog({ open, onOpenChange, serviceSection, onSuccess }: ServiceItemsDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [editingItem, setEditingItem] = useState<ServiceItem | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (open) {
            setIsFormOpen(false)
            setEditingItem(null)
            setImageFile(null)
            setImagePreview(null)
            setDeleteModalOpen(false)
            setItemToDelete(null)
        }
    }, [open, serviceSection])

    const form = useForm<any>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title_en: "",
            title_ar: "",
            category_en: "",
            category_ar: "",
            description_en: "",
            description_ar: "",
            order: 0,
        }
    })

    const handleEditClick = (item: ServiceItem) => {
        setEditingItem(item)
        setImagePreview(item.image?.imageLink || null)
        setImageFile(null)
        form.reset({
            title_en: item.title_en,
            title_ar: item.title_ar,
            category_en: item.category_en,
            category_ar: item.category_ar,
            description_en: item.description_en,
            description_ar: item.description_ar,
            order: item.order,
        })
        setIsFormOpen(true)
    }

    const handleAddNewClick = () => {
        setEditingItem(null)
        setImagePreview(null)
        setImageFile(null)
        form.reset({
            title_en: "",
            title_ar: "",
            category_en: "",
            category_ar: "",
            description_en: "",
            description_ar: "",
            order: (serviceSection?.services.length || 0) + 1,
        })
        setIsFormOpen(true)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const objectUrl = URL.createObjectURL(file)
            setImagePreview(objectUrl)
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!serviceSection) return
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append("title_en", values.title_en)
            formData.append("title_ar", values.title_ar)
            formData.append("category_en", values.category_en)
            formData.append("category_ar", values.category_ar)
            formData.append("description_en", values.description_en)
            formData.append("description_ar", values.description_ar)
            formData.append("order", String(values.order))

            if (imageFile) {
                formData.append("image", imageFile)
            }

            if (editingItem) {
                await updateServiceItem(serviceSection._id, editingItem._id!, formData)
                toast.success("Item updated successfully")
            } else {
                if (!imageFile) {
                    toast.error("Image is required for new items")
                    setIsLoading(false)
                    return
                }
                await addServiceItem(serviceSection._id, formData)
                toast.success("Item added successfully")
            }

            onSuccess() // Refresh parent data
            setIsFormOpen(false) // Close form, go back to list
            setEditingItem(null)

        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteClick = (itemId: string) => {
        setItemToDelete(itemId)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!serviceSection || !itemToDelete) return
        setIsDeleting(true)
        try {
            await deleteServiceItem(serviceSection._id, itemToDelete)
            toast.success("Item deleted")
            onSuccess()
        } catch (error) {
            toast.error("Failed to delete item")
        } finally {
            setIsDeleting(false)
            setDeleteModalOpen(false)
            setItemToDelete(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Manage Service Items</DialogTitle>
                    <DialogDescription>
                        {serviceSection?.header.title_en}
                    </DialogDescription>
                </DialogHeader>

                {!isFormOpen ? (
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex justify-end mb-4">
                            <Button onClick={handleAddNewClick} size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> Add Item
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                            <div className="space-y-4">
                                {serviceSection?.services.map((item, i) => (
                                    <div key={item._id || i} className="flex gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
                                        <div className="w-24 h-24 rounded-lg bg-muted relative overflow-hidden shrink-0">
                                            {item.image?.imageLink ? (
                                                <Image
                                                    src={item.image.imageLink}
                                                    alt={item.title_en}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    <ImageIcon className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="font-semibold truncate">{item.title_en}</h4>
                                                    <p className="text-sm text-muted-foreground">{item.category_en}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}>
                                                        <Pencil className="w-4 h-4 text-blue-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => item._id && handleDeleteClick(item._id)}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                {item.description_en}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {serviceSection?.services.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No items found. Click add to create one.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="mb-4">
                            <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(false)} className="mb-2">
                                ← Back to list
                            </Button>
                            <h3 className="text-lg font-semibold">
                                {editingItem ? "Edit Item" : "New Item"}
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <FormLabel>Item Image</FormLabel>
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden bg-muted/50">
                                                {imagePreview ? (
                                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                                ) : (
                                                    <div className="text-center text-xs text-muted-foreground p-2">
                                                        <span>Upload Image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="w-full max-w-xs"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="title_en"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title (EN)</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
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
                                                    <FormControl><Input {...field} dir="rtl" /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="category_en"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category (EN)</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="category_ar"
                                            render={({ field }) => (
                                                <FormItem className="text-right">
                                                    <FormLabel>Category (AR)</FormLabel>
                                                    <FormControl><Input {...field} dir="rtl" /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="description_en"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description (EN)</FormLabel>
                                                    <FormControl><Textarea className="resize-none h-24" {...field} /></FormControl>
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
                                                    <FormControl><Textarea className="resize-none h-24" {...field} dir="rtl" /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="order"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Order</FormLabel>
                                                <FormControl><Input type="number" min={1} {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="pt-4 flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {editingItem ? "Save Changes" : "Create Item"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                )}
            </DialogContent>

            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={confirmDelete}
                title="Delete Service Item?"
                description="This action cannot be undone. This will permanently delete the service item."
                confirmText="Delete Item"
                isLoading={isDeleting}
            />
        </Dialog>
    )
}
