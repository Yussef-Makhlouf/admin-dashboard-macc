"use client"

import { useEffect, useState, useMemo } from "react"
import { Career } from "@/types"
import { getCareers, toggleCareerStatus } from "@/lib/api/careers"
import { getColumns } from "@/components/careers/columns"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Briefcase } from "lucide-react"
import { CareerDialog } from "@/components/careers/career-dialog"
import { toast } from "sonner"

export default function CareersPage() {
    const [data, setData] = useState<Career[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCareer, setEditingCareer] = useState<Career | null>(null)

    const fetchData = async () => {
        try {
            const res = await getCareers()
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

    const handleEdit = (career: Career) => {
        setEditingCareer(career)
        setDialogOpen(true)
    }

    const handleToggle = async (id: string) => {
        try {
            await toggleCareerStatus(id)
            toast.success("Status updated")
            fetchData()
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const columns = useMemo(() => getColumns(handleEdit, handleToggle), [])

    const handleSuccess = () => {
        setDialogOpen(false)
        fetchData()
        setEditingCareer(null)
    }

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#15AC9E] mx-auto mb-4" />
                    <p className="text-gray-500">Loading careers...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
                        <Briefcase className="w-7 h-7 text-[#D4AF37]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Careers & Jobs
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage job postings and career opportunities
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => { setEditingCareer(null); setDialogOpen(true); }}
                    size="lg"
                    className="gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Post New Job
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                    <p className="text-sm text-gray-500">Total Positions</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-green-600">
                        {data.filter(c => c.isActive).length}
                    </p>
                    <p className="text-sm text-gray-500">Active</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-gray-400">
                        {data.filter(c => !c.isActive).length}
                    </p>
                    <p className="text-sm text-gray-500">Inactive</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-[#15AC9E]">0</p>
                    <p className="text-sm text-gray-500">Applications</p>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[40px] p-6 shadow-sm">
                <DataTable columns={columns} data={data} searchKey="title_en" />
            </div>

            <CareerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                career={editingCareer}
                onSuccess={handleSuccess}
            />
        </div>
    )
}
