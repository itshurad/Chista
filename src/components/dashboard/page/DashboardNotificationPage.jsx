"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  Check,
  Eye,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  ShieldCheck,
  MessageSquareText,
} from "lucide-react";

import {
  useAllNotifications,
  useDeleteNotification,
  useSeeNotification,
} from "@/hooks/useNotifications";

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

function DashboardNotificationPage() {
  const { data, isLoading, isError } = useAllNotifications();
  const notifications = data?.notifications || data || [];

  const { mutateAsync: deleteNotification, isPending: isDeleting } =
    useDeleteNotification();
  const { mutateAsync: seeNotification, isPending: isSeeing } =
    useSeeNotification();

  // فیلتر سریع بالای صفحه (all | seen | unread)
  const [activeFilter, setActiveFilter] = useState("all");

  // مدال مشاهده کامل متن اطلاعیه
  const [viewTarget, setViewTarget] = useState(null);

  // مدال تایید حذف
  const [deleteTarget, setDeleteTarget] = useState(null);

  // -----------------------------
  // توابع کمکی
  // -----------------------------
  const isNotificationSeen = (notification) =>
    Number(notification?.isSee) === 1 || Number(notification?.see) === 1;

  const getAdminName = (notification) =>
    typeof notification?.admin === "object"
      ? notification.admin?.name || notification.admin?.username || "ادمین"
      : notification?.admin || "ادمین";

  // -----------------------------
  // آمار و فیلتر کردن
  // -----------------------------
  const seenCount = useMemo(
    () => notifications.filter((n) => isNotificationSeen(n)).length,
    [notifications],
  );
  const unreadCount = notifications.length - seenCount;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "seen") {
      return notifications.filter((n) => isNotificationSeen(n));
    }
    if (activeFilter === "unread") {
      return notifications.filter((n) => !isNotificationSeen(n));
    }
    return notifications;
  }, [notifications, activeFilter]);

  // -----------------------------
  // تغییر وضعیت به خوانده‌شده (See)
  // -----------------------------
  const handleSee = async (notification) => {
    if (!notification || isNotificationSeen(notification)) return;

    try {
      await seeNotification(notification._id);
    } catch (error) {
      console.error("خطا در مشاهده نوتیفیکیشن:", error);
    }
  };

  // باز کردن مدال مشاهده جزئیات + علامت‌گذاری خودکار به عنوان خوانده شده
  const openViewModal = (notification) => {
    setViewTarget(notification);
    if (!isNotificationSeen(notification)) {
      handleSee(notification);
    }
  };

  // -----------------------------
  // تایید حذف
  // -----------------------------
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteNotification(deleteTarget._id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("خطا در حذف نوتیفیکیشن:", error);
    }
  };

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* بخش ۱: هدر، آمار خلاصه با بج‌های رنگی و دکمه ایجاد اطلاعیه جدید */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <Bell className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                مدیریت اطلاعیه‌ها
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {seenCount} خوانده شده
              </span>

              {unreadCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF8A00]" />
                  {unreadCount} جدید
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              ارسال و پیگیری پیام‌های سیستمی مدیران
            </p>
          </div>
        </div>

        {/* دکمه کپسولی زرد طلایی مشابه Get Course در تصویر رفرنس */}
        <Link
          href="/dashboard/admin/notifications/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>اطلاعیه جدید</span>
        </Link>
      </div>

      {/* بخش ۲: کارت‌های Overview برای فیلتر سریع (مشابه ردیف اول تصویر رفرنس) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* کل اطلاعیه‌ها */}
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            activeFilter === "all"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                activeFilter === "all"
                  ? "bg-white text-[#14151A]"
                  : "bg-[#FFF4E5] text-[#FF8A00]"
              }`}
            >
              {notifications.length}
            </div>
            <div>
              <p className="text-sm font-extrabold">کل اطلاعیه‌ها</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  activeFilter === "all" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                تمام پیام‌های ثبت شده
              </p>
            </div>
          </div>
        </button>

        {/* خوانده شده */}
        <button
          type="button"
          onClick={() => setActiveFilter("seen")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            activeFilter === "seen"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-sm font-extrabold text-[#059669]">
              {seenCount}
            </div>
            <div>
              <p className="text-sm font-extrabold">خوانده شده</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  activeFilter === "seen" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                بررسی شده توسط ادمین
              </p>
            </div>
          </div>
        </button>

        {/* خوانده نشده */}
        <button
          type="button"
          onClick={() => setActiveFilter("unread")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            activeFilter === "unread"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
              {unreadCount}
            </div>
            <div>
              <p className="text-sm font-extrabold">خوانده نشده</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  activeFilter === "unread" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                منتظر مشاهده
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
            <span>در حال دریافت اطلاعیه‌ها...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-8 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            دریافت اطلاعیه‌ها با خطا مواجه شد
          </p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            لیست خالی
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            هیچ اطلاعیه‌ای در این بخش وجود ندارد
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
            {filteredNotifications.map((notification) => {
              const seen = isNotificationSeen(notification);
              const adminName = getAdminName(notification);

              return (
                <motion.div
                  key={notification._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.05)]"
                >
                  {/* نوار عمودی رنگی کنار کارت (سبز برای خوانده شده، نارنجی برای جدید) */}
                  <span
                    className={`absolute right-0 top-4 bottom-4 w-1 rounded-l-full ${
                      seen ? "bg-[#059669]" : "bg-[#FF8A00]"
                    }`}
                  />

                  {/* هدر کارت موبایل: ادمین + بج وضعیت */}
                  <div className="mb-3 flex items-center justify-between gap-2 pr-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-extrabold text-[#3B5BDB]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {adminName}
                    </span>

                    {seen ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                        <CheckCircle2 className="h-3 w-3" />
                        خوانده شده
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[10px] font-extrabold text-[#FF8A00]">
                        <Clock className="h-3 w-3" />
                        خوانده نشده
                      </span>
                    )}
                  </div>

                  {/* متن اطلاعیه */}
                  <div
                    onClick={() => openViewModal(notification)}
                    className="cursor-pointer pr-2"
                  >
                    <p className="line-clamp-3 text-xs leading-relaxed font-semibold text-[#14151A]">
                      {notification.message}
                    </p>
                  </div>

                  {/* فوتر کارت موبایل: تاریخ + دکمه‌های عملیات */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-[#F4F3F0] pt-3 pr-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8E929F]">
                      <Calendar className="h-3 w-3" />
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleDateString(
                            "fa-IR",
                          )
                        : "-"}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {!seen && (
                        <button
                          type="button"
                          disabled={isSeeing}
                          onClick={() => handleSee(notification)}
                          className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[10px] font-extrabold text-[#059669] transition-transform active:scale-90 disabled:opacity-50"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          <span>ثبت مشاهده</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => openViewModal(notification)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-transform active:scale-90"
                        title="مشاهده کامل"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(notification)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-transform active:scale-90 disabled:opacity-50"
                        title="حذف"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 💻 نمای دسکتاپ: ساختار جدولی دقیقاً مشابه My Courses در تصویر رفرنس */}
          <div className="hidden lg:block">
            {/* هدر ستون‌ها بیرون از کارت سفید */}
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">متن اطلاعیه</div>
              <div className="col-span-2">ادمین دریافت‌کننده</div>
              <div className="col-span-1 text-center">وضعیت</div>
              <div className="col-span-1 text-center">تاریخ</div>
              <div className="col-span-2 text-center">عملیات</div>
            </div>

            {/* کانتینر سفید گرد برای ردیف‌ها */}
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]"
            >
              {filteredNotifications.map((notification, idx) => {
                const seen = isNotificationSeen(notification);
                const adminName = getAdminName(notification);

                return (
                  <motion.div
                    key={notification._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center gap-2 px-4 py-4 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    {/* ۱. شماره ردیف */}
                    <div className="col-span-1 text-center font-bold text-[#8E929F]">
                      {idx + 1}
                    </div>

                    {/* ۲. متن اطلاعیه */}
                    <div
                      onClick={() => openViewModal(notification)}
                      className="col-span-5 flex cursor-pointer items-center gap-3 pl-3"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          seen
                            ? "bg-[#F8F7F4] text-[#8E929F]"
                            : "bg-[#FFF4E5] text-[#FF8A00]"
                        }`}
                      >
                        <MessageSquareText className="h-4 w-4" />
                      </div>
                      <p
                        className={`line-clamp-1 font-bold transition-colors hover:text-[#FF8A00] ${
                          seen ? "text-[#8E929F]" : "text-[#14151A]"
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>

                    {/* ۳. ادمین (بج آبی یخی مشابه Popular in week) */}
                    <div className="col-span-2">
                      <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-[#3B5BDB]">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{adminName}</span>
                      </span>
                    </div>

                    {/* ۴. وضعیت (بج سبز برای خوانده شده / نارنجی برای خوانده نشده) */}
                    <div className="col-span-1 flex justify-center">
                      {seen ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          خوانده شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3 py-1 text-[10px] font-extrabold text-[#FF8A00]">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF8A00]" />
                          جدید
                        </span>
                      )}
                    </div>

                    {/* ۵. تاریخ */}
                    <div className="col-span-1 text-center text-[11px] font-semibold text-[#8E929F]">
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleDateString(
                            "fa-IR",
                          )
                        : "-"}
                    </div>

                    {/* ۶. اکشن‌های دایره‌ای رنگی مشابه جدول تصویر رفرنس */}
                    <div className="col-span-2 flex items-center justify-center gap-1.5">
                      {!seen && (
                        <button
                          type="button"
                          disabled={isSeeing}
                          onClick={() => handleSee(notification)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669] transition-all hover:bg-[#059669] hover:text-white active:scale-90 disabled:opacity-50"
                          title="علامت‌گذاری به عنوان خوانده شده"
                        >
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => openViewModal(notification)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                        title="مشاهده متن کامل"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.2} />
                      </button>

                      {/* دکمه حذف با پس‌زمینه قرمز نزدیک به سفید و قرمز پررنگ مکمل */}
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(notification)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-90 disabled:opacity-50"
                        title="حذف اطلاعیه"
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

      {/* بخش ۴: مدال مشاهده کامل پیام اطلاعیه */}
      <AnimatePresence>
        {viewTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewTarget(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#14151A]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
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
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-extrabold text-[#3B5BDB]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {getAdminName(viewTarget)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                    <CheckCircle2 className="h-3 w-3" />
                    مشاهده شده
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setViewTarget(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] transition-colors hover:text-[#14151A] active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 rounded-2xl bg-[#F8F7F4] p-4">
                <p className="max-h-60 overflow-y-auto whitespace-pre-line text-xs leading-7 font-semibold text-[#14151A]">
                  {viewTarget.message}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8E929F]">
                  تاریخ ثبت:{" "}
                  {viewTarget.createdAt
                    ? new Date(viewTarget.createdAt).toLocaleDateString("fa-IR")
                    : "-"}
                </span>

                <button
                  type="button"
                  onClick={() => setViewTarget(null)}
                  className="rounded-full bg-[#FFCC00] px-6 py-2.5 text-xs font-extrabold text-[#14151A] shadow-sm transition-transform active:scale-95"
                >
                  بستن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* بخش ۵: مدال تایید حذف با بج قرمز مکمل */}
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
                  حذف اطلاعیه
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
                  آیا از حذف این اطلاعیه مطمئن هستید؟
                </h3>
                <p className="mt-2 line-clamp-2 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2]/60 p-3 text-xs leading-relaxed font-semibold text-[#E11D48]">
                  {deleteTarget.message}
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

export default DashboardNotificationPage;
