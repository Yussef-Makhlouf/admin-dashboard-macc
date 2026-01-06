"use client"

import { useEffect, useState, useMemo } from "react"
import { Career } from "@/types"
import { getCareers, toggleCareerStatus } from "@/lib/api/careers"
import { getColumns } from "@/components/careers/columns"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Briefcase, Filter, X } from "lucide-react"
import { CareerDialog } from "@/components/careers/career-dialog"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function CareersPage() {
    const [data, setData] = useState<Career[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCareer, setEditingCareer] = useState<Career | null>(null)

    // Filter states
    const [departmentFilter, setDepartmentFilter] = useState<string>("all")
    const [locationFilter, setLocationFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

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

    // Extract unique values for filters
    const departments = useMemo(() => {
        const unique = [...new Set(data.map(c => c.department_en).filter(Boolean))]
        return unique.sort()
    }, [data])

    const locations = useMemo(() => {
        const unique = [...new Set(data.map(c => c.location_en).filter(Boolean))]
        return unique.sort()
    }, [data])

    // Filter the data
    const filteredData = useMemo(() => {
        return data.filter(career => {
            const matchesDepartment = departmentFilter === "all" || career.department_en === departmentFilter
            const matchesLocation = locationFilter === "all" || career.location_en === locationFilter
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "active" && career.isActive) ||
                (statusFilter === "inactive" && !career.isActive)
            return matchesDepartment && matchesLocation && matchesStatus
        })
    }, [data, departmentFilter, locationFilter, statusFilter])

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

    const clearFilters = () => {
        setDepartmentFilter("all")
        setLocationFilter("all")
        setStatusFilter("all")
    }

    const hasActiveFilters = departmentFilter !== "all" || locationFilter !== "all" || statusFilter !== "all"

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
                    <p className="text-2xl font-bold text-[#15AC9E]">{filteredData.length}</p>
                    <p className="text-sm text-gray-500">Filtered Results</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Filter className="h-4 w-4" />
                        <span className="font-medium text-sm">Filters:</span>
                    </div>

                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {locations.map(loc => (
                                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[40px] p-6 shadow-sm">
                <DataTable columns={columns} data={filteredData} searchKey="title_en" />
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
