"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Lock,
  UserCheck,
} from "lucide-react";

import { useProfile } from "@/hooks/useUsers";

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

export default function UserProfilePage() {
  const { data: profileData, isLoading } = useProfile();
  const user = profileData?.me || profileData?.user || profileData || {};

  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user && user._id) {
      reset({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (values) => {
    setSuccess(false);
    try {
      // شبیه‌سازی آپدیت پروفایل
      console.log("Update profile:", values);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
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
      <div className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.05)] sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#059669]">
            <UserCheck className="h-3.5 w-3.5" />
            حساب کاربری دانشجو
          </span>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-4 py-2 text-xs font-bold text-[#14151A] transition-colors hover:bg-[#EFECE6]"
          >
            <span>پیشخوان</span>
            <ChevronLeft className="h-3.5 w-3.5 text-[#8E929F]" />
          </Link>
        </div>

        <div className="relative mb-7 pr-4">
          <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#FF8A00]" />
          <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
            ویرایش اطلاعات حساب
          </h1>
          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            اطلاعات هویتی و راه‌های ارتباطی خود را مدیریت کنید
          </p>
        </div>

        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-center gap-2.5 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-xs font-extrabold text-[#059669]"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>تغییرات پروفایل با موفقیت ذخیره شد.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#14151A]">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="نام کامل..."
              className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] px-4 py-3.5 text-xs font-semibold text-[#14151A] outline-none transition-all focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#14151A]">
              نام کاربری
            </label>
            <input
              type="text"
              dir="ltr"
              {...register("username")}
              placeholder="username"
              className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] px-4 py-3.5 text-left font-mono text-xs font-semibold text-[#14151A] outline-none transition-all focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#14151A]">
              پست الکترونیک (ایمیل)
            </label>
            <input
              type="email"
              dir="ltr"
              {...register("email")}
              placeholder="example@domain.com"
              className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] px-4 py-3.5 text-left font-mono text-xs font-semibold text-[#14151A] outline-none transition-all focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#14151A]">
              شماره تماس
            </label>
            <input
              type="tel"
              dir="ltr"
              {...register("phone")}
              placeholder="09123456789"
              className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] px-4 py-3.5 text-left font-mono text-xs font-semibold text-[#14151A] outline-none transition-all focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
            />
          </div>

          <div className="pt-2">
            <div className="h-[1px] w-full bg-[#F1F0EC]" />
          </div>

          <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-[#F8F7F4] px-6 py-3.5 text-xs font-bold text-[#8E929F] transition-colors hover:bg-[#EFECE6]"
            >
              انصراف
            </Link>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633]"
            >
              <span>ذخیره تغییرات</span>
              <CheckCircle2 className="h-4 w-4" />
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
