"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus({
        type: "error",
        message: "لطفاً یک آدرس ایمیل معتبر وارد کنید",
      });
      return;
    }

    setIsSubmitting(true);
    // شبیه‌سازی یا ارسال به API خبرنامه
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      setStatus({
        type: "success",
        message: "ایمیل شما با موفقیت در خبرنامه ثبت شد!",
      });
    }, 600);
  };

  return (
    <footer dir="rtl" className="w-full bg-[#F8F7F4] pt-12 pb-24 md:pb-12">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* ۱. کارت خبرنامه (Newsletter) با گرادینت تیره مشابه کارت Completed Courses */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-6 text-white shadow-[0_20px_50px_-12px_rgba(20,21,26,0.25)] sm:p-10">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            {/* متن خبرنامه */}
            <div className="space-y-2.5 lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold text-[#FFCC00]">
                <Sparkles className="h-3.5 w-3.5" />
                عضویت در خبرنامه آموزشی
              </div>

              <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                از دوره‌های جدید و کدهای تخفیف جا نمانید!
              </h3>

              <p className="max-w-xl text-xs leading-relaxed font-medium text-white/65">
                با ثبت ایمیل خود، جدیدترین مقالات تخصصی و کوپن‌های تخفیف دوره‌ها
                را مستقیماً دریافت کنید. بدون هیچ ایمیل تبلیغاتی مزاحم.
              </p>
            </div>

            {/* فرم خبرنامه کپسولی */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:rounded-full sm:bg-white/10 sm:p-1.5 sm:ring-1 sm:ring-white/15"
              >
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full rounded-full bg-white/10 px-4 py-3 text-left   text-xs font-semibold text-white outline-none placeholder:   placeholder:text-white/45 sm:bg-transparent sm:py-2.5"
                />

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-6 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>در حال ثبت...</span>
                  ) : (
                    <>
                      <span>عضویت</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* نمایش وضعیت ثبت ایمیل با بج‌های سبز یا قرمز مکمل */}
              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex justify-start"
                  >
                    {status.type === "success" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-extrabold text-[#059669]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {status.message}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-3 py-1 text-[11px] font-extrabold text-[#E11D48]">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {status.message}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ۲. کارت اصلی فوتر (لینک‌ها و اطلاعات تماس) */}
        {/* ========================================================= */}
        <div className="rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)] sm:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* ستون معرفی برند */}
            <div className="space-y-4 md:col-span-5">
              <Link href="/blog" className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFCC00] to-[#FF8A00] text-white shadow-sm">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-base font-extrabold text-[#14151A]">
                    آکادمی لرن
                  </span>
                  <span className="text-[11px] font-bold text-[#8E929F]">
                    یادگیری پروژه‌محور و نتیجه‌گرا
                  </span>
                </div>
              </Link>

              <p className="max-w-sm text-xs leading-6 font-medium text-[#8E929F]">
                ما با تمرکز بر کیفیت آموزش، پشتیبانی مستقیم و پروژه‌های واقعی
                بازار کار، مسیر یادگیری برنامه‌نویسی و طراحی را برای شما ساده و
                لذت‌بخش می‌کنیم.
              </p>

              {/* بج‌های اعتماد */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                  پشتیبانی دائمی دوره‌ها
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-extrabold text-[#3B5BDB]">
                  آپدیت رایگان مادام‌العمر
                </span>
              </div>
            </div>

            {/* ستون دسترسی سریع */}
            <div className="space-y-3 md:col-span-3">
              <div className="relative pr-3">
                <span className="absolute right-0 top-0.5 bottom-0.5 w-1 rounded-full bg-[#FF8A00]" />
                <h4 className="text-xs font-extrabold text-[#14151A]">
                  بخش‌های سایت
                </h4>
              </div>

              <ul className="space-y-2 text-xs font-bold text-[#8E929F]">
                {[
                  { id: 1, title: "صفحه اصلی", href: "/" },
                  { id: 2, title: "دوره‌های آموزشی", href: "/courses" },
                  { id: 3, title: "مقالات تخصصی", href: "/" },
                  { id: 4, title: "پیگیری سفارشات", href: "/orders" },
                  { id: 5, title: "ارتباط با ما", href: "/contact" },
                ].map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1 transition-colors hover:text-[#FF8A00]"
                    >
                      <ChevronLeft className="h-3 w-3 opacity-60" />
                      <span>{link.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ستون اطلاعات تماس */}
            <div className="space-y-3 md:col-span-4">
              <div className="relative pr-3">
                <span className="absolute right-0 top-0.5 bottom-0.5 w-1 rounded-full bg-[#3B5BDB]" />
                <h4 className="text-xs font-extrabold text-[#14151A]">
                  راه‌های ارتباطی
                </h4>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between rounded-2xl bg-[#F8F7F4] px-3.5 py-2.5">
                  <span className="inline-flex items-center gap-2 font-bold text-[#8E929F]">
                    <Phone className="h-3.5 w-3.5 text-[#FF8A00]" />
                    تلفن پشتیبانی
                  </span>
                  <span dir="ltr" className="  font-extrabold text-[#14151A]">
                    021 - 9100 2026
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[#F8F7F4] px-3.5 py-2.5">
                  <span className="inline-flex items-center gap-2 font-bold text-[#8E929F]">
                    <Mail className="h-3.5 w-3.5 text-[#3B5BDB]" />
                    ایمیل
                  </span>
                  <span dir="ltr" className="  font-extrabold text-[#14151A]">
                    info@academylearn.ir
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-[#F8F7F4] px-3.5 py-2.5 font-bold text-[#8E929F]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#059669]" />
                  <span className="truncate text-[#14151A]">
                    تهران، پارک فناوری و نوآوری
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* خط جداکننده و کپی‌رایت */}
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#F4F3F0] pt-6 text-[11px] font-bold text-[#8E929F] sm:flex-row">
            <p>© تمامی حقوق برای آکادمی لرن محفوظ است.</p>
            <span className="rounded-full bg-[#FFF4E5] px-3 py-1 text-[10px] font-extrabold text-[#FF8A00]">
              طراحی شده با استاندارد UI/UX مدرن
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
