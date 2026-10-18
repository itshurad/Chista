"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellPlus,
  ChevronLeft,
  ChevronDown,
  ShieldCheck,
  Send,
  AlertCircle,
} from "lucide-react";

import {
  useCreateNotification,
  useNotificationAdmins,
} from "@/hooks/useNotifications";

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.8 },
  },
};

const badgeVariants = {
  initial: { opacity: 0, y: -4, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.12 } },
};

function NotificationForm() {
  const {
    data: adminsData,
    isLoading: isAdminsLoading,
    isError: isAdminsError,
  } = useNotificationAdmins();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [adminId, setAdminId] = useState("");

  const { mutateAsync: createNotification, isPending: isCreating } =
    useCreateNotification();

  const admins = adminsData?.admins || adminsData || [];

  const isMessageTooShort = message.length > 0 && message.trim().length < 3;
  const isFormValid = Boolean(adminId) && message.trim().length >= 3;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) return;

    try {
      await createNotification({
        message: message.trim(),
        admin: adminId,
      });

      router.push("/dashboard/admin/notifications");
    } catch (error) {
      console.error("خطا در ایجاد نوتیفیکیشن:", error);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-xl space-y-5 pb-10"
      dir="rtl"
    >
      {/* کارت اصلی فرم */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.05)] sm:p-8">
        {/* نوار بالای کارت: بج وضعیت + دکمه بازگشت کپسولی */}
        <div className="mb-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#059669]">
            <BellPlus className="h-3.5 w-3.5" />
            ارسال پیام جدید
          </span>

          <Link
            href="/dashboard/admin/notifications"
            className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-4 py-2 text-xs font-bold text-[#14151A] transition-all hover:bg-[#EFECE6] active:scale-95"
          >
            <span>بازگشت</span>
            <ChevronLeft className="h-3.5 w-3.5 text-[#8E929F]" />
          </Link>
        </div>

        {/* تیتر با نوار عمودی نارنجی (مشابه کارت‌های دوره در تصویر رفرنس) */}
        <div className="relative mb-7 pr-4">
          <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#FF8A00]" />
          <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
            ایجاد اطلاعیه جدید
          </h1>
          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            گیرنده و متن پیام سیستمی را مشخص کنید
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ۱. انتخاب ادمین دریافت‌کننده */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                انتخاب ادمین دریافت‌کننده
              </label>

              {adminId ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                  انتخاب شد
                </span>
              ) : (
                <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
                  گیرنده پیام
                </span>
              )}
            </div>

            {isAdminsError ? (
              <div className="flex items-center gap-2 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-4 py-3 text-xs font-bold text-[#E11D48]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>دریافت لیست ادمین‌ها با خطا مواجه شد.</span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={adminId}
                  onChange={(event) => setAdminId(event.target.value)}
                  disabled={isAdminsLoading}
                  className="w-full appearance-none rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 pr-10 pl-10 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {isAdminsLoading
                      ? "در حال دریافت لیست ادمین‌ها..."
                      : "یک ادمین را انتخاب کنید..."}
                  </option>

                  {admins.map((admin) => (
                    <option key={admin._id} value={admin._id}>
                      {admin.name || admin.username || admin.email || "ادمین"}
                    </option>
                  ))}
                </select>

                <ShieldCheck className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-[#8E929F]" />
                <ChevronDown className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
              </div>
            )}
          </div>

          {/* ۲. متن اطلاعیه */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                متن اطلاعیه
              </label>

              <div className="flex items-center gap-1.5">
                <AnimatePresence mode="wait">
                  {isMessageTooShort && (
                    <motion.span
                      key="err-msg"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      حداقل ۳ کاراکتر
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* بج شمارنده کاراکترها */}
                <span
                  dir="ltr"
                  className={`rounded-full px-2.5 py-0.5   text-[10px] font-bold ${
                    message.length > 900
                      ? "bg-[#FFF4E5] text-[#FF8A00]"
                      : "bg-[#F8F7F4] text-[#8E929F]"
                  }`}
                >
                  {message.length} / 1000
                </span>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={1000}
              rows={6}
              placeholder="متن پیام یا اطلاعیه خود را اینجا بنویسید..."
              className={`w-full resize-none rounded-2xl border p-4 text-xs leading-7 font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                isMessageTooShort
                  ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                  : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
              }`}
            />
          </div>

          {/* خط جداکننده مینیمال */}
          <div className="pt-2">
            <div className="h-[1px] w-full bg-[#F1F0EC]" />
          </div>

          {/* دکمه‌های عملیات (انصراف + ارسال کپسولی طلایی) */}
          <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard/admin/notifications"
              className="inline-flex items-center justify-center rounded-full bg-[#F8F7F4] px-6 py-3.5 text-xs font-bold text-[#8E929F] transition-colors hover:bg-[#EFECE6] hover:text-[#14151A] active:scale-95"
            >
              انصراف
            </Link>

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.01 }}
              type="submit"
              disabled={isCreating || !isFormValid}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                  <span>در حال ارسال...</span>
                </>
              ) : (
                <>
                  <span>ارسال اطلاعیه</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default NotificationForm;
