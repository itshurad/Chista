"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  X,
  Clock,
  Calendar,
  User,
  Bookmark,
  ChevronLeft,
  Sparkles,
  Layers,
  Eye,
  ArrowUpLeft,
  AlertCircle,
} from "lucide-react";

import { useAllArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/useCategories";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getArticleCoverUrl = (article) => {
  if (!article) return "";
  if (article.coverUrl) return article.coverUrl;
  if (article.cover) {
    if (article.cover.startsWith("http") || article.cover.startsWith("/")) {
      return article.cover;
    }
    return `${API_URL}/blog/covers/${article.cover}`;
  }
  return "";
};

const fallbackArticlesList = [
  {
    _id: "a1",
    title: "اصول طراحی Mobile-First در پروژه‌های مدرن ۲۰۲۶",
    description:
      "چگونه رابط کاربری وب‌سایت را طوری طراحی کنیم که در موبایل حس یک اپلیکیشن بومی و سریع را منتقل کند؟",
    body: "طراحی موبایل‌فرست دیگر یک انتخاب نیست بلکه استاندارد اصلی وب مدرن است. در این رویکرد ابتدا محدودیت‌های صفحه نمایش کوچک، تعامل با انگشت شست، سرعت بارگذاری و حذف متن‌های غیرضروری در اولویت قرار می‌گیرد و سپس چیدمان برای دسکتاپ گسترش می‌یابد.",
    href: "mobile-first-ux-2026",
    publish: 1,
    creator: { name: "تیم تحریریه" },
    categoryID: { _id: "cat1", title: "UI/UX" },
    createdAt: new Date().toISOString(),
    coverUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "a2",
    title: "بهینه‌سازی سرعت و انیمیشن‌ها در React و Next.js",
    description:
      "بررسی تکنیک‌های کاهش Layout Shift و اجرای انیمیشن‌های ۶۰ فریم بر ثانیه با استفاده از Framer Motion.",
    body: "برای ساخت یک وب‌اپلیکیشن نرم و روان، باید از انیمیشن‌هایی استفاده کنید که مستقیماً توسط GPU پردازش می‌شوند (مانند transform و opacity) و از تغییر ناگهانی ابعاد المان‌ها جلوگیری کنید.",
    href: "nextjs-performance-guide",
    publish: 1,
    creator: { name: "علی رضایی" },
    categoryID: { _id: "cat2", title: "فرانت‌اند" },
    createdAt: new Date().toISOString(),
    coverUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "a3",
    title: "راهنمای جامع معماری رنگ و بج‌های معنایی در داشبورد",
    description:
      "استفاده صحیح از رنگ‌های مکمل (سبز، قرمز، نارنجی و آبی) برای تشخیص سریع وضعیت آیتم‌ها بدون شلوغی بصری.",
    body: "استفاده از پس‌زمینه‌های بسیار روشن و نزدیک به سفید به همراه متن‌های پررنگ مکمل، کنتراست استاندارد و چشم‌نوازی ایجاد می‌کند که بدون خسته کردن چشم کاربر، وظیفه هر آیتم را مشخص می‌سازد.",
    href: "semantic-badges-design",
    publish: 1,
    creator: { name: "سارا محمدی" },
    categoryID: { _id: "cat1", title: "UI/UX" },
    createdAt: new Date().toISOString(),
    coverUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "a4",
    title: "مدیریت وضعیت سرور در ری‌اکت با React Query",
    description:
      "کش کردن هوشمند درخواست‌ها، بروزرسانی خودکار و مدیریت وضعیت‌های Loading و Error در پروژه‌های واقعی.",
    body: "کتابخانه TanStack Query مدیریت داده‌های سمت سرور را متحول کرده و نیاز به نوشتن کدهای تکراری در useEffect را به طور کامل از بین می‌برد.",
    href: "react-query-architecture",
    publish: 1,
    creator: { name: "محمد حسینی" },
    categoryID: { _id: "cat2", title: "فرانت‌اند" },
    createdAt: new Date().toISOString(),
    coverUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
  },
];



const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
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

