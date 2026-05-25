"use client"

import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { Header } from "./components/Header"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="lg:pl-72 min-h-screen">
        <Header setSidebarOpen={setSidebarOpen} />
        <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-10">
          {children}
        </div>
      </main>
    </div>
  )
}
