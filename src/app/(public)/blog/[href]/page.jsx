"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  Clock,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  ArrowUpLeft,
  AlertCircle,
  Layers,
} from "lucide-react";

import { useAllArticles, useArticleByHref } from "@/hooks/useArticles";

export default function SingleArticlePage() {
  const { href } = useParams();

  const { data, isPending: isLoading, isError } = useArticleByHref(href);
  const { article } = data || {};

  const { data: articlesData, isPending: articlesPending } = useAllArticles();
  const { articles } = articlesData || {};

  const otherArticles = articles
    ?.filter((item) => item._id !== article?._id && Number(item.publish) === 1)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F7F4]" dir="rtl">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-24 shadow-sm">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
              <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
              <span>در حال دریافت اطلاعات مقاله...</span>
            </div>
          </div>
        ) : isError || !article ? (
          /* Error */
          <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h2 className="text-base font-extrabold text-[#E11D48]">
              مقاله مورد نظر یافت نشد
            </h2>

            <Link
              href="/blog"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-[#14151A] shadow-sm transition-transform active:scale-95"
            >
              <span>بازگشت به مقالات</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8E929F]">
                <Link href="/" className="hover:text-[#14151A]">
                  خانه
                </Link>

                <ChevronLeft className="h-3.5 w-3.5 opacity-60" />

                <Link href="/blog" className="hover:text-[#14151A]">
                  مقالات
                </Link>

                <ChevronLeft className="h-3.5 w-3.5 opacity-60" />

                <span className="max-w-[200px] truncate rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[#14151A] shadow-sm">
                  {article.title}
                </span>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#14151A] shadow-[0_4px_16px_-4px_rgba(20,21,26,0.06)] transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00] active:scale-95"
              >
                <span>بازگشت به لیست</span>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              {/* Article */}
              <motion.article
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 28,
                }}
                className="overflow-hidden rounded-[32px] bg-white p-5 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)] sm:p-8 lg:col-span-8"
              >
                {/* Badges */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3.5 py-1.5 text-[11px] font-extrabold text-[#3B5BDB]">
                      <Layers className="h-3.5 w-3.5" />
                      {article.categoryID?.title || "عمومی"}
                    </span>

                    {Number(article.publish) === 1 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[11px] font-extrabold text-[#059669]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        منتشر شده
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-3 py-1.5 text-[11px] font-extrabold text-[#FF8A00]">
                        پیش‌نویس
                      </span>
                    )}
                  </div>

                  <span
                    dir="ltr"
                    className="rounded-full bg-[#F3F0FF] px-3 py-1   text-[11px] font-bold text-[#7048E8]"
                  >
                    /{article.href}
                  </span>
                </div>

                {/* Title */}
                <div className="relative mb-6 pr-4">
                  <span className="absolute right-0 top-1 bottom-1 w-1.5 rounded-full bg-[#FF8A00]" />

                  <h1 className="text-xl leading-snug font-extrabold tracking-tight text-[#14151A] sm:text-3xl">
                    {article.title}
                  </h1>
                </div>

                {/* Cover */}
                {article.coverUrl ? (
                  <div className="mb-7 overflow-hidden rounded-[24px] bg-[#F8F7F4] ring-1 ring-[#F1F0EC]">
                    <img
                      src={article.coverUrl}
                      alt={article.title}
                      className="max-h-[420px] w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-7 flex h-56 w-full flex-col items-center justify-center rounded-[24px] bg-[#F8F7F4] text-[#8E929F]">
                    <FileText className="mb-2 h-10 w-10 text-[#FF8A00]" />
                    <span className="text-xs font-bold">بدون تصویر کاور</span>
                  </div>
                )}

                {/* Description */}
                {article.description && (
                  <div className="mb-8 rounded-[22px] bg-[#FFF4E5]/70 p-4 sm:p-5">
                    <span className="mb-1.5 inline-block rounded-full bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-[#FF8A00]">
                      چکیده مقاله
                    </span>

                    <p className="text-xs leading-7 font-bold text-[#14151A] sm:text-sm">
                      {article.description}
                    </p>
                  </div>
                )}

                {/* =============================== */}
                {/* Tiptap HTML Content */}
                {/* =============================== */}

                <div
                  className="
                    article-content
                    text-sm
                    leading-8
                    text-[#14151A]/90
                    sm:text-[15px]
                    sm:leading-9
                  "
                  dangerouslySetInnerHTML={{
                    __html: article.body || "",
                  }}
                />
              </motion.article>

              {/* Sidebar */}
              <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4">
                {/* Author / Publish */}
                <div className="rounded-[30px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-6 text-white shadow-[0_18px_42px_-12px_rgba(20,21,26,0.25)]">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold text-[#FFCC00]">
                      اطلاعات انتشار
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                      تایید شده
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFCC00] text-base font-extrabold text-[#14151A]">
                      {article.creator?.name?.charAt(0) || "U"}
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-white/60">
                        نویسنده مقاله
                      </p>

                      <h3 className="text-sm font-extrabold text-white">
                        {article.creator?.name || "نامشخص"}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-white/60">
                        <Calendar className="h-3.5 w-3.5 text-[#FFCC00]" />
                        تاریخ انتشار:
                      </span>

                      <span className="font-bold text-white">
                        {article.createdAt
                          ? new Date(article.createdAt).toLocaleDateString(
                              "fa-IR",
                            )
                          : "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-white/60">
                        <Clock className="h-3.5 w-3.5 text-[#FF8A00]" />
                        آخرین ویرایش:
                      </span>

                      <span className="font-bold text-white">
                        {article.updatedAt
                          ? new Date(article.updatedAt).toLocaleDateString(
                              "fa-IR",
                            )
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/courses"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FFCC00] py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>مشاهده دوره‌های آموزشی</span>
                    </Link>
                  </div>
                </div>

                {/* Other Articles */}
                {otherArticles?.length > 0 && (
                  <div className="rounded-[30px] bg-white p-6 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]">
                    <div className="relative mb-4 pr-3.5">
                      <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#3B5BDB]" />

                      <h3 className="text-sm font-extrabold text-[#14151A]">
                        سایر مقالات
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {otherArticles.map((item) => (
                        <Link
                          key={item._id}
                          href={`blog/${item.href}`}
                          className="group flex items-center gap-3 rounded-2xl bg-[#F8F7F4] p-2.5 transition-colors hover:bg-[#FFF4E5]"
                        >
                          {item.coverUrl ? (
                            <img
                              src={item.coverUrl}
                              alt={item.title}
                              className="h-12 w-14 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-[#FF8A00]">
                              <FileText className="h-4 w-4" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-xs font-extrabold text-[#14151A] group-hover:text-[#FF8A00]">
                              {item.title}
                            </h4>

                            <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-[#8E929F]">
                              {item.categoryID?.title || "مقاله"}

                              <ArrowUpLeft className="h-3 w-3" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
