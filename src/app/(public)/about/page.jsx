"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Target,
  Award,
  HeartHandshake,
  ChevronLeft,
  Star,
  CheckCircle2,
  PhoneCall,
  Code2,
  Rocket,
} from "lucide-react";

// مقادیر ارزش‌های آکادمی (به سبک کارت‌های Popular Courses)
const coreValues = [
  {
    id: 1,
    badge: "استاندارد جهانی",
    badgeStyle: "bg-[#EEF2FF] text-[#3B5BDB]",
    barColor: "bg-[#FF8A00]",
    title: "آموزش ۱۰۰٪ پروژه‌محور",
    description:
      "تمام مباحث آموزشی در قالب پروژه‌های واقعی بازار کار تدریس می‌شوند تا دانشجو آماده استخدام شود.",
    icon: Code2,
  },
  {
    id: 2,
    badge: "همراهی کامل",
    badgeStyle: "bg-[#ECFDF5] text-[#059669]",
    barColor: "bg-[#3B5BDB]",
    title: "پشتیبانی و منتورینگ مستقیم",
    description:
      "پاسخگویی سریع و دقیق به تمام سوالات و چالش‌های کدنویسی دانشجویان توسط شخص مدرس و منتورها.",
    icon: HeartHandshake,
  },
  {
    id: 3,
    badge: "بدون انقضا",
    badgeStyle: "bg-[#FFF4E5] text-[#FF8A00]",
    barColor: "bg-[#059669]",
    title: "بروزرسانی رایگان مادام‌العمر",
    description:
      "با خرید هر دوره، به تمامی آپدیت‌ها و سرفصل‌های جدیدی که در آینده اضافه می‌شوند رایگان دسترسی دارید.",
    icon: Rocket,
  },
  {
    id: 4,
    badge: "تضمین کیفیت",
    badgeStyle: "bg-[#FFF2F2] text-[#E11D48] border border-[#FFE0E3]",
    barColor: "bg-[#FF8A00]",
    title: "مسیر شغلی شفاف و هدفمند",
    description:
      "طراحی نقشه راه اختصاصی از سطح مقدماتی تا پیشرفته بدون سردرگمی در بین منابع پراکنده.",
    icon: Target,
  },
];

