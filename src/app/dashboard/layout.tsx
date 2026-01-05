import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <div className="md:pl-72">
                <Header />
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
