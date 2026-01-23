"use client"

import { useEffect, useState } from "react"
import { ServiceSection } from "@/types"
import { getServices, deleteServiceSection, bulkDeleteServices } from "@/lib/api/services"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, FolderOpen, ArrowUpDown, MoreHorizontal, Layers, Pencil, Trash2 } from "lucide-react"
import { ServiceDialog } from "@/components/services/service-dialog"
import { ServiceItemsDialog } from "@/components/services/service-items-dialog"
import { DeleteModal } from "@/components/ui/delete-modal"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function ServicesPage() {
    const [data, setData] = useState<ServiceSection[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [itemsDialogOpen, setItemsDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState<ServiceSection | null>(null)
    const [managingService, setManagingService] = useState<ServiceSection | null>(null)

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
    const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false)

    const fetchData = async () => {
        try {
            const res = await getServices()
            setData(res)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (service: ServiceSection) => {
        setEditingService(service)
        setDialogOpen(true)
    }

    const handleManageItems = (service: ServiceSection) => {
        setManagingService(service)
        setItemsDialogOpen(true)
    }

    const handleDeleteClick = (id: string) => {
        setServiceToDelete(id)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!serviceToDelete) return
        setIsDeleting(true)
        try {
            await deleteServiceSection(serviceToDelete)
            toast.success("Service Section deleted")
            fetchData()
        } catch (error) {
            toast.error("Failed to delete section")
        } finally {
            setIsDeleting(false)
            setDeleteModalOpen(false)
            setServiceToDelete(null)
        }
    }

    const confirmBulkDelete = async () => {
        setIsDeleting(true)
        try {
            const idsToDelete = data
                .filter((_, index) => rowSelection[index.toString()])
                .map(service => service._id)

            if (idsToDelete.length === 0) return

            await bulkDeleteServices(idsToDelete)
            toast.success(`${idsToDelete.length} service sections deleted`)
            setRowSelection({})
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete service sections")
        } finally {
            setIsDeleting(false)
            setBulkDeleteModalOpen(false)
        }
    }

    const handleSuccess = () => {
        setDialogOpen(false)
        setItemsDialogOpen(false)
        fetchData()
        setEditingService(null)
        setManagingService(null)
    }


    const columns: ColumnDef<ServiceSection>[] = [
        {
            accessorKey: "header.title_en",
            id: "title",
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
            cell: ({ row }) => <span className="font-medium">{row.original.header.title_en}</span>
        },
        {
            accessorKey: "services",
            header: "Services Count",
            cell: ({ row }) => {
                return <Badge variant="secondary">{row.original.services.length} Items</Badge>
            }
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("isActive") as boolean
                return (
                    <div className={isActive ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {isActive ? "Active" : "Inactive"}
                    </div>
                )
            }
        },
        {
            accessorKey: "updatedAt",
            header: "Last Updated",
            cell: ({ row }) => {
                return new Date(row.original.updatedAt).toLocaleDateString()
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const service = row.original

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
                                onClick={() => navigator.clipboard.writeText(service._id)}
                            >
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleManageItems(service)}>
                                <Layers className="mr-2 h-4 w-4" /> Manage Items
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(service)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(service._id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]


    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#15AC9E] mx-auto mb-4" />
                    <p className="text-gray-500">Loading services...</p>
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
                        <FolderOpen className="w-7 h-7 text-[#15AC9E]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Services Management
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage service sections and content
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => { setEditingService(null); setDialogOpen(true); }}
                    size="lg"
                    className="gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Add Section
                </Button>
            </div>

            {/* Service Type Legend */}
            <div className="flex flex-wrap gap-3">
                {[
                    { name: "Hard Services", color: "#5C677D" },
                    { name: "Soft Services", color: "#D4AF37" },
                    { name: "Ground Services", color: "#4CAF50" },
                    { name: "Special Projects", color: "#6C63FF" },
                    { name: "Engineering", color: "#007ACC" },
                ].map((type) => (
                    <div
                        key={type.name}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50"
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: type.color }}
                        />
                        <span className="text-sm text-gray-600">{type.name}</span>
                    </div>
                ))}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[40px] p-6 shadow-sm">
                {Object.keys(rowSelection).length > 0 && (
                    <div className="mb-4 p-4 bg-red-50 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-700">
                            <Trash2 className="h-4 w-4" />
                            <span className="font-medium">{Object.keys(rowSelection).length} items selected</span>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setBulkDeleteModalOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                        >
                            Delete Selected
                        </Button>
                    </div>
                )}
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="title"
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />
            </div>

            <ServiceDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                service={editingService}
                onSuccess={handleSuccess}
            />

            <ServiceItemsDialog
                open={itemsDialogOpen}
                onOpenChange={setItemsDialogOpen}
                serviceSection={managingService}
                onSuccess={handleSuccess}
            />

            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={confirmDelete}
                title="Delete Service Section?"
                description="This action cannot be undone. This will permanently delete the service section and all items inside it."
                confirmText="Delete Section"
                isLoading={isDeleting}
            />

            <DeleteModal
                open={bulkDeleteModalOpen}
                onOpenChange={setBulkDeleteModalOpen}
                onConfirm={confirmBulkDelete}
                title="Delete Selected Sections?"
                description={`Are you sure you want to delete ${Object.keys(rowSelection).length} selected service sections? This action cannot be undone.`}
                confirmText="Delete Selected"
                isLoading={isDeleting}
            />
        </div>
    )
}
