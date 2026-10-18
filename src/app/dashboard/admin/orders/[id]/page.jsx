"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ChevronLeft,
  Calendar,
  GraduationCap,
  Hash,
  UserRound,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpLeft,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  ReceiptText,
} from "lucide-react";

import { useOrder } from "@/hooks/useOrders";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 28,
      mass: 0.8,
    },
  },
};

const formatDate = (date) => {
  if (!date) return "---";
  return new Date(date).toLocaleDateString("fa-IR");
};

const formatPrice = (price) => {
  if (price === undefined || price === null) return "ثبت‌شده در سیستم";
  if (Number(price) === 0) return "رایگان";
  return `${Number(price).toLocaleString("fa-IR")} تومان`;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError } = useOrder(id);

  // پشتیبانی از data?.orders و سایر حالت‌های احتمالی
  const order = data?.orders || data?.order || data?.courses || null;
  const course = order?.course || null;
  const user = order?.user || null;

  const isAdmin = user?.role === "ADMIN";
  const orderPrice = order?.price ?? course?.price;

  const handleCopyId = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main dir="rtl" className="mx-auto w-full max-w-4xl space-y-6 pb-10">
      {/* ========================================================= */}
      {/* بخش ۱: هدر صفحه (هم‌سبک با سایر صفحات داشبورد) */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <ReceiptText className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                جزئیات سفارش و ثبت‌نام
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                <CheckCircle2 className="h-3 w-3" />
                تایید شده
              </span>
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              اطلاعات کامل ثبت‌نام کاربر در دوره آموزشی
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/admin/orders"
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-[#14151A] shadow-[0_4px_16px_-4px_rgba(20,21,26,0.06)] transition-all hover:bg-[#FFF4E5] hover:text-[#FF8A00] active:scale-95"
        >
          <span>بازگشت به سفارشات</span>
          <ChevronLeft className="h-4 w-4 text-[#8E929F]" strokeWidth={2.2} />
        </Link>
      </div>

      {/* ========================================================= */}
      {/* بخش ۲: وضعیت‌های Loading / Error / محتوای سفارش */}
      {/* ========================================================= */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-20 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت اطلاعات سفارش...</span>
          </div>
        </div>
      ) : isError || !order ? (
        /* بج خطا با پس‌زمینه قرمز نزدیک به سفید و متن قرمز پررنگ مکمل */
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] py-16 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            سفارش مورد نظر پیدا نشد
          </p>
        </div>
      ) : (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {/* ردیف کارت‌های خلاصه (دقیقاً مشابه Courses Overview در تصویر رفرنس) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* کارت ۱: تاریخ ثبت سفارش */}
            <div className="flex items-center justify-between rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#8E929F]">
                    تاریخ ثبت‌نام
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-[#14151A]">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* کارت ۲: مبلغ سفارش (گرادینت تیره مشابه کارت Completed Courses در تصویر) */}
            <div className="flex items-center justify-between rounded-[28px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-5 text-white shadow-[0_16px_38px_-10px_rgba(20,21,26,0.22)]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFCC00] text-[#14151A]">
                  <ReceiptText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-white/60">
                    مبلغ سفارش
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-[#FFCC00]">
                    {formatPrice(orderPrice)}
                  </p>
                </div>
              </div>
            </div>

            {/* کارت ۳: شناسه یکتای سفارش با قابلیت کپی */}
            <div className="flex items-center justify-between rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00]">
                  <Hash className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#8E929F]">
                    شناسه ثبت‌نام
                  </p>
                  <p
                    dir="ltr"
                    className="mt-0.5 truncate   text-xs font-extrabold text-[#14151A]"
                  >
                    #{String(order._id).slice(-10).toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyId(order._id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00] active:scale-90"
                title="کپی شناسه کامل"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-[#059669]" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* کارت اصلی دو ستونه: مشخصات دوره + مشخصات دانشجو */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* ستون ۱: مشخصات دوره آموزشی */}
            <div className="flex flex-col justify-between rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.05)] sm:p-7">
              <div>
                {/* بج بالای کارت */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#FF8A00]">
                    <GraduationCap className="h-4 w-4" />
                    اطلاعات دوره آموزشی
                  </span>

                  <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
                    دسترسی فعال
                  </span>
                </div>

                {/* عنوان دوره با نوار عمودی نارنجی (مشابه کارت‌های تصویر رفرنس) */}
                <div className="relative pr-4">
                  <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#FF8A00]" />
                  <p className="text-[11px] font-bold text-[#8E929F]">
                    نام دوره
                  </p>
                  <h2 className="mt-1 text-base font-extrabold leading-relaxed text-[#14151A] sm:text-lg">
                    {course?.name || "دوره نامشخص"}
                  </h2>
                </div>
              </div>

              {/* فوتر کارت دوره: لینک و آدرس دوره */}
              <div className="mt-6 space-y-3 border-t border-[#F4F3F0] pt-4 text-xs">
                {course?.href && (
                  <div className="pt-1">
                    <Link
                      href={`/courses/${course.href}`}
                      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#FFCC00] py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
                    >
                      <span>مشاهده صفحه دوره</span>
                      <ArrowUpLeft className="h-4 w-4" strokeWidth={2.3} />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* ستون ۲: مشخصات کاربر ثبت‌نام کننده */}
            <div className="flex flex-col justify-between rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.05)] sm:p-7">
              <div>
                {/* بج بالای کارت */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3.5 py-1.5 text-[11px] font-extrabold text-[#3B5BDB]">
                    <UserRound className="h-4 w-4" />
                    مشخصات دانشجو
                  </span>

                  {user?.role && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-extrabold ${
                        isAdmin
                          ? "bg-[#FFF4E5] text-[#FF8A00]"
                          : "bg-[#ECFDF5] text-[#059669]"
                      }`}
                    >
                      {isAdmin ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <UserCheck className="h-3 w-3" />
                      )}
                      {isAdmin ? "مدیر سیستم" : "کاربر عادی"}
                    </span>
                  )}
                </div>

                {/* نام کاربر با نوار عمودی آبی (مشابه کارت‌های تصویر رفرنس) */}
                <div className="relative pr-4">
                  <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#3B5BDB]" />
                  <p className="text-[11px] font-bold text-[#8E929F]">
                    نام و نام خانوادگی
                  </p>
                  <h2 className="mt-1 text-base font-extrabold text-[#14151A] sm:text-lg">
                    {user?.name ||
                      user?.username ||
                      user?.email ||
                      "کاربر نامشخص"}
                  </h2>
                </div>
              </div>

              {/* فوتر کارت کاربر: ایمیل، تلفن و شناسه کامل */}
              <div className="mt-6 space-y-2.5 border-t border-[#F4F3F0] pt-4 text-xs">
                {user?.email && (
                  <div className="flex items-center justify-between rounded-2xl bg-[#F8F7F4] px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#8E929F]">
                      <Mail className="h-3.5 w-3.5 text-[#3B5BDB]" />
                      ایمیل:
                    </span>
                    <span
                      dir="ltr"
                      className="max-w-[200px] truncate   font-extrabold text-[#14151A]"
                    >
                      {user.email}
                    </span>
                  </div>
                )}

                {user?.phone && (
                  <div className="flex items-center justify-between rounded-2xl bg-[#F8F7F4] px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#8E929F]">
                      <Phone className="h-3.5 w-3.5 text-[#059669]" />
                      تلفن:
                    </span>
                    <span
                      dir="ltr"
                      className="  font-extrabold text-[#14151A]"
                    >
                      {user.phone}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-2xl bg-[#F8F7F4] px-3.5 py-2.5">
                  <span className="font-bold text-[#8E929F]">
                    کد کامل سفارش:
                  </span>
                  <span
                    dir="ltr"
                    className="  text-[11px] font-bold text-[#14151A]"
                  >
                    {order._id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
