"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loginApi } from "@/services/authService";

const loginValidation = z.object({
  identifire: z
    .string()
    .trim()
    .min(1, "ایمیل یا نام کاربری الزامی است")
    .superRefine((value, ctx) => {
      if (value.includes("@")) {
        const emailResult = z.string().email().safeParse(value);

        if (!emailResult.success) {
          ctx.addIssue({
            code: "custom",
            message: "فرمت ایمیل معتبر نیست",
          });
        }
        return;
      }

      if (value.length < 3) {
        ctx.addIssue({
          code: "custom",
          message: "حداقل ۳ کاراکتر وارد کنید",
        });
      }

      if (value.length > 20) {
        ctx.addIssue({
          code: "custom",
          message: "حداکثر ۲۰ کاراکتر مجاز است",
        });
      }

      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        ctx.addIssue({
          code: "custom",
          message: "فقط حروف انگلیسی، عدد و _ مجاز است",
        });
      }
    }),

  password: z
    .string()
    .min(8, "رمز عبور حداقل ۸ کاراکتر است")
    .max(100, "رمز عبور بیش از حد طولانی است"),
});

// تنظیمات انیمیشن نیتیو و فوق‌العاده نرم
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.8 },
  },
};

const badgeAlertVariants = {
  initial: { opacity: 0, y: -6, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginValidation),
    mode: "onBlur",
  });

  const handleLogin = async (data) => {
    try {
      setServerError("");
      await loginApi(data);
      router.push("/dashboard");
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "اطلاعات ورود اشتباه است.",
      );
    }
  };

  return (
    <div
      className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#F8F7F4] px-4 py-8 selection:bg-[#FFCC00]/30 sm:px-6"
      dir="rtl"
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[400px]"
      >
        {/* کارت اصلی با استایل برگرفته از UI ارسالی */}
        <div className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.06)] sm:p-8">
          {/* هدر کارت: بج وضعیت + آیکون بوکمارک گوشه مشابه کارت‌های دوره */}
          <div className="mb-6 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3.5 py-1.5 text-[11px] font-bold text-[#3B5BDB]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B5BDB]" />
              ورود به حساب
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
          </div>

          {/* عنوان با نوار رنگی عمودی (الهام گرفته از کارت‌های UI) */}
          <div className="relative mb-7 pr-4">
            <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#FF8A00]" />
            <h1 className="text-xl font-extrabold tracking-tight text-[#14151A] sm:text-2xl">
              خوش آمدید
            </h1>
            <p className="mt-1 text-xs font-medium text-[#8E929F]">
              مشخصات کاربری خود را وارد کنید
            </p>
          </div>

          {/* بج خطای سرور (قرمز نزدیک به سفید در بک‌گراند + قرمز پررنگ مکمل) */}
          <AnimatePresence mode="wait">
            {serverError && (
              <motion.div
                variants={badgeAlertVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mb-5 flex items-center gap-2.5 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-4 py-3 text-xs font-bold text-[#E11D48]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>{serverError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {/* فیلد نام کاربری یا ایمیل */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  نام کاربری یا ایمیل
                </label>
                <AnimatePresence>
                  {errors.identifire && (
                    <motion.span
                      variants={badgeAlertVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      {errors.identifire.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <input
                {...register("identifire")}
                type="text"
                dir="ltr"
                placeholder="username / email"
                className={`w-full rounded-2xl border px-4 py-3.5 text-left text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                  errors.identifire
                    ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                    : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                }`}
              />
            </div>

            {/* فیلد رمز عبور */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  رمز عبور
                </label>
              </div>

              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border py-3.5 pl-11 pr-4 text-left text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:text-[#A0A4B0] ${
                    errors.password
                      ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                      : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 left-1.5 my-auto flex h-8 w-8 items-center justify-center rounded-xl text-[#8E929F] transition-colors hover:bg-black/5 hover:text-[#14151A] active:scale-90"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* خط جداکننده مینیمال مشابه کارت‌های تصویر */}
            <div className="pt-2">
              <div className="h-[1px] w-full bg-[#F1F0EC]" />
            </div>

            {/* دکمه ورود کپسولی زرد طلایی مشابه دکمه Get Course */}
            <div className="pt-1">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.01 }}
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-6 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                    <span>در حال ورود...</span>
                  </>
                ) : (
                  <>
                    <span>ورود به حساب</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        {/* فوتر تغییر وضعیت به ثبت‌نام با بج سبز مکمل */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="text-xs font-medium text-[#8E929F]">
            حساب ندارید؟
          </span>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-3.5 py-1.5 text-xs font-bold text-[#059669] transition-transform active:scale-95"
          >
            <span>ثبت‌نام</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-3 w-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
