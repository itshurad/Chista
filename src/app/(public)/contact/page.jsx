"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageCircle,
  Mail,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Sparkles,
  X,
} from "lucide-react";

import { useCreateContact } from "@/hooks/useContacts";

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.8 },
  },
};

export default function ContactPage() {
  const createContact = useCreateContact();

  const [form, setForm] = useState({
    name: "",
    title: "",
    body: "",
    email: "",
    phone: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(false);

    try {
      await createContact.mutateAsync(form);

      setForm({
        name: "",
        title: "",
        body: "",
        email: "",
        phone: "",
      });

      setSuccess(true);
    } catch (error) {
      console.error("Create contact error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]" dir="rtl">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.05)] sm:p-9"
        >
          {/* ۱. ردیف بالای کارت: بج وضعیت + دکمه بازگشت */}
          <div className="mb-6 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#FF8A00]">
              <Sparkles className="h-3.5 w-3.5" />
              پشتیبانی و ارتباط مستقیم
            </span>

            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-4 py-2 text-xs font-bold text-[#14151A] transition-colors hover:bg-[#EFECE6] active:scale-95"
            >
              <span>صفحه اصلی</span>
              <ChevronLeft className="h-3.5 w-3.5 text-[#8E929F]" />
            </Link>
          </div>

          {/* ۲. عنوان صفحه با نوار عمودی نارنجی (مشابه کارت‌های تصویر رفرنس) */}
          <div className="relative mb-6 pr-4">
            <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#FF8A00]" />
            <h1 className="text-xl font-extrabold tracking-tight text-[#14151A] sm:text-2xl">
              با ما در ارتباط باشید
            </h1>
            <p className="mt-1 text-xs font-medium text-[#8E929F]">
              سوال، پیشنهاد یا پیام خود را بفرستید؛ در سریع‌ترین زمان پاسخگوی
              شما هستیم
            </p>
          </div>

          {/* ۳. نوار بج‌های خلاصه (جایگزین ستون شلوغ قبلی) */}
          <div className="mb-7 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
              پاسخگویی سریع
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-extrabold text-[#3B5BDB]">
              <Mail className="h-3 w-3" />
              ارسال پاسخ به ایمیل
            </span>

            <span
              dir="ltr"
              className="inline-flex items-center gap-1 rounded-full bg-[#F3F0FF] px-3 py-1   text-[10px] font-bold text-[#7048E8]"
            >
              021 - 9100 2026
            </span>
          </div>

          {/* ۴. پیام‌های موفقیت (بج سبز مکمل) یا خطا (بج قرمز مکمل) */}
          <AnimatePresence mode="wait">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-xs font-extrabold text-[#059669]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>پیام شما با موفقیت ثبت شد.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#059669]/10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}

            {createContact.isError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 flex items-center gap-2.5 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-4 py-3 text-xs font-extrabold text-[#E11D48]"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  {createContact.error?.response?.data?.message ||
                    "ارسال پیام انجام نشد. لطفاً دوباره تلاش کنید."}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ۵. فرم مینیمال ارسال پیام */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="نام و نام خانوادگی"
                badge="الزامی"
                badgeStyle="bg-[#EEF2FF] text-[#3B5BDB]"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="هوراد احمدی"
                icon={<User className="h-4 w-4" />}
                required
              />

              <Input
                label="ایمیل"
                badge="جهت دریافت پاسخ"
                badgeStyle="bg-[#ECFDF5] text-[#059669]"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                icon={<Mail className="h-4 w-4" />}
                required
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="شماره تماس"
                badge="اختیاری"
                badgeStyle="bg-[#F8F7F4] text-[#8E929F]"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="09123456789"
                icon={<Phone className="h-4 w-4" />}
                dir="ltr"
              />

              <Input
                label="عنوان پیام"
                badge="موضوع"
                badgeStyle="bg-[#FFF4E5] text-[#FF8A00]"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="مثلاً: مشاوره ثبت‌نام دوره"
                icon={<MessageCircle className="h-4 w-4" />}
                required
              />
            </div>

            {/* متن پیام */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  متن پیام
                </label>
                <span className="rounded-full bg-[#F8F7F4] px-2.5 py-0.5 text-[10px] font-bold text-[#8E929F]">
                  توضیحات شما
                </span>
              </div>

              <textarea
                name="body"
                value={form.body}
                onChange={handleChange}
                required
                rows={5}
                placeholder="پیام خود را بنویسید..."
                className="w-full resize-none rounded-2xl border border-transparent bg-[#F8F7F4] p-4 text-xs leading-7 font-semibold text-[#14151A] outline-none transition-all placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
              />
            </div>

            {/* خط جداکننده لطیف */}
            <div className="pt-2">
              <div className="h-[1px] w-full bg-[#F1F0EC]" />
            </div>

            {/* دکمه کپسولی زرد طلایی مشابه Get Course */}
            <div className="pt-1">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.01 }}
                type="submit"
                disabled={createContact.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createContact.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                    <span>در حال ارسال...</span>
                  </>
                ) : (
                  <>
                    <span>ارسال پیام</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

function Input({
  label,
  badge,
  badgeStyle,
  icon,
  name,
  value,
  onChange,
  type = "text",
  dir,
  ...props
}) {
  const isLtr = dir === "ltr";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#14151A]">{label}</label>
        {badge && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${badgeStyle}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="relative">
        <span
          className={`pointer-events-none absolute inset-y-0 my-auto flex items-center text-[#8E929F] ${
            isLtr ? "left-3.5" : "right-3.5"
          }`}
        >
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          dir={dir}
          className={`w-full rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 text-xs font-semibold text-[#14151A] outline-none transition-all placeholder:font-sans placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5] ${
            isLtr ? "pr-4 pl-10 text-left  " : "pr-10 pl-4 text-right"
          }`}
          {...props}
        />
      </div>
    </div>
  );
}
