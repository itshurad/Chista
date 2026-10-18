import Header from "@/components/dashboard/layout/Header";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import React from "react";

export default function AdminDashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div
        dir="rtl"
        className="
          min-h-screen
          bg-[#F8F7F4]
          text-[#14151A]
        "
      >
        <div className="flex min-h-screen w-full">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Area */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main
              className="
                flex-1
                px-4
                pb-8
                sm:px-6
                lg:px-8
              "
            >
              <div className="mx-auto w-full max-w-[1600px]">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
