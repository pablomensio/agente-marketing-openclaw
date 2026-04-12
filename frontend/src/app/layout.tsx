import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import HealthBanner from "@/components/HealthBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Centro de Control de Marketing Autónomo",
  description: "HITL Marketing Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} flex h-screen bg-[#121212] overflow-hidden text-white`}>
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto">
          <HealthBanner />
          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
