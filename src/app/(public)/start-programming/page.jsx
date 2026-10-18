"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Code2,
  Server,
  Cpu,
  Palette,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Compass,
  Rocket,
  HelpCircle,
  ArrowUpLeft,
  PhoneCall,
} from "lucide-react";

// داده‌های نقشه‌های راه (Roadmaps)
const learningTracks = [
  {
    id: "frontend",
    title: "توسعه فرانت‌اند (Front-End)",
    badge: "پرتقاضا در بازار کار",
    badgeStyle: "bg-[#EEF2FF] text-[#3B5BDB]",
    barColor: "bg-[#FF8A00]",
    duration: "۴ تا ۶ ماه",
    icon: Code2,
    description:
      "اگر به ساخت ظاهر وب‌سایت‌ها، انیمیشن‌ها و تعامل مستقیم با کاربر علاقه دارید، این مسیر بهترین شروع برای شماست.",
    steps: [
      {
        step: 1,
        name: "HTML5 & CSS3 مدرن",
        topic: "ساختار صفحه، Flexbox و Grid",
        duration: "۳ هفته",
        progress: 100,
        status: "پیش‌نیاز پایه",
        statusType: "green",
      },
      {
        step: 2,
        name: "طراحی ریسپانسیو و Tailwind CSS",
        topic: "پیاده‌سازی رابط‌های کاربری Mobile-First",
        duration: "۲ هفته",
        progress: 75,
        status: "ضروری",
        statusType: "blue",
      },
      {
        step: 3,
        name: "جاوااسکریپت (JavaScript ES6+)",
        topic: "منطق برنامه‌نویسی، DOM و ارتباط با سرور",
        duration: "۶ هفته",
        progress: 50,
        status: "هسته اصلی",
        statusType: "orange",
      },
      {
        step: 4,
        name: "کتابخانه React و فریم‌ورک Next.js",
        topic: "ساخت وب‌اپلیکیشن‌های واقعی و آماده استخدام",
        duration: "۸ هفته",
        progress: 25,
        status: "ورود به بازار کار",
        statusType: "green",
      },
    ],
  },
  {
    id: "backend",
    title: "توسعه بک‌اند (Back-End)",
    badge: "درآمد بالا",
    badgeStyle: "bg-[#ECFDF5] text-[#059669]",
    barColor: "bg-[#3B5BDB]",
    duration: "۵ تا ۷ ماه",
    icon: Server,
    description:
      "مناسب افرادی که به منطق پشت صحنه، دیتابیس‌ها، امنیت سرور و پردازش داده‌ها علاقه‌مند هستند.",
    steps: [
      {
        step: 1,
        name: "مبانی شبکه، HTTP و جاوااسکریپت",
        topic: "درک نحوه کارکرد وب و درخواست‌های کلاینت/سرور",
        duration: "۳ هفته",
        progress: 100,
        status: "پیش‌نیاز پایه",
        statusType: "green",
      },
      {
        step: 2,
        name: "Node.js و فریم‌ورک Express",
        topic: "ساخت RESTful API و معماری MVC",
        duration: "۶ هفته",
        progress: 70,
        status: "هسته اصلی",
        statusType: "orange",
      },
      {
        step: 3,
        name: "پایگاه داده (MongoDB & PostgreSQL)",
        topic: "مدل‌سازی داده‌ها، کوئری‌نویسی و بهینه‌سازی",
        duration: "۴ هفته",
        progress: 45,
        status: "ضروری",
        statusType: "blue",
      },
      {
        step: 4,
        name: "احراز هویت (JWT)، امنیت و استقرار",
        topic: "داکر، تست‌نویسی و پابلیش پروژه روی سرور واقعی",
        duration: "۴ هفته",
        progress: 20,
        status: "ورود به بازار کار",
        statusType: "green",
      },
    ],
  },
  {
    id: "ai",
    title: "پایتون و هوش مصنوعی (AI)",
    badge: "ترند آینده",
    badgeStyle: "bg-[#FFF4E5] text-[#FF8A00]",
    barColor: "bg-[#059669]",
    duration: "۶ تا ۸ ماه",
    icon: Cpu,
    description:
      "مسیر ویژه علاقه‌مندان به علم داده، یادگیری ماشین، اتوماسیون و کار با مدل‌های هوشمند.",
    steps: [
      {
        step: 1,
        name: "برنامه‌نویسی پایتون (Python) مقدماتی تا پیشرفته",
        topic: "ساختمان داده، شیءگرایی و الگوریتم",
        duration: "۵ هفته",
        progress: 100,
        status: "پیش‌نیاز پایه",
        statusType: "green",
      },
      {
        step: 2,
        name: "کتابخانه‌های تحلیل داده (NumPy & Pandas)",
        topic: "پاکسازی، پردازش و مصورسازی داده‌ها",
        duration: "۴ هفته",
        progress: 65,
        status: "ضروری",
        statusType: "blue",
      },
      {
        step: 3,
        name: "یادگیری ماشین (Machine Learning)",
        topic: "الگوریتم‌های پیش‌بینی و دسته‌بندی با Scikit-Learn",
        duration: "۶ هفته",
        progress: 40,
        status: "هسته اصلی",
        statusType: "orange",
      },
      {
        step: 4,
        name: "یادگیری عمیق و پروژه‌های عملی هوش مصنوعی",
        topic: "شبکه‌های عصبی و کار با API مدل‌های زبانی",
        duration: "۶ هفته",
        progress: 20,
        status: "ورود به بازار کار",
        statusType: "green",
      },
    ],
  },
  {
    id: "uiux",
    title: "طراحی رابط و تجربه کاربری (UI/UX)",
    badge: "بدون نیاز به کدنویسی",
    badgeStyle: "bg-[#F3F0FF] text-[#7048E8]",
    barColor: "bg-[#FF8A00]",
    duration: "۳ تا ۴ ماه",
    icon: Palette,
    description:
      "اگر ذوق هنری و حل مسئله دارید و می‌خواهید ظاهر اپلیکیشن‌ها و وب‌سایت‌ها را طراحی کنید.",
    steps: [
      {
        step: 1,
        name: "مبانی تجربه کاربری (UX Research)",
        topic: "شناخت کاربر، وایرفریم و معماری اطلاعات",
        duration: "۳ هفته",
        progress: 100,
        status: "پیش‌نیاز پایه",
        statusType: "green",
      },
      {
        step: 2,
        name: "تسلط کامل بر ابزار Figma",
        topic: "اتولایوت، کامپوننت‌ها و متغیرها",
        duration: "۳ هفته",
        progress: 75,
        status: "ضروری",
        statusType: "blue",
      },
      {
        step: 3,
        name: "طراحی دیزاین سیستم، رنگ و تایپوگرافی",
        topic: "ساخت رابط‌های کاربری استاندارد موبایل و دسکتاپ",
        duration: "۴ هفته",
        progress: 50,
        status: "هسته اصلی",
        statusType: "orange",
      },
      {
        step: 4,
        name: "پروتوتایپ تعاملی و ساخت رزومه (Portfolio)",
        topic: "تحویل فایل به برنامه‌نویس و آمادگی مصاحبه",
        duration: "۳ هفته",
        progress: 25,
        status: "ورود به بازار کار",
        statusType: "green",
      },
    ],
  },
];