export default function ArticlesPage() {
  const { data: articlesData, isLoading, isError } = useAllArticles();
  const { data: categoriesData } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [savedIds, setSavedIds] = useState([]);
  const [quickReadArticle, setQuickReadArticle] = useState(null);

  // نرمال‌سازی مقالات (فقط منتشر شده‌ها)
  const articles = useMemo(() => {
    const raw = articlesData?.articles || articlesData || [];
    const list =
      Array.isArray(raw) && raw.length > 0 ? raw : fallbackArticlesList;
    return list.filter(
      (a) => Number(a.publish) === 1 || a.publish === undefined,
    );
  }, [articlesData]);

  // استخراج دسته‌بندی‌ها
  const categories = useMemo(() => {
    const raw = categoriesData?.categories || categoriesData || [];
    if (Array.isArray(raw) && raw.length > 0) return raw;

    // استخراج خودکار از مقالات در صورت نبودن لیست دسته‌بندی
    const map = new Map();
    articles.forEach((a) => {
      if (a.categoryID?.title) {
        map.set(a.categoryID._id || a.categoryID.title, {
          _id: a.categoryID._id || a.categoryID.title,
          title: a.categoryID.title,
        });
      }
    });
    return Array.from(map.values());
  }, [categoriesData, articles]);

  // فیلتر بر اساس دسته‌بندی و عبارت جستجو
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const catMatch =
        selectedCategory === "ALL" ||
        article.categoryID?._id === selectedCategory ||
        article.categoryID?.title === selectedCategory;

      if (!catMatch) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        article.title?.toLowerCase().includes(q) ||
        article.description?.toLowerCase().includes(q)
      );
    });
  }, [articles, selectedCategory, searchQuery]);

  // مقاله ویژه بالای صفحه
  const featuredArticle = filteredArticles[0] || null;

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]" dir="rtl">
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* ========================================================= */}
        {/* ۱. هدر صفحه مقالات + کادر جستجوی کپسولی (مشابه بالای تصویر رفرنس) */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
              <FileText className="h-5 w-5" strokeWidth={2.2} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-[#14151A] sm:text-2xl">
                  مجله و مقالات تخصصی
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                  {articles.length} مقاله منتشر شده
                </span>
              </div>

              <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
                جدیدترین مطالب آموزشی، تجربیات فنی و راهنمای بازار کار
              </p>
            </div>
          </div>

          {/* نوار جستجوی کپسولی سفید */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در عنوان یا متن مقالات..."
              className="w-full rounded-full border border-transparent bg-white py-3 pr-5 pl-11 text-xs font-semibold text-[#14151A] shadow-[0_6px_24px_-6px_rgba(20,21,26,0.06)] outline-none transition-all placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:ring-4 focus:ring-[#FFF4E5]"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 left-3 my-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] hover:text-[#14151A]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Search className="pointer-events-none absolute inset-y-0 left-4 my-auto h-4 w-4 text-[#8E929F]" />
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ۲. ردیف فیلتر دسته‌بندی‌ها به سبک کارت‌های Overview در تصویر رفرنس */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`flex shrink-0 items-center gap-3 rounded-[24px] px-5 py-3.5 text-right transition-all active:scale-95 ${
              selectedCategory === "ALL"
                ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_12px_28px_-8px_rgba(20,21,26,0.22)]"
                : "bg-white text-[#14151A] shadow-[0_8px_24px_-8px_rgba(20,21,26,0.05)] hover:bg-white/90"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold ${
                selectedCategory === "ALL"
                  ? "bg-white text-[#14151A]"
                  : "bg-[#FFF4E5] text-[#FF8A00]"
              }`}
            >
              {articles.length}
            </span>
            <div>
              <p className="text-xs font-extrabold">همه مقالات</p>
              <p
                className={`text-[10px] font-medium ${
                  selectedCategory === "ALL"
                    ? "text-white/60"
                    : "text-[#8E929F]"
                }`}
              >
                تمام موضوعات
              </p>
            </div>
          </button>

          {categories.map((cat) => {
            const catKey = cat._id || cat.title;
            const isSelected = selectedCategory === catKey;
            const count = articles.filter(
              (a) =>
                a.categoryID?._id === catKey ||
                a.categoryID?.title === cat.title,
            ).length;

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                className={`flex shrink-0 items-center gap-3 rounded-[24px] px-5 py-3.5 text-right transition-all active:scale-95 ${
                  isSelected
                    ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_12px_28px_-8px_rgba(20,21,26,0.22)]"
                    : "bg-white text-[#14151A] shadow-[0_8px_24px_-8px_rgba(20,21,26,0.05)] hover:bg-white/90"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold ${
                    isSelected
                      ? "bg-[#FFCC00] text-[#14151A]"
                      : "bg-[#EEF2FF] text-[#3B5BDB]"
                  }`}
                >
                  {count}
                </span>
                <div>
                  <p className="text-xs font-extrabold">{cat.title}</p>
                  <p
                    className={`text-[10px] font-medium ${
                      isSelected ? "text-white/60" : "text-[#8E929F]"
                    }`}
                  >
                    مقاله تخصصی
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* ۳. وضعیت‌های Loading / Error / Empty */}
        {/* ========================================================= */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-20 shadow-sm">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
              <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
              <span>در حال بارگذاری مقالات...</span>
            </div>
          </div>
        ) : isError && articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-10 text-center">
            <AlertCircle className="mb-2 h-6 w-6 text-[#E11D48]" />
            <p className="text-xs font-extrabold text-[#E11D48]">
              خطا در برقراری ارتباط با سرور
            </p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-sm">
            <span className="mb-2 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
              بدون نتیجه
            </span>
            <p className="text-xs font-semibold text-[#8E929F]">
              مقاله‌ای مطابق با جستجوی شما یافت نشد
            </p>
          </div>
        ) : (
          <>
            {/* ========================================================= */}
            {/* ۴. کارت مقاله ویژه (Featured Article) در بالای صفحه */}
            {/* ========================================================= */}
            {featuredArticle && !searchQuery && selectedCategory === "ALL" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="group overflow-hidden rounded-[32px] bg-white p-5 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.06)] sm:p-7"
              >
                <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                  {/* تصویر مقاله ویژه */}
                  <div className="relative h-60 w-full overflow-hidden rounded-[24px] bg-[#F8F7F4] sm:h-72 lg:col-span-6">
                    {getArticleCoverUrl(featuredArticle) ? (
                      <img
                        src={getArticleCoverUrl(featuredArticle)}
                        alt={featuredArticle.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFF4E5] to-[#EEF2FF]">
                        <FileText className="h-12 w-12 text-[#FF8A00]" />
                      </div>
                    )}

                    <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#14151A]/85 px-3 py-1 text-[10px] font-extrabold text-[#FFCC00] backdrop-blur-md">
                        <Sparkles className="h-3 w-3" />
                        منتخب سردبیر
                      </span>
                      <span className="rounded-full bg-[#ECFDF5]/95 px-3 py-1 text-[10px] font-extrabold text-[#059669] backdrop-blur-md">
                        {featuredArticle.categoryID?.title || "تخصصی"}
                      </span>
                    </div>
                  </div>

                  {/* توضیحات مقاله ویژه */}
                  <div className="flex flex-col justify-between space-y-4 lg:col-span-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[11px] font-bold text-[#8E929F]">
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-[#3B5BDB]" />
                          {featuredArticle.creator?.name || "تیم نویسندگان"}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#FF8A00]" />
                          {featuredArticle.createdAt
                            ? new Date(
                                featuredArticle.createdAt,
                              ).toLocaleDateString("fa-IR")
                            : "امروز"}
                        </span>
                      </div>

                      <div className="relative pr-4">
                        <span className="absolute right-0 top-1 bottom-1 w-1.5 rounded-full bg-[#FF8A00]" />
                        <Link href={`/blog/${featuredArticle.href}`}>
                          <h2 className="text-lg font-extrabold leading-snug text-[#14151A] transition-colors group-hover:text-[#FF8A00] sm:text-2xl">
                            {featuredArticle.title}
                          </h2>
                        </Link>
                      </div>

                      <p className="line-clamp-3 text-xs leading-7 font-medium text-[#8E929F] sm:text-sm">
                        {featuredArticle.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F4F3F0] pt-4">
                      <button
                        type="button"
                        onClick={() => setQuickReadArticle(featuredArticle)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-4 py-2.5 text-xs font-extrabold text-[#3B5BDB] transition-colors hover:bg-[#3B5BDB] hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>پیش‌نمایش سریع</span>
                      </button>

                      <Link
                        href={`/blog/${featuredArticle.href}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-6 py-2.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
                      >
                        <span>مطالعه کامل مقاله</span>
                        <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* ۵. گرید کارت‌های مقالات (به سبک کارت‌های Popular Courses در تصویر رفرنس) */}
            {/* ========================================================= */}
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredArticles.map((article, idx) => {
                const isSaved = savedIds.includes(article._id);
                const coverUrl = getArticleCoverUrl(article);
                const barColor =
                  idx % 3 === 0
                    ? "bg-[#FF8A00]"
                    : idx % 3 === 1
                      ? "bg-[#3B5BDB]"
                      : "bg-[#059669]";

                return (
                  <motion.article
                    key={article._id}
                    variants={itemVariants}
                    className="group flex flex-col justify-between rounded-[30px] bg-white p-4 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-12px_rgba(20,21,26,0.1)]"
                  >
                    <div>
                      {/* تصویر شاخص مقاله */}
                      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-[22px] bg-[#F8F7F4]">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EEF2FF] to-[#FFF4E5]">
                            <FileText className="mb-1.5 h-8 w-8 text-[#3B5BDB]" />
                            <span className="text-[10px] font-bold text-[#8E929F]">
                              مجله آکادمی لرن
                            </span>
                          </div>
                        )}

                        {/* بج دسته‌بندی + بوکمارک روی تصویر */}
                        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                          <span className="rounded-full bg-[#EEF2FF]/95 px-3 py-1 text-[10px] font-extrabold text-[#3B5BDB] shadow-sm backdrop-blur-md">
                            {article.categoryID?.title || "مقاله آموزشی"}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleSave(article._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#3B5BDB] shadow-sm backdrop-blur-md transition-transform active:scale-90"
                            title="ذخیره برای مطالعه"
                          >
                            <Bookmark
                              className={`h-3.5 w-3.5 ${
                                isSaved ? "fill-[#3B5BDB]" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* عنوان و خلاصه مقاله با نوار عمودی رنگی */}
                      <div className="relative px-1 pr-4">
                        <span
                          className={`absolute right-1 top-0.5 bottom-0.5 w-1.5 rounded-full ${barColor}`}
                        />
                        <Link href={`/blog/${article.href}`}>
                          <h3 className="line-clamp-2 text-sm font-extrabold leading-relaxed text-[#14151A] transition-colors group-hover:text-[#FF8A00]">
                            {article.title}
                          </h3>
                        </Link>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-6 font-medium text-[#8E929F]">
                          {article.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-1">
                      <div className="my-4 h-[1px] w-full bg-[#F1F0EC]" />

                      {/* فوتر کارت مقاله */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-extrabold text-[#14151A]">
                            {article.creator?.name || "تیم تحریریه"}
                          </span>
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#8E929F]">
                            <Clock className="h-3 w-3 text-[#FF8A00]" />
                            {article.createdAt
                              ? new Date(article.createdAt).toLocaleDateString(
                                  "fa-IR",
                                )
                              : "جدید"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setQuickReadArticle(article)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] transition-colors hover:bg-[#EEF2FF] hover:text-[#3B5BDB]"
                            title="پیش‌نمایش سریع"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <Link
                            href={`/blog/${article.href}`}
                            className="inline-flex items-center gap-1 rounded-full bg-[#FFCC00] px-4 py-2 text-[11px] font-extrabold text-[#14151A] shadow-[0_8px_18px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
                          >
                            <span>مطالعه</span>
                            <ChevronLeft
                              className="h-3.5 w-3.5"
                              strokeWidth={2.5}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </>
        )}
      </main>

      {/* ========================================================= */}
      {/* ۶. مدال مطالعه سریع مقاله (Bottom-Sheet در موبایل / Modal در دسکتاپ) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {quickReadArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickReadArticle(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#14151A]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85dvh] w-full max-w-xl overflow-y-auto rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px]"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E4E0] sm:hidden" />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-extrabold text-[#059669]">
                  {quickReadArticle.categoryID?.title || "مقاله تخصصی"}
                </span>

                <button
                  type="button"
                  onClick={() => setQuickReadArticle(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] hover:text-[#14151A]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {getArticleCoverUrl(quickReadArticle) && (
                <img
                  src={getArticleCoverUrl(quickReadArticle)}
                  alt={quickReadArticle.title}
                  className="mt-4 h-48 w-full rounded-2xl object-cover"
                />
              )}

              <h3 className="mt-4 text-base font-extrabold text-[#14151A] sm:text-lg">
                {quickReadArticle.title}
              </h3>

              <p className="mt-3 whitespace-pre-line rounded-2xl bg-[#F8F7F4] p-4 text-xs leading-7 font-medium text-[#14151A]/85">
                {quickReadArticle.body || quickReadArticle.description}
              </p>

              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuickReadArticle(null)}
                  className="rounded-full bg-[#F8F7F4] px-5 py-2.5 text-xs font-bold text-[#8E929F] hover:text-[#14151A]"
                >
                  بستن
                </button>

                <Link
                  href={`/blog/${quickReadArticle.href}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-6 py-2.5 text-xs font-extrabold text-[#14151A] shadow-sm"
                >
                  <span>صفحه کامل مقاله</span>
                  <ArrowUpLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
