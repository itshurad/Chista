"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useAllMenus, useCreateMenu, useUpdateMenu } from "@/hooks/useMenus";

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

function MenuForm({ menu = {} }) {
  const router = useRouter();
  const isEditMode = Boolean(menu?._id);

  const { data: menusData, isLoading: isLoadingMenus } = useAllMenus();
  const parentMenuList = (menusData?.menus || menusData || []).filter(
    (item) => !isEditMode || String(item._id) !== String(menu._id),
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: menu?.title || "",
      href: menu?.href || "",
      parent: menu?.parent?._id || menu?.parent || "",
    },
  });

  const selectedParent = watch("parent");

  const { mutateAsync: createMenu, isPending: isCreating } = useCreateMenu();
  const { mutateAsync: updateMenu, isPending: isUpdating } = useUpdateMenu();

  const isPending = isCreating || isUpdating;

  const handleMenuSubmit = async (formData) => {
    try {
      const payload = {
        title: formData.title.trim(),
        href: formData.href.trim(),
        ...(formData.parent
          ? { parent: formData.parent }
          : { parent: undefined }),
      };

      if (isEditMode) {
        await updateMenu({
          id: menu._id,
          data: payload,
        });
      } else {
        await createMenu(payload);
      }

      reset();
      router.push("/dashboard/admin/menus");
      router.refresh();
    } catch (error) {
      console.error(
        isEditMode ? "خطا در ویرایش منو:" : "خطا در ایجاد منو:",
        error,
      );
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-xl space-y-5 pb-8"
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
            {isEditMode ? "حالت ویرایش" : "منوی جدید"}
          </span>

          <Link
            href="/dashboard/admin/menus"
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

        {/* تیتر با نوار عمودی رنگی (مشابه کارت‌های دوره در رفرنس) */}
        <div className="relative mb-7 pr-4">
          <span
            className={`absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full ${
              isEditMode ? "bg-[#FF8A00]" : "bg-[#3B5BDB]"
            }`}
          />
          <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
            {isEditMode ? "ویرایش منو" : "ایجاد منوی جدید"}
          </h1>
          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            عنوان، مسیر و جایگاه منو را مشخص کنید
          </p>
        </div>

        <form onSubmit={handleSubmit(handleMenuSubmit)} className="space-y-5">
          {/* فیلد عنوان */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                عنوان منو
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
                    نمایش در هدر
                  </span>
                )}
              </AnimatePresence>
            </div>

            <input
              {...register("title", {
                required: "عنوان الزامی است",
              })}
              type="text"
              placeholder="مثلاً: دوره‌های آموزشی"
              className={`w-full rounded-2xl border px-4 py-3.5 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                errors.title
                  ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                  : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
              }`}
            />
          </div>

          {/* فیلد آدرس (Href) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                آدرس لینک (Href)
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
                    /path
                  </span>
                )}
              </AnimatePresence>
            </div>

            <input
              {...register("href", {
                required: "آدرس لینک الزامی است",
              })}
              type="text"
              dir="ltr"
              placeholder="/courses"
              className={`w-full rounded-2xl border px-4 py-3.5 text-left   text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-sans placeholder:font-normal placeholder:text-[#A0A4B0] ${
                errors.href
                  ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                  : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
              }`}
            />
          </div>

          {/* فیلد منوی والد */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                سطح و جایگاه منو
              </label>

              {/* بج داینامیک وضعیت والد (سبز برای سردسته، نارنجی برای زیرمنو) */}
              {selectedParent ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                  زیرمنو
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                  منوی اصلی (سردسته)
                </span>
              )}
            </div>

            <div className="relative">
              <select
                {...register("parent")}
                disabled={isLoadingMenus}
                className="w-full appearance-none rounded-2xl border border-transparent bg-[#F8F7F4] px-4 py-3.5 pl-10 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">منوی اصلی (بدون والد)</option>
                {parentMenuList.map((item) => (
                  <option key={item._id} value={item._id}>
                    زیرمجموعه: {item.title}
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

          {/* خط جداکننده مینیمال */}
          <div className="pt-2">
            <div className="h-[1px] w-full bg-[#F1F0EC]" />
          </div>

          {/* دکمه‌های عملیات (کاملاً ریسپانسیو و کپسولی) */}
          <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard/admin/menus"
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
                  <span>{isEditMode ? "ذخیره تغییرات" : "ایجاد منو"}</span>
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

export default MenuForm;
