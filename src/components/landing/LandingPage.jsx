"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Star,
  Bookmark,
  Sparkles,
  BookOpen,
  FileText,
  ShoppingBag,
  PhoneCall,
  ArrowUpLeft,
  Image as ImageIcon,
} from "lucide-react";

import { useAllCourses } from "@/hooks/useCourses";
import { useAllArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/useCategories";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// تابع کمکی دریافت آدرس کامل تصویر دوره یا مقاله
const resolveImageUrl = (item, folder = "courses/covers") => {
  if (!item) return "";
  if (item.coverUrl) return item.coverUrl;
  if (item.cover) {
    if (item.cover.startsWith("http") || item.cover.startsWith("/")) {
      return item.cover;
    }
    return `${API_URL}/${folder}/${item.cover}`;
  }
  return "";
};

// داده‌های پیش‌فرض (Fallback) همراه با تصویر شاخص
const fallbackCourses = [
  {
    _id: "c1",
    name: "دوره جامع طراحی رابط کاربری (UI/UX)",
    description:
      "آموزش گام‌به‌گام طراحی دیزاین سیستم، پروتوتایپ و تجربه کاربری مدرن در فیگما.",
    href: "ui-design-course",
    price: 1200000,
    discount: 20,
    score: 4.8,
    status: "COMPLETED",
    categoryID: { title: "طراحی وب" },
    coverUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "c2",
    name: "توسعه وب فول‌استک (Next.js & Node)",
    description:
      "ساخت اپلیکیشن‌های مقیاس‌پذیر از صفر تا صد همراه با معماری تمیز و امنیت بالا.",
    href: "fullstack-web-dev",
    price: 2400000,
    discount: 0,
    score: 4.9,
    status: "PRESELL",
    categoryID: { title: "برنامه‌نویسی" },
    coverUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "c3",
    name: "یادگیری ماشین با پایتون (Machine Learning)",
    description:
      "پیاده‌سازی الگوریتم‌های هوش مصنوعی و تحلیل داده با پروژه‌های واقعی.",
    href: "machine-learning-python",
    price: 1950000,
    discount: 15,
    score: 4.7,
    status: "COMPLETED",
    categoryID: { title: "هوش مصنوعی" },
    coverUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "c4",
    name: "موشن گرافیک حرفه‌ای در After Effects",
    description:
      "خلق انیمیشن‌های تبلیغاتی و رابط‌های کاربری متحرک با تکنیک‌های روز دنیا.",
    href: "motion-graphics-ae",
    price: 1600000,
    discount: 10,
    score: 4.6,
    status: "COMPLETED",
    categoryID: { title: "گرافیک" },
    coverUrl:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
  },
];

const fallbackArticles = [
  {
    _id: "a1",
    title: "اصول طراحی Mobile-First در پروژه‌های مدرن ۲۰۲۶",
    description:
      "چگونه رابط کاربری وب‌سایت را طوری طراحی کنیم که در موبایل حس یک اپلیکیشن بومی را منتقل کند؟",
    href: "mobile-first-ux-2026",
    categoryID: { title: "UI/UX" },
    createdAt: new Date().toISOString(),
    coverUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "a2",
    title: "بهینه‌سازی سرعت و انیمیشن‌ها در React و Next.js",
    description:
      "بررسی تکنیک‌های کاهش Layout Shift و اجرای انیمیشن‌های ۶۰ فریم بر ثانیه.",
    href: "nextjs-performance-guide",
    categoryID: { title: "فرانت‌اند" },
    createdAt: new Date().toISOString(),
    coverUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "a3",
    title: "راهنمای جامع معماری رنگ و بج‌های معنایی در داشبورد",
    description:
      "استفاده صحیح از رنگ‌های مکمل برای تشخیص سریع وضعیت آیتم‌ها بدون شلوغی بصری.",
    href: "semantic-badges-design",
    categoryID: { title: "سیستم طراحی" },
    createdAt: new Date().toISOString(),
    coverUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

export default function LandingPage() {
  const { data: coursesData } = useAllCourses();
  const { data: articlesData } = useAllArticles();
  const { data: categoriesData } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [bookmarkedIds, setBookmarkedIds] = useState(["c3"]);

  // نرمال‌سازی دوره‌ها
  const courses = useMemo(() => {
    const raw = coursesData?.allCourse || coursesData?.courses || [];
    return Array.isArray(raw) && raw.length > 0 ? raw : fallbackCourses;
  }, [coursesData]);

  // نرمال‌سازی مقالات
  const articles = useMemo(() => {
    const raw = articlesData?.articles || articlesData || [];
    const published = Array.isArray(raw)
      ? raw.filter((a) => Number(a.publish) === 1 || a.publish === undefined)
      : [];
    return published.length > 0 ? published.slice(0, 3) : fallbackArticles;
  }, [articlesData]);

  // نرمال‌سازی دسته‌بندی‌ها
  const categories = useMemo(() => {
    const raw = categoriesData?.categories || categoriesData || [];
    return Array.isArray(raw) ? raw.slice(0, 6) : [];
  }, [categoriesData]);

  // فیلتر دوره‌ها بر اساس دسته‌بندی
  const displayedCourses = useMemo(() => {
    if (selectedCategory === "ALL") return courses.slice(0, 8);
    return courses
      .filter(
        (c) =>
          c.categoryID?._id === selectedCategory ||
          c.categoryID?.title === selectedCategory,
      )
      .slice(0, 8);
  }, [courses, selectedCategory]);

  const completedCoursesCount = courses.filter(
    (c) => c.status === "COMPLETED",
  ).length;
  const presellCoursesCount = courses.length - completedCoursesCount;

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir="rtl"
      className="min-h-screen bg-[#F8F7F4] py-6 sm:py-10"
    >
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* ۱. بخش Hero و معرفی پلتفرم */}
        {/* ========================================================= */}
        <motion.section
          variants={itemVariants}
          className="relative overflow-hidden rounded-[36px] bg-white p-6 shadow-[0_14px_45px_-12px_rgba(20,21,26,0.06)] sm:p-10 lg:p-12"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3.5 py-1.5 text-[11px] font-extrabold text-[#3B5BDB]">
                  <Sparkles className="h-3.5 w-3.5" />
                  نسل جدید آموزش آنلاین
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#059669]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                  تضمین کیفیت و پشتیبانی
                </span>
              </div>

              <div className="relative pr-4">
                <span className="absolute right-0 top-1 bottom-1 w-1.5 rounded-full bg-[#FF8A00]" />
                <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-[#14151A] sm:text-4xl">
                  مهارت‌های آینده را همین امروز پروژه‌محور یاد بگیرید
                </h1>
              </div>

              <p className="max-w-xl text-xs leading-7 font-medium text-[#8E929F] sm:text-sm">
                دسترسی به جدیدترین دوره‌های تخصصی برنامه‌نویسی، طراحی رابط
                کاربری و هوش مصنوعی همراه با منتورینگ مستقیم و مقالات کاربردی.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_10px_24px_-4px_rgba(255,204,0,0.5)] transition-all hover:bg-[#FFD633] active:scale-95"
                >
                  <span>مشاهده دوره‌ها</span>
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                </Link>

                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F8F7F4] px-6 py-3.5 text-xs font-extrabold text-[#14151A] transition-colors hover:bg-[#EFECE6] active:scale-95"
                >
                  <FileText className="h-4 w-4 text-[#3B5BDB]" />
                  <span>مطالعه مقالات</span>
                </Link>
              </div>
            </div>

            {/* کارت ویژه سمت چپ Hero */}
            <div className="lg:col-span-5">
              <div className="rounded-[28px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-6 text-white shadow-[0_20px_45px_-12px_rgba(20,21,26,0.28)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold text-[#FFCC00]">
                    پیشنهاد ویژه هفته
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                    فعال
                  </span>
                </div>

                <h3 className="mt-4 text-base font-extrabold text-white sm:text-lg">
                  مسیر یادگیری اختصاصی + پشتیبانی دائمی
                </h3>
                <p className="mt-2 text-xs leading-6 font-medium text-white/65">
                  در تمام دوره‌ها، پیشرفت شما گام‌به‌گام بررسی شده و در صورت
                  بروز هرگونه چالش، منتورهای دوره پاسخگوی شما هستند.
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-extrabold text-[#14151A]">
                      {courses.length}+
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">
                        دوره تخصصی
                      </p>
                      <p className="text-[10px] text-white/55">
                        آپدیت منظم هفتگی
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/orders"
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#FFCC00] hover:underline"
                  >
                    <span>پیگیری سفارشات</span>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================================= */}
        {/* ۲. ردیف کارت‌های Overview (مشابه Courses Overview در تصویر اول) */}
        {/* ========================================================= */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
            نمای کلی آکادمی
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col justify-between rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-base font-extrabold text-[#FF8A00]">
                  {courses.length}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#14151A]">
                    کل دوره‌های آموزشی
                  </h3>
                  <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                    تخصصی و پروژه‌محور
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#14151A] hover:text-[#FF8A00]"
                >
                  <span>مشاهده جزئیات</span>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-5 text-white shadow-[0_16px_38px_-10px_rgba(20,21,26,0.22)]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-base font-extrabold text-[#14151A]">
                  {completedCoursesCount}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    دوره‌های تکمیل شده
                  </h3>
                  <p className="mt-0.5 text-[11px] font-medium text-white/60">
                    آماده مشاهده فوری
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Link
                  href="/courses?status=COMPLETED"
                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-white/90 hover:text-[#FFCC00]"
                >
                  <span>مشاهده جزئیات</span>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-base font-extrabold text-[#FF8A00]">
                  {presellCoursesCount}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#14151A]">
                    در حال برگزاری
                  </h3>
                  <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                    پیش‌فروش با تخفیف ویژه
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Link
                  href="/courses?status=PRESELL"
                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#14151A] hover:text-[#FF8A00]"
                >
                  <span>مشاهده جزئیات</span>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-base font-extrabold text-[#FF8A00]">
                  {articles.length}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#14151A]">
                    مقالات تخصصی
                  </h3>
                  <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                    مطالعه رایگان و کاربردی
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#14151A] hover:text-[#FF8A00]"
                >
                  <span>مشاهده جزئیات</span>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================================= */}
        {/* ۳. بخش دوره‌های محبوب همراه با تصویر شاخص (کاور دوره) */}
        {/* ========================================================= */}
        <motion.section variants={itemVariants} className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                محبوب‌ترین دوره‌ها
              </h2>

              {categories.length > 0 && (
                <div className="mr-2 flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("ALL")}
                    className={`rounded-full px-3 py-1 text-[11px] font-extrabold transition-colors ${
                      selectedCategory === "ALL"
                        ? "bg-[#14151A] text-white"
                        : "bg-white text-[#8E929F] hover:text-[#14151A]"
                    }`}
                  >
                    همه
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold transition-colors ${
                        selectedCategory === cat._id
                          ? "bg-[#14151A] text-white"
                          : "bg-white text-[#8E929F] hover:text-[#14151A]"
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#14151A] transition-colors hover:text-[#FF8A00]"
            >
              <span>مشاهده همه دوره‌ها</span>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>

          {/* گرید ۴ ستونه کارت‌های دوره همراه با عکس شاخص */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayedCourses.map((course, idx) => {
              const isBookmarked = bookmarkedIds.includes(course._id);
              const price = Number(course.price) || 0;
              const discount = Number(course.discount) || 0;
              const finalPrice =
                discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
              const rating = course.courseAverageScore || course.score || 4.8;
              const coverImg = resolveImageUrl(course, "courses/covers");
              const isCompleted = course.status === "COMPLETED";

              // رنگ نوار عمودی کنار عنوان دقیقاً مشابه ۴ کارت تصویر رفرنس
              const barColorClass =
                idx % 3 === 1
                  ? "bg-[#3B5BDB]"
                  : idx % 3 === 2
                    ? "bg-[#059669]"
                    : "bg-[#FF8A00]";

              return (
                <div
                  key={course._id}
                  className="group flex flex-col justify-between rounded-[30px] bg-white p-4 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-12px_rgba(20,21,26,0.1)]"
                >
                  <div>
                    {/* قاب تصویر شاخص (کاور دوره) + بج‌ها و دکمه بوکمارک روی تصویر */}
                    <div className="relative mb-4 h-44 w-full overflow-hidden rounded-[22px] bg-[#F8F7F4]">
                      {coverImg ? (
                        <img
                          src={coverImg}
                          alt={course.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#FFF4E5] to-[#EEF2FF] text-[#8E929F]">
                          <BookOpen className="mb-1.5 h-8 w-8 text-[#FF8A00]" />
                          <span className="text-[10px] font-bold">
                            آکادمی لرن
                          </span>
                        </div>
                      )}

                      {/* گرادینت ملایم بالای تصویر برای خوانایی بج‌ها */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

                      {/* ردیف بالای روی تصویر: بج دسته‌بندی آبی + دکمه بوکمارک */}
                      <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                        <span className="rounded-full bg-[#EEF2FF]/95 px-3 py-1 text-[10px] font-extrabold text-[#3B5BDB] shadow-sm backdrop-blur-md">
                          {course.categoryID?.title || "محبوب هفته"}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleBookmark(course._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#3B5BDB] shadow-sm backdrop-blur-md transition-transform active:scale-90"
                          aria-label="نشان کردن"
                        >
                          <Bookmark
                            className={`h-3.5 w-3.5 ${
                              isBookmarked ? "fill-[#3B5BDB]" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* بج تخفیف یا وضعیت در پایین تصویر */}
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                        {discount > 0 && (
                          <span className="rounded-full border border-[#FFE0E3] bg-[#FFF2F2]/95 px-2.5 py-0.5 text-[10px] font-extrabold text-[#E11D48] shadow-sm backdrop-blur-md">
                            {discount}% تخفیف
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold shadow-sm backdrop-blur-md ${
                            isCompleted
                              ? "bg-[#ECFDF5]/95 text-[#059669]"
                              : "bg-[#FFF4E5]/95 text-[#FF8A00]"
                          }`}
                        >
                          {isCompleted ? "تکمیل شده" : "پیش‌فروش"}
                        </span>
                      </div>
                    </div>

                    {/* عنوان و توضیحات با نوار عمودی رنگی در سمت راست (مشابه تصویر دوم) */}
                    <div className="relative px-1 pr-4">
                      <span
                        className={`absolute right-1 top-0.5 bottom-0.5 w-1.5 rounded-full ${barColorClass}`}
                      />
                      <Link href={`/courses/${course.href}`}>
                        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-[#14151A] transition-colors group-hover:text-[#FF8A00]">
                          {course.name}
                        </h3>
                      </Link>
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed font-medium text-[#8E929F]">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-1">
                    {/* خط جداکننده وسط کارت */}
                    <div className="my-4 h-[1px] w-full bg-[#F1F0EC]" />

                    {/* فوتر کارت: امتیاز و قیمت + دکمه کپسولی طلایی Get Course */}
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                          <span className="text-xs font-extrabold text-[#14151A]">
                            {rating}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                          <span className="text-sm font-extrabold text-[#14151A]">
                            {finalPrice === 0
                              ? "رایگان"
                              : `${finalPrice.toLocaleString("fa-IR")}`}
                          </span>
                          {finalPrice > 0 && (
                            <span className="text-[10px] font-bold text-[#8E929F]">
                              تومان
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="text-[10px] font-semibold text-[#A0A4B0] line-through">
                              {price.toLocaleString("fa-IR")}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/courses/${course.href}`}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#FFCC00] px-4 py-2.5 text-[11px] font-extrabold text-[#14151A] shadow-[0_8px_18px_-4px_rgba(255,204,0,0.5)] transition-all hover:bg-[#FFD633] active:scale-95"
                      >
                        <span>مشاهده دوره</span>
                        <ChevronLeft
                          className="h-3.5 w-3.5"
                          strokeWidth={2.5}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ========================================================= */}
        {/* ۴. بخش آخرین مقالات همراه با تصویر شاخص */}
        {/* ========================================================= */}
        <motion.section variants={itemVariants} className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
              جدیدترین مقالات آموزشی
            </h2>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#14151A] transition-colors hover:text-[#FF8A00]"
            >
              <span>مشاهده همه مقالات</span>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {articles.map((article, idx) => {
              const articleCover = resolveImageUrl(article, "articles/covers");

              return (
                <div
                  key={article._id}
                  className="group flex flex-col justify-between rounded-[28px] bg-white p-4 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    {/* تصویر کاور مقاله */}
                    <div className="relative mb-4 h-44 w-full overflow-hidden rounded-[20px] bg-[#F8F7F4]">
                      {articleCover ? (
                        <img
                          src={articleCover}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EEF2FF] to-[#ECFDF5]">
                          <FileText className="mb-1 h-7 w-7 text-[#3B5BDB]" />
                          <span className="text-[10px] font-bold text-[#8E929F]">
                            مقاله آموزشی
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                        <span className="rounded-full bg-[#ECFDF5]/95 px-3 py-1 text-[10px] font-extrabold text-[#059669] shadow-sm backdrop-blur-md">
                          {article.categoryID?.title || "مقاله تخصصی"}
                        </span>

                        <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#14151A] shadow-sm backdrop-blur-md">
                          {article.createdAt
                            ? new Date(article.createdAt).toLocaleDateString(
                                "fa-IR",
                              )
                            : "جدید"}
                        </span>
                      </div>
                    </div>

                    <div className="relative px-1 pr-4">
                      <span
                        className={`absolute right-1 top-0.5 bottom-0.5 w-1.5 rounded-full ${
                          idx % 2 === 0 ? "bg-[#3B5BDB]" : "bg-[#FF8A00]"
                        }`}
                      />
                      <Link href={`/blog/${article.href}`}>
                        <h3 className="line-clamp-2 text-sm font-extrabold leading-relaxed text-[#14151A] transition-colors group-hover:text-[#3B5BDB]">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-6 font-medium text-[#8E929F]">
                        {article.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#F4F3F0] px-1 pt-3.5">
                    <span className="text-[11px] font-bold text-[#8E929F]">
                      زمان مطالعه: ۵ دقیقه
                    </span>

                    <Link
                      href={`/blog/${article.href}`}
                      className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-3.5 py-1.5 text-[11px] font-extrabold text-[#3B5BDB] transition-colors hover:bg-[#3B5BDB] hover:text-white"
                    >
                      <span>مطالعه</span>
                      <ArrowUpLeft className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ========================================================= */}
        {/* ۵. بخش دوگانه: پیگیری سریع سفارشات + ارتباط مستقیم با ما */}
        {/* ========================================================= */}
        <motion.section
          variants={itemVariants}
          className="grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          <div className="flex flex-col justify-between rounded-[30px] bg-white p-6 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)] sm:p-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-extrabold text-[#059669]">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  سفارشات و دسترسی‌ها
                </span>
              </div>

              <div className="relative pr-4">
                <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#059669]" />
                <h3 className="text-base font-extrabold text-[#14151A] sm:text-lg">
                  پیگیری سفارشات و دوره‌های خریداری‌شده
                </h3>
                <p className="mt-2 text-xs leading-6 font-medium text-[#8E929F]">
                  بلافاصله پس از ثبت سفارش، دسترسی به ویدیوها، فایل‌های تمرینی و
                  گروه پشتیبانی دوره در بخش سفارشات حساب کاربری شما فعال می‌شود.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end border-t border-[#F4F3F0] pt-4">
              <Link
                href="/orders"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-5 py-2.5 text-xs font-extrabold text-[#14151A] shadow-sm transition-transform active:scale-95"
              >
                <span>مشاهده سفارشات من</span>
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[30px] bg-white p-6 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)] sm:p-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3 py-1 text-[11px] font-extrabold text-[#FF8A00]">
                  <PhoneCall className="h-3.5 w-3.5" />
                  مشاوره و ارتباط با ما
                </span>
              </div>

              <div className="relative pr-4">
                <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#FF8A00]" />
                <h3 className="text-base font-extrabold text-[#14151A] sm:text-lg">
                  نیاز به راهنمایی برای انتخاب دوره دارید؟
                </h3>
                <p className="mt-2 text-xs leading-6 font-medium text-[#8E929F]">
                  تیم مشاوره و پشتیبانی ما آماده پاسخگویی به سوالات شما درباره
                  پیش‌نیازها، سرفصل‌ها و مسیر ورود به بازار کار است.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end border-t border-[#F4F3F0] pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#14151A] px-5 py-2.5 text-xs font-extrabold text-white transition-transform active:scale-95"
              >
                <span>صفحه ارتباط با ما</span>
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.main>
  );
}
