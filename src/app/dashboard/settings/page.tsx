"use client"

import { useEffect, useState } from "react"
import { User } from "@/types"
import { getUsers, deleteUser } from "@/lib/api/users"
import { columns } from "@/components/users/columns"
import { DataTable } from "@/components/ui/data-table"
import { DeleteModal } from "@/components/ui/delete-modal"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Settings as SettingsIcon } from "lucide-react"
import { UserDialog } from "@/components/users/user-dialog"
import { toast } from "sonner"

export default function SettingsPage() {
    const [data, setData] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchData = async () => {
        try {
            const res = await getUsers()
            setData(res)
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch users")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setDialogOpen(true)
    }

    const handleDeleteClick = (id: string) => {
        setUserToDelete(id)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!userToDelete) return
        setIsDeleting(true)
        try {
            await deleteUser(userToDelete)
            toast.success("User deleted")
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete user")
        } finally {
            setIsDeleting(false)
            setDeleteModalOpen(false)
            setUserToDelete(null)
        }
    }

    const handleSuccess = () => {
        setDialogOpen(false)
        fetchData()
        setEditingUser(null)
    }

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#15AC9E] mx-auto mb-4" />
                    <p className="text-gray-500">Loading settings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#15AC9E]/10 flex items-center justify-center">
                        <SettingsIcon className="w-7 h-7 text-[#15AC9E]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            System Settings
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage users and system preferences
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => { setEditingUser(null); setDialogOpen(true); }}
                    size="lg"
                    className="gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Add User
                </Button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[40px] p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">User Management</h2>
                    <p className="text-muted-foreground text-sm">Manage dashboard administrators and users.</p>
                </div>
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="email"
                    meta={{
                        onEdit: handleEdit,
                        onDelete: handleDeleteClick
                    }}
                />
            </div>

            <UserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                user={editingUser}
                onSuccess={handleSuccess}
            />

            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={confirmDelete}
                title="Delete User?"
                description="This action cannot be undone. This will permanently delete the user account and all associated data."
                confirmText="Delete User"
                isLoading={isDeleting}
            />
        </div>
    )
}
