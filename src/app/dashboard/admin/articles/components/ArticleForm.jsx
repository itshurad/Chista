"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

import {
  useCreateArticle,
  useCreateArticleDraft,
  useUpdateArticle,
} from "@/hooks/useArticles";

import { useCategories } from "@/hooks/useCategories";

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.8 },
  },
};

const badgeVariants = {
  initial: { opacity: 0, y: -4, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.12 } },
};

function ArticleForm({ article = {} }) {
  const router = useRouter();
  const isEditMode = Boolean(article?._id);

  // ==========================================
  // Categories
  // ==========================================
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const categories = categoriesData?.categories || categoriesData || [];

  // ==========================================
  // Submit type & Cover Preview
  // ==========================================
  const [submitType, setSubmitType] = useState("publish");
  const [coverPreview, setCoverPreview] = useState(article?.coverUrl || null);

  // ==========================================
  // Form
  // ==========================================
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      body: "",
      href: "",
      categoryID: "",
    },
  });

  // ==========================================
  // Set Edit Data
  // ==========================================
  useEffect(() => {
    const categoryID = article?.categoryID?._id || article?.categoryID || "";

    reset({
      title: article?.title || "",
      description: article?.description || "",
      body: article?.body || "",
      href: article?.href || "",
      categoryID,
    });

    setCoverPreview(article?.coverUrl || null);
  }, [article, reset]);

  // ==========================================
  // Mutations
  // ==========================================
  const { mutateAsync: createArticle, isPending: isCreating } =
    useCreateArticle();
  const { mutateAsync: createDraft, isPending: isCreatingDraft } =
    useCreateArticleDraft();
  const { mutateAsync: updateArticle, isPending: isUpdating } =
    useUpdateArticle();

  const isPending = isCreating || isCreatingDraft || isUpdating;

  // ==========================================
  // Cover Change
  // ==========================================
  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setCoverPreview(article?.coverUrl || null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  };

  // ==========================================
  // Submit
  // ==========================================
  const handleArticleSubmit = async (formData) => {
    try {
      const payload = new FormData();

      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("body", formData.body);
      payload.append("href", formData.href.trim());
      payload.append("categoryID", formData.categoryID);

      if (formData.cover?.[0]) {
        payload.append("cover", formData.cover[0]);
      }

      if (isEditMode) {
        await updateArticle({
          id: article._id,
          data: payload,
        });
      } else if (submitType === "draft") {
        await createDraft(payload);
      } else {
        await createArticle(payload);
      }

      reset();
      router.push("/dashboard/admin/articles");
      router.refresh();
    } catch (error) {
      console.error(
        isEditMode ? "خطا در ویرایش مقاله:" : "خطا در ایجاد مقاله:",
        error,
      );
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-3xl space-y-5 pb-10"
      dir="rtl"
    >
      {/* کارت اصلی فرم */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.05)] sm:p-8">
        {/* نوار بالای کارت: بج وضعیت + دکمه بازگشت کپسولی */}
        <div className="mb-6 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold ${
              isEditMode
                ? "bg-[#FFF4E5] text-[#FF8A00]"
                : "bg-[#ECFDF5] text-[#059669]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isEditMode ? "bg-[#FF8A00]" : "bg-[#059669]"
              }`}
            />
            {isEditMode ? "ویرایش محتوا" : "نگارش جدید"}
          </span>

          <Link
            href="/dashboard/admin/articles"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F7F4] px-4 py-2 text-xs font-bold text-[#14151A] transition-all hover:bg-[#EFECE6] active:scale-95"
          >
            <span>بازگشت</span>
            <svg
              className="h-3.5 w-3.5 text-[#8E929F]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
        </div>

        {/* تیتر با نوار عمودی رنگی (مشابه کارت‌های دوره در تصویر رفرنس) */}
        <div className="relative mb-7 pr-4">
          <span
            className={`absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full ${
              isEditMode ? "bg-[#FF8A00]" : "bg-[#3B5BDB]"
            }`}
          />
          <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
            {isEditMode ? "ویرایش مقاله" : "ایجاد مقاله جدید"}
          </h1>
          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            مشخصات، دسته‌بندی و محتوای مقاله را تکمیل کنید
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleArticleSubmit)}
          className="space-y-5"
        >
          {/* ۱. عنوان مقاله */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                عنوان مقاله
              </label>

              <AnimatePresence mode="wait">
                {errors.title ? (
                  <motion.span
                    key="err-title"
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                    {errors.title.message}
                  </motion.span>
                ) : (
                  <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
                    تیتر اصلی
                  </span>
                )}
              </AnimatePresence>
            </div>

            <input
              {...register("title", {
                required: "عنوان مقاله الزامی است",
              })}
              type="text"
              placeholder="عنوان مقاله را وارد کنید..."
              className={`w-full rounded-2xl border px-4 py-3.5 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                errors.title
                  ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                  : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
              }`}
            />
          </div>

          {/* ۲. چیدمان دو ستونه در دسکتاپ برای آدرس (Href) و دسته‌بندی */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* آدرس مقاله (Href) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  آدرس مقاله (Slug)
                </label>

                <AnimatePresence mode="wait">
                  {errors.href ? (
                    <motion.span
                      key="err-href"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      {errors.href.message}
                    </motion.span>
                  ) : (
                    <span
                      dir="ltr"
                      className="rounded-full bg-[#F3F0FF] px-2.5 py-0.5   text-[10px] font-bold text-[#7048E8]"
                    >
                      /slug
                    </span>
                  )}
                </AnimatePresence>
              </div>

              <input
                {...register("href", {
                  required: "آدرس مقاله الزامی است",
                })}
                type="text"
                dir="ltr"
                placeholder="react-hooks"
                className={`w-full rounded-2xl border px-4 py-3.5 text-left   text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-sans placeholder:font-normal placeholder:text-[#A0A4B0] ${
                  errors.href
                    ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                    : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                }`}
              />
            </div>

            {/* دسته‌بندی مقاله */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  دسته‌بندی
                </label>

                <AnimatePresence mode="wait">
                  {errors.categoryID ? (
                    <motion.span
                      key="err-cat"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      {errors.categoryID.message}
                    </motion.span>
                  ) : (
                    <span className="rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                      موضوع
                    </span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <select
                  {...register("categoryID", {
                    required: "انتخاب دسته‌بندی الزامی است",
                  })}
                  disabled={isLoadingCategories}
                  className={`w-full appearance-none rounded-2xl border px-4 py-3.5 pl-10 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.categoryID
                      ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48]"
                      : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  }`}
                >
                  <option value="">
                    {isLoadingCategories
                      ? "در حال دریافت..."
                      : "انتخاب دسته‌بندی..."}
                  </option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title || category.name}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#8E929F]">
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
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* ۳. توضیحات کوتاه */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                توضیحات کوتاه (خلاصه)
              </label>

              <AnimatePresence mode="wait">
                {errors.description ? (
                  <motion.span
                    key="err-desc"
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                    {errors.description.message}
                  </motion.span>
                ) : (
                  <span className="rounded-full bg-[#F8F7F4] px-2.5 py-0.5 text-[10px] font-bold text-[#8E929F]">
                    نمایش در کارت
                  </span>
                )}
              </AnimatePresence>
            </div>

            <textarea
              {...register("description", {
                required: "توضیحات مقاله الزامی است",
              })}
              rows={3}
              placeholder="چکیده‌ای کوتاه از مقاله..."
              className={`w-full resize-none rounded-2xl border px-4 py-3.5 text-xs leading-relaxed font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                errors.description
                  ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                  : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
              }`}
            />
          </div>

          {/* ۴. متن کامل مقاله */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                متن کامل مقاله
              </label>

              <AnimatePresence>
                {errors.body && (
                  <motion.span
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                    {errors.body.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <textarea
              {...register("body", {
                required: "متن مقاله الزامی است",
              })}
              rows={12}
              placeholder="محتوای اصلی مقاله را اینجا بنویسید..."
              className={`w-full resize-y rounded-2xl border px-4 py-3.5 text-xs leading-7 font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                errors.body
                  ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                  : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
              }`}
            />
          </div>

          {/* ۵. آپلود تصویر کاور + پیش‌نمایش زنده */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                تصویر کاور
              </label>

              <AnimatePresence mode="wait">
                {errors.cover ? (
                  <motion.span
                    key="err-cover"
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                    {errors.cover.message}
                  </motion.span>
                ) : coverPreview ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                    {isEditMode && coverPreview === article?.coverUrl
                      ? "تصویر فعلی"
                      : "آماده آپلود"}
                  </span>
                ) : (
                  <span className="rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                    الزامی
                  </span>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* باکس انتخاب فایل */}
              <label
                className={`group relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
                  errors.cover
                    ? "border-[#FECDD3] bg-[#FFF2F2]/50"
                    : "border-[#E5E4E0] bg-[#F8F7F4]/70 hover:border-[#FF8A00] hover:bg-[#FFF4E5]/40"
                }`}
              >
                <input
                  {...register("cover", {
                    required: !isEditMode ? "تصویر کاور الزامی است" : false,
                    onChange: handleCoverChange,
                  })}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                />

                <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#FF8A00] shadow-sm transition-transform group-hover:scale-105">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>

                <span className="text-xs font-extrabold text-[#14151A]">
                  انتخاب تصویر کاور
                </span>
                <span className="mt-1 text-[10px] font-medium text-[#8E929F]">
                  {isEditMode
                    ? "برای جایگزینی تصویر فعلی کلیک کنید"
                    : "فرمت‌های JPG, PNG یا WEBP"}
                </span>
              </label>

              {/* باکس پیش‌نمایش */}
              {coverPreview ? (
                <div className="relative h-[160px] w-full overflow-hidden rounded-2xl bg-[#F8F7F4] ring-1 ring-[#F1F0EC]">
                  <img
                    src={coverPreview}
                    alt={article?.title || "پیش‌نمایش کاور"}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-[#14151A]/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                    پیش‌نمایش
                  </span>
                </div>
              ) : (
                <div className="flex h-[160px] flex-col items-center justify-center rounded-2xl bg-[#F8F7F4] text-center">
                  <span className="text-xs font-bold text-[#A0A4B0]">
                    تصویری انتخاب نشده است
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* خط جداکننده مینیمال */}
          <div className="pt-2">
            <div className="h-[1px] w-full bg-[#F1F0EC]" />
          </div>

          {/* ۶. دکمه‌های عملیات (انصراف / ذخیره پیش‌نویس / انتشار) */}
          <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard/admin/articles"
              className="inline-flex items-center justify-center rounded-full bg-[#F8F7F4] px-6 py-3.5 text-xs font-bold text-[#8E929F] transition-colors hover:bg-[#EFECE6] hover:text-[#14151A] active:scale-95"
            >
              انصراف
            </Link>

            {/* دکمه ذخیره پیش‌نویس با استایل بج نارنجی مکمل */}
            {!isEditMode && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={isPending}
                onClick={() => setSubmitType("draft")}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FFF4E5] px-6 py-3.5 text-xs font-extrabold text-[#FF8A00] transition-colors hover:bg-[#FFE8C8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreatingDraft ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#FF8A00]/30 border-t-[#FF8A00]" />
                    <span>ذخیره پیش‌نویس...</span>
                  </>
                ) : (
                  <span>ذخیره پیش‌نویس</span>
                )}
              </motion.button>
            )}

            {/* دکمه اصلی انتشار / ویرایش کپسولی زرد طلایی */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.01 }}
              type="submit"
              disabled={isPending}
              onClick={() => setSubmitType("publish")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating || isUpdating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                  <span>در حال ثبت...</span>
                </>
              ) : (
                <>
                  <span>{isEditMode ? "ذخیره تغییرات" : "انتشار مقاله"}</span>
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
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
    </motion.div>
  );
}

export default ArticleForm;
