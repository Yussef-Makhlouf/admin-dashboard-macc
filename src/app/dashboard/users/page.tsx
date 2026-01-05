"use client"

import { useEffect, useState, useMemo } from "react"
import { User } from "@/types"
import { getUsers, deleteUser } from "@/lib/api/users"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, MoreHorizontal, ArrowUpDown, UserCog, UserCheck, Shield } from "lucide-react"
import { UserDialog } from "@/components/users/user-dialog"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function UsersPage() {
    const [data, setData] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)

    const fetchData = async () => {
        try {
            const users = await getUsers()
            setData(users)
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

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!userToDelete) return
        try {
            await deleteUser(userToDelete._id)
            toast.success("User deleted successfully")
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete user")
        } finally {
            setDeleteDialogOpen(false)
            setUserToDelete(null)
        }
    }

    const handleDialogSuccess = () => {
        setDialogOpen(false)
        fetchData()
        toast.success(editingUser ? "User updated" : "User created")
        setEditingUser(null)
    }

    const columns: ColumnDef<User>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "image",
            header: "User",
            cell: ({ row }) => {
                const img = row.original.image?.imageLink
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-100">
                            <AvatarImage src={img} />
                            <AvatarFallback className="bg-[#15AC9E]/10 text-[#15AC9E]">
                                {row.original.userName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-gray-900">{row.original.userName}</p>
                            <p className="text-xs text-gray-500">{row.original.email}</p>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role") as string
                return (
                    <Badge
                        variant="secondary"
                        className={`capitalize px-3 py-1 rounded-full ${role === 'admin'
                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                    >
                        {role}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("isActive") as boolean
                return (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isActive
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
                        {isActive ? "Active" : "Inactive"}
                    </div>
                )
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-lg">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(user.email)}
                                className="cursor-pointer"
                            >
                                Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(user)} className="cursor-pointer">
                                Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                onClick={() => handleDeleteClick(user)}
                            >
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ], [])

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#15AC9E] mx-auto mb-4" />
                    <p className="text-gray-500">Loading users...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600/10 flex items-center justify-center">
                        <UserCog className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            User Management
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage user access and roles
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

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-[30px] p-6 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900">{data.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-gray-500" />
                    </div>
                </div>
                <div className="bg-white rounded-[30px] p-6 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Administrators</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {data.filter(u => u.role === 'admin').length}
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                </div>
                <div className="bg-white rounded-[30px] p-6 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Active Users</p>
                        <p className="text-3xl font-bold text-green-600">
                            {data.filter(u => u.isActive).length}
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-green-600" />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[40px] p-6 shadow-sm">
                <DataTable columns={columns} data={data} />
            </div>

            <UserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                user={editingUser}
                onSuccess={handleDialogSuccess}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            account and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 rounded-full"
                        >
                            Delete User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