// اعضای کلیدی تیم
const teamMembers = [
  {
    id: 1,
    name: "علی رضایی",
    role: "بنیان‌گذار و مدرس ارشد فرانت‌اند",
    experience: "+۸ سال سابقه فنی",
    score: "4.9",
    badgeColor: "bg-[#FFF4E5] text-[#FF8A00]",
  },
  {
    id: 2,
    name: "سارا محمدی",
    role: "مدیر طراحی محصول و مدرس UI/UX",
    experience: "+۶ سال سابقه طراحی",
    score: "4.8",
    badgeColor: "bg-[#EEF2FF] text-[#3B5BDB]",
  },
  {
    id: 3,
    name: "محمد حسینی",
    role: "معمار نرم‌افزار و مدرس بک‌اند",
    experience: "+۹ سال سابقه توسعه",
    score: "5.0",
    badgeColor: "bg-[#ECFDF5] text-[#059669]",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]" dir="rtl">
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* ========================================================= */}
        {/* ۱. نوار مسیر (Breadcrumb) */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8E929F]">
            <Link href="/" className="hover:text-[#14151A]">
              خانه
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 opacity-60" />
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[#14151A] shadow-sm">
              درباره آکادمی لرن
            </span>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#14151A] shadow-sm transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00]"
          >
            <span>مشاهده دوره‌ها</span>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* ========================================================= */}
        {/* ۲. بخش Hero داستان ما + کارت گرادینت تیره مأموریت ما */}
        {/* ========================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="overflow-hidden rounded-[34px] bg-white p-6 shadow-[0_14px_45px_-12px_rgba(20,21,26,0.06)] sm:p-10"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* ستون راست: معرفی و داستان */}
            <div className="space-y-5 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3.5 py-1.5 text-[11px] font-extrabold text-[#3B5BDB]">
                  <Sparkles className="h-3.5 w-3.5" />
                  داستان شکل‌گیری آکادمی
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#059669]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  آموزش نتیجه‌محور
                </span>
              </div>

              <div className="relative pr-4">
                <span className="absolute right-0 top-1 bottom-1 w-1.5 rounded-full bg-[#FF8A00]" />
                <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-[#14151A] sm:text-4xl">
                  ما پل ارتباطی بین یادگیری تئوری و بازار کار واقعی هستیم
                </h1>
              </div>

              <p className="text-xs leading-7 font-medium text-[#8E929F] sm:text-sm">
                آکادمی لرن با یک هدف مشخص متولد شد: حذف فاصله بین آموزش‌های
                دانشگاهی و نیازهای واقعی شرکت‌های تکنولوژی. ما باور داریم
                یادگیری برنامه‌نویسی و طراحی زمانی ارزشمند است که به خلق محصول
                واقعی و استخدام شدن ختم شود.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_10px_24px_-4px_rgba(255,204,0,0.5)] transition-all hover:bg-[#FFD633] active:scale-95"
                >
                  <span>شروع مسیر یادگیری</span>
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F8F7F4] px-6 py-3.5 text-xs font-extrabold text-[#14151A] transition-colors hover:bg-[#EFECE6] active:scale-95"
                >
                  <PhoneCall className="h-4 w-4 text-[#FF8A00]" />
                  <span>ارتباط با مشاورین</span>
                </Link>
              </div>
            </div>

            {/* ستون چپ: کارت گرادینت تیره (مشابه کارت Completed Courses در تصویر رفرنس) */}
            <div className="lg:col-span-5">
              <div className="rounded-[28px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-6 text-white shadow-[0_20px_45px_-12px_rgba(20,21,26,0.28)] sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold text-[#FFCC00]">
                    چشم‌انداز ما
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                    تضمین کیفیت
                  </span>
                </div>

                <h3 className="mt-4 text-base font-extrabold text-white sm:text-lg">
                  تمرکز بر کیفیت، نه کمیت!
                </h3>
                <p className="mt-2 text-xs leading-6 font-medium text-white/65">
                  به جای تولید صدها دوره سطحی، ما زمان خود را صرف ساخت دوره‌های
                  عمیق، استاندارد و منطبق بر آخرین داکیومنت‌های جهانی می‌کنیم.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                  <div className="rounded-2xl bg-white/5 p-3">
                    <span className="text-lg font-extrabold text-[#FFCC00]">
                      ۹۸٪
                    </span>
                    <p className="mt-0.5 text-[11px] font-medium text-white/70">
                      رضایت دانشجویان
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-3">
                    <span className="text-lg font-extrabold text-[#FFCC00]">
                      ۲۴/۷
                    </span>
                    <p className="mt-0.5 text-[11px] font-medium text-white/70">
                      پشتیبانی فنی فعال
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================================= */}
        {/* ۳. ردیف کارت‌های Overview آمار آکادمی (مشابه Courses Overview در تصویر اول) */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
            آکادمی لرن در یک نگاه
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* کارت ۱ */}
            <div className="flex items-center gap-3.5 rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
                +۱۲k
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#14151A]">
                  دانشجوی فعال
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                  در سراسر کشور
                </p>
              </div>
            </div>

            {/* کارت ۲ (تیره مشابه Completed Courses) */}
            <div className="flex items-center gap-3.5 rounded-[28px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-5 text-white shadow-[0_16px_38px_-10px_rgba(20,21,26,0.22)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#14151A]">
                +۴۰
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  دوره تخصصی
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-white/60">
                  تکمیل شده و پروژه‌محور
                </p>
              </div>
            </div>

            {/* کارت ۳ */}
            <div className="flex items-center gap-3.5 rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-extrabold text-[#3B5BDB]">
                +۸۵۰
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#14151A]">
                  ساعت ویدیوی آموزشی
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                  با بالاترین کیفیت ضبط
                </p>
              </div>
            </div>

            {/* کارت ۴ */}
            <div className="flex items-center gap-3.5 rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-sm font-extrabold text-[#059669]">
                ۴.۹
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#14151A]">
                  میانگین امتیاز دوره‌ها
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                  بر اساس رای دانشجویان
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ۴. ارزش‌های محوری ما (به سبک کارت‌های Popular Courses در تصویر رفرنس) */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
              چرا آکادمی لرن را انتخاب می‌کنند؟
            </h2>
            <span className="rounded-full bg-[#FFF4E5] px-3 py-1 text-[11px] font-extrabold text-[#FF8A00]">
              ارزش‌های ما
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((val) => {
              const IconComponent = val.icon;
              return (
                <div
                  key={val.id}
                  className="flex flex-col justify-between rounded-[30px] bg-white p-6 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <div>
                    {/* ردیف بالای کارت: بج وضعیت + آیکون دایره‌ای گوشه */}
                    <div className="mb-5 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${val.badgeStyle}`}
                      >
                        {val.badge}
                      </span>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F7F4] text-[#14151A]">
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>

                    {/* عنوان و توضیحات با نوار عمودی رنگی در سمت راست */}
                    <div className="relative pr-4">
                      <span
                        className={`absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full ${val.barColor}`}
                      />
                      <h3 className="text-sm font-extrabold text-[#14151A]">
                        {val.title}
                      </h3>
                      <p className="mt-2 text-xs leading-6 font-medium text-[#8E929F]">
                        {val.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[#F4F3F0] pt-3.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#059669]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      تضمین آکادمی
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* ۵. معرفی تیم و مدرسین (Instructors & Team) */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
              تیم فنی و مدرسین آکادمی
            </h2>
            <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-extrabold text-[#3B5BDB]">
              منتورهای باسابقه
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col justify-between rounded-[28px] bg-white p-6 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#FFCC00] text-base font-extrabold text-[#14151A] shadow-sm">
                    {member.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-[#14151A]">
                      {member.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#F4F3F0] pt-4">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${member.badgeColor}`}
                  >
                    {member.experience}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-1 text-xs font-extrabold text-[#14151A]">
                    <Star className="h-3.5 w-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                    {member.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
