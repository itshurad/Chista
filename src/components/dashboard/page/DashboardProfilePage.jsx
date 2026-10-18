"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  AtSign,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  X,
} from "lucide-react";
import { useProfile, useUpdateUser } from "@/hooks/useUsers";

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

export default function DashboardProfilePage() {
  const { data: userInfo, isLoading: isLoadingProfile, isError } = useProfile();
  const user = userInfo?.me || userInfo?.user || userInfo || {};

  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateUser();

  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const isAdmin = user?.role === "ADMIN";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
    },
  });

  // مقداردهی اولیه فیلدها با اطلاعات دریافت شده از سرور
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      reset({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (formData) => {
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      await updateProfile({ id: user._id, data: payload });

      setFeedback({
        type: "success",
        message: "اطلاعات حساب کاربری با موفقیت به‌روزرسانی شد.",
      });

      reset({
        ...payload,
        password: "",
      });
    } catch (err) {
      const serverResponse = err?.response?.data;
      const errorMsg = Array.isArray(serverResponse?.errors)
        ? serverResponse.errors.map((e) => e.message).join(" | ")
        : serverResponse?.message || "خطایی در ویرایش اطلاعات رخ داد.";

      setFeedback({
        type: "error",
        message: errorMsg,
      });
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-20 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
          <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
          <span>در حال بارگذاری اطلاعات حساب کاربری...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-8 text-center"
        dir="rtl"
      >
        <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
          <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <p className="text-xs font-extrabold text-[#E11D48]">
          خطا در واکشی مشخصات کاربری. لطفاً اتصال سرور را بررسی کنید.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-3xl space-y-5 pb-10"
      dir="rtl"
    >
      {/* بخش ۱: کارت هویتی بالای صفحه با گرادینت تیره (مشابه کارت Completed Courses در تصویر رفرنس) */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-6 text-white shadow-[0_16px_40px_-12px_rgba(20,21,26,0.22)] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* آواتار دایره‌ای زرد طلایی */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FFCC00] text-lg font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.4)]">
              {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                  {user?.name || "کاربر سیستم"}
                </h1>
                {user?.username && (
                  <span
                    dir="ltr"
                    className="rounded-full bg-white/10 px-2.5 py-0.5   text-[11px] font-bold text-[#FFCC00]"
                  >
                    @{user.username}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs font-medium text-white/60">
                مدیریت اطلاعات فردی و راه‌های ارتباطی
              </p>
            </div>
          </div>

          {/* بج‌های وضعیت و نقش */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold ${
                isAdmin
                  ? "bg-[#FFF4E5] text-[#FF8A00]"
                  : "bg-[#EEF2FF] text-[#3B5BDB]"
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="h-3.5 w-3.5" />
              ) : (
                <UserCheck className="h-3.5 w-3.5" />
              )}
              {isAdmin ? "مدیر کل" : "کاربر عادی"}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-extrabold text-[#059669]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
              فعال
            </span>
          </div>
        </div>
      </div>

      {/* بخش ۲: اعلان نتیجه عملیات (سبز مکمل برای موفقیت / قرمز مکمل برای خطا) */}
      <AnimatePresence mode="wait">
        {feedback.message && (
          <motion.div
            key={feedback.message}
            variants={badgeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-xs font-extrabold ${
              feedback.type === "success"
                ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]"
                : "border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669]" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-[#E11D48]" />
              )}
              <span>{feedback.message}</span>
            </div>

            <button
              type="button"
              onClick={() => setFeedback({ type: "", message: "" })}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* بخش ۳: کارت اصلی فرم ویرایش اطلاعات */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.05)] sm:p-8">
        {/* تیتر کارت با نوار عمودی نارنجی (مشابه کارت‌های دوره در تصویر رفرنس) */}
        <div className="relative mb-7 pr-4">
          <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#FF8A00]" />
          <h2 className="text-base font-extrabold tracking-tight text-[#14151A] sm:text-lg">
            ویرایش مشخصات حساب
          </h2>
          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            اطلاعات زیر در سراسر پلتفرم برای حساب شما استفاده می‌شود
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* ۱. نام و نام خانوادگی */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  نام و نام خانوادگی
                </label>

                <AnimatePresence mode="wait">
                  {errors.name ? (
                    <motion.span
                      key="err-name"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      {errors.name.message}
                    </motion.span>
                  ) : (
                    <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
                      نام نمایشی
                    </span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <input
                  {...register("name", {
                    required: "نام الزامی است",
                    minLength: { value: 3, message: "حداقل ۳ نویسه" },
                    maxLength: { value: 100, message: "حداکثر ۱۰۰ نویسه" },
                  })}
                  type="text"
                  placeholder="مثلاً: علی رضایی"
                  className={`w-full rounded-2xl border py-3.5 pr-10 pl-4 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                    errors.name
                      ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                      : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  }`}
                />
                <User className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-[#8E929F]" />
              </div>
            </div>

            {/* ۲. نام کاربری (Username) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  نام کاربری
                </label>

                <AnimatePresence mode="wait">
                  {errors.username ? (
                    <motion.span
                      key="err-username"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      {errors.username.message}
                    </motion.span>
                  ) : (
                    <span
                      dir="ltr"
                      className="rounded-full bg-[#F3F0FF] px-2.5 py-0.5   text-[10px] font-bold text-[#7048E8]"
                    >
                      @username
                    </span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <input
                  {...register("username", {
                    required: "نام کاربری الزامی است",
                    minLength: { value: 3, message: "حداقل ۳ نویسه" },
                    maxLength: { value: 50, message: "حداکثر ۵۰ نویسه" },
                  })}
                  type="text"
                  dir="ltr"
                  placeholder="ali_rezaei"
                  className={`w-full rounded-2xl border py-3.5 pr-4 pl-10 text-left   text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:   placeholder:font-normal placeholder:text-[#A0A4B0] ${
                    errors.username
                      ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                      : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  }`}
                />
                <AtSign className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
              </div>
            </div>

            {/* ۳. آدرس ایمیل */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  آدرس ایمیل
                </label>

                <AnimatePresence mode="wait">
                  {errors.email ? (
                    <motion.span
                      key="err-email"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      {errors.email.message}
                    </motion.span>
                  ) : (
                    <span className="rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                      پست الکترونیک
                    </span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <input
                  {...register("email", {
                    required: "ایمیل الزامی است",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "فرمت ایمیل نامعتبر است",
                    },
                  })}
                  type="email"
                  dir="ltr"
                  placeholder="name@example.com"
                  className={`w-full rounded-2xl border py-3.5 pr-4 pl-10 text-left   text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:   placeholder:font-normal placeholder:text-[#A0A4B0] ${
                    errors.email
                      ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                      : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  }`}
                />
                <Mail className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
              </div>
            </div>

            {/* ۴. شماره تماس */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  شماره تماس
                </label>

                <AnimatePresence mode="wait">
                  {errors.phone ? (
                    <motion.span
                      key="err-phone"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      {errors.phone.message}
                    </motion.span>
                  ) : (
                    <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                      تلفن همراه
                    </span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <input
                  {...register("phone", {
                    required: "شماره تماس الزامی است",
                    minLength: { value: 10, message: "حداقل ۱۰ رقم" },
                    maxLength: { value: 15, message: "حداکثر ۱۵ رقم" },
                  })}
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  className={`w-full rounded-2xl border py-3.5 pr-4 pl-10 text-left   text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:   placeholder:font-normal placeholder:text-[#A0A4B0] ${
                    errors.phone
                      ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                      : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  }`}
                />
                <Phone className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
              </div>
            </div>
          </div>

          {/* خط جداکننده مینیمال */}
          <div className="pt-2">
            <div className="h-[1px] w-full bg-[#F1F0EC]" />
          </div>

          {/* دکمه‌های عملیات (بازنشانی + ذخیره تغییرات کپسولی طلایی) */}
          <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
            {isDirty && (
              <button
                type="button"
                onClick={() =>
                  reset({
                    name: user.name || "",
                    username: user.username || "",
                    email: user.email || "",
                    phone: user.phone || "",
                  })
                }
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#F8F7F4] px-5 py-3.5 text-xs font-bold text-[#8E929F] transition-colors hover:bg-[#EFECE6] hover:text-[#14151A] active:scale-95"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>لغو تغییرات</span>
              </button>
            )}

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.01 }}
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>ذخیره تغییرات</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
