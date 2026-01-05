"use client"

import { useEffect, useState } from "react"
import { Application } from "@/types"
import { getApplications, deleteApplication, updateApplicationStatus } from "@/lib/api/applications"
import { columns } from "@/components/applications/columns"
import { DataTable } from "@/components/ui/data-table"
import { Loader2, FileText } from "lucide-react"
import { toast } from "sonner"

export default function ApplicationsPage() {
    const [data, setData] = useState<Application[]>([])
    const [isLoading, setIsLoading] = useState(true)

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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return
        try {
            await deleteApplication(id)
            toast.success("Application deleted")
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete application")
        }
    }

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

            {/* Data Table */}
            <div className="bg-white rounded-[40px] p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Applicants List</h2>
                    <p className="text-muted-foreground text-sm">Review incoming CVs and manage candidate status.</p>
                </div>
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="email"
                    meta={{
                        onStatusUpdate: handleStatusUpdate,
                        onDelete: handleDelete
                    }}
                />
            </div>
        </div>
    )
}
