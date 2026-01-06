"use client"

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
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void | Promise<void>
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
}

export function DeleteModal({
    open,
    onOpenChange,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone. This will permanently delete the item.",
    confirmText = "Delete",
    cancelText = "Cancel",
    isLoading = false,
}: DeleteModalProps) {
    const handleConfirm = async () => {
        await onConfirm()
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl max-w-md max-h-[calc(100vh-10rem)]">
                <AlertDialogHeader className="space-y-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7 text-red-600" />
                    </div>
                    <AlertDialogTitle className="text-center text-xl">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-gray-500">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                    <AlertDialogCancel
                        className="rounded-full sm:flex-1 order-2 sm:order-1"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700 rounded-full sm:flex-1 order-1 sm:order-2"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
