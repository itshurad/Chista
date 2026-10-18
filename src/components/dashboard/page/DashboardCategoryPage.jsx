"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  Calendar,
  Clock,
  FolderOpen,
} from "lucide-react";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";

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

function DashboardCategoryPage() {
  const { data, isLoading, isError } = useCategories();
  const categories = data?.categories || data || [];
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [deleteTarget, setDeleteTarget] = useState(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget._id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* بخش ۱: هدر صفحه + آمار خلاصه با بج سبز + دکمه کپسولی طلایی */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* دایره شمارنده نارنجی مشابه کارت‌های بالای تصویر رفرنس */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00] shadow-sm">
            {categories.length}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                مدیریت دسته‌بندی‌ها
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                فعال در سایت
              </span>
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              ساختار موضوعی دوره‌ها و مقالات آموزشی
            </p>
          </div>
        </div>

        {/* دکمه کپسولی زرد طلایی مشابه Get Course در تصویر رفرنس */}
        <Link
          href="/dashboard/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>دسته‌بندی جدید</span>
        </Link>
      </div>

      {/* بخش ۲: وضعیت‌های Loading / Error / Empty */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال بارگذاری دسته‌بندی‌ها...</span>
          </div>
        </div>
      ) : isError ? (
        /* بج خطا با پس‌زمینه قرمز نزدیک به سفید و متن قرمز پررنگ مکمل */
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] py-14 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            خطا در دریافت اطلاعات از سرور
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB]">
            <FolderOpen className="h-5 w-5" />
          </div>
          <span className="mb-1 rounded-full bg-[#EEF2FF] px-3 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
            لیست خالی
          </span>
          <p className="mt-1 text-xs font-semibold text-[#8E929F]">
            هنوز هیچ دسته‌بندی‌ای ثبت نشده است
          </p>
        </div>
      ) : (
        <>
          {/* 📱 نمای موبایل (Mobile-First Cards): تجربه اپ نیتیو */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3 md:hidden"
          >
            {categories.map((category, idx) => (
              <motion.div
                key={category._id}
                variants={itemVariants}
                className="relative overflow-hidden rounded-[26px] bg-white p-4 shadow-[0_8px_25px_-8px_rgba(20,21,26,0.05)]"
              >
                {/* نوار رنگی عمودی کنار کارت */}
                <span className="absolute right-0 top-4 bottom-4 w-1 rounded-l-full bg-[#FF8A00]" />

                <div className="flex items-start justify-between gap-3 pr-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] text-xs font-extrabold text-[#FF8A00]">
                      {idx + 1}
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-[#14151A]">
                        {category.title}
                      </h3>
                      <span
                        dir="ltr"
                        className="mt-1 inline-block rounded-full bg-[#F3F0FF] px-2.5 py-0.5   text-[10px] font-bold text-[#7048E8]"
                      >
                        /{category.href}
                      </span>
                    </div>
                  </div>

                  {/* دکمه‌های اکشن دایره‌ای */}
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/dashboard/admin/categories/edit/${category._id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-transform active:scale-90"
                      title="ویرایش"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(category)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-transform active:scale-90"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </button>
                  </div>
                </div>

                {/* فوتر کارت موبایل: تاریخ ایجاد و بروزرسانی */}
                <div className="mt-3.5 flex items-center justify-between border-t border-[#F4F3F0] pt-3 pr-2 text-[10px] font-semibold text-[#8E929F]">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#059669]" />
                    ایجاد:{" "}
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString("fa-IR")
                      : "---"}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#FF8A00]" />
                    تغییر:{" "}
                    {category.updatedAt
                      ? new Date(category.updatedAt).toLocaleDateString("fa-IR")
                      : "---"}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 💻 نمای دسکتاپ: دقیقاً مشابه بخش My Courses در تصویر رفرنس */}
          <div className="hidden md:block">
            {/* هدر ستون‌ها بیرون از کارت سفید */}
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">عنوان دسته‌بندی</div>
              <div className="col-span-3">آدرس (Href)</div>
              <div className="col-span-2">تاریخ ایجاد</div>
              <div className="col-span-1">آخرین تغییر</div>
              <div className="col-span-1 text-center">عملیات</div>
            </div>

            {/* کانتینر سفید گرد برای ردیف‌ها */}
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]"
            >
              {categories.map((category, idx) => (
                <motion.div
                  key={category._id}
                  variants={itemVariants}
                  className="grid grid-cols-12 items-center px-4 py-4 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                >
                  {/* ۱. شماره ردیف */}
                  <div className="col-span-1 text-center font-bold text-[#8E929F]">
                    {idx + 1}
                  </div>

                  {/* ۲. عنوان دسته‌بندی + آواتار */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-xs font-extrabold text-[#3B5BDB]">
                      {category.title?.charAt(0) || "C"}
                    </div>
                    <span className="truncate font-extrabold text-[#14151A]">
                      {category.title}
                    </span>
                  </div>

                  {/* ۳. بج آدرس Href */}
                  <div className="col-span-3">
                    <span
                      dir="ltr"
                      className="inline-block rounded-full bg-[#F3F0FF] px-3 py-1   text-[11px] font-bold text-[#7048E8]"
                    >
                      /{category.href}
                    </span>
                  </div>

                  {/* ۴. تاریخ ایجاد */}
                  <div className="col-span-2 text-[11px] font-semibold text-[#8E929F]">
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString("fa-IR")
                      : "---"}
                  </div>

                  {/* ۵. آخرین تغییر */}
                  <div className="col-span-1 text-[11px] font-semibold text-[#8E929F]">
                    {category.updatedAt
                      ? new Date(category.updatedAt).toLocaleDateString("fa-IR")
                      : "---"}
                  </div>

                  {/* ۶. اکشن‌ها (آیکون‌های دایره‌ای رنگی مشابه جدول تصویر رفرنس) */}
                  <div className="col-span-1 flex items-center justify-center gap-2">
                    <Link
                      href={`/dashboard/admin/categories/edit/${category._id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                      title="ویرایش"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(category)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-90"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </>
      )}

      {/* بخش ۳: مدال تایید حذف (Bottom-Sheet در موبایل و Modal در دسکتاپ) */}
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
              {/* دستگیره شیت موبایل */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E4E0] sm:hidden" />

              {/* هدر مدال با بج قرمز مکمل */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-3 py-1 text-[11px] font-bold text-[#E11D48]">
                  <Trash2 className="h-3.5 w-3.5" />
                  حذف دسته‌بندی
                </span>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] transition-colors hover:text-[#14151A] active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* محتوای مدال */}
              <div className="mt-5 text-right">
                <h3 className="text-base font-extrabold text-[#14151A]">
                  آیا از حذف این دسته‌بندی مطمئن هستید؟
                </h3>
                <p className="mt-2 text-xs leading-relaxed font-medium text-[#8E929F]">
                  دسته‌بندی{" "}
                  <span className="mx-0.5 inline-flex items-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 font-extrabold text-[#E11D48]">
                    {deleteTarget.title}
                  </span>{" "}
                  به صورت دائمی حذف خواهد شد.
                </p>
              </div>

              {/* دکمه‌های عملیات مدال */}
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

export default DashboardCategoryPage;
