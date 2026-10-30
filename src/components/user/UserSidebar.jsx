"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  BookOpen,
  ShoppingBag,
  MessageSquare,
  User,
  Home,
  LogOut,
  X,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

const userNavItems = [
  {
    title: "پیشخوان من",
    href: "/dashboard",
    icon: LayoutGrid,
    exact: true,
  },
  {
    title: "دوره‌های من",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "سفارشات و فاکتورها",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "تیکت‌های پشتیبانی",
    href: "/dashboard/tickets",
    icon: MessageSquare,
  },
  {
    title: "جزئیات حساب کاربری",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function UserSidebar({ isOpen, onClose, user }) {
  const pathname = usePathname();

  const checkActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname?.startsWith(`${item.href}/`);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* ۱. سایدبار ثابت دسکتاپ */}
      {/* ========================================================= */}
      <aside className="hidden w-72 shrink-0 lg:block" dir="rtl">
        <div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col justify-between rounded-[32px] bg-white p-5 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]">
          <div className="space-y-6">
            {/* لوگو و عنوان پنل دانشجو */}
            <div className="flex items-center justify-between border-b border-[#F4F3F0] pb-5">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFCC00] to-[#FF8A00] text-white shadow-[0_6px_16px_-4px_rgba(255,138,0,0.45)]">
                  <BookOpen className="h-5 w-5" strokeWidth={2.3} />
                </div>
                <div>
                  <span className="block text-sm font-extrabold text-[#14151A]">
                    آکادمی لرن
                  </span>
                  <span className="mt-0.5 inline-block rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[9px] font-extrabold text-[#059669]">
                    پنل دانشجو
                  </span>
                </div>
              </Link>
            </div>

            {/* لینک‌های ناوبری */}
            <nav className="space-y-1.5">
              {userNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = checkActive(item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center justify-between rounded-2xl px-4 py-3.5 text-xs transition-all duration-200 ${
                      isActive
                        ? "bg-[#FFF4E5] font-extrabold text-[#14151A]"
                        : "font-bold text-[#8E929F] hover:bg-[#F8F7F4] hover:text-[#14151A]"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute right-0 top-2.5 bottom-2.5 w-1.5 rounded-l-full bg-[#FF8A00]" />
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                          isActive
                            ? "bg-white text-[#FF8A00] shadow-2xs"
                            : "bg-[#F8F7F4] text-[#8E929F] group-hover:bg-white group-hover:text-[#14151A]"
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2.2} />
                      </div>
                      <span>{item.title}</span>
                    </div>

                    <ChevronLeft
                      className={`h-3.5 w-3.5 transition-transform ${
                        isActive
                          ? "text-[#FF8A00]"
                          : "opacity-0 group-hover:opacity-60"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* بخش پایین سایدبار: کارت پشتیبانی تیره + بازگشت به سایت */}
          <div className="space-y-3">
            <div className="rounded-[24px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-4 text-white shadow-[0_14px_30px_-10px_rgba(20,21,26,0.22)]">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-extrabold text-[#FFCC00]">
                  <Sparkles className="h-3 w-3" />
                  پشتیبانی مستقیم
                </span>
                <span className="h-2 w-2 rounded-full bg-[#059669]" />
              </div>

              <p className="mt-2.5 text-xs font-extrabold text-white">
                سوالی در دوره‌ها دارید؟
              </p>
              <p className="mt-1 text-[10px] leading-relaxed font-medium text-white/60">
                از بخش تیکت‌ها مستقیماً با مدرس دوره در ارتباط باشید.
              </p>

              <Link
                href="/dashboard/tickets/new"
                className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#FFCC00] py-2 text-[11px] font-extrabold text-[#14151A] transition-transform active:scale-95"
              >
                <span>ارسال تیکت جدید</span>
                <ChevronLeft className="h-3 w-3" strokeWidth={2.5} />
              </Link>
            </div>

            <Link
              href="/"
              className="flex items-center justify-between rounded-2xl bg-[#F8F7F4] px-4 py-3 text-xs font-extrabold text-[#14151A] transition-colors hover:bg-[#EFECE6]"
            >
              <span className="inline-flex items-center gap-2">
                <Home className="h-4 w-4 text-[#3B5BDB]" />
                بازگشت به صفحه اصلی سایت
              </span>
              <ChevronLeft className="h-3.5 w-3.5 text-[#8E929F]" />
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* ۲. منوی کشویی موبایل (Mobile Drawer) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-[#14151A]/40 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              dir="rtl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed top-0 right-0 z-50 flex h-[100dvh] w-72 flex-col justify-between rounded-l-[32px] bg-white p-5 shadow-2xl lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#F4F3F0] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFCC00] to-[#FF8A00] text-white">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-extrabold text-[#14151A]">
                        پنل کاربری
                      </span>
                      <span className="text-[10px] font-bold text-[#8E929F]">
                        {user?.name || "دانشجوی آکادمی"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <nav className="mt-5 space-y-1.5">
                  {userNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = checkActive(item);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center justify-between rounded-2xl px-3.5 py-3 text-xs transition-colors ${
                          isActive
                            ? "bg-[#FFF4E5] font-extrabold text-[#14151A]"
                            : "font-bold text-[#8E929F] hover:bg-[#F8F7F4] hover:text-[#14151A]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`h-4 w-4 ${
                              isActive ? "text-[#FF8A00]" : "text-[#8E929F]"
                            }`}
                          />
                          <span>{item.title}</span>
                        </div>
                        <ChevronLeft className="h-3.5 w-3.5 opacity-60" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <Link
                href="/"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#F8F7F4] py-3 text-xs font-extrabold text-[#14151A]"
              >
                <Home className="h-4 w-4 text-[#FF8A00]" />
                <span>مشاهده وب‌سایت</span>
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* ۳. نوار ناوبری پایین موبایل (Mobile Bottom Navigation) */}
      {/* ========================================================= */}
      <nav
        dir="rtl"
        className="fixed bottom-3 inset-x-4 z-40 flex h-16 items-center justify-around rounded-full bg-white/95 px-2 shadow-[0_12px_35px_-8px_rgba(20,21,26,0.16)] ring-1 ring-[#F1F0EC] backdrop-blur-xl lg:hidden"
      >
        {userNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = checkActive(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-2.5 py-1 text-[10px] transition-transform active:scale-90 ${
                isActive
                  ? "font-extrabold text-[#14151A]"
                  : "font-bold text-[#8E929F]"
              }`}
            >
              <div
                className={`flex h-8 w-10 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-[#FFF4E5] text-[#FF8A00]" : "text-[#8E929F]"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </div>
              <span className="truncate">{item.title.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
