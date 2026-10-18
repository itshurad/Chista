"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, ChevronLeft, Link2, Type, Check } from "lucide-react";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";

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

function CategoryForm({ category = {} }) {
  const router = useRouter();
  const isEditMode = Boolean(category?._id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: category?.title || "",
      href: category?.href || "",
    },
  });

  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useUpdateCategory();

  const isPending = isCreating || isUpdating;

  const handleCategory = async (data) => {
    try {
      if (isEditMode) {
        await updateCategory({
          id: category._id,
          data,
        });
      } else {
        await createCategory(data);
      }
      reset();
      router.push("/dashboard/admin/categories");
    } catch (error) {
      console.error(
        isEditMode ? "Error updating category:" : "Error creating category:",
        error,
      );
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
      {/* کارت اصلی فرم */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.05)] sm:p-8">
        {/* نوار بالای کارت: بج وضعیت + دکمه بازگشت کپسولی */}
        <div className="mb-6 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold ${
              isEditMode
                ? "bg-[#FFF4E5] text-[#FF8A00]"
                : "bg-[#ECFDF5] text-[#059669]"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            {isEditMode ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
          </span>

          <Link
            href="/dashboard/admin/categories"
            className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-4 py-2 text-xs font-bold text-[#14151A] transition-all hover:bg-[#EFECE6] active:scale-95"
          >
            <span>بازگشت</span>
            <ChevronLeft className="h-3.5 w-3.5 text-[#8E929F]" />
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
            {isEditMode ? "ویرایش دسته‌بندی" : "ایجاد دسته‌بندی جدید"}
          </h1>
          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            عنوان و شناسه یکتای دسته‌بندی را وارد کنید
          </p>
        </div>

        <form onSubmit={handleSubmit(handleCategory)} className="space-y-5">
          {/* ۱. عنوان دسته‌بندی */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                عنوان دسته‌بندی
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
                    نام فارسی
                  </span>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <input
                {...register("title", {
                  required: "عنوان دسته‌بندی الزامی است",
                })}
                type="text"
                placeholder="مثلاً: برنامه‌نویسی وب"
                className={`w-full rounded-2xl border py-3.5 pr-10 pl-4 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                  errors.title
                    ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                    : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                }`}
              />
              <Type className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-[#8E929F]" />
            </div>
          </div>

          {/* ۲. آدرس (Href / Slug) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                آدرس (Href / Slug)
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

            <div className="relative">
              <input
                {...register("href", {
                  required: "آدرس دسته‌بندی الزامی است",
                })}
                type="text"
                dir="ltr"
                placeholder="web-development"
                className={`w-full rounded-2xl border py-3.5 pr-4 pl-10 text-left   text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-sans placeholder:font-normal placeholder:text-[#A0A4B0] ${
                  errors.href
                    ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                    : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                }`}
              />
              <Link2 className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
            </div>
          </div>

          {/* خط جداکننده مینیمال */}
          <div className="pt-2">
            <div className="h-[1px] w-full bg-[#F1F0EC]" />
          </div>

          {/* دکمه‌های عملیات (انصراف + ثبت کپسولی طلایی) */}
          <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard/admin/categories"
              className="inline-flex items-center justify-center rounded-full bg-[#F8F7F4] px-6 py-3.5 text-xs font-bold text-[#8E929F] transition-colors hover:bg-[#EFECE6] hover:text-[#14151A] active:scale-95"
            >
              انصراف
            </Link>

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.01 }}
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                  <span>در حال ثبت...</span>
                </>
              ) : (
                <>
                  <span>
                    {isEditMode ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"}
                  </span>
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default CategoryForm;
