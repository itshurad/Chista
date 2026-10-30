"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ReceiptText,
  CheckCircle2,
  BookOpen,
  Eye,
  ArrowUpLeft,
  ChevronLeft,
  Copy,
  Check,
  X,
  AlertCircle,
  PlayCircle,
  Clock3,
  Plus,
} from "lucide-react";

import { useOrders } from "@/hooks/useOrders";

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
  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatPrice = (price) => {
  if (price === undefined || price === null) return "---";
  if (Number(price) === 0) return "رایگان";
  return `${Number(price).toLocaleString("fa-IR")} تومان`;
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
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

export default function DashboardUserOrdersPage() {
  const { data, isLoading, isError } = useOrders();

  const orders = useMemo(() => {
    const raw = data?.orders || data?.courses || data?.allOrders || data || [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | COMPLETED | PRESELL
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedId, setCopiedId] = useState("");

  // محاسبه آمار مالی و دوره‌ها
  const completedCount = useMemo(
    () => orders.filter((o) => o.course?.status === "COMPLETED").length,
    [orders],
  );

  const totalSpent = useMemo(
    () =>
      orders.reduce(
        (sum, item) => sum + (Number(item.price ?? item.course?.price) || 0),
        0,
      ),
    [orders],
  );

  // فیلتر سفارشات
  const filteredOrders = useMemo(() => {
    if (statusFilter === "COMPLETED") {
      return orders.filter((o) => o.course?.status === "COMPLETED");
    }
    if (statusFilter === "PRESELL") {
      return orders.filter((o) => o.course?.status !== "COMPLETED");
    }
    return orders;
  }, [orders, statusFilter]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(""), 1800);
  };

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* ========================================================= */}
      {/* بخش ۱: هدر صفحه + بج وضعیت + دکمه ثبت‌نام دوره جدید */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                سفارشات و فاکتورهای من
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {orders.length} تراکنش موفق
              </span>
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              مشاهده رسید پرداخت‌ها، وضعیت ثبت‌نام و دسترسی به دوره‌ها
            </p>
          </div>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>خرید دوره جدید</span>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* بخش ۲: کارت‌های Overview برای فیلتر سریع و نمایش مجموع پرداختی */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* کارت ۱: همه فاکتورها */}
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
              {orders.length}
            </div>
            <div>
              <p className="text-sm font-extrabold">همه فاکتورها</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  statusFilter === "ALL" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                تمام سفارشات ثبت‌شده
              </p>
            </div>
          </div>
        </button>

        {/* کارت ۲: دوره‌های تکمیل شده */}
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
              <p className="text-sm font-extrabold">دوره‌های تکمیل شده</p>
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

        {/* کارت ۳: مجموع پرداخت‌ها */}
        <div className="flex items-center justify-between rounded-[26px] bg-white p-5 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB]">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#14151A]">
                {totalSpent === 0
                  ? "رایگان"
                  : `${totalSpent.toLocaleString("fa-IR")} تومان`}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                مجموع سرمایه‌گذاری آموزشی
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* بخش ۳: وضعیت‌های Loading / Error / Empty و لیست فاکتورها */}
      {/* ========================================================= */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت فاکتورها...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-10 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            دریافت اطلاعات سفارشات با خطا مواجه شد
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            بدون فاکتور
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            هنوز سفارشی در این بخش ثبت نشده است
          </p>
        </div>
      ) : (
        <>
          {/* 📱 نمای موبایل (Mobile-First Cards) */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3.5 xl:hidden"
          >
            {filteredOrders.map((order) => {
              const course = order.course || {};
              const coverImg = getCoverUrl(course);
              const isCompleted = course.status === "COMPLETED";
              const paidAmount = order.price ?? course.price ?? 0;

              return (
                <motion.div
                  key={order._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.05)]"
                >
                  <span
                    className={`absolute right-0 top-4 bottom-4 w-1 rounded-l-full ${
                      isCompleted ? "bg-[#059669]" : "bg-[#FF8A00]"
                    }`}
                  />

                  {/* ردیف بالای کارت موبایل: کد سفارش + بج تسویه */}
                  <div className="mb-3.5 flex items-center justify-between gap-2 pr-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(order._id)}
                      className="inline-flex items-center gap-1 rounded-full bg-[#F3F0FF] px-2.5 py-1 font-mono text-[10px] font-bold text-[#7048E8]"
                    >
                      <span dir="ltr">
                        #{String(order._id).slice(-6).toUpperCase()}
                      </span>
                      {copiedId === order._id ? (
                        <Check className="h-3 w-3 text-[#059669]" />
                      ) : (
                        <Copy className="h-3 w-3 opacity-70" />
                      )}
                    </button>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                      <CheckCircle2 className="h-3 w-3" />
                      پرداخت موفق
                    </span>
                  </div>

                  {/* کاور و نام دوره */}
                  <div className="flex items-center gap-3.5 pr-2">
                    {coverImg ? (
                      <img
                        src={coverImg}
                        alt={course.name}
                        className="h-15 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-[#F1F0EC]"
                      />
                    ) : (
                      <div className="flex h-15 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] text-[#FF8A00]">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-extrabold text-[#14151A]">
                        {course.name || "دوره آموزشی"}
                      </h3>

                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-extrabold text-[#14151A]">
                          {formatPrice(paidAmount)}
                        </span>
                        <span className="text-[#8E929F]">•</span>
                        <span className="text-[10px] font-semibold text-[#8E929F]">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* فوتر کارت موبایل */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#F4F3F0] pt-3 pr-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-3 py-1.5 text-[11px] font-extrabold text-[#3B5BDB]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>رسید سریع</span>
                      </button>

                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-3 py-1.5 text-[11px] font-bold text-[#14151A]"
                      >
                        <ReceiptText className="h-3.5 w-3.5 text-[#FF8A00]" />
                        <span>چاپ فاکتور</span>
                      </Link>
                    </div>

                    <Link
                      href={
                        course.href ? `/courses/${course.href}` : "/courses"
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-[#FFCC00] px-3.5 py-1.5 text-[11px] font-extrabold text-[#14151A] shadow-2xs"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      <span>جلسات</span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 💻 نمای دسکتاپ: جدول مدرن هم‌سبک سایر صفحات */}
          <div className="hidden xl:block">
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">دوره خریداری‌شده</div>
              <div className="col-span-2">شماره فاکتور</div>
              <div className="col-span-2">مبلغ پرداختی</div>
              <div className="col-span-1 text-center">تاریخ</div>
              <div className="col-span-1 text-center">وضعیت</div>
              <div className="col-span-1 text-center">عملیات</div>
            </div>

            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]"
            >
              {filteredOrders.map((order, idx) => {
                const course = order.course || {};
                const coverImg = getCoverUrl(course);
                const paidAmount = order.price ?? course.price ?? 0;

                return (
                  <motion.div
                    key={order._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center gap-2 px-4 py-3.5 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    {/* ۱. ردیف */}
                    <div className="col-span-1 text-center font-bold text-[#8E929F]">
                      {idx + 1}
                    </div>

                    {/* ۲. کاور و نام دوره */}
                    <div className="col-span-4 flex items-center gap-3 pl-2">
                      {coverImg ? (
                        <img
                          src={coverImg}
                          alt={course.name}
                          className="h-12 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-[#F1F0EC]"
                        />
                      ) : (
                        <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] text-[#FF8A00]">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <Link
                          href={
                            course.href ? `/courses/${course.href}` : "/courses"
                          }
                          className="truncate font-extrabold text-[#14151A] hover:text-[#FF8A00]"
                        >
                          {course.name || "دوره آموزشی"}
                        </Link>
                        {course.href && (
                          <span
                            dir="ltr"
                            className="mt-0.5 block truncate font-mono text-[10px] font-semibold text-[#8E929F]"
                          >
                            /{course.href}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ۳. شماره فاکتور با قابلیت کپی */}
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(order._id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F0FF] px-3 py-1 font-mono text-[11px] font-bold text-[#7048E8] transition-all hover:bg-[#7048E8] hover:text-white active:scale-95"
                        title="کپی شناسه فاکتور"
                      >
                        <span dir="ltr">
                          #{String(order._id).slice(-8).toUpperCase()}
                        </span>
                        {copiedId === order._id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-70" />
                        )}
                      </button>
                    </div>

                    {/* ۴. مبلغ */}
                    <div className="col-span-2 font-extrabold text-[#14151A]">
                      {formatPrice(paidAmount)}
                    </div>

                    {/* ۵. تاریخ */}
                    <div className="col-span-1 text-center text-[11px] font-semibold text-[#8E929F]">
                      {formatDate(order.createdAt)}
                    </div>

                    {/* ۶. وضعیت */}
                    <div className="col-span-1 flex justify-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                        تسویه شده
                      </span>
                    </div>

                    {/* ۷. عملیات */}
                    <div className="col-span-1 flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                        title="مشاهده سریع رسید"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.2} />
                      </button>

                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] transition-all hover:bg-[#FF8A00] hover:text-white active:scale-90"
                        title="صفحه کامل و چاپ فاکتور"
                      >
                        <ReceiptText className="h-4 w-4" strokeWidth={2.2} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* بخش ۴: مدال مشاهده سریع فاکتور (Bottom-Sheet موبایل / Modal دسکتاپ) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#14151A]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px]"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E4E0] sm:hidden" />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-extrabold text-[#059669]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  رسید الکترونیکی سفارش
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] hover:text-[#14151A]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-3 rounded-[24px] bg-[#F8F7F4] p-4 text-xs">
                <div className="relative pr-3">
                  <span className="absolute right-0 top-0.5 bottom-0.5 w-1 rounded-full bg-[#FF8A00]" />
                  <p className="text-[10px] font-bold text-[#8E929F]">
                    شرح دوره آموزشی
                  </p>
                  <h3 className="mt-0.5 text-sm font-extrabold text-[#14151A]">
                    {selectedOrder.course?.name || "دوره آموزشی"}
                  </h3>
                </div>

                <div className="h-[1px] bg-[#EAE8E1]" />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8E929F]">تاریخ ثبت:</span>
                  <span className="font-extrabold text-[#14151A]">
                    {formatDate(selectedOrder.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8E929F]">
                    شماره فاکتور:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedOrder._id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-mono text-[10px] font-extrabold text-[#14151A] shadow-2xs"
                  >
                    <span dir="ltr">
                      #{String(selectedOrder._id).slice(-10).toUpperCase()}
                    </span>
                    {copiedId === selectedOrder._id ? (
                      <Check className="h-3 w-3 text-[#059669]" />
                    ) : (
                      <Copy className="h-3 w-3 text-[#8E929F]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-[22px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-4 text-white">
                <span className="text-xs font-bold text-white/75">
                  مبلغ پرداخت‌شده:
                </span>
                <span className="text-sm font-extrabold text-[#FFCC00]">
                  {formatPrice(
                    selectedOrder.price ?? selectedOrder.course?.price,
                  )}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2.5">
                <Link
                  href={`/dashboard/orders/${selectedOrder._id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#F8F7F4] py-3 text-xs font-extrabold text-[#14151A] transition-colors hover:bg-[#EFECE6]"
                >
                  <ReceiptText className="h-3.5 w-3.5 text-[#FF8A00]" />
                  <span>صفحه کامل فاکتور</span>
                </Link>

                {selectedOrder.course?.href && (
                  <Link
                    href={`/courses/${selectedOrder.course.href}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FFCC00] py-3 text-xs font-extrabold text-[#14151A] shadow-sm"
                  >
                    <span>مشاهده جلسات</span>
                    <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