export default function StartProgrammingPage() {
  const [selectedTrackId, setSelectedTrackId] = useState("frontend");

  const activeTrack =
    learningTracks.find((t) => t.id === selectedTrackId) || learningTracks[0];

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
              شروع برنامه‌نویسی
            </span>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#14151A] shadow-sm transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00]"
          >
            <span>مشاهده همه دوره‌ها</span>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* ========================================================= */}
        {/* ۲. بخش Hero شروع برنامه‌نویسی */}
        {/* ========================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="overflow-hidden rounded-[34px] bg-white p-6 shadow-[0_14px_45px_-12px_rgba(20,21,26,0.06)] sm:p-10"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3.5 py-1.5 text-[11px] font-extrabold text-[#3B5BDB]">
                  <Compass className="h-3.5 w-3.5" />
                  نقشه راه صفر تا صد
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#059669]">
                  <Sparkles className="h-3.5 w-3.5" />
                  ویژه افراد بدون پیش‌زمینه
                </span>
              </div>

              <div className="relative pr-4">
                <span className="absolute right-0 top-1 bottom-1 w-1.5 rounded-full bg-[#FF8A00]" />
                <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-[#14151A] sm:text-4xl">
                  برنامه‌نویسی را از کجا و چگونه بدون سردرگمی شروع کنیم؟
                </h1>
              </div>

              <p className="text-xs leading-7 font-medium text-[#8E929F] sm:text-sm">
                مهم‌ترین چالش در شروع برنامه‌نویسی، انتخاب مسیر درست و پرهیز از
                پراکنده‌خوانی است. در این صفحه، مسیرهای اصلی بازار کار را به
                زبان ساده تفکیک کرده‌ایم تا دقیقاً بدانید قدم اول، دوم و آخر شما
                چیست.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#roadmaps"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_10px_24px_-4px_rgba(255,204,0,0.5)] transition-all hover:bg-[#FFD633] active:scale-95"
                >
                  <span>انتخاب مسیر یادگیری</span>
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                </a>

                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F8F7F4] px-6 py-3.5 text-xs font-extrabold text-[#14151A] transition-colors hover:bg-[#EFECE6] active:scale-95"
                >
                  <BookOpen className="h-4 w-4 text-[#3B5BDB]" />
                  <span>دوره‌های مقدماتی</span>
                </Link>
              </div>
            </div>

            {/* کارت گرادینت تیره سمت چپ (مشابه کارت Completed Courses در تصویر رفرنس) */}
            <div className="lg:col-span-5">
              <div className="rounded-[28px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-6 text-white shadow-[0_20px_45px_-12px_rgba(20,21,26,0.28)] sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold text-[#FFCC00]">
                    فرمول موفقیت
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                    تضمین شده
                  </span>
                </div>

                <h3 className="mt-4 text-base font-extrabold text-white sm:text-lg">
                  نیاز به ریاضی قوی یا مدرک دانشگاهی ندارید!
                </h3>
                <p className="mt-2 text-xs leading-6 font-medium text-white/65">
                  برای تبدیل شدن به یک برنامه‌نویس حرفه‌ای، تنها به ۳ فاکتور
                  نیاز دارید: نقشه راه استاندارد، تمرین روزانه روی پروژه‌های
                  واقعی و پشتیبانی هنگام برخورد با خطاها.
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFCC00] text-xs font-extrabold text-[#14151A]">
                      ۴
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">
                        مسیر اصلی شغلی
                      </p>
                      <p className="text-[10px] text-white/55">
                        از صفر مطلق تا استخدام
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#FFCC00] hover:underline"
                  >
                    <span>مشاوره رایگان</span>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================================= */}
        {/* ۳. چهار گام شروع (دقیقاً مشابه Courses Overview در بالای تصویر اول) */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
            ۴ گام تا اولین پروژه واقعی شما
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* گام ۱ */}
            <div className="flex items-center gap-3.5 rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-base font-extrabold text-[#FF8A00]">
                ۱
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#14151A]">
                  شناخت علاقه و هدف
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                  ظاهر سایت، منطق سرور یا هوش مصنوعی؟
                </p>
              </div>
            </div>

            {/* گام ۲ (کارت تیره مشابه Completed Courses) */}
            <div className="flex items-center gap-3.5 rounded-[28px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-5 text-white shadow-[0_16px_38px_-10px_rgba(20,21,26,0.22)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-base font-extrabold text-[#14151A]">
                ۲
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  تمرکز روی یک مسیر
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-white/60">
                  پرهیز از عوض کردن مداوم زبان‌ها
                </p>
              </div>
            </div>

            {/* گام ۳ */}
            <div className="flex items-center gap-3.5 rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-base font-extrabold text-[#3B5BDB]">
                ۳
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#14151A]">
                  کدنویسی و تمرین عملی
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                  یادگیری همراه با ساخت مینی‌پروژه
                </p>
              </div>
            </div>

            {/* گام ۴ */}
            <div className="flex items-center gap-3.5 rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-base font-extrabold text-[#059669]">
                ۴
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#14151A]">
                  رزومه و ورود به بازار
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                  انتشار پروژه‌ها در گیت‌هاب و استخدام
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ۴. انتخاب مسیر یادگیری (به سبک کارت‌های Popular Courses در تصویر رفرنس) */}
        {/* ========================================================= */}
        <section id="roadmaps" className="space-y-5 scroll-mt-24">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                مسیرهای اصلی برنامه‌نویسی (یکی را انتخاب کنید)
              </h2>
              <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
                با کلیک روی هر کارت، نقشه راه گام‌به‌گام آن در پایین نمایش داده
                می‌شود
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-extrabold text-[#3B5BDB]">
              نقشه راه تعاملی ۲۰۲۶
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {learningTracks.map((track) => {
              const IconComponent = track.icon;
              const isSelected = track.id === selectedTrackId;

              return (
                <div
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`cursor-pointer text-nowrap flex flex-col justify-between rounded-[30px] p-6 transition-all duration-200 active:scale-[0.98] ${
                    isSelected
                      ? "bg-white ring-2 ring-[#FF8A00] shadow-[0_18px_45px_-12px_rgba(255,138,0,0.18)]"
                      : "bg-white shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)] hover:-translate-y-1"
                  }`}
                >
                  <div>
                    {/* ردیف بالا: بج + آیکون گوشه */}
                    <div className="mb-5 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${track.badgeStyle}`}
                      >
                        {track.badge}
                      </span>

                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          isSelected
                            ? "bg-[#FF8A00] text-white"
                            : "bg-[#F8F7F4] text-[#14151A]"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>

                    {/* عنوان و توضیح با نوار عمودی رنگی */}
                    <div className="relative pr-4">
                      <span
                        className={`absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full ${track.barColor}`}
                      />
                      <h3 className="text-sm font-extrabold  text-[#14151A]">
                        {track.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-xs leading-6 font-medium text-[#8E929F]">
                        {track.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="my-4 h-[1px] w-full bg-[#F1F0EC]" />

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8E929F]">
                        <Clock className="h-3.5 w-3.5 text-[#FF8A00]" />
                        {track.duration}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-colors ${
                          isSelected
                            ? "bg-[#FFCC00] text-[#14151A]"
                            : "bg-[#F8F7F4] text-[#8E929F]"
                        }`}
                      >
                        <span>{isSelected ? "انتخاب شده" : "مشاهده نقشه"}</span>
                        <ChevronLeft className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* ۵. جدول گام‌های مسیر انتخاب شده (دقیقاً مشابه My Courses در تصویر رفرنس) */}
        {/* ========================================================= */}
        <AnimatePresence mode="wait">
          <motion.section
            key={activeTrack.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-extrabold text-[#14151A] sm:text-lg">
                  گام‌های یادگیری: {activeTrack.title}
                </h3>
                <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
                  {activeTrack.steps.length} مرحله استاندارد
                </span>
              </div>

              <Link
                href="/courses"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-[#14151A] hover:text-[#FF8A00]"
              >
                <span>مشاهده دوره‌های این مسیر</span>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>

            {/* 📱 نمای موبایل: کارت‌های گام‌به‌گام */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {activeTrack.steps.map((item) => (
                <div
                  key={item.step}
                  className="relative overflow-hidden rounded-[26px] bg-white p-4 shadow-[0_8px_25px_-8px_rgba(20,21,26,0.05)]"
                >
                  <span className="absolute right-0 top-4 bottom-4 w-1 rounded-l-full bg-[#FF8A00]" />

                  <div className="flex items-start justify-between gap-2 pr-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] text-xs font-extrabold text-[#FF8A00]">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#14151A]">
                          {item.name}
                        </h4>
                        <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                          {item.topic}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                        item.statusType === "green"
                          ? "bg-[#ECFDF5] text-[#059669]"
                          : item.statusType === "blue"
                            ? "bg-[#EEF2FF] text-[#3B5BDB]"
                            : "bg-[#FFF4E5] text-[#FF8A00]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between border-t border-[#F4F3F0] pt-3 pr-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8E929F]">
                      <Clock className="h-3 w-3 text-[#FF8A00]" />
                      مدت زمان: {item.duration}
                    </span>

                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-1 rounded-full bg-[#FFCC00] px-3.5 py-1.5 text-[10px] font-extrabold text-[#14151A]"
                    >
                      <span>شروع گام</span>
                      <ChevronLeft className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* 💻 نمای دسکتاپ: دقیقاً مشابه جدول My Courses در پایین تصویر رفرنس */}
            <div className="hidden md:block">
              <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
                <div className="col-span-1 text-center">گام</div>
                <div className="col-span-3">تکنولوژی / مهارت</div>
                <div className="col-span-3">سرفصل‌های کلیدی</div>
                <div className="col-span-2">مسیر پیشرفت</div>
                <div className="col-span-1 text-center">مدت زمان</div>
                <div className="col-span-1 text-center">اهمیت</div>
                <div className="col-span-1 text-center">دوره</div>
              </div>

              <div className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]">
                {activeTrack.steps.map((item) => (
                  <div
                    key={item.step}
                    className="grid grid-cols-12 items-center gap-2 px-4 py-4 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    <div className="col-span-1 flex justify-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF4E5] font-extrabold text-[#FF8A00]">
                        {item.step}
                      </span>
                    </div>

                    <div className="col-span-3 font-extrabold text-[#14151A]">
                      {item.name}
                    </div>

                    <div className="col-span-3 text-[11px] font-medium text-[#8E929F]">
                      {item.topic}
                    </div>

                    {/* نوار پیشرفت مشابه ستون Progress در تصویر رفرنس */}
                    <div className="col-span-2 pl-4">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F0EC]">
                        <div
                          style={{ width: `${item.progress}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-[#3B5BDB] to-[#FF8A00]"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 text-center text-[11px] font-bold text-[#14151A]">
                      {item.duration}
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <span
                        className={`inline-flex text-nowrap items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                          item.statusType === "green"
                            ? "bg-[#ECFDF5] text-[#059669]"
                            : item.statusType === "blue"
                              ? "bg-[#EEF2FF] text-[#3B5BDB]"
                              : "bg-[#FFF4E5] text-[#FF8A00]"
                        }`}
                      >
                        <span className="h-1.5 w-1.5  rounded-full bg-current" />
                        {item.status}
                      </span>
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <Link
                        href="/courses"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                        title="مشاهده دوره‌های مرتبط"
                      >
                        <ArrowUpLeft className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </AnimatePresence>

        {/* ========================================================= */}
        {/* ۶. بخش بایدها و نبایدهای شروع برنامه‌نویسی (با بج‌های سبز و قرمز مکمل) */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* کارت بایدها (بج‌های سبز مکمل) */}
          <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)] sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3.5 py-1.5 text-xs font-extrabold text-[#059669]">
                <CheckCircle2 className="h-4 w-4" />
                عادت‌های طلایی برای موفقیت
              </span>
            </div>

            <div className="space-y-3">
              {[
                "روزانه حداقل ۱ الی ۲ ساعت به صورت مستمر کد بزنید.",
                "هر مبحثی را که یاد می‌گیرید بلافاصله در یک مینی‌پروژه پیاده کنید.",
                "از خطاها (Errors) نترسید؛ خواندن متن ارور نیمی از برنامه‌نویسی است.",
                "پروژه‌های تمرینی خود را از همان ماه اول در گیت‌هاب قرار دهید.",
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-2xl bg-[#ECFDF5]/60 p-3.5 text-xs font-bold text-[#059669]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* کارت نبایدها (بج‌های قرمز نزدیک به سفید + متن قرمز پررنگ مکمل) */}
          <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)] sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-3.5 py-1.5 text-xs font-extrabold text-[#E11D48]">
                <XCircle className="h-4 w-4" />
                اشتباهات رایج مبتدیان
              </span>
            </div>

            <div className="space-y-3">
              {[
                "دیدن ویدیوهای آموزشی مثل فیلم سینمایی بدون نوشتن کد با دست خودتان!",
                "پریدن از یک زبان به زبان دیگر قبل از تکمیل یک مسیر مشخص.",
                "تلاش برای حفظ کردن تمام کدها به جای درک منطق و جستجو در داکیومنت‌ها.",
                "انتظار یادگیری کامل یک فریم‌ورک سنگین تنها در چند روز.",
              ].map((mistake, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] p-3.5 text-xs font-bold text-[#E11D48]"
                >
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
