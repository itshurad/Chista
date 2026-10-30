"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

import { useProfile } from "@/hooks/useUsers";
import UserHeader from "@/components/user/UserHeader";
import UserSidebar from "@/components/user/UserSidebar";

export default function UserDashboardLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: profileData } = useProfile();
  const user = profileData?.me || profileData?.user || profileData || {};

  // جلوگیری از تداخل با مسیرهای پنل ادمین (/dashboard/admin/...)
  if (pathname?.startsWith("/dashboard/admin")) {
    return <>{children}</>;
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F8F7F4] px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:py-6"
    >
      <div className="mx-auto flex max-w-8xl items-start gap-6">
        {/* سایدبار دانشجو */}
        <UserSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          user={user}
        />

        {/* ستون اصلی: هدر + محتوای صفحات */}
        <div className="min-w-0 flex-1 space-y-6">
          <UserHeader
            onOpenSidebar={() => setIsSidebarOpen(true)}
            user={user}
          />

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
