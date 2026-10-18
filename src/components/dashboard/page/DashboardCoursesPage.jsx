"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Star,
  Users,
  Clock,
  Headphones,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Tag,
  UserCheck,
  Layers,
} from "lucide-react";
import { useDeleteCourse, useAllCourses } from "@/hooks/useCourses";

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

export default function DashboardCoursesPage() {
  const { data, isLoading, isError } = useAllCourses();
  const { mutateAsync: deleteCourse, isPending: isDeleting } =
    useDeleteCourse();

  const courses = data?.allCourse || data?.courses || data || [];

  // فیلتر سریع بالای صفحه (ALL | COMPLETED | PRESELL)
  const [statusFilter, setStatusFilter] = useState("ALL");

  // استیت مدال حذف نیتیو (جایگزین window.confirm)
  const [deleteTarget, setDeleteTarget] = useState(null);

  // -----------------------------
  // آمار دوره‌ها (مشابه Courses Overview در تصویر رفرنس)
  // -----------------------------
  const completedCount = useMemo(
    () => courses.filter((c) => c.status === "COMPLETED").length,
    [courses],
  );
  const presellCount = courses.length - completedCount;

  const filteredCourses = useMemo(() => {
    if (statusFilter === "COMPLETED") {
      return courses.filter((c) => c.status === "COMPLETED");
    }
    if (statusFilter === "PRESELL") {
      return courses.filter((c) => c.status !== "COMPLETED");
    }
    return courses;
  }, [courses, statusFilter]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCourse(deleteTarget._id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("خطا در حذف دوره:", error);
    }
  };

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* بخش ۱: هدر صفحه + دکمه کپسولی طلایی (مشابه Get Course) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <BookOpen className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                مدیریت دوره‌ها
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {completedCount} تکمیل شده
              </span>

              {presellCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3B5BDB]" />
                  {presellCount} پیش‌فروش
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              مدیریت دوره‌های آموزشی، قیمت‌گذاری و وضعیت ثبت‌نام
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/admin/courses/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>ایجاد دوره جدید</span>
        </Link>
      </div>

      {/* بخش ۲: کارت‌های Overview برای فیلتر سریع (دقیقاً مشابه Courses Overview در تصویر اول) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* کل دوره‌ها */}
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
              <p className="text-sm font-extrabold">کل دوره‌ها</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  statusFilter === "ALL" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                تمام دوره‌های ثبت شده
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
                ضبط و انتشار کامل
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
                در حال برگزاری و تکمیل
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* بخش ۳: وضعیت‌های Loading / Error / Empty */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت دوره‌ها...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-8 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            دریافت دوره‌ها با خطا مواجه شد.
          </p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            بدون دوره
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            هنوز دوره‌ای در این بخش ثبت نشده است
          </p>
        </div>
      ) : (
        <>
          {/* 📱 نمای موبایل و تبلت: کارت‌های الهام گرفته از Popular Courses در تصویر رفرنس */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:hidden"
          >
            {filteredCourses.map((course) => {
              const isCompleted = course.status === "COMPLETED";
              const hasDiscount = Number(course.discount) > 0;
              const rating = course.courseAverageScore || course.score || 5;

              return (
                <motion.div
                  key={course._id}
                  variants={itemVariants}
                  className="flex flex-col justify-between rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]"
                >
                  <div>
                    {/* ردیف بالای کارت: بج دسته‌بندی آبی + بج وضعیت */}
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-extrabold text-[#3B5BDB]">
                        <Layers className="h-3 w-3" />
                        {course.categoryID?.title || "عمومی"}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                          <CheckCircle2 className="h-3 w-3" />
                          تکمیل شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[10px] font-extrabold text-[#FF8A00]">
                          <Sparkles className="h-3 w-3" />
                          پیش‌فروش
                        </span>
                      )}
                    </div>

                    {/* کاور + عنوان دوره با نوار عمودی رنگی */}
                    <div className="flex items-start gap-3.5">
                      {course.coverUrl ? (
                        <img
                          src={course.coverUrl}
                          alt={course.name}
                          className="h-16 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-[#F1F0EC]"
                        />
                      ) : (
                        <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F8F7F4] text-[10px] font-bold text-[#8E929F]">
                          بدون تصویر
                        </div>
                      )}

                      <div className="relative min-w-0 flex-1 pr-3">
                        <span
                          className={`absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full ${
                            isCompleted ? "bg-[#059669]" : "bg-[#FF8A00]"
                          }`}
                        />
                        <h3 className="truncate text-sm font-extrabold text-[#14151A]">
                          {course.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed font-medium text-[#8E929F]">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    {/* بج‌های اطلاعات تکمیلی (زمان، پشتیبانی، دانشجو، مدرس) */}
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-2.5 py-1 text-[10px] font-bold text-[#14151A]">
                        <Clock className="h-3 w-3 text-[#FF8A00]" />
                        {course.time || "-"}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-2.5 py-1 text-[10px] font-bold text-[#14151A]">
                        <Headphones className="h-3 w-3 text-[#3B5BDB]" />
                        {course.support || "-"}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-2.5 py-1 text-[10px] font-bold text-[#14151A]">
                        <Users className="h-3 w-3 text-[#059669]" />
                        {Number(course.students || 0).toLocaleString(
                          "fa-IR",
                        )}{" "}
                        دانشجو
                      </span>

                      <span
                        dir="ltr"
                        className="rounded-full bg-[#F3F0FF] px-2.5 py-1   text-[10px] font-bold text-[#7048E8]"
                      >
                        /{course.href}
                      </span>
                    </div>
                  </div>

                  {/* خط جداکننده مشابه کارت‌های تصویر رفرنس */}
                  <div className="my-4 h-[1px] w-full bg-[#F1F0EC]" />

                  {/* فوتر کارت: امتیاز و قیمت (سمت راست) + دکمه‌های عملیات (سمت چپ) */}
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                        <span className="text-xs font-extrabold text-[#14151A]">
                          {rating}
                        </span>
                        {hasDiscount && (
                          <span className="rounded-full bg-[#FFF4E5] px-2 py-0.5 text-[10px] font-extrabold text-[#FF8A00]">
                            {course.discount}% تخفیف
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm font-extrabold text-[#14151A]">
                        {Number(course.price || 0).toLocaleString("fa-IR")}{" "}
                        <span className="text-[10px] font-bold text-[#8E929F]">
                          تومان
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/dashboard/admin/courses/edit/${course._id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-4 py-2 text-xs font-extrabold text-[#14151A] shadow-sm transition-transform active:scale-95"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>ویرایش</span>
                      </Link>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(course)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-transform active:scale-90 disabled:opacity-50"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 💻 نمای دسکتاپ: ساختار جدولی دقیقاً مشابه My Courses در تصویر رفرنس */}
          <div className="hidden xl:block">
            {/* هدر ستون‌ها بیرون از کارت سفید */}
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-3">دوره و توضیحات</div>
              <div className="col-span-2">دسته‌بندی / مدرس</div>
              <div className="col-span-2">زمان / پشتیبانی</div>
              <div className="col-span-2">قیمت و تخفیف</div>
              <div className="col-span-1 text-center">آمار و امتیاز</div>
              <div className="col-span-1 text-center">وضعیت</div>
              <div className="col-span-1 text-center">عملیات</div>
            </div>

            {/* کانتینر سفید گرد برای ردیف‌ها */}
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]"
            >
              {filteredCourses.map((course) => {
                const isCompleted = course.status === "COMPLETED";
                const hasDiscount = Number(course.discount) > 0;
                const rating = course.courseAverageScore || course.score || 5;

                return (
                  <motion.div
                    key={course._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center gap-2 px-4 py-3.5 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    {/* ۱. کاور + نام دوره + آدرس + توضیح کوتاه */}
                    <div className="col-span-3 flex items-center gap-3.5 pl-2">
                      {course.coverUrl ? (
                        <img
                          src={course.coverUrl}
                          alt={course.name}
                          className="h-14 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-[#F1F0EC]"
                        />
                      ) : (
                        <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F8F7F4] text-[10px] font-bold text-[#8E929F]">
                          بدون تصویر
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold text-[#14151A]">
                          {course.name}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] font-medium text-[#8E929F]">
                          {course.description}
                        </p>
                        <span
                          dir="ltr"
                          className="mt-1 inline-block max-w-full truncate rounded-full bg-[#F3F0FF] px-2 py-0.5   text-[9px] font-bold text-[#7048E8]"
                        >
                          /{course.href}
                        </span>
                      </div>
                    </div>

                    {/* ۲. دسته‌بندی + مدرس */}
                    <div className="col-span-2 flex flex-col items-start gap-1">
                      <span className="inline-flex max-w-full truncate rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
                        {course.categoryID?.title || "-"}
                      </span>
                      <span className="truncate text-[11px] font-bold text-[#8E929F]">
                        مدرس:{" "}
                        <strong className="text-[#14151A]">
                          {course.creator?.name || "-"}
                        </strong>
                      </span>
                    </div>

                    {/* ۳. زمان و پشتیبانی */}
                    <div className="col-span-2 flex flex-col items-start gap-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#14151A]">
                        <Clock className="h-3.5 w-3.5 text-[#FF8A00]" />
                        {course.time || "-"}
                      </span>
                      <span className="inline-flex items-center gap-1 truncate text-[10px] font-semibold text-[#8E929F]">
                        <Headphones className="h-3 w-3 text-[#3B5BDB]" />
                        {course.support || "-"}
                      </span>
                    </div>

                    {/* ۴. قیمت و بج تخفیف */}
                    <div className="col-span-2 flex flex-col items-start gap-1">
                      <span className="font-extrabold text-[#14151A]">
                        {Number(course.price || 0).toLocaleString("fa-IR")}{" "}
                        <span className="text-[10px] font-normal text-[#8E929F]">
                          تومان
                        </span>
                      </span>

                      {hasDiscount ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#FF8A00]">
                          <Tag className="h-2.5 w-2.5" />
                          {course.discount}% تخفیف
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-[#8E929F]">
                          بدون تخفیف
                        </span>
                      )}
                    </div>

                    {/* ۵. دانشجویان، ثبت‌نام و امتیاز */}
                    <div className="col-span-1 flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2 py-0.5 text-[10px] font-extrabold text-[#14151A]">
                        <Star className="h-3 w-3 fill-[#FF8A00] text-[#FF8A00]" />
                        {rating}
                      </span>

                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8E929F]">
                        <span title="دانشجویان">
                          {Number(course.students || 0).toLocaleString("fa-IR")}{" "}
                          نفر
                        </span>
                        {course.registers !== undefined && (
                          <span className="text-[#059669]" title="ثبت‌نامی‌ها">
                            (
                            {Number(course.registers || 0).toLocaleString(
                              "fa-IR",
                            )}
                            )
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ۶. وضعیت دوره (بج سبز برای تکمیل شده / آبی برای پیش‌فروش) */}
                    <div className="col-span-1 flex justify-center">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          تکمیل شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-extrabold text-[#3B5BDB]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#3B5BDB]" />
                          پیش‌فروش
                        </span>
                      )}
                    </div>

                    {/* ۷. اکشن‌های دایره‌ای رنگی مشابه ستون Actions در تصویر رفرنس */}
                    <div className="col-span-1 flex items-center justify-center gap-1.5">
                      <Link
                        href={`/dashboard/admin/courses/edit/${course._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                        title="ویرایش دوره"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </Link>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(course)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-90 disabled:opacity-50"
                        title="حذف دوره"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}

      {/* بخش ۴: مدال تایید حذف با بج قرمز مکمل (یکپارچه با سایر صفحات) */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#14151A]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px]"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E4E0] sm:hidden" />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-3 py-1 text-[11px] font-bold text-[#E11D48]">
                  <Trash2 className="h-3.5 w-3.5" />
                  حذف دوره
                </span>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] transition-colors hover:text-[#14151A] active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 text-right">
                <h3 className="text-base font-extrabold text-[#14151A]">
                  آیا از حذف این دوره مطمئن هستید؟
                </h3>
                <p className="mt-2 text-xs leading-relaxed font-medium text-[#8E929F]">
                  دوره آموزشی{" "}
                  <span className="mx-0.5 inline-flex items-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 font-extrabold text-[#E11D48]">
                    {deleteTarget.name}
                  </span>{" "}
                  به صورت دائمی حذف خواهد شد.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-full bg-[#F8F7F4] py-3 text-xs font-bold text-[#14151A] transition-colors hover:bg-[#EFECE6] active:scale-95"
                >
                  انصراف
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-[#FECDD3] bg-[#FFF2F2] py-3 text-xs font-extrabold text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>در حال حذف...</span>
                    </>
                  ) : (
                    <span>تأیید و حذف</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
