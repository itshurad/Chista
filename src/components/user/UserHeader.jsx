"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  BookOpen,
  UserCheck,
  ShieldCheck,
  X,
} from "lucide-react";

export default function UserHeader({ onOpenSidebar, user }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const isAdmin = user?.role === "ADMIN";

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/courses?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header
      dir="rtl"
      className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-white px-4 py-3.5 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] sm:px-6"
    >
      {/* بخش راست: دکمه همبرگری موبایل + خوش‌آمدگویی و نقش کاربر */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F7F4] text-[#14151A] transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00] lg:hidden"
          aria-label="باز کردن منو"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
            {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#14151A] sm:text-sm">
                {user?.name || user?.username || "دانشجوی گرامی"}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                <UserCheck className="h-3 w-3" />
                دانشجو
              </span>

              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  className="hidden items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#3B5BDB] sm:inline-flex"
                >
                  <ShieldCheck className="h-3 w-3" />
                  پنل مدیریت
                </Link>
              )}
            </div>

            <p
              dir="ltr"
              className="mt-0.5 text-right font-mono text-[10px] font-semibold text-[#8E929F]"
            >
              {user?.email || user?.phone || "حساب کاربری فعال"}
            </p>
          </div>
        </div>
      </div>

      {/* بخش چپ: کادر جستجوی کپسولی + دکمه مشاهده دوره‌های جدید */}
      <div className="flex items-center gap-2.5">
        <form
          onSubmit={handleSearch}
          className="relative hidden w-60 md:block lg:w-64"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی دوره جدید..."
            className="w-full rounded-full border border-transparent bg-[#F8F7F4] py-2.5 pr-4 pl-9 text-xs font-semibold text-[#14151A] outline-none transition-all placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 left-3 my-auto flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#8E929F]"
            >
              <X className="h-3 w-3" />
            </button>
          ) : (
            <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
          )}
        </form>

        <Link
          href="/dashboard/tickets"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F7F4] text-[#14151A] transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00]"
          title="تیکت‌ها و پیام‌ها"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-[#059669]" />
        </Link>
      </div>
    </header>
  );
}
