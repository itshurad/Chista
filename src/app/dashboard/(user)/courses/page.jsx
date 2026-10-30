"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  PlayCircle,
  Sparkles,
  Plus,
  ChevronLeft,
  AlertCircle,
  Headphones,
  User,
  Layers,
  Calendar,
} from "lucide-react";

import { useOrders } from "@/hooks/useOrders";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const formatDate = (date) => {
  if (!date) return "---";
  return new Date(date).toLocaleDateString("fa-IR");
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28 },
  },
};

export default function UserCoursesPage() {
  const { data, isLoading, isError } = useOrders();

  // استخراج لیست دوره‌های ثبت‌نام شده از سفارشات کاربر
  const enrolledOrders = useMemo(() => {
    const raw = data?.orders || data?.courses || data?.allOrders || data || [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  // فیلتر وضعیت (ALL | COMPLETED | PRESELL)
  const [statusFilter, setStatusFilter] = useState("ALL");

  const completedCount = useMemo(
    () =>
      enrolledOrders.filter((item) => item.course?.status === "COMPLETED")
        .length,
    [enrolledOrders],
  );
  const inProgressCount = enrolledOrders.length - completedCount;

  const filteredCourses = useMemo(() => {
    if (statusFilter === "COMPLETED") {
      return enrolledOrders.filter(
        (item) => item.course?.status === "COMPLETED",
      );
    }
    if (statusFilter === "PRESELL") {
      return enrolledOrders.filter(
        (item) => item.course?.status !== "COMPLETED",
      );
    }
    return enrolledOrders;
  }, [enrolledOrders, statusFilter]);

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* ========================================================= */}
      {/* بخش ۱: هدر صفحه + بج‌های خلاصه + دکمه ثبت‌نام دوره جدید */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <BookOpen className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                دوره‌های آموزشی من
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {completedCount} تکمیل شده
              </span>

              {inProgressCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3B5BDB]" />
                  {inProgressCount} در حال برگزاری
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              دسترسی دائمی به ویدیوها، جلسات آموزشی و پشتیبانی دوره‌های شما
            </p>
          </div>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>ثبت‌نام دوره جدید</span>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* بخش ۲: ۳ کارت Overview برای فیلتر سریع */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* همه دوره‌های من */}
        <button
          type="button"
          onClick={() => setStatusFilter("ALL")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            statusFilter === "ALL"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                statusFilter === "ALL"
                  ? "bg-white text-[#14151A]"
                  : "bg-[#FFF4E5] text-[#FF8A00]"
              }`}
            >
              {enrolledOrders.length}
            </div>
            <div>
              <p className="text-sm font-extrabold">همه دوره‌های من</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  statusFilter === "ALL" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                کل دوره‌های ثبت‌نام شده
              </p>
            </div>
          </div>
        </button>

        {/* دوره‌های تکمیل شده */}
        <button
          type="button"
          onClick={() => setStatusFilter("COMPLETED")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            statusFilter === "COMPLETED"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-sm font-extrabold text-[#059669]">
              {completedCount}
            </div>
            <div>
              <p className="text-sm font-extrabold">تکمیل شده</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  statusFilter === "COMPLETED"
                    ? "text-white/60"
                    : "text-[#8E929F]"
                }`}
              >
                آماده مشاهده کامل جلسات
              </p>
            </div>
          </div>
        </button>

        {/* در حال برگزاری */}
        <button
          type="button"
          onClick={() => setStatusFilter("PRESELL")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            statusFilter === "PRESELL"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
              {inProgressCount}
            </div>
            <div>
              <p className="text-sm font-extrabold">در حال برگزاری</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  statusFilter === "PRESELL"
                    ? "text-white/60"
                    : "text-[#8E929F]"
                }`}
              >
                دریافت آپدیت‌های هفتگی
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* ========================================================= */}
      {/* بخش ۳: وضعیت‌های Loading / Error / Empty و گرید دوره‌های دانشجو */}
      {/* ========================================================= */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت دوره‌های شما...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-10 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            خطا در دریافت لیست دوره‌های شما
          </p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            بدون دوره
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            در این بخش هنوز دوره‌ای برای شما ثبت نشده است
          </p>
          <Link
            href="/courses"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-6 py-2.5 text-xs font-extrabold text-[#14151A] shadow-sm transition-transform active:scale-95"
          >
            <span>مشاهده کاتالوگ دوره‌ها</span>
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>
      ) : (
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filteredCourses.map((order, idx) => {
            const course = order.course || {};
            const coverImg = order.coverUrl;
            console.log(order);
            const isCompleted = course.status === "COMPLETED";

            const barColorClass =
              idx % 3 === 1
                ? "bg-[#3B5BDB]"
                : idx % 3 === 2
                  ? "bg-[#059669]"
                  : "bg-[#FF8A00]";

            return (
              <motion.div
                key={order._id || course._id || idx}
                variants={itemVariants}
                className="group flex flex-col justify-between rounded-[30px] bg-white p-4 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-12px_rgba(20,21,26,0.1)]"
              >
                <div>
                  {/* قاب تصویر شاخص دوره + بج‌های وضعیت روی تصویر */}
                  <div className="relative mb-4 h-44 w-full overflow-hidden rounded-[22px] bg-[#F8F7F4]">
                    {coverImg ? (
                      <img
                        src={coverImg}
                        alt={course.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#FFF4E5] to-[#EEF2FF] text-[#8E929F]">
                        <BookOpen className="mb-1.5 h-8 w-8 text-[#FF8A00]" />
                        <span className="text-[10px] font-bold">
                          دوره آموزشی
                        </span>
                      </div>
                    )}

                    {/* بج دسته‌بندی و وضعیت روی تصویر */}
                    <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF]/95 px-3 py-1 text-[10px] font-extrabold text-[#3B5BDB] shadow-sm backdrop-blur-md">
                        <Layers className="h-3 w-3" />
                        {course.categoryID?.title || "تخصصی"}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5]/95 px-2.5 py-1 text-[10px] font-extrabold text-[#059669] shadow-sm backdrop-blur-md">
                          <CheckCircle2 className="h-3 w-3" />
                          تکمیل شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5]/95 px-2.5 py-1 text-[10px] font-extrabold text-[#FF8A00] shadow-sm backdrop-blur-md">
                          <Sparkles className="h-3 w-3" />
                          در حال برگزاری
                        </span>
                      )}
                    </div>
                  </div>

                  {/* نام دوره و توضیحات با نوار عمودی رنگی */}
                  <div className="relative px-1 pr-4">
                    <span
                      className={`absolute right-1 top-0.5 bottom-0.5 w-1.5 rounded-full ${barColorClass}`}
                    />
                    <Link
                      href={
                        course.href ? `/courses/${course.href}` : "/courses"
                      }
                    >
                      <h3 className="line-clamp-1 text-sm font-extrabold text-[#14151A] transition-colors group-hover:text-[#FF8A00]">
                        {course.name || "دوره آموزشی"}
                      </h3>
                    </Link>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed font-medium text-[#8E929F]">
                      {course.description ||
                        "دسترسی کامل به تمام ویدیوها و فایل‌های پیوست این دوره برای شما فعال است."}
                    </p>
                  </div>

                  {/* بج‌های اطلاعات فرعی دوره (مدرس، زمان و پشتیبانی) */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5 px-1">
                    {course.creator?.name && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-2.5 py-1 text-[10px] font-bold text-[#14151A]">
                        <User className="h-3 w-3 text-[#3B5BDB]" />
                        {course.creator.name}
                      </span>
                    )}

                    {course.time && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-2.5 py-1 text-[10px] font-bold text-[#14151A]">
                        <Clock className="h-3 w-3 text-[#FF8A00]" />
                        {course.time}
                      </span>
                    )}

                    {course.support && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-2.5 py-1 text-[10px] font-bold text-[#14151A]">
                        <Headphones className="h-3 w-3 text-[#059669]" />
                        {course.support}
                      </span>
                    )}
                  </div>
                </div>

                {/* فوتر کارت: تاریخ ثبت‌نام + دکمه ورود به جلسات دوره */}
                <div className="px-1">
                  <div className="my-4 h-[1px] w-full bg-[#F1F0EC]" />

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#059669]">
                        <CheckCircle2 className="h-3 w-3" />
                        دانشجوی دوره
                      </span>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#8E929F]">
                        <Calendar className="h-3 w-3 text-[#FF8A00]" />
                        ثبت‌نام: {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <Link
                      href={
                        course.href ? `/courses/${course.href}` : "/courses"
                      }
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FFCC00] px-4 py-2.5 text-[11px] font-extrabold text-[#14151A] shadow-[0_8px_18px_-4px_rgba(255,204,0,0.5)] transition-all hover:bg-[#FFD633] active:scale-95"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>مشاهده جلسات</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
