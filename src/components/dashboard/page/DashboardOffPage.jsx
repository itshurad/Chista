"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TicketPercent,
  Plus,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
  User,
  Ban,
} from "lucide-react";

import { useAllOffs, useDeleteOff } from "@/hooks/useOffs";

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

function DashboardOffPage() {
  const { data, isLoading, isError } = useAllOffs();
  const { mutateAsync: deleteOff, isPending: isDeleting } = useDeleteOff();

  const offs = data?.offs || data || [];

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // -----------------------------
  // آمار کدهای تخفیف
  // -----------------------------
  const maxDiscountPercent = useMemo(() => {
    if (offs.length === 0) return 0;
    return Math.max(...offs.map((off) => Number(off.percent) || 0));
  }, [offs]);

  const activeOffsCount = useMemo(
    () =>
      offs.filter((off) => (Number(off.uses) || 0) < (Number(off.max) || 1))
        .length,
    [offs],
  );
  const expiredOffsCount = offs.length - activeOffsCount;

  // -----------------------------
  // کپی کردن سریع کد تخفیف
  // -----------------------------
  const handleCopyCode = (id, codeText) => {
    if (!codeText) return;
    navigator.clipboard?.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // -----------------------------
  // تایید حذف
  // -----------------------------
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOff(deleteTarget._id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("خطا در حذف کد تخفیف:", error);
    }
  };

  const getCourseName = (off) =>
    typeof off?.course === "object"
      ? off.course?.name || off.course?.title || "دوره نامشخص"
      : off?.course || "دوره نامشخص";

  const getCreatorName = (off) =>
    typeof off?.creator === "object"
      ? off.creator?.name || off.creator?.username || "ادمین"
      : off?.creator || "ادمین";

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* بخش ۱: هدر صفحه + آمار خلاصه با بج‌های رنگی + دکمه ایجاد تخفیف */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <TicketPercent className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                مدیریت کدهای تخفیف
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {activeOffsCount} کد فعال
              </span>

              {expiredOffsCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48]" />
                  {expiredOffsCount} تکمیل ظرفیت
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              مشاهده کوپن‌های تخفیف، ظرفیت مصرف‌شده و ایجاد کمپین جدید
            </p>
          </div>
        </div>

        {/* دکمه کپسولی زرد طلایی مشابه Get Course */}
        <Link
          href="/dashboard/admin/offs/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>ایجاد تخفیف جدید</span>
        </Link>
      </div>

      {/* بخش ۲: کارت‌های Overview آماری (مشابه Courses Overview در تصویر رفرنس) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* کل کدهای تخفیف */}
        <div className="flex items-center justify-between rounded-[26px] bg-white p-5 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
              {offs.length}
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#14151A]">
                کل کدهای تخفیف
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                کوپن‌های ثبت‌شده در سیستم
              </p>
            </div>
          </div>
        </div>

        {/* بیشترین درصد تخفیف (کارت تیره مشابه Completed Courses در تصویر رفرنس) */}
        <div className="flex items-center justify-between rounded-[26px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-5 text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#14151A]">
              {maxDiscountPercent}%
            </div>
            <div>
              <p className="text-sm font-extrabold text-white">
                بیشترین درصد تخفیف
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-white/60">
                بالاترین نرخ تخفیف فعلی
              </p>
            </div>
          </div>
        </div>

        {/* کدهای دارای ظرفیت */}
        <div className="flex items-center justify-between rounded-[26px] bg-white p-5 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-sm font-extrabold text-[#059669]">
              {activeOffsCount}
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#14151A]">
                کدهای قابل استفاده
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                دارای ظرفیت باقی‌مانده
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* بخش ۳: وضعیت‌های Loading / Error / Empty */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت کدهای تخفیف...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-8 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            دریافت کدهای تخفیف با خطا مواجه شد.
          </p>
        </div>
      ) : offs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            بدون کوپن
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            هنوز هیچ کد تخفیفی ایجاد نشده است
          </p>
        </div>
      ) : (
        <>
          {/* 📱 نمای موبایل (Mobile-First Cards): تجربه اپ نیتیو */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3.5 lg:hidden"
          >
            {offs.map((off) => {
              const uses = Number(off.uses) || 0;
              const max = Number(off.max) || 1;
              const isExpired = uses >= max;
              const usagePercent = Math.min(
                100,
                Math.round((uses / max) * 100),
              );

              return (
                <motion.div
                  key={off._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.05)]"
                >
                  {/* نوار عمودی رنگی کنار کارت (سبز برای فعال / قرمز برای منقضی) */}
                  <span
                    className={`absolute right-0 top-4 bottom-4 w-1 rounded-l-full ${
                      isExpired ? "bg-[#E11D48]" : "bg-[#059669]"
                    }`}
                  />

                  {/* هدر کارت موبایل: بج کد تخفیف + بج درصد + دکمه حذف */}
                  <div className="flex items-center justify-between gap-2 pr-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(off._id, off.code)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F0FF] px-3 py-1   text-xs font-extrabold text-[#7048E8] transition-transform active:scale-95"
                        title="کپی کد"
                      >
                        <span>{off.code}</span>
                        {copiedId === off._id ? (
                          <Check className="h-3 w-3 text-[#059669]" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-70" />
                        )}
                      </button>

                      <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-extrabold text-[#059669]">
                        {off.percent}% تخفیف
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setDeleteTarget(off)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-transform active:scale-90 disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* دوره و سازنده */}
                  <div className="mt-3.5 space-y-1.5 pr-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#14151A]">
                      <BookOpen className="h-3.5 w-3.5 text-[#3B5BDB]" />
                      <span className="truncate">{getCourseName(off)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8E929F]">
                      <User className="h-3.5 w-3.5 text-[#FF8A00]" />
                      <span>ایجادکننده: {getCreatorName(off)}</span>
                    </div>
                  </div>

                  {/* نوار پیشرفت ظرفیت استفاده + بج وضعیت در فوتر کارت */}
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F4F3F0] pt-3 pr-2">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between text-[10px] font-extrabold">
                        <span className="text-[#8E929F]">ظرفیت مصرف‌شده</span>
                        <span dir="ltr" className="  text-[#14151A]">
                          {uses} / {max}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F0EC]">
                        <div
                          style={{ width: `${usagePercent}%` }}
                          className={`h-full rounded-full transition-all ${
                            isExpired
                              ? "bg-[#E11D48]"
                              : "bg-gradient-to-r from-[#3B5BDB] to-[#059669]"
                          }`}
                        />
                      </div>
                    </div>

                    {isExpired ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-1 text-[10px] font-extrabold text-[#E11D48]">
                        <Ban className="h-3 w-3" />
                        منقضی
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                        <CheckCircle2 className="h-3 w-3" />
                        فعال
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 💻 نمای دسکتاپ: دقیقاً مشابه جدول My Courses در تصویر رفرنس */}
          <div className="hidden lg:block">
            {/* هدر ستون‌ها بیرون از کارت سفید */}
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-2">کد تخفیف</div>
              <div className="col-span-1 text-center">درصد</div>
              <div className="col-span-3">دوره مرتبط</div>
              <div className="col-span-2">ایجادکننده</div>
              <div className="col-span-2">میزان استفاده</div>
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
              {offs.map((off) => {
                const uses = Number(off.uses) || 0;
                const max = Number(off.max) || 1;
                const isExpired = uses >= max;
                const usagePercent = Math.min(
                  100,
                  Math.round((uses / max) * 100),
                );

                return (
                  <motion.div
                    key={off._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center gap-2 px-4 py-4 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    {/* ۱. کد تخفیف با قابلیت کپی */}
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(off._id, off.code)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F0FF] px-3 py-1   text-xs font-extrabold text-[#7048E8] transition-all hover:bg-[#7048E8] hover:text-white active:scale-95"
                        title="کلیک برای کپی کد"
                      >
                        <span>{off.code}</span>
                        {copiedId === off._id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-70" />
                        )}
                      </button>
                    </div>

                    {/* ۲. درصد تخفیف */}
                    <div className="col-span-1 flex justify-center">
                      <span className="inline-flex items-center rounded-full bg-[#FFF4E5] px-2.5 py-1   text-xs font-extrabold text-[#FF8A00]">
                        {off.percent}%
                      </span>
                    </div>

                    {/* ۳. دوره مرتبط */}
                    <div className="col-span-3 pl-2">
                      <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-[#3B5BDB]">
                        <BookOpen className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{getCourseName(off)}</span>
                      </span>
                    </div>

                    {/* ۴. ایجادکننده */}
                    <div className="col-span-2 truncate font-bold text-[#14151A]">
                      {getCreatorName(off)}
                    </div>

                    {/* ۵. نوار پیشرفت ظرفیت (مشابه ستون Progress در جدول تصویر رفرنس) */}
                    <div className="col-span-2 pl-4">
                      <div className="mb-1 flex items-center justify-between text-[10px] font-extrabold">
                        <span className="text-[#8E929F]">مصرف‌شده</span>
                        <span dir="ltr" className="  text-[#14151A]">
                          {uses} / {max}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F0EC]">
                        <div
                          style={{ width: `${usagePercent}%` }}
                          className={`h-full rounded-full transition-all ${
                            isExpired
                              ? "bg-[#E11D48]"
                              : "bg-gradient-to-r from-[#3B5BDB] to-[#059669]"
                          }`}
                        />
                      </div>
                    </div>

                    {/* ۶. بج وضعیت (سبز برای فعال / قرمز مکمل برای تکمیل ظرفیت) */}
                    <div className="col-span-1 flex justify-center">
                      {isExpired ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-1 text-[10px] font-extrabold text-[#E11D48]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48]" />
                          منقضی
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          فعال
                        </span>
                      )}
                    </div>

                    {/* ۷. دکمه حذف دایره‌ای */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(off)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-90 disabled:opacity-50"
                        title="حذف کد تخفیف"
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
                  حذف کد تخفیف
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
                  آیا از حذف این کد تخفیف مطمئن هستید؟
                </h3>
                <p className="mt-2 text-xs leading-relaxed font-medium text-[#8E929F]">
                  کوپن تخفیف{" "}
                  <span
                    dir="ltr"
                    className="mx-0.5 inline-flex items-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5   font-extrabold text-[#E11D48]"
                  >
                    {deleteTarget.code}
                  </span>{" "}
                  ({deleteTarget.percent}%) برای همیشه حذف خواهد شد.
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

export default DashboardOffPage;
