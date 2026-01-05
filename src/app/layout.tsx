import type { Metadata } from "next";
import { Outfit, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MACC Admin Dashboard",
  description: "Administrative dashboard for MACC Construction",
  icons: {
    icon: "/logo_aqua.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${montserrat.variable} antialiased min-h-screen bg-[#FAFAFA]`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

