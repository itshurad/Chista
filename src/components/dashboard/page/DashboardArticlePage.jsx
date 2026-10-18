"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAllArticles, useDeleteArticle } from "@/hooks/useArticles";

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28 },
  },
};

function DashboardArticlePage() {
  const { data, isLoading, isError, error } = useAllArticles();
  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();

  const [deleteTarget, setDeleteTarget] = useState(null);

  const articles = data?.articles || data || [];

  const publishedCount = articles.filter((a) => Number(a.publish) === 1).length;
  const draftCount = articles.length - publishedCount;

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteArticle(deleteTarget._id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* بخش ۱: هدر، آمار خلاصه با بج‌های رنگی و دکمه ایجاد مقاله */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* دایره شمارنده نارنجی مشابه کارت‌های بالای تصویر رفرنس */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00] shadow-sm">
            {articles.length}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                مدیریت مقالات
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {publishedCount} منتشر شده
              </span>

              {draftCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                  {draftCount} پیش‌نویس
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              لیست مطالب، وضعیت انتشار و دسته‌بندی‌ها
            </p>
          </div>
        </div>

        {/* دکمه کپسولی زرد طلایی مشابه Get Course */}
        <Link
          href="/dashboard/admin/articles/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>مقاله جدید</span>
        </Link>
      </div>

      {/* بخش ۲: وضعیت‌های Loading / Error / Empty */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت مقالات...</span>
          </div>
        </div>
      ) : isError ? (
        /* بج خطا با پس‌زمینه قرمز نزدیک به سفید و متن قرمز پررنگ مکمل */
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-8 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            خطا در دریافت مقالات:{" "}
            {error?.message || "ارتباط با سرور برقرار نشد"}
          </p>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            بدون محتوا
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            هنوز هیچ مقاله‌ای ایجاد نشده است
          </p>
        </div>
      ) : (
        <>
          {/* 📱 نمای موبایل (Mobile-First Cards): الهام گرفته از کارت‌های Popular Courses */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3.5 lg:hidden"
          >
            {articles.map((article) => {
              const isPublished = Number(article.publish) === 1;
              return (
                <motion.div
                  key={article._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.05)]"
                >
                  {/* ردیف بالای کارت: بج وضعیت + بج دسته‌بندی + اکشن‌ها */}
                  <div className="mb-3.5 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {isPublished ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          منتشر شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[10px] font-extrabold text-[#FF8A00]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                          پیش‌نویس
                        </span>
                      )}

                      <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[10px] font-bold text-[#3B5BDB]">
                        {article.categoryID?.title || "بدون دسته"}
                      </span>
                    </div>

                    {/* دکمه‌های ویرایش و حذف دایره‌ای */}
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/dashboard/admin/articles/edit/${article._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-transform active:scale-90"
                        title="ویرایش"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          />
                        </svg>
                      </Link>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(article)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF2F2] text-[#E11D48] transition-transform active:scale-90 disabled:opacity-50"
                        title="حذف"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* بدنه کارت: کاور + عنوان و توضیحات با نوار رنگی عمودی */}
                  <div className="flex items-center gap-3.5">
                    {article.cover ? (
                      <img
                        src={article.coverUrl}
                        alt={article.title}
                        className="h-16 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-[#F1F0EC]"
                      />
                    ) : (
                      <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F8F7F4] text-[10px] font-bold text-[#8E929F]">
                        بدون کاور
                      </div>
                    )}

                    <div className="relative min-w-0 flex-1 pr-3">
                      <span
                        className={`absolute right-0 top-0.5 bottom-0.5 w-1 rounded-full ${
                          isPublished ? "bg-[#059669]" : "bg-[#FF8A00]"
                        }`}
                      />
                      <h3 className="truncate text-sm font-extrabold text-[#14151A]">
                        {article.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed font-medium text-[#8E929F]">
                        {article.description}
                      </p>
                    </div>
                  </div>

                  {/* فوتر کارت موبایل: نویسنده + آدرس Href */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-[#F4F3F0] pt-3">
                    <span className="text-[11px] font-bold text-[#8E929F]">
                      نویسنده:{" "}
                      <strong className="text-[#14151A]">
                        {article.creator?.name || "نامشخص"}
                      </strong>
                    </span>

                    <span
                      dir="ltr"
                      className="max-w-[160px] truncate rounded-full bg-[#F3F0FF] px-2.5 py-0.5   text-[10px] font-bold text-[#7048E8]"
                    >
                      /{article.href}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 💻 نمای دسکتاپ: دقیقاً مشابه بخش My Courses در تصویر رفرنس */}
          <div className="hidden lg:block">
            {/* هدر ستون‌ها بیرون از کانتینر سفید */}
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-4">مقاله</div>
              <div className="col-span-2">دسته‌بندی</div>
              <div className="col-span-2">آدرس (Href)</div>
              <div className="col-span-2">وضعیت</div>
              <div className="col-span-1">نویسنده</div>
              <div className="col-span-1 text-center">عملیات</div>
            </div>

            {/* لیست ردیف‌ها درون کارت سفید گرد */}
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]"
            >
              {articles.map((article) => {
                const isPublished = Number(article.publish) === 1;
                return (
                  <motion.div
                    key={article._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center gap-2 px-4 py-3.5 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    {/* کاور + عنوان و توضیح کوتاه */}
                    <div className="col-span-4 flex items-center gap-3.5 pl-2">
                      {article.cover ? (
                        <img
                          src={article.coverUrl}
                          alt={article.title}
                          className="h-12 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-[#F1F0EC]"
                        />
                      ) : (
                        <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F8F7F4] text-[10px] font-bold text-[#8E929F]">
                          بدون کاور
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold text-[#14151A]">
                          {article.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-[#8E929F]">
                          {article.description}
                        </p>
                      </div>
                    </div>

                    {/* بج دسته‌بندی (آبی یخی مشابه Popular in week) */}
                    <div className="col-span-2">
                      <span className="inline-flex max-w-full truncate rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-[#3B5BDB]">
                        {article.categoryID?.title || "-"}
                      </span>
                    </div>

                    {/* بج آدرس Href (بنفش) */}
                    <div className="col-span-2">
                      <span
                        dir="ltr"
                        className="inline-block max-w-full truncate rounded-full bg-[#F3F0FF] px-3 py-1   text-[10px] font-bold text-[#7048E8]"
                      >
                        /{article.href}
                      </span>
                    </div>

                    {/* بج وضعیت انتشار (سبز برای منتشر شده / نارنجی برای پیش‌نویس) */}
                    <div className="col-span-2">
                      {isPublished ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-extrabold text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          منتشر شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3 py-1 text-[11px] font-extrabold text-[#FF8A00]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                          پیش‌نویس
                        </span>
                      )}
                    </div>

                    {/* نویسنده */}
                    <div className="col-span-1 truncate text-[11px] font-bold text-[#8E929F]">
                      {article.creator?.name || "-"}
                    </div>

                    {/* اکشن‌های دایره‌ای رنگی مشابه جدول تصویر رفرنس */}
                    <div className="col-span-1 flex items-center justify-center gap-2">
                      <Link
                        href={`/dashboard/admin/articles/edit/${article._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                        title="ویرایش مقاله"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          />
                        </svg>
                      </Link>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(article)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF2F2] text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-90 disabled:opacity-50"
                        title="حذف مقاله"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}

      {/* بخش ۳: مدال تایید حذف نیتیو و یکپارچه با سایر صفحات */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#14151A]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px]"
            >
              {/* دستگیره شیت موبایل */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E4E0] sm:hidden" />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-3 py-1 text-[11px] font-bold text-[#E11D48]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48]" />
                  حذف مقاله
                </span>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] transition-colors hover:text-[#14151A] active:scale-90"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-5 text-right">
                <h3 className="text-base font-extrabold text-[#14151A]">
                  آیا از حذف این مقاله مطمئن هستید؟
                </h3>
                <p className="mt-2 text-xs leading-relaxed font-medium text-[#8E929F]">
                  مقاله{" "}
                  <span className="mx-0.5 inline-flex items-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 font-extrabold text-[#E11D48]">
                    {deleteTarget.title}
                  </span>{" "}
                  برای همیشه حذف خواهد شد.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-full bg-[#F8F7F4] py-3 text-xs font-bold text-[#14151A] transition-colors hover:bg-[#EFECE6] active:scale-95"
                >
                  انصراف
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-[#FECDD3] bg-[#FFF2F2] py-3 text-xs font-extrabold text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>در حال حذف...</span>
                    </>
                  ) : (
                    <span>تأیید و حذف</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DashboardArticlePage;
