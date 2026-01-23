"use client"

import { useEffect, useState, useMemo } from "react"
import { Application, Career } from "@/types"
import { getApplications, deleteApplication, updateApplicationStatus, bulkDeleteApplications } from "@/lib/api/applications"
import { columns } from "@/components/applications/columns"
import { DataTable } from "@/components/ui/data-table"
import { DeleteModal } from "@/components/ui/delete-modal"
import { Loader2, FileText, Filter, X, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ApplicationsPage() {
    const [data, setData] = useState<Application[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Filter states
    const [jobFilter, setJobFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
    const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false)

    const fetchData = async () => {
        try {
            const res = await getApplications()
            setData(res)
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch applications")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Extract unique job titles for filter
    const jobTitles = useMemo(() => {
        const titles = data
            .map(app => {
                if (typeof app.career === 'object' && app.career?.title_en) {
                    return { id: app.career._id, title: app.career.title_en }
                }
                return null
            })
            .filter((item): item is { id: string; title: string } => item !== null)

        // Remove duplicates by id
        const unique = titles.filter((item, index, self) =>
            index === self.findIndex(t => t.id === item.id)
        )
        return unique.sort((a, b) => a.title.localeCompare(b.title))
    }, [data])

    // Filter the data
    const filteredData = useMemo(() => {
        return data.filter(app => {
            const career = app.career as Career | undefined
            const matchesJob = jobFilter === "all" || career?._id === jobFilter
            const matchesStatus = statusFilter === "all" || app.status === statusFilter
            return matchesJob && matchesStatus
        })
    }, [data, jobFilter, statusFilter])

    const handleStatusUpdate = async (id: string, status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected') => {
        try {
            await updateApplicationStatus(id, status)
            toast.success(`Application status updated to ${status}`)
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? (error as any).response?.data?.message || error.message : "Failed to update status")
        }
    }

    const handleDeleteClick = (id: string) => {
        setApplicationToDelete(id)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!applicationToDelete) return
        setIsDeleting(true)
        try {
            await deleteApplication(applicationToDelete)
            toast.success("Application deleted")
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete application")
        } finally {
            setIsDeleting(false)
            setDeleteModalOpen(false)
            setApplicationToDelete(null)
        }
    }

    const confirmBulkDelete = async () => {
        setIsDeleting(true)
        try {
            const idsToDelete = filteredData
                .filter((_, index) => rowSelection[index.toString()])
                .map(app => app._id)

            if (idsToDelete.length === 0) return

            await bulkDeleteApplications(idsToDelete)
            toast.success(`${idsToDelete.length} applications deleted`)
            setRowSelection({})
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete applications")
        } finally {
            setIsDeleting(false)
            setBulkDeleteModalOpen(false)
        }
    }

    const clearFilters = () => {
        setJobFilter("all")
        setStatusFilter("all")
    }

    const hasActiveFilters = jobFilter !== "all" || statusFilter !== "all"

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#15AC9E] mx-auto mb-4" />
                    <p className="text-gray-500">Loading applications...</p>
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
                        <FileText className="w-7 h-7 text-[#15AC9E]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Career Applications
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Review and manage job applications
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                    <p className="text-sm text-gray-500">Total Applications</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-yellow-600">
                        {data.filter(a => a.status === 'Pending').length}
                    </p>
                    <p className="text-sm text-gray-500">Pending</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">
                        {data.filter(a => a.status === 'Reviewed').length}
                    </p>
                    <p className="text-sm text-gray-500">Reviewed</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-green-600">
                        {data.filter(a => a.status === 'Accepted').length}
                    </p>
                    <p className="text-sm text-gray-500">Accepted</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-red-600">
                        {data.filter(a => a.status === 'Rejected').length}
                    </p>
                    <p className="text-sm text-gray-500">Rejected</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Filter className="h-4 w-4" />
                        <span className="font-medium text-sm">Filters:</span>
                    </div>

                    <Select value={jobFilter} onValueChange={setJobFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Job Title" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Jobs</SelectItem>
                            {jobTitles.map(job => (
                                <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Reviewed">Reviewed</SelectItem>
                            <SelectItem value="Accepted">Accepted</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    )}

                    <span className="text-sm text-gray-500 ml-auto">
                        Showing {filteredData.length} of {data.length} applications
                    </span>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[40px] p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Applicants List</h2>
                    <p className="text-muted-foreground text-sm">Review incoming CVs and manage candidate status.</p>
                </div>

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
                    data={filteredData}
                    searchKey="fullName"
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                    meta={{
                        onStatusUpdate: handleStatusUpdate,
                        onDelete: handleDeleteClick
                    }}
                />
            </div>

            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={confirmDelete}
                title="Delete Application?"
                description="This action cannot be undone. This will permanently delete this application and all associated data."
                confirmText="Delete Application"
                isLoading={isDeleting}
            />

            <DeleteModal
                open={bulkDeleteModalOpen}
                onOpenChange={setBulkDeleteModalOpen}
                onConfirm={confirmBulkDelete}
                title="Delete Selected Applications?"
                description={`Are you sure you want to delete ${Object.keys(rowSelection).length} selected applications? This action cannot be undone.`}
                confirmText="Delete Selected"
                isLoading={isDeleting}
            />
        </div>
    )
}
