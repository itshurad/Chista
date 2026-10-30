"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Plus,
  ChevronLeft,
  PlayCircle,
  Sparkles,
  ShoppingBag,
  ArrowUpLeft,
  Layers,
  User,
} from "lucide-react";

import { useProfile } from "@/hooks/useUsers";
import { useOrders } from "@/hooks/useOrders";
import { useAllTickets } from "@/hooks/useTickets";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const getCoverUrl = (course) => {
  if (!course) return "";
  if (course.coverUrl) return course.coverUrl;
  if (course.cover) {
    if (course.cover.startsWith("http") || course.cover.startsWith("/")) {
      return course.cover;
    }
    return `${API_URL}/courses/covers/${course.cover}`;
  }
  return "";
};

const formatDate = (date) => {
  if (!date) return "---";
  return new Date(date).toLocaleDateString("fa-IR");
};

const formatPrice = (price) => {
  if (price === undefined || price === null) return "---";
  if (Number(price) === 0) return "رایگان";
  return `${Number(price).toLocaleString("fa-IR")} تومان`;
};

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

export default function UserDashboardHomePage() {
  const { data: profileData, isLoading: isLoadingProfile } = useProfile();
  const { data: ordersData, isLoading: isLoadingOrders } = useOrders();
  const { data: ticketsData, isLoading: isLoadingTickets } = useAllTickets();

  const user = profileData?.me || profileData?.user || profileData || {};

  // استخراج لیست سفارشات و دوره‌های خریداری‌شده کاربر
  const orders = useMemo(() => {
    const raw =
      ordersData?.orders ||
      ordersData?.courses ||
      ordersData?.allOrders ||
      ordersData ||
      [];
    return Array.isArray(raw) ? raw : [];
  }, [ordersData]);

  // استخراج لیست تیکت‌های کاربر
  const tickets = useMemo(() => {
    const raw =
      ticketsData?.tickets ||
      ticketsData?.allTickets ||
      ticketsData?.mainTickets ||
      ticketsData ||
      [];
    return Array.isArray(raw) ? raw : [];
  }, [ticketsData]);

  // آمار خلاصه دانشجو
  const stats = useMemo(() => {
    const totalCourses = orders.length;
    const completedCourses = orders.filter(
      (o) => o.course?.status === "COMPLETED",
    ).length;
    const inProgressCourses = totalCourses - completedCourses;
    const answeredTickets = tickets.filter(
      (t) => Number(t?.answer) === 1,
    ).length;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalTickets: tickets.length,
      answeredTickets,
    };
  }, [orders, tickets]);

  const myRecentCourses = useMemo(() => orders.slice(0, 4), [orders]);
  const recentTickets = useMemo(() => tickets.slice(0, 4), [tickets]);

  const isLoading = isLoadingProfile || isLoadingOrders || isLoadingTickets;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
      dir="rtl"
    >
      {/* ========================================================= */}
      {/* بخش ۱: بنر خوش‌آمدگویی و خلاصه وضعیت یادگیری */}
      {/* ========================================================= */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-[#14151A] sm:text-2xl">
              سلام، {user?.name || user?.username || "دانشجوی عزیز"} 👋
            </h1>

            <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
              <Sparkles className="h-3 w-3" />
              مسیر یادگیری فعال
            </span>
          </div>

          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            از اینجا به تمام دوره‌های ثبت‌نام‌شده، فاکتورها و تیکت‌های پشتیبانی
            خود دسترسی دارید
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_6px_20px_-6px_rgba(20,21,26,0.06)] transition-all hover:bg-[#FFF4E5] hover:text-[#FF8A00]"
          >
            <User className="h-3.5 w-3.5 text-[#FF8A00]" />
            <span>ویرایش پروفایل</span>
          </Link>

          <Link
            href="/dashboard/tickets/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span>ارسال تیکت جدید</span>
          </Link>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* بخش ۲: ۴ کارت Overview دانشجو */}
      {/* ========================================================= */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {/* کارت ۱: کل دوره‌های من */}
        <div className="flex flex-col justify-between rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-base font-extrabold text-[#FF8A00]">
              {isLoading ? ".." : stats.totalCourses}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#14151A]">
                دوره‌های ثبت‌نامی
              </h3>
              <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                کل دوره‌های حساب شما
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#14151A] hover:text-[#FF8A00]"
            >
              <span>مشاهده دوره‌ها</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* کارت ۲: دوره‌های تکمیل شده (گرادینت تیره) */}
        <div className="flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-5 text-white shadow-[0_16px_38px_-10px_rgba(20,21,26,0.22)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-base font-extrabold text-[#14151A]">
              {isLoading ? ".." : stats.completedCourses}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                دوره‌های تکمیل شده
              </h3>
              <p className="mt-0.5 text-[11px] font-medium text-white/60">
                آماده مشاهده کامل
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-white/90 hover:text-[#FFCC00]"
            >
              <span>ادامه یادگیری</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* کارت ۳: در حال برگزاری */}
        <div className="flex flex-col justify-between rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-base font-extrabold text-[#3B5BDB]">
              {isLoading ? ".." : stats.inProgressCourses}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#14151A]">
                در حال برگزاری
              </h3>
              <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                دریافت آپدیت‌های هفتگی
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#14151A] hover:text-[#3B5BDB]"
            >
              <span>سفارشات من</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* کارت ۴: تیکت‌های پشتیبانی */}
        <div className="flex flex-col justify-between rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-base font-extrabold text-[#059669]">
              {isLoading ? ".." : stats.totalTickets}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#14151A]">
                تیکت‌های من
              </h3>
              <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                {stats.answeredTickets} پاسخ دریافت شده
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Link
              href="/dashboard/tickets"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#14151A] hover:text-[#059669]"
            >
              <span>مشاهده تیکت‌ها</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* بخش ۳: دوره‌های اخیر من (همراه با کاور و دکمه ادامه یادگیری) */}
      {/* ========================================================= */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold tracking-tight text-[#14151A] sm:text-lg">
            دوره‌های در حال یادگیری من
          </h2>

          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#14151A] transition-colors hover:text-[#FF8A00]"
          >
            <span>همه دوره‌های من</span>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        {isLoadingOrders ? (
          <div className="flex items-center justify-center rounded-[28px] bg-white py-12 shadow-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF4E5] px-4 py-1.5 text-xs font-bold text-[#FF8A00]">
              <span className="h-2 w-2 animate-ping rounded-full bg-[#FF8A00]" />
              در حال دریافت دوره‌های شما...
            </span>
          </div>
        ) : myRecentCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[30px] bg-white py-14 text-center shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00]">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-sm font-extrabold text-[#14151A]">
              هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید
            </p>
            <p className="mt-1 text-xs font-medium text-[#8E929F]">
              همین حالا اولین دوره تخصصی خود را انتخاب و یادگیری را شروع کنید
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-6 py-2.5 text-xs font-extrabold text-[#14151A] shadow-sm"
            >
              <span>مشاهده کاتالوگ دوره‌ها</span>
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {myRecentCourses.map((order, idx) => {
              const course = order.course || {};
              const coverImg = getCoverUrl(course);
              const isCompleted = course.status === "COMPLETED";
              const barColor = idx % 2 === 0 ? "bg-[#FF8A00]" : "bg-[#3B5BDB]";

              return (
                <div
                  key={order._id}
                  className="group flex flex-col justify-between rounded-[28px] bg-white p-4 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <div>
                    {/* تصویر کاور دوره */}
                    <div className="relative mb-3.5 h-38 w-full overflow-hidden rounded-[20px] bg-[#F8F7F4]">
                      {coverImg ? (
                        <img
                          src={coverImg}
                          alt={course.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFF4E5] to-[#EEF2FF] text-[#FF8A00]">
                          <BookOpen className="h-7 w-7" />
                        </div>
                      )}

                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold backdrop-blur-md ${
                            isCompleted
                              ? "bg-[#ECFDF5]/95 text-[#059669]"
                              : "bg-[#EEF2FF]/95 text-[#3B5BDB]"
                          }`}
                        >
                          {isCompleted ? "تکمیل شده" : "در حال برگزاری"}
                        </span>
                      </div>
                    </div>

                    {/* نام دوره با نوار عمودی رنگی */}
                    <div className="relative px-1 pr-3.5">
                      <span
                        className={`absolute right-0.5 top-0.5 bottom-0.5 w-1.5 rounded-full ${barColor}`}
                      />
                      <h3 className="line-clamp-1 text-sm font-extrabold text-[#14151A]">
                        {course.name || "دوره آموزشی"}
                      </h3>
                      <p className="mt-1 text-[10px] font-semibold text-[#8E929F]">
                        ثبت‌نام: {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="px-1">
                    <div className="my-3.5 h-[1px] w-full bg-[#F1F0EC]" />

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                        <CheckCircle2 className="h-3 w-3" />
                        دسترسی کامل
                      </span>

                      <Link
                        href={
                          course.href ? `/courses/${course.href}` : "/courses"
                        }
                        className="inline-flex items-center gap-1 rounded-full bg-[#FFCC00] px-3.5 py-2 text-[11px] font-extrabold text-[#14151A] shadow-2xs transition-all hover:bg-[#FFD633] active:scale-95"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>مشاهده جلسات</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ========================================================= */}
      {/* بخش ۴: آخرین تیکت‌ها و پشتیبانی (جدول دسکتاپ + کارت موبایل) */}
      {/* ========================================================= */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold tracking-tight text-[#14151A] sm:text-lg">
            آخرین تیکت‌های پشتیبانی من
          </h2>

          <Link
            href="/dashboard/tickets"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#14151A] transition-colors hover:text-[#FF8A00]"
          >
            <span>همه تیکت‌ها</span>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        {isLoadingTickets ? (
          <div className="flex items-center justify-center rounded-[28px] bg-white py-12 shadow-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF4E5] px-4 py-1.5 text-xs font-bold text-[#FF8A00]">
              <span className="h-2 w-2 animate-ping rounded-full bg-[#FF8A00]" />
              در حال دریافت تیکت‌ها...
            </span>
          </div>
        ) : recentTickets.length === 0 ? (
          <div className="flex items-center justify-between rounded-[28px] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#3B5BDB]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#14151A]">
                  شما هنوز تیکتی ثبت نکرده‌اید
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                  در صورت بروز هرگونه سوال فنی یا مالی، تیکت ارسال کنید
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/tickets/new"
              className="rounded-full bg-[#FFCC00] px-4 py-2 text-xs font-extrabold text-[#14151A]"
            >
              ثبت تیکت
            </Link>
          </div>
        ) : (
          <>
            {/* 📱 نمای موبایل */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {recentTickets.map((ticket) => {
                const isAnswered = Number(ticket.answer) === 1;

                return (
                  <Link
                    key={ticket._id}
                    href="/dashboard/tickets"
                    className="relative flex items-center justify-between overflow-hidden rounded-[24px] bg-white p-4 shadow-[0_8px_25px_-8px_rgba(20,21,26,0.05)]"
                  >
                    <span
                      className={`absolute right-0 top-3.5 bottom-3.5 w-1 rounded-l-full ${
                        isAnswered ? "bg-[#059669]" : "bg-[#FF8A00]"
                      }`}
                    />

                    <div className="min-w-0 pr-2">
                      <p className="truncate text-xs font-extrabold text-[#14151A]">
                        {ticket.title || "بدون عنوان"}
                      </p>
                      <span className="mt-1 inline-block text-[10px] font-semibold text-[#8E929F]">
                        {ticket.department?.title || "پشتیبانی"} •{" "}
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>

                    {isAnswered ? (
                      <span className="shrink-0 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                        پاسخ داده شده
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[10px] font-extrabold text-[#FF8A00]">
                        منتظر پاسخ
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* 💻 نمای دسکتاپ */}
            <div className="hidden md:block">
              <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
                <div className="col-span-5">عنوان تیکت</div>
                <div className="col-span-3">واحد پشتیبانی</div>
                <div className="col-span-2 text-center">تاریخ ثبت</div>
                <div className="col-span-1 text-center">وضعیت</div>
                <div className="col-span-1 text-center">مشاهده</div>
              </div>

              <div className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]">
                {recentTickets.map((ticket) => {
                  const isAnswered = Number(ticket.answer) === 1;

                  return (
                    <div
                      key={ticket._id}
                      className="grid grid-cols-12 items-center px-4 py-3.5 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isAnswered
                              ? "bg-[#ECFDF5] text-[#059669]"
                              : "bg-[#FFF4E5] text-[#FF8A00]"
                          }`}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <span className="truncate font-extrabold text-[#14151A]">
                          {ticket.title || "بدون عنوان"}
                        </span>
                      </div>

                      <div className="col-span-3">
                        <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-bold text-[#3B5BDB]">
                          {ticket.department?.title || "پشتیبانی"}
                        </span>
                      </div>

                      <div className="col-span-2 text-center text-[11px] font-semibold text-[#8E929F]">
                        {formatDate(ticket.createdAt)}
                      </div>

                      <div className="col-span-1 flex justify-center">
                        {isAnswered ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                            <CheckCircle2 className="h-3 w-3" />
                            پاسخ داده شده
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[10px] font-extrabold text-[#FF8A00]">
                            <Clock3 className="h-3 w-3" />
                            منتظر پاسخ
                          </span>
                        )}
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <Link
                          href="/dashboard/tickets"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
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
