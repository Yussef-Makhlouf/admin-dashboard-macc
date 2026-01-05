"use client"

import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import Sidebar from "./Sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export default function Header() {
    const [language, setLanguage] = useState<"en" | "ar">("en")

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                {/* Left Section - Mobile Menu + Search */}
                <div className="flex items-center gap-4">
                    {/* Mobile Sidebar Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72 bg-[#0A0A0A]">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Navigation Menu</SheetTitle>
                            </SheetHeader>
                            <Sidebar />
                        </SheetContent>
                    </Sheet>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full w-64 lg:w-80">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none text-sm flex-1 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Language Toggle */}
                    {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                            {language === "en" ? "EN" : "AR"}
                        </span>
                    </Button> */}

                    {/* Notifications */}
                    <DropdownMenu>
                        {/* <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-full hover:bg-gray-100"
                            >
                                <Bell className="h-5 w-5 text-gray-500" />
                          
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[#15AC9E] rounded-full"></span>
                            </Button>
                        </DropdownMenuTrigger> */}
                        <DropdownMenuContent align="end" className="w-80 rounded-2xl shadow-lg">
                            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="py-2 px-3 text-sm text-gray-500">
                                <p>No new notifications</p>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-gray-100">
                                <Avatar className="h-8 w-8 border-2 border-[#15AC9E]">
                                    <AvatarImage src="/avatar.png" />
                                    <AvatarFallback className="bg-[#15AC9E] text-white font-semibold">
                                        AD
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-gray-900">Admin</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-3 shadow-lg">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-red-500 focus:text-red-500"
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    document.cookie = "token=; path=/; max-age=0";
                                    window.location.href = "/login";
                                }}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
