"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";
import { useProfile } from "@/hooks/useUsers";
import { logoutApi } from "@/services/authService";

const dropdownVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.96,
    transition: { duration: 0.14 },
  },
};

function Header() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isCollapsed, setIsCollapsed, setIsMobileOpen } = useSidebar();
  const { data } = useProfile();
  const profile = data?.me || {};

  const isAdmin = profile?.role === "ADMIN";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/login");
    }
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-[#F8F7F4]/85 px-4 backdrop-blur-xl transition-all sm:px-6"
      dir="rtl"
    >
      {/* بخش راست: کنترل سایدبار + بج وضعیت پنل */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* دکمه همبرگری موبایل */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsMobileOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#14151A] shadow-[0_4px_16px_-4px_rgba(20,21,26,0.06)] transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00] md:hidden"
          title="باز کردن منو"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </motion.button>

        {/* دکمه جمع/باز کردن سایدبار در دسکتاپ */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-[#14151A] shadow-[0_4px_16px_-4px_rgba(20,21,26,0.06)] transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00] md:flex"
          title={isCollapsed ? "باز کردن سایدبار" : "جمع کردن سایدبار"}
        >
          <svg
            className={`h-4 w-4 transition-transform duration-300 ${
              isCollapsed ? "" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
          </svg>
        </motion.button>

        {/* کپسول سفید وضعیت و نقش کاربر (الهام گرفته از نوار کپسولی بالای تصویر رفرنس) */}
        <div className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 shadow-[0_4px_16px_-4px_rgba(20,21,26,0.05)]">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
              isAdmin
                ? "bg-[#FFF4E5] text-[#FF8A00]"
                : "bg-[#ECFDF5] text-[#059669]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isAdmin ? "bg-[#FF8A00]" : "bg-[#059669]"
              }`}
            />
            {isAdmin ? "ادمین" : "کاربر"}
          </span>

          <span className="hidden text-xs font-bold text-[#14151A] sm:inline">
            پنل مدیریت
          </span>
        </div>
      </div>

      {/* بخش چپ: آیکون‌های دسترسی سریع و پروفایل (مشابه گوشه بالا-چپ تصویر رفرنس) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* دکمه تیکت‌ها */}
        <Link
          href="/dashboard/admin/tickets"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#14151A] shadow-[0_4px_16px_-4px_rgba(20,21,26,0.06)] transition-all hover:bg-[#EEF2FF] hover:text-[#3B5BDB] active:scale-95"
          title="تیکت‌ها"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
            />
          </svg>
        </Link>

        {/* دکمه اطلاعیه‌ها (با نقطه نارنجی دقیقاً مشابه زنگوله در تصویر رفرنس) */}
        <Link
          href="/dashboard/admin/notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#14151A] shadow-[0_4px_16px_-4px_rgba(20,21,26,0.06)] transition-all hover:bg-[#FFF4E5] hover:text-[#FF8A00] active:scale-95"
          title="اطلاعیه‌ها"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF8A00] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-[#FF8A00]" />
          </span>
        </Link>

        {/* پروفایل کاربر */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-full bg-white p-1.5 pl-3 shadow-[0_4px_16px_-4px_rgba(20,21,26,0.06)] transition-all hover:shadow-md focus:outline-none"
          >
            {/* آواتار دایره‌ای با تم زرد طلایی/تیره */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFCC00] text-xs font-extrabold text-[#14151A]">
              {profile?.name ? profile.name.charAt(0) : "AD"}
            </div>

            <div className="hidden text-right leading-tight md:block">
              <span className="block max-w-[100px] truncate text-xs font-extrabold text-[#14151A]">
                {profile?.name || "کاربر"}
              </span>
            </div>

            <svg
              className={`h-3.5 w-3.5 text-[#8E929F] transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180 text-[#14151A]" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.button>

          {/* منوی بازشونده پروفایل (Dropdown) */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute left-0 mt-3 w-60 origin-top-left rounded-[26px] bg-white p-2.5 shadow-[0_20px_50px_-12px_rgba(20,21,26,0.14)] ring-1 ring-[#F1F0EC]"
              >
                {/* اطلاعات خلاصه کاربر همراه با بج سبز آنلاین */}
                <div className="mb-2 rounded-2xl bg-[#F8F7F4] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#14151A]">
                      {profile?.name || "حساب کاربری"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-extrabold text-[#059669]">
                      <span className="h-1 w-1 rounded-full bg-[#059669]" />
                      فعال
                    </span>
                  </div>
                  {profile?.email && (
                    <p
                      dir="ltr"
                      className="mt-1 truncate text-left   text-[11px] font-medium text-[#8E929F]"
                    >
                      {profile.email}
                    </p>
                  )}
                </div>

                {/* لینک پروفایل */}
                <Link
                  href="/dashboard/admin/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#14151A] transition-colors hover:bg-[#EEF2FF] hover:text-[#3B5BDB]"
                >
                  <div className="flex items-center gap-2.5">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    <span>حساب کاربری</span>
                  </div>
                  <svg
                    className="h-3.5 w-3.5 opacity-60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                </Link>

                {/* دکمه خروج با استایل بج قرمز مکمل (بک‌گراند قرمز نزدیک به سفید + متن قرمز پررنگ) */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1.5 flex w-full items-center justify-between rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-3.5 py-2.5 text-xs font-extrabold text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                      />
                    </svg>
                    <span>خروج از حساب</span>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Header;
