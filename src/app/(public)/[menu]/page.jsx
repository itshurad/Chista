"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  X,
  Star,
  Clock,
  Users,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Layers,
  User,
} from "lucide-react";

import { useAllCoursesByMenu } from "@/hooks/useCourses";
import { useParams } from "next/navigation";

export default function CoursesPage() {
  const { menu } = useParams();
  const { data: coursesData, isLoading, isError } = useAllCoursesByMenu(menu);

  const courses = coursesData?.allCourse || [];

  // استیت‌های ساده فیلتر و جستجو
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | COMPLETED | PRESELL
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // آمار دوره‌ها برای کارت‌های Overview
  const completedCount = courses.filter((c) => c.status === "COMPLETED").length;
  const presellCount = courses.length - completedCount;

  // فیلتر کردن لیست دوره‌ها
  const filteredCourses = courses.filter((course) => {
    // ۱. فیلتر وضعیت برگزاری
    if (statusFilter === "COMPLETED" && course.status !== "COMPLETED") {
      return false;
    }
    if (statusFilter === "PRESELL" && course.status === "COMPLETED") {
      return false;
    }

    // ۲. فیلتر دسته‌بندی
    const courseCatId =
      typeof course.categoryID === "object"
        ? course.categoryID?._id
        : course.categoryID;

    if (selectedCategory !== "ALL" && courseCatId !== selectedCategory) {
      return false;
    }

    // ۳. فیلتر جستجو
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      course.name?.toLowerCase().includes(q) ||
      course.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8F7F4]" dir="rtl">
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* ========================================================= */}
        {/* ۱. هدر صفحه + باکس جستجوی کپسولی (مشابه Search something در تصویر رفرنس) */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
              <BookOpen className="h-5 w-5" strokeWidth={2.2} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-[#14151A] sm:text-2xl">
                  دوره‌های آموزشی
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                  {courses.length} دوره فعال
                </span>
              </div>

              <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
                یادگیری پروژه‌محور با پشتیبانی مستقیم مدرسین
              </p>
            </div>
          </div>

          {/* نوار جستجوی کپسولی سفید */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نام یا موضوع دوره..."
              className="w-full rounded-full border border-transparent bg-white py-3 pr-5 pl-11 text-xs font-semibold text-[#14151A] shadow-[0_6px_24px_-6px_rgba(20,21,26,0.06)] outline-none transition-all placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:ring-4 focus:ring-[#FFF4E5]"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 left-3 my-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] hover:text-[#14151A]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Search className="pointer-events-none absolute inset-y-0 left-4 my-auto h-4 w-4 text-[#8E929F]" />
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ۲. کارت‌های Overview برای فیلتر وضعیت (مشابه Courses Overview در تصویر اول) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {/* همه دوره‌ها */}
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
                {courses.length}
              </div>
              <div>
                <p className="text-sm font-extrabold">همه دوره‌ها</p>
                <p
                  className={`mt-0.5 text-[11px] font-medium ${
                    statusFilter === "ALL" ? "text-white/60" : "text-[#8E929F]"
                  }`}
                >
                  نمایش تمام دوره‌های آکادمی
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
                  آماده مشاهده کامل
                </p>
              </div>
            </div>
          </button>

          {/* دوره‌های پیش‌فروش */}
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
                {presellCount}
              </div>
              <div>
                <p className="text-sm font-extrabold">در حال پیش‌فروش</p>
                <p
                  className={`mt-0.5 text-[11px] font-medium ${
                    statusFilter === "PRESELL"
                      ? "text-white/60"
                      : "text-[#8E929F]"
                  }`}
                >
                  در حال برگزاری و آپدیت
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* ========================================================= */}
        {/* ۴. وضعیت‌های Loading / Error / Empty و گرید کارت‌های دوره */}
        {/* ========================================================= */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-20 shadow-sm">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
              <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
              <span>در حال دریافت دوره‌ها...</span>
            </div>
          </div>
        ) : isError ? (
          /* بج خطا با پس‌زمینه قرمز نزدیک به سفید و متن قرمز پررنگ مکمل */
          <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-10 text-center">
            <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
              <AlertCircle className="h-5 w-5" />
            </div>
            <p className="text-xs font-extrabold text-[#E11D48]">
              خطا در دریافت لیست دوره‌ها از سرور
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-sm">
            <span className="mb-2 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
              بدون نتیجه
            </span>
            <p className="text-xs font-semibold text-[#8E929F]">
              هیچ دوره‌ای مطابق با فیلتر انتخابی شما یافت نشد
            </p>
          </div>
        ) : (
          /* گرید ۴ ستونه کارت‌های دوره (دقیقاً مشابه Popular Courses در تصویر رفرنس) */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCourses.map((course, idx) => {
              const coverImg = course.coverUrl;
              const isCompleted = course.status === "COMPLETED";
              const price = Number(course.price) || 0;
              const discount = Number(course.discount) || 0;
              const finalPrice =
                discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
              const rating = course.courseAverageScore || course.score || 5;

              // رنگ نوار عمودی کنار نام دوره مشابه تصویر رفرنس
              const barColorClass =
                idx % 3 === 1
                  ? "bg-[#3B5BDB]"
                  : idx % 3 === 2
                    ? "bg-[#059669]"
                    : "bg-[#FF8A00]";

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
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
                            بدون تصویر کاور
                          </span>
                        </div>
                      )}

                      {/* بج دسته‌بندی (آبی مشابه Popular in week) در بالای تصویر */}
                      <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF]/95 px-3 py-1 text-[10px] font-extrabold text-[#3B5BDB] shadow-sm backdrop-blur-md">
                          <Layers className="h-3 w-3" />
                          {course.categoryID?.title || "عمومی"}
                        </span>

                        {/* بج وضعیت دوره (سبز برای تکمیل شده / نارنجی برای پیش‌فروش) */}
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5]/95 px-2.5 py-1 text-[10px] font-extrabold text-[#059669] shadow-sm backdrop-blur-md">
                            <CheckCircle2 className="h-3 w-3" />
                            تکمیل شده
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5]/95 px-2.5 py-1 text-[10px] font-extrabold text-[#FF8A00] shadow-sm backdrop-blur-md">
                            <Sparkles className="h-3 w-3" />
                            پیش‌فروش
                          </span>
                        )}
                      </div>

                      {/* بج تخفیف (قرمز نزدیک به سفید + متن قرمز پررنگ مکمل) */}
                      {discount > 0 && (
                        <div className="absolute bottom-2.5 right-2.5">
                          <span className="rounded-full border border-[#FFE0E3] bg-[#FFF2F2]/95 px-2.5 py-0.5 text-[10px] font-extrabold text-[#E11D48] shadow-sm backdrop-blur-md">
                            {discount}% تخفیف
                          </span>
                        </div>
                      )}
                    </div>

                    {/* نام دوره و توضیحات با نوار عمودی رنگی در سمت راست */}
                    <div className="relative px-1 pr-4">
                      <span
                        className={`absolute right-1 top-0.5 bottom-0.5 w-1.5 rounded-full ${barColorClass}`}
                      />
                      <Link href={`/courses/${course.href}`}>
                        <h3 className="line-clamp-1 text-sm font-extrabold text-[#14151A] transition-colors group-hover:text-[#FF8A00]">
                          {course.name}
                        </h3>
                      </Link>
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed font-medium text-[#8E929F]">
                        {course.description}
                      </p>
                    </div>

                    {/* بج‌های اطلاعات فرعی دوره (مدرس، زمان و تعداد دانشجو) */}
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

                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-2.5 py-1 text-[10px] font-bold text-[#14151A]">
                        <Users className="h-3 w-3 text-[#059669]" />
                        {Number(course.students || 0).toLocaleString("fa-IR")}
                      </span>
                    </div>
                  </div>

                  {/* فوتر کارت: خط جداکننده + امتیاز و قیمت + دکمه کپسولی زرد طلایی Get Course */}
                  <div className="px-1">
                    <div className="my-4 h-[1px] w-full bg-[#F1F0EC]" />

                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                          <span className="text-xs font-extrabold text-[#14151A]">
                            {rating}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                          <span className="text-sm font-extrabold text-[#14151A]">
                            {finalPrice === 0
                              ? "رایگان"
                              : finalPrice.toLocaleString("fa-IR")}
                          </span>
                          {finalPrice > 0 && (
                            <span className="text-[10px] font-bold text-[#8E929F]">
                              تومان
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="text-[10px] font-semibold text-[#A0A4B0] line-through">
                              {price.toLocaleString("fa-IR")}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/courses/${course.href}`}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#FFCC00] px-4 py-2.5 text-[11px] font-extrabold text-[#14151A] shadow-[0_8px_18px_-4px_rgba(255,204,0,0.5)] transition-all hover:bg-[#FFD633] active:scale-95"
                      >
                        <span>مشاهده دوره</span>
                        <ChevronLeft
                          className="h-3.5 w-3.5"
                          strokeWidth={2.5}
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
