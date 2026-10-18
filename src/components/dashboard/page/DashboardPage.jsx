"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  User,
  ChevronLeft,
  ShieldCheck,
  UserCheck,
  Compass,
  Layers,
  Ban,
  CheckCircle2,
  ArrowUpLeft,
  Sparkles,
  BookOpen,
  FileText,
  ShoppingBag,
  MessageSquare,
  TicketPercent,
  Building2,
  Clock3,
} from "lucide-react";

import { useProfile, useUsers } from "@/hooks/useUsers";
import { useMenus } from "@/hooks/useMenus";
import { useAllCourses } from "@/hooks/useCourses";
import { useAllArticles } from "@/hooks/useArticles";
import { useOrders } from "@/hooks/useOrders";
import { useAllTickets } from "@/hooks/useTickets";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

export default function DashboardHomePage() {
  // واکشی داده‌ها از تمام هوک‌های پروژه
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();
  const { data: menusData, isLoading: isLoadingMenus } = useMenus();
  const { data: profileData, isLoading: isLoadingProfile } = useProfile();
  const { data: coursesData, isLoading: isLoadingCourses } = useAllCourses();
  const { data: articlesData, isLoading: isLoadingArticles } = useAllArticles();
  const { data: ordersData, isLoading: isLoadingOrders } = useOrders();
  const { data: ticketsData, isLoading: isLoadingTickets } = useAllTickets();

  const currentUser = profileData?.me || profileData?.user || profileData || {};
  const users = Array.isArray(usersData) ? usersData : usersData?.users || [];
  const menus = Array.isArray(menusData) ? menusData : menusData?.menus || [];
  const courses =
    coursesData?.allCourse || coursesData?.courses || coursesData || [];
  const articles = articlesData?.articles || articlesData || [];
  const orders = ordersData?.orders || ordersData?.courses || ordersData || [];
  const tickets =
    ticketsData?.tickets || ticketsData?.allTickets || ticketsData || [];

  // محاسبات آماری کامل داشبورد
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const bannedCount = users.filter((u) => Boolean(u.isBan)).length;

    const totalCourses = Array.isArray(courses) ? courses.length : 0;
    const totalArticles = Array.isArray(articles) ? articles.length : 0;
    const totalOrders = Array.isArray(orders) ? orders.length : 0;
    const pendingTickets = Array.isArray(tickets)
      ? tickets.filter((t) => Number(t?.answer) !== 1).length
      : 0;

    const parentMenusCount = menus.length;
    const subMenusCount = menus.reduce(
      (acc, m) => acc + (m.subMenus?.length || 0),
      0,
    );

    return {
      totalUsers,
      adminCount,
      bannedCount,
      totalCourses,
      totalArticles,
      totalOrders,
      pendingTickets,
      parentMenusCount,
      subMenusCount,
    };
  }, [users, menus, courses, articles, orders, tickets]);

  // آخرین ۴ کاربر ثبت‌نامی
  const recentUsers = useMemo(() => {
    return [...users].slice(-4).reverse();
  }, [users]);

  // ۴ منوی شاخص هدر
  const topMenus = useMemo(() => {
    return menus.slice(0, 4);
  }, [menus]);

  const isLoading =
    isLoadingUsers ||
    isLoadingMenus ||
    isLoadingProfile ||
    isLoadingCourses ||
    isLoadingArticles ||
    isLoadingOrders ||
    isLoadingTickets;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-14"
      dir="rtl"
    >
      {/* ========================================================= */}
      {/* بخش ۱: هدر خوش‌آمدگویی مینیمال + اکشن‌های سریع کپسولی */}
      {/* ========================================================= */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-[#14151A] sm:text-2xl">
              خوش آمدید،{" "}
              {currentUser?.name || currentUser?.username || "مدیر گرامی"}
            </h1>

            <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
              <Sparkles className="h-3 w-3" />
              مدیریت کل سیستم
            </span>

            {stats.pendingTickets > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-3 py-1 text-[10px] font-extrabold text-[#FF8A00]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF8A00]" />
                {stats.pendingTickets} تیکت نیازمند پاسخ
              </span>
            )}
          </div>
          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            گزارش لحظه‌ای وضعیت کاربران، دوره‌ها، سفارشات و تیکت‌های پشتیبانی
          </p>
        </div>

        {/* دکمه‌های میانبر سریع */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard/admin/courses/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_6px_20px_-6px_rgba(20,21,26,0.06)] transition-all hover:bg-[#FFF4E5] hover:text-[#FF8A00] active:scale-95"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#FF8A00]" />
            <span>دوره جدید</span>
          </Link>

          <Link
            href="/dashboard/admin/offs/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_6px_20px_-6px_rgba(20,21,26,0.06)] transition-all hover:bg-[#FFF4E5] hover:text-[#FF8A00] active:scale-95"
          >
            <TicketPercent className="h-3.5 w-3.5 text-[#3B5BDB]" />
            <span>تخفیف جدید</span>
          </Link>

          <Link
            href="/dashboard/admin/menus/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span>منوی جدید</span>
          </Link>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* بخش ۲: کارت‌های Overview جامع (۶ کارت کلیدی سیستم) */}
      {/* ========================================================= */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {/* ۱. کل کاربران */}
        <div className="flex flex-col justify-between rounded-[28px] bg-white p-4.5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
              {isLoading ? ".." : stats.totalUsers}
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#14151A]">کاربران</h3>
              <p className="mt-0.5 text-[10px] font-medium text-[#8E929F]">
                ثبت‌نام شده
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              href="/dashboard/admin/users"
              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#14151A] hover:text-[#FF8A00]"
            >
              <span>مدیریت</span>
              <ChevronLeft className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* ۲. دوره‌های آموزشی (کارت تیره گرادینت مشابه Completed Courses) */}
        <div className="flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-4.5 text-white shadow-[0_16px_38px_-10px_rgba(20,21,26,0.22)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#14151A]">
              {isLoading ? ".." : stats.totalCourses}
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white">دوره‌ها</h3>
              <p className="mt-0.5 text-[10px] font-medium text-white/60">
                آموزش‌های فعال
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              href="/dashboard/admin/courses"
              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-white/90 hover:text-[#FFCC00]"
            >
              <span>مدیریت</span>
              <ChevronLeft className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* ۳. مقالات */}
        <div className="flex flex-col justify-between rounded-[28px] bg-white p-4.5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-extrabold text-[#3B5BDB]">
              {isLoading ? ".." : stats.totalArticles}
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#14151A]">مقالات</h3>
              <p className="mt-0.5 text-[10px] font-medium text-[#8E929F]">
                مطالب مجله
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              href="/dashboard/admin/articles"
              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#14151A] hover:text-[#3B5BDB]"
            >
              <span>مدیریت</span>
              <ChevronLeft className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* ۴. سفارشات */}
        <div className="flex flex-col justify-between rounded-[28px] bg-white p-4.5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-sm font-extrabold text-[#059669]">
              {isLoading ? ".." : stats.totalOrders}
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#14151A]">سفارشات</h3>
              <p className="mt-0.5 text-[10px] font-medium text-[#8E929F]">
                ثبت‌نام‌ها
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              href="/dashboard/admin/orders"
              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#14151A] hover:text-[#059669]"
            >
              <span>مدیریت</span>
              <ChevronLeft className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* ۵. تیکت‌ها */}
        <div className="flex flex-col justify-between rounded-[28px] bg-white p-4.5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
              {isLoading ? ".." : stats.pendingTickets}
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#14151A]">تیکت‌ها</h3>
              <p className="mt-0.5 text-[10px] font-medium text-[#8E929F]">
                منتظر پاسخ
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              href="/dashboard/admin/tickets"
              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#14151A] hover:text-[#FF8A00]"
            >
              <span>پاسخ‌دهی</span>
              <ChevronLeft className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* ۶. منوها */}
        <div className="flex flex-col justify-between rounded-[28px] bg-white p-4.5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3F0FF] text-sm font-extrabold text-[#7048E8]">
              {isLoading ? ".." : stats.parentMenusCount}
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#14151A]">منوها</h3>
              <p className="mt-0.5 text-[10px] font-medium text-[#8E929F]">
                هدر سایت
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              href="/dashboard/admin/menus"
              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#14151A] hover:text-[#7048E8]"
            >
              <span>مدیریت</span>
              <ChevronLeft className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* بخش ۳: منوهای فعال هدر (به سبک کارت‌های Popular Courses در تصویر رفرنس) */}
      {/* ========================================================= */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold tracking-tight text-[#14151A] sm:text-lg">
            منوهای فعال هدر
          </h2>

          <Link
            href="/dashboard/admin/menus"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#14151A] transition-colors hover:text-[#FF8A00]"
          >
            <span>مدیریت همه منوها</span>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        {isLoadingMenus ? (
          <div className="flex items-center justify-center rounded-[28px] bg-white py-12 shadow-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF4E5] px-4 py-1.5 text-xs font-bold text-[#FF8A00]">
              <span className="h-2 w-2 animate-ping rounded-full bg-[#FF8A00]" />
              در حال بارگذاری منوها...
            </span>
          </div>
        ) : topMenus.length === 0 ? (
          <div className="rounded-[28px] bg-white py-12 text-center text-xs font-semibold text-[#8E929F] shadow-sm">
            هیچ منویی ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topMenus.map((menu, index) => {
              const subCount = menu.subMenus?.length || 0;
              const isBlueAccent = index % 2 === 1;

              return (
                <div
                  key={menu._id}
                  className="flex flex-col justify-between rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${
                          subCount > 0
                            ? "bg-[#EEF2FF] text-[#3B5BDB]"
                            : "bg-[#ECFDF5] text-[#059669]"
                        }`}
                      >
                        {subCount > 0 ? "دارای زیرمجموعه" : "سردسته مستقل"}
                      </span>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB]">
                        <Compass className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="relative pr-3.5">
                      <span
                        className={`absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full ${
                          isBlueAccent ? "bg-[#3B5BDB]" : "bg-[#FF8A00]"
                        }`}
                      />
                      <h3 className="truncate text-sm font-extrabold text-[#14151A]">
                        {menu.title}
                      </h3>
                      <p
                        dir="ltr"
                        className="mt-1 truncate text-left text-[11px] font-semibold text-[#8E929F]"
                      >
                        /{menu.href}
                      </p>
                    </div>
                  </div>

                  <div className="my-4 h-[1px] w-full bg-[#F1F0EC]" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-[#FF8A00]" />
                      <span className="text-xs font-extrabold text-[#14151A]">
                        {subCount}
                      </span>
                      <span className="text-[10px] font-semibold text-[#8E929F]">
                        زیرمنو
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/admin/menus/edit/${menu._id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-[#FFCC00] px-3.5 py-2 text-[11px] font-extrabold text-[#14151A] shadow-sm transition-all hover:bg-[#FFD633] active:scale-95"
                    >
                      <span>ویرایش</span>
                      <ChevronLeft className="h-3 w-3" strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ========================================================= */}
      {/* بخش ۴: جدیدترین کاربران (دقیقاً به سبک جدول My Courses در پایین تصویر رفرنس) */}
      {/* ========================================================= */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold tracking-tight text-[#14151A] sm:text-lg">
            جدیدترین کاربران
          </h2>

          <Link
            href="/dashboard/admin/users"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#14151A] transition-colors hover:text-[#FF8A00]"
          >
            <span>مشاهده همه کاربران</span>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        {isLoadingUsers ? (
          <div className="flex items-center justify-center rounded-[28px] bg-white py-12 shadow-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF4E5] px-4 py-1.5 text-xs font-bold text-[#FF8A00]">
              <span className="h-2 w-2 animate-ping rounded-full bg-[#FF8A00]" />
              در حال دریافت کاربران...
            </span>
          </div>
        ) : recentUsers.length === 0 ? (
          <div className="rounded-[28px] bg-white py-12 text-center text-xs font-semibold text-[#8E929F] shadow-sm">
            هنوز کاربری ثبت‌نام نکرده است.
          </div>
        ) : (
          <>
            {/* 📱 نمای موبایل: کارت‌های جمع‌وجور نیتیو */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {recentUsers.map((user) => {
                const isAdmin = user.role === "ADMIN";
                const isBanned = Boolean(user.isBan);

                return (
                  <div
                    key={user._id}
                    className="relative flex items-center justify-between overflow-hidden rounded-[24px] bg-white p-4 shadow-[0_8px_25px_-8px_rgba(20,21,26,0.05)]"
                  >
                    <span
                      className={`absolute right-0 top-3.5 bottom-3.5 w-1 rounded-l-full ${
                        isBanned
                          ? "bg-[#E11D48]"
                          : isAdmin
                            ? "bg-[#FF8A00]"
                            : "bg-[#059669]"
                      }`}
                    />

                    <div className="flex items-center gap-3 pr-2">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-extrabold ${
                          isAdmin
                            ? "bg-[#FFF4E5] text-[#FF8A00]"
                            : "bg-[#EEF2FF] text-[#3B5BDB]"
                        }`}
                      >
                        {user.name?.charAt(0) ||
                          user.username?.charAt(0) ||
                          "U"}
                      </div>

                      <div>
                        <p className="text-xs font-extrabold text-[#14151A]">
                          {user.name || "بی‌نام"}
                        </p>
                        <p
                          dir="ltr"
                          className="mt-0.5 text-[10px] font-semibold text-[#8E929F]"
                        >
                          {user.email || `@${user.username}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          isAdmin
                            ? "bg-[#FFF4E5] text-[#FF8A00]"
                            : "bg-[#EEF2FF] text-[#3B5BDB]"
                        }`}
                      >
                        {isAdmin ? "ADMIN" : "USER"}
                      </span>

                      {isBanned ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2 py-0.5 text-[9px] font-extrabold text-[#E11D48]">
                          مسدود
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[9px] font-extrabold text-[#059669]">
                          فعال
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 💻 نمای دسکتاپ: دقیقاً مشابه جدول My Courses در تصویر رفرنس */}
            <div className="hidden md:block">
              <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
                <div className="col-span-4">نام کاربر</div>
                <div className="col-span-3">ایمیل / نام کاربری</div>
                <div className="col-span-2 text-center">نقش</div>
                <div className="col-span-2 text-center">وضعیت حساب</div>
                <div className="col-span-1 text-center">مدیریت</div>
              </div>

              <div className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]">
                {recentUsers.map((user) => {
                  const isAdmin = user.role === "ADMIN";
                  const isBanned = Boolean(user.isBan);

                  return (
                    <div
                      key={user._id}
                      className="grid grid-cols-12 items-center px-4 py-3.5 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                    >
                      <div className="col-span-4 flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                            isAdmin
                              ? "bg-[#FFF4E5] text-[#FF8A00]"
                              : "bg-[#EEF2FF] text-[#3B5BDB]"
                          }`}
                        >
                          {user.name?.charAt(0) ||
                            user.username?.charAt(0) ||
                            "U"}
                        </div>
                        <span className="truncate font-extrabold text-[#14151A]">
                          {user.name || "بی‌نام"}
                        </span>
                      </div>

                      <div className="col-span-3">
                        <span
                          dir="ltr"
                          className="inline-block max-w-full truncate rounded-full bg-[#F3F0FF] px-3 py-1 text-[10px] font-bold text-[#7048E8]"
                        >
                          {user.email || `@${user.username}`}
                        </span>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-3 py-1 text-[10px] font-extrabold text-[#FF8A00]">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            مدیر کل (ADMIN)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-extrabold text-[#3B5BDB]">
                            <UserCheck className="h-3.5 w-3.5" />
                            کاربر (USER)
                          </span>
                        )}
                      </div>

                      <div className="col-span-2 flex justify-center">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-3 py-1 text-[10px] font-extrabold text-[#E11D48]">
                            <Ban className="h-3 w-3" />
                            مسدود شده
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
                            <CheckCircle2 className="h-3 w-3" />
                            فعال
                          </span>
                        )}
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <Link
                          href="/dashboard/admin/users"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                          title="مدیریت کاربر"
                        >
                          <ArrowUpLeft className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
