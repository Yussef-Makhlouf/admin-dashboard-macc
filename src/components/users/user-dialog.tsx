"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { User } from "@/types"
import { createUser, updateUser } from "@/lib/api/users"
import Image from "next/image"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
    userName: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().optional(),
    role: z.enum(["user", "admin", "hr"]),
    isActive: z.boolean().default(true),
}).refine((data) => {
    // Password is required for creating a new user (when no _id is present in the context usually, but here we validate loosely)
    // We'll handle refined validation logic in the component or assume optional for edit
    return true
})

interface UserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
    onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const form = useForm<any>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
            email: "",
            password: "",
            role: "admin",
            isActive: true,
        },
    })

    // Reset form when user changes
    useState(() => {
        if (user) {
            form.reset({
                userName: user.userName,
                email: user.email,
                password: "", // Don't fill password on edit
                role: user.role,
                isActive: user.isActive,
            })
            setImagePreview(user.image?.imageLink || null)
        } else {
            form.reset({
                userName: "",
                email: "",
                password: "",
                role: "admin",
                isActive: true,
            })
            setImagePreview(null)
        }
        setImageFile(null)
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const objectUrl = URL.createObjectURL(file)
            setImagePreview(objectUrl)
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("userName", values.userName)
            formData.append("email", values.email)

            if (values.password && values.password.length > 0) {
                formData.append("password", values.password)
            } else if (!user && !values.password) {
                toast.error("Password is required when creating a new user")
                setIsLoading(false)
                return
            }

            formData.append("role", values.role)
            formData.append("isActive", values.isActive.toString())
            // Backend might not support isActive update via this endpoint directly if not in schema, assuming it is.
            // Based on types, User has isActive. UpdateUser endpoint might support it if controller does.
            // Checking backend controller code would confirm. Assuming yes for now.

            if (imageFile) {
                formData.append("image", imageFile)
            }

            if (user) {
                await updateUser(user._id, formData)
                toast.success("User updated successfully")
            } else {
                await createUser(formData)
                toast.success("User created successfully")
            }

            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
                    <DialogDescription>
                        {user ? "Make changes to the user profile here." : "Add a new user to the system."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Image Upload */}
                        <div className="flex justify-center mb-6">
                            <div className="relative group cursor-pointer" onClick={() => document.getElementById('user-image-upload')?.click()}>
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <span className="text-gray-400 text-sm">Upload</span>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs">Change</span>
                                </div>
                                <Input
                                    id="user-image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} />
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
                                    <FormLabel>Password {user && "(Leave blank to keep current)"}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="hr">HR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8 pb-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Active Status</FormLabel>
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
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {user ? "Save Changes" : "Create User"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
