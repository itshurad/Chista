"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  Clock3,
  Eye,
  GraduationCap,
  ShoppingBag,
  UserRound,
  CheckCircle2,
  ReceiptText,
} from "lucide-react";

import { useOrders } from "@/hooks/useOrders";

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

const getCourseName = (order) => {
  if (!order?.course) return "دوره نامشخص";
  if (typeof order.course === "string") return order.course;
  return order.course.name || order.course.title || "دوره بدون عنوان";
};

const getCourseHref = (order) => {
  if (!order?.course || typeof order.course === "string") return null;
  return order.course.href || null;
};

const getUserName = (order) => {
  if (!order?.user) return "کاربر نامشخص";
  if (typeof order.user === "string") return order.user;
  return (
    order.user.name ||
    order.user.username ||
    order.user.email ||
    "کاربر بدون نام"
  );
};

const getUserEmail = (order) => {
  if (!order?.user || typeof order.user === "string") return null;
  return order.user.email || null;
};

const formatDate = (date) => {
  if (!date) return "---";
  return new Date(date).toLocaleDateString("fa-IR");
};

function OrderStatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
      ثبت شده
    </span>
  );
}

export default function DashboardOrdersPage() {
  const { data, isLoading, isError } = useOrders();

  const orders = useMemo(() => {
    const raw = data?.courses || data?.orders || data?.allOrders || data || [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* ========================================================= */}
      {/* ۱. هدر صفحه + تعداد کل سفارشات */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                مدیریت سفارشات
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {orders.length} ثبت‌نام فعال
              </span>
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              مشاهده و پیگیری سوابق ثبت‌نام کاربران در دوره‌های آموزشی
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ۲. کارت‌های Overview آماری (مشابه Courses Overview در تصویر رفرنس) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* کارت ۱ */}
        <div className="flex items-center justify-between rounded-[26px] bg-white p-5 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
              {orders.length}
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#14151A]">
                کل سفارشات ثبت‌شده
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                در کل پلتفرم
              </p>
            </div>
          </div>
        </div>

        {/* کارت ۲ (گرادینت تیره مشابه Completed Courses در تصویر رفرنس) */}
        <div className="flex items-center justify-between rounded-[26px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-5 text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#14151A]">
              {orders.length}
            </div>
            <div>
              <p className="text-sm font-extrabold text-white">
                تراکنش‌های موفق
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-white/60">
                تسویه شده و قطعی
              </p>
            </div>
          </div>
        </div>

        {/* کارت ۳ */}
        <div className="flex items-center justify-between rounded-[26px] bg-white p-5 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-sm font-extrabold text-[#059669]">
              {orders.length}
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#14151A]">
                دسترسی‌های فعال
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                دانشجویان شاغل به تحصیل
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ۳. وضعیت‌های Loading / Error / Empty */}
      {/* ========================================================= */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت سفارشات...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-8 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            خطا در دریافت سفارشات از سرور
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F]">
            <GraduationCap className="h-5 w-5" strokeWidth={2} />
          </div>
          <p className="text-sm font-extrabold text-[#14151A]">
            هنوز سفارشی ثبت نشده است
          </p>
          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            ثبت‌نام کاربران در دوره‌ها در این بخش نمایش داده می‌شود
          </p>
        </div>
      ) : (
        <>
          {/* ========================================================= */}
          {/* 📱 نمای موبایل (Mobile-First Cards): تجربه اپ نیتیو */}
          {/* ========================================================= */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3.5 md:hidden"
          >
            {orders.map((order, idx) => {
              const courseName = getCourseName(order);
              const courseHref = getCourseHref(order);
              const userName = getUserName(order);
              const userEmail = getUserEmail(order);

              return (
                <motion.div
                  key={order._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.05)]"
                >
                  <span className="absolute right-0 top-4 bottom-4 w-1 rounded-l-full bg-[#FF8A00]" />

                  <div className="flex items-start justify-between gap-3 pr-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] text-xs font-extrabold text-[#FF8A00]">
                        {idx + 1}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-extrabold text-[#14151A]">
                          {courseName}
                        </h3>
                        {courseHref && (
                          <span
                            dir="ltr"
                            className="mt-1 inline-block max-w-[180px] truncate rounded-full bg-[#F3F0FF] px-2.5 py-0.5   text-[10px] font-bold text-[#7048E8]"
                          >
                            /{courseHref}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/admin/orders/${order._id}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-transform active:scale-90"
                      title="مشاهده جزئیات"
                    >
                      <Eye className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </Link>
                  </div>

                  {/* کاربر */}
                  <div className="mt-3.5 rounded-2xl bg-[#F8F7F4] p-3 pr-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#3B5BDB]">
                        <UserRound className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold text-[#14151A]">
                          {userName}
                        </p>
                        {userEmail && (
                          <p
                            dir="ltr"
                            className="truncate text-[10px] font-medium text-[#8E929F]"
                          >
                            {userEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* فوتر کارت موبایل */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-[#F4F3F0] pt-3 pr-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#8E929F]">
                      <Clock3
                        className="h-3 w-3 text-[#FF8A00]"
                        strokeWidth={2}
                      />
                      {formatDate(order.createdAt)}
                    </span>

                    <OrderStatusBadge />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ========================================================= */}
          {/* 💻 نمای دسکتاپ: دقیقاً مشابه جدول My Courses در تصویر رفرنس */}
          {/* ========================================================= */}
          <div className="hidden md:block">
            {/* هدر ستون‌ها بیرون از کارت سفید */}
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">دوره آموزشی</div>
              <div className="col-span-3">مشخصات کاربر</div>
              <div className="col-span-2 text-center">تاریخ ثبت</div>
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
              {orders.map((order, idx) => {
                const courseName = getCourseName(order);
                const courseHref = getCourseHref(order);
                const userName = getUserName(order);
                const userEmail = getUserEmail(order);

                return (
                  <motion.div
                    key={order._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center px-4 py-4 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    {/* ۱. شماره ردیف */}
                    <div className="col-span-1 text-center font-bold text-[#8E929F]">
                      {idx + 1}
                    </div>

                    {/* ۲. دوره آموزشی */}
                    <div className="col-span-4 flex items-center gap-3 pl-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#7048E8]">
                        <GraduationCap className="h-4 w-4" strokeWidth={2} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold text-[#14151A]">
                          {courseName}
                        </p>
                        {courseHref && (
                          <span
                            dir="ltr"
                            className="mt-0.5 inline-block max-w-full truncate rounded-full bg-[#F3F0FF] px-2.5 py-0.5   text-[9px] font-bold text-[#7048E8]"
                          >
                            /{courseHref}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ۳. مشخصات کاربر */}
                    <div className="col-span-3 min-w-0 pr-2">
                      <p className="truncate font-extrabold text-[#14151A]">
                        {userName}
                      </p>
                      {userEmail && (
                        <p
                          dir="ltr"
                          className="truncate text-[10px] font-medium text-[#8E929F]"
                        >
                          {userEmail}
                        </p>
                      )}
                    </div>

                    {/* ۴. تاریخ ثبت */}
                    <div className="col-span-2 text-center text-[11px] font-semibold text-[#8E929F]">
                      {formatDate(order.createdAt)}
                    </div>

                    {/* ۵. وضعیت */}
                    <div className="col-span-1 flex justify-center">
                      <OrderStatusBadge />
                    </div>

                    {/* ۶. عملیات (دکمه دایره‌ای) */}
                    <div className="col-span-1 flex items-center justify-center">
                      <Link
                        href={`/dashboard/admin/orders/${order._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                        title="مشاهده جزئیات سفارش"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.2} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
