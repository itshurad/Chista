"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronDown,
  Link2,
  Clock,
  Headphones,
  DollarSign,
  Percent,
  Users,
  Star,
  UploadCloud,
  Check,
  AlertCircle,
  X,
} from "lucide-react";

import { useCreateCourse, useUpdateCourse } from "@/hooks/useCourses";
import { useCategories } from "@/hooks/useCategories";

const defaultValues = {
  name: "",
  description: "",
  support: "",
  href: "",
  price: 0,
  status: "PRESELL",
  discount: 0,
  categoryID: "",
  time: "",
  students: 0,
  score: 5,
  semiDescription: "",
  cover: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getCoverUrl = (cover) => {
  if (!cover) return "";
  if (cover.startsWith("http")) return cover;
  return `${API_URL}/courses/covers/${cover}`;
};

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

export default function CourseForm({ course = null }) {
  const router = useRouter();
  const isEdit = Boolean(course?._id);

  const [preview, setPreview] = useState("");
  const [serverError, setServerError] = useState("");

  const { data: categoryData, isLoading: categoryLoading } = useCategories();

  const categories =
    categoryData?.categories ||
    categoryData?.allCategories ||
    categoryData ||
    [];

  const { mutateAsync: createCourse, isPending: isCreating } =
    useCreateCourse();

  const { mutateAsync: updateCourse, isPending: isUpdating } =
    useUpdateCourse();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const selectedCover = watch("cover");
  const selectedStatus = watch("status");

  // --------------------------------------------------------------------------
  // Edit Mode Initialization
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (!course) {
      reset(defaultValues);
      setPreview("");
      return;
    }

    const categoryId =
      typeof course.categoryID === "object"
        ? course.categoryID?._id
        : course.categoryID;

    reset({
      name: course.name || "",
      description: course.description || "",
      support: course.support || "",
      href: course.href || "",
      price: Number(course.price ?? 0),
      status: course.status || "PRESELL",
      discount: Number(course.discount ?? 0),
      categoryID: categoryId ? String(categoryId) : "",
      time: course.time || "",
      students: Number(course.students ?? 0),
      score: Number(course.score ?? 5),
      semiDescription: course.semiDescription || "",
      cover: null,
    });

    setPreview(
      course.coverUrl || (course.cover ? getCoverUrl(course.cover) : ""),
    );
  }, [course, reset]);

  // --------------------------------------------------------------------------
  // FIX: Sync selected category after categories are loaded
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (
      !isEdit ||
      !course ||
      !Array.isArray(categories) ||
      !categories.length
    ) {
      return;
    }

    const categoryId =
      typeof course.categoryID === "object"
        ? course.categoryID?._id
        : course.categoryID;

    if (!categoryId) return;

    const categoryExists = categories.some(
      (category) => String(category?._id) === String(categoryId),
    );

    if (categoryExists) {
      setValue("categoryID", String(categoryId), {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [course, categories, isEdit, setValue]);

  // --------------------------------------------------------------------------
  // New Image Preview
  // --------------------------------------------------------------------------

  useEffect(() => {
    const file = selectedCover?.[0];

    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedCover]);

  // --------------------------------------------------------------------------
  // Submit Handler
  // --------------------------------------------------------------------------

  const onSubmit = async (values) => {
    setServerError("");

    try {
      const numericPrice = Number.isNaN(Number(values.price))
        ? 0
        : Number(values.price);

      const numericDiscount = Number.isNaN(Number(values.discount))
        ? 0
        : Number(values.discount);

      const numericStudents = Number.isNaN(Number(values.students))
        ? 0
        : Number(values.students);

      const numericScore = Number.isNaN(Number(values.score))
        ? 5
        : Number(values.score);

      const formData = new FormData();

      formData.append("name", values.name.trim());
      formData.append("description", values.description.trim());
      formData.append("support", values.support.trim());
      formData.append("href", values.href.trim());
      formData.append("price", numericPrice);
      formData.append("status", values.status);
      formData.append("discount", numericDiscount);
      formData.append("categoryID", values.categoryID);
      formData.append("time", values.time.trim());
      formData.append("students", numericStudents);
      formData.append("score", numericScore);
      formData.append("semiDescription", values.semiDescription.trim());

      if (values.cover?.[0]) {
        formData.append("cover", values.cover[0]);
      }

      if (isEdit) {
        await updateCourse({
          id: course._id,
          formData,
        });
      } else {
        await createCourse(formData);
      }

      router.push("/dashboard/admin/courses");
      router.refresh();
    } catch (error) {
      console.error("Course submit error:", error);

      const resData = error?.response?.data;

      if (Array.isArray(resData?.errors) && resData.errors.length > 0) {
        setServerError(resData.errors.map((e) => e.message).join(" | "));
      } else {
        setServerError(
          resData?.message || "خطایی در ثبت اطلاعات دوره رخ داده است.",
        );
      }
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-3xl space-y-5 pb-12"
      dir="rtl"
    >
      {/* کارت اصلی فرم */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.05)] sm:p-8">
        {/* نوار بالای کارت: بج وضعیت + دکمه بازگشت کپسولی */}
        <div className="mb-6 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold ${
              isEdit
                ? "bg-[#FFF4E5] text-[#FF8A00]"
                : "bg-[#ECFDF5] text-[#059669]"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            {isEdit ? "ویرایش دوره آموزشی" : "دوره آموزشی جدید"}
          </span>

          <Link
            href="/dashboard/admin/courses"
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
              isEdit ? "bg-[#FF8A00]" : "bg-[#3B5BDB]"
            }`}
          />
          <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
            {isEdit ? "ویرایش مشخصات دوره" : "ایجاد دوره جدید"}
          </h1>
          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            اطلاعات پایه، قیمت‌گذاری و کاور دوره را تنظیم کنید
          </p>
        </div>

        {/* نمایش خطای سرور با بج قرمز مکمل */}
        <AnimatePresence mode="wait">
          {serverError && (
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-4 py-3.5 text-xs font-extrabold text-[#E11D48]"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#E11D48]" />
                <span>{serverError}</span>
              </div>
              <button
                type="button"
                onClick={() => setServerError("")}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ۱. نام دوره و لینک دوره (دو ستونه در دسکتاپ) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* نام دوره */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  نام دوره
                </label>

                <AnimatePresence mode="wait">
                  {errors.name ? (
                    <motion.span
                      key="err-name"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      {errors.name.message}
                    </motion.span>
                  ) : (
                    <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
                      عنوان اصلی
                    </span>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="text"
                placeholder="مثلاً: آموزش جامع Next.js"
                {...register("name", {
                  required: "نام دوره الزامی است",
                  minLength: {
                    value: 3,
                    message: "حداقل ۳ کاراکتر وارد کنید",
                  },
                })}
                className={`w-full rounded-2xl border px-4 py-3.5 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                  errors.name
                    ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                    : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                }`}
              />
            </div>

            {/* لینک دوره (Href) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  لینک دوره (Slug)
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
                      /course-slug
                    </span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="nextjs-masterclass"
                  {...register("href", {
                    required: "لینک دوره الزامی است",
                  })}
                  className={`w-full rounded-2xl border py-3.5 pr-4 pl-10 text-left   text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-sans placeholder:font-normal placeholder:text-[#A0A4B0] ${
                    errors.href
                      ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                      : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  }`}
                />
                <Link2 className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
              </div>
            </div>
          </div>

          {/* ۲. دسته‌بندی و وضعیت دوره */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* دسته‌بندی */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  دسته‌بندی دوره
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
                  disabled={categoryLoading}
                  className={`w-full appearance-none rounded-2xl border px-4 py-3.5 pl-10 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 disabled:opacity-50 ${
                    errors.categoryID
                      ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48]"
                      : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  }`}
                >
                  <option value="">
                    {categoryLoading
                      ? "در حال دریافت دسته‌بندی‌ها..."
                      : "انتخاب دسته‌بندی..."}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
              </div>
            </div>

            {/* وضعیت دوره */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  وضعیت برگزاری
                </label>

                {selectedStatus === "COMPLETED" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                    تکمیل شده
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3B5BDB]" />
                    پیش‌فروش
                  </span>
                )}
              </div>

              <div className="relative">
                <select
                  {...register("status", {
                    required: "وضعیت دوره الزامی است",
                  })}
                  className="w-full appearance-none rounded-2xl border border-transparent bg-[#F8F7F4] px-4 py-3.5 pl-10 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                >
                  <option value="PRESELL">پیش‌فروش (در حال برگزاری)</option>
                  <option value="COMPLETED">تکمیل شده</option>
                </select>
                <ChevronDown className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
              </div>
            </div>
          </div>

          {/* ۳. پشتیبانی و زمان دوره */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* پشتیبانی */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  نحوه پشتیبانی
                </label>

                <AnimatePresence mode="wait">
                  {errors.support ? (
                    <motion.span
                      key="err-sup"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      {errors.support.message}
                    </motion.span>
                  ) : (
                    <span className="rounded-full bg-[#F8F7F4] px-2.5 py-0.5 text-[10px] font-bold text-[#8E929F]">
                      تلگرام / تیکت
                    </span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="مثلاً: گروه اختصاصی تلگرام و تیکت"
                  {...register("support", {
                    required: "اطلاعات پشتیبانی الزامی است",
                  })}
                  className={`w-full rounded-2xl border py-3.5 pr-10 pl-4 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                    errors.support
                      ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48]"
                      : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  }`}
                />
                <Headphones className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-[#8E929F]" />
              </div>
            </div>

            {/* زمان دوره */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  مدت زمان دوره
                </label>

                <AnimatePresence mode="wait">
                  {errors.time ? (
                    <motion.span
                      key="err-time"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                      {errors.time.message}
                    </motion.span>
                  ) : (
                    <span className="rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                      ساعت آموزشی
                    </span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="مثلاً: ۴۵ ساعت"
                  {...register("time", {
                    required: "زمان دوره الزامی است",
                  })}
                  className={`w-full rounded-2xl border py-3.5 pr-10 pl-4 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                    errors.time
                      ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48]"
                      : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  }`}
                />
                <Clock className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-[#8E929F]" />
              </div>
            </div>
          </div>

          {/* ۴. فیلدهای عددی: قیمت، تخفیف، تعداد دانشجو، امتیاز (۴ ستونه در دسکتاپ) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* قیمت */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  قیمت (تومان)
                </label>
                {errors.price && (
                  <span className="rounded-full bg-[#FFF2F2] px-2 py-0.5 text-[9px] font-bold text-[#E11D48]">
                    نامعتبر
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  dir="ltr"
                  {...register("price", {
                    required: "قیمت الزامی است",
                    setValueAs: (v) =>
                      v === "" || Number.isNaN(Number(v)) ? 0 : Number(v),
                    min: { value: 0, message: "حداقل ۰" },
                  })}
                  className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 pr-4 pl-9 text-left   text-xs font-bold text-[#14151A] outline-none transition-all focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                />
                <DollarSign className="pointer-events-none absolute inset-y-0 left-3 my-auto h-3.5 w-3.5 text-[#059669]" />
              </div>
            </div>

            {/* تخفیف */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  تخفیف (٪)
                </label>
                <span className="rounded-full bg-[#FFF4E5] px-2 py-0.5 text-[9px] font-bold text-[#FF8A00]">
                  ۰ تا ۱۰۰
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  dir="ltr"
                  {...register("discount", {
                    setValueAs: (v) =>
                      v === "" || Number.isNaN(Number(v)) ? 0 : Number(v),
                    min: 0,
                    max: 100,
                  })}
                  className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 pr-4 pl-9 text-left   text-xs font-bold text-[#14151A] outline-none transition-all focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                />
                <Percent className="pointer-events-none absolute inset-y-0 left-3 my-auto h-3.5 w-3.5 text-[#FF8A00]" />
              </div>
            </div>

            {/* تعداد دانشجو */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  تعداد دانشجو
                </label>
                <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[9px] font-bold text-[#3B5BDB]">
                  نفر
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  dir="ltr"
                  {...register("students", {
                    setValueAs: (v) =>
                      v === "" || Number.isNaN(Number(v)) ? 0 : Number(v),
                    min: 0,
                  })}
                  className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 pr-4 pl-9 text-left   text-xs font-bold text-[#14151A] outline-none transition-all focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                />
                <Users className="pointer-events-none absolute inset-y-0 left-3 my-auto h-3.5 w-3.5 text-[#3B5BDB]" />
              </div>
            </div>

            {/* امتیاز */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14151A]">
                  امتیاز دوره
                </label>
                <span className="rounded-full bg-[#FFF4E5] px-2 py-0.5 text-[9px] font-bold text-[#FF8A00]">
                  از ۵
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  dir="ltr"
                  {...register("score", {
                    setValueAs: (v) =>
                      v === "" || Number.isNaN(Number(v)) ? 5 : Number(v),
                    min: 0,
                    max: 5,
                  })}
                  className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 pr-4 pl-9 text-left   text-xs font-bold text-[#14151A] outline-none transition-all focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                />
                <Star className="pointer-events-none absolute inset-y-0 left-3 my-auto h-3.5 w-3.5 fill-[#FF8A00] text-[#FF8A00]" />
              </div>
            </div>
          </div>

          {/* ۵. توضیح کوتاه (Semi Description) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                توضیح کوتاه (چکیده دوره)
              </label>

              <AnimatePresence mode="wait">
                {errors.semiDescription ? (
                  <motion.span
                    key="err-semi"
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                    {errors.semiDescription.message}
                  </motion.span>
                ) : (
                  <span className="rounded-full bg-[#F8F7F4] px-2.5 py-0.5 text-[10px] font-bold text-[#8E929F]">
                    نمایش در بالای صفحه دوره
                  </span>
                )}
              </AnimatePresence>
            </div>

            <textarea
              rows={2}
              placeholder="یک توضیح یک الی دو خطی جذاب درباره دوره..."
              {...register("semiDescription", {
                required: "توضیح کوتاه الزامی است",
              })}
              className={`w-full resize-none rounded-2xl border p-4 text-xs leading-6 font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                errors.semiDescription
                  ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48]"
                  : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
              }`}
            />
          </div>

          {/* ۶. توضیحات کامل دوره */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                توضیحات کامل دوره
              </label>

              <AnimatePresence>
                {errors.description && (
                  <motion.span
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                    {errors.description.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <textarea
              rows={6}
              placeholder="سرفصل‌ها، پیش‌نیازها و توضیحات جامع دوره را بنویسید..."
              {...register("description", {
                required: "توضیحات الزامی است",
              })}
              className={`w-full resize-y rounded-2xl border p-4 text-xs leading-7 font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                errors.description
                  ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48]"
                  : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
              }`}
            />
          </div>

          {/* ۷. آپلود تصویر کاور دوره + پیش‌نمایش */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                تصویر کاور دوره
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
                ) : preview ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                    {isEdit && !selectedCover?.[0]
                      ? "تصویر فعلی دوره"
                      : "تصویر جدید انتخاب شد"}
                  </span>
                ) : (
                  <span className="rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                    الزامی
                  </span>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                className={`group flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
                  errors.cover
                    ? "border-[#FECDD3] bg-[#FFF2F2]/50"
                    : "border-[#E5E4E0] bg-[#F8F7F4]/70 hover:border-[#FF8A00] hover:bg-[#FFF4E5]/40"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  {...register("cover", {
                    required: !isEdit ? "تصویر دوره الزامی است" : false,
                  })}
                  className="sr-only"
                />

                <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#FF8A00] shadow-sm transition-transform group-hover:scale-105">
                  <UploadCloud className="h-5 w-5" />
                </div>

                <span className="text-xs font-extrabold text-[#14151A]">
                  انتخاب فایل تصویر
                </span>
                <span className="mt-1 text-[10px] font-medium text-[#8E929F]">
                  {isEdit
                    ? "برای تغییر کاور فعلی کلیک کنید"
                    : "فرمت‌های مجاز: JPG, PNG, WEBP"}
                </span>
              </label>

              {preview ? (
                <div className="relative h-[160px] w-full overflow-hidden rounded-2xl bg-[#F8F7F4] ring-1 ring-[#F1F0EC]">
                  <img
                    src={preview}
                    alt="Course cover"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-[#14151A]/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                    {isEdit && !selectedCover?.[0] ? "کاور فعلی" : "پیش‌نمایش"}
                  </span>
                </div>
              ) : (
                <div className="flex h-[160px] items-center justify-center rounded-2xl bg-[#F8F7F4] text-xs font-bold text-[#A0A4B0]">
                  تصویری انتخاب نشده است
                </div>
              )}
            </div>
          </div>

          {/* خط جداکننده مینیمال */}
          <div className="pt-2">
            <div className="h-[1px] w-full bg-[#F1F0EC]" />
          </div>

          {/* دکمه‌های عملیات (انصراف + ذخیره کپسولی طلایی) */}
          <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard/admin/courses"
              className="inline-flex items-center justify-center rounded-full bg-[#F8F7F4] px-6 py-3.5 text-xs font-bold text-[#8E929F] transition-colors hover:bg-[#EFECE6] hover:text-[#14151A] active:scale-95"
            >
              انصراف
            </Link>

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.01 }}
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                <>
                  <span>{isEdit ? "ذخیره تغییرات" : "ساخت دوره"}</span>
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
