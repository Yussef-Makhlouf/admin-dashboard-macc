"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Application } from '@/types'
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Trash2, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Reviewed: "bg-blue-100 text-blue-800", // Mapping 'viewed' to 'Reviewed' if needed, or stick to API enum
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    // Handle API lowercase variants if necessary
    pending: "bg-yellow-100 text-yellow-800",
    viewed: "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
}

export const columns: ColumnDef<Application>[] = [
    {
        accessorKey: "fullName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const colorClass = (statusColors as any)[status] || "bg-gray-100 text-gray-800"

            return (
                <Badge variant="outline" className={`${colorClass} border-0 capitalize`}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "cv",
        header: "CV",
        cell: ({ row }) => {
            const cvUrl = row.original.cv?.fileUrl
            if (!cvUrl) return <span className="text-gray-400">No CV</span>
            return (
                <Link href={cvUrl} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                    Download <Eye className="w-3 h-3" />
                </Link>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Applied Date",
        cell: ({ row }) => {
            return new Date(row.original.createdAt).toLocaleDateString()
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row, table }) => {
            const app = row.original
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const meta = table.options.meta as any

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(app.email)}
                        >
                            Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Eye className="mr-2 h-4 w-4" /> Update Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => meta?.onStatusUpdate(app._id, 'Pending')}>
                                    <Clock className="mr-2 h-4 w-4 text-yellow-500" /> Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => meta?.onStatusUpdate(app._id, 'Reviewed')}>
                                    <Eye className="mr-2 h-4 w-4 text-blue-500" /> Reviewed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => meta?.onStatusUpdate(app._id, 'Accepted')}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Accepted
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => meta?.onStatusUpdate(app._id, 'Rejected')}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-500" /> Rejected
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => meta?.onDelete(app._id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
