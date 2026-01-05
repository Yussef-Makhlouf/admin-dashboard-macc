"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Career } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const getColumns = (handleEdit: (career: Career) => void, handleToggle: (id: string) => void): ColumnDef<Career>[] => [
    {
        accessorKey: "title_en",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title (EN)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "department_en",
        header: "Department",
    },
    {
        accessorKey: "location_en",
        header: "Location",
    },
    {
        accessorKey: "employmentType_en",
        header: "Type",
        cell: ({ row }) => <Badge variant="outline">{row.getValue("employmentType_en")}</Badge>
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive") as boolean
            return (
                <div className={isActive ? "text-green-600 font-medium" : "text-gray-500 font-medium"}>
                    {isActive ? "Active" : "Hidden"}
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const career = row.original

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
                            onClick={() => navigator.clipboard.writeText(career._id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(career)}>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggle(career._id)}>Toggle Status</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
