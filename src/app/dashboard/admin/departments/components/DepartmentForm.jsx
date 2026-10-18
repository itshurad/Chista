"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  CornerDownLeft,
  Type,
  Check,
  X,
} from "lucide-react";

import {
  useCreateDepartment,
  useDepartments,
  useUpdateDepartment,
} from "@/hooks/useDepartments";

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

const defaultValues = {
  title: "",
  type: "MAIN",
  parent: "",
};

function DepartmentForm({ department = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParentId = searchParams?.get("parent") || "";

  const isEditMode = Boolean(department?._id);
  const [serverError, setServerError] = useState("");

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

  const selectedType = watch("type");

  const { data: mainDepartmentsData, isLoading: isLoadingMainDepartments } =
    useDepartments();

  const mainDepartments = useMemo(() => {
    const raw =
      mainDepartmentsData?.departments ||
      mainDepartmentsData?.mainDepartments ||
      mainDepartmentsData?.allDepartments ||
      mainDepartmentsData ||
      [];

    // فقط دپارتمان‌های اصلی (بدون والد) و حذف خود دپارتمان در حالت ویرایش
    return (Array.isArray(raw) ? raw : []).filter(
      (item) =>
        !item.parent &&
        (!isEditMode || String(item._id) !== String(department?._id)),
    );
  }, [mainDepartmentsData, isEditMode, department]);

  const parentDepartmentId = useMemo(() => {
    if (!department?.parent) return "";
    if (typeof department.parent === "object") {
      return department.parent?._id || "";
    }
    return department.parent;
  }, [department]);

  const { mutateAsync: createDepartment, isPending: isCreating } =
    useCreateDepartment();
  const { mutateAsync: updateDepartment, isPending: isUpdating } =
    useUpdateDepartment();

  const isPending = isCreating || isUpdating;

  // ---------------------------------------------------------------------------
  // مقداردهی اولیه در حالت ویرایش یا زمانی که از دکمه «+ زیر دپارتمان» آمده‌ایم
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (department && department._id) {
      reset({
        title: department.title || "",
        type: department.parent ? "SUB" : "MAIN",
        parent: parentDepartmentId || "",
      });
      return;
    }

    if (urlParentId) {
      reset({
        title: "",
        type: "SUB",
        parent: urlParentId,
      });
      return;
    }

    reset(defaultValues);
  }, [department, parentDepartmentId, urlParentId, reset]);

  // ---------------------------------------------------------------------------
  // ارسال فرم
  // ---------------------------------------------------------------------------
  const handleDepartmentSubmit = async (values) => {
    setServerError("");

    try {
      const payload = {
        title: values.title.trim(),
      };

      if (values.type === "SUB" && values.parent) {
        payload.parent = values.parent;
      }

      if (isEditMode) {
        await updateDepartment({
          id: department._id,
          data: payload,
        });
      } else {
        await createDepartment(payload);
      }

      reset(defaultValues);
      router.push("/dashboard/admin/departments");
      router.refresh();
    } catch (error) {
      console.error(
        isEditMode ? "خطا در ویرایش دپارتمان:" : "خطا در ایجاد دپارتمان:",
        error,
      );
      setServerError(
        error?.response?.data?.message ||
          "خطایی در ثبت اطلاعات دپارتمان رخ داد.",
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
      {/* بخش ۱: انتخابگر نوع دپارتمان به سبک کارت‌های Overview در تصویر رفرنس */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {/* کارت دپارتمان اصلی */}
        <button
          type="button"
          onClick={() => {
            setValue("type", "MAIN");
            setValue("parent", "");
          }}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            selectedType === "MAIN"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                selectedType === "MAIN"
                  ? "bg-[#ECFDF5] text-[#059669]"
                  : "bg-[#F8F7F4] text-[#8E929F]"
              }`}
            >
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-extrabold sm:text-sm">
                  دپارتمان اصلی
                </p>
                {selectedType === "MAIN" && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                )}
              </div>
              <p
                className={`mt-0.5 text-[10px] font-medium ${
                  selectedType === "MAIN" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                واحد مستقل بدون والد
              </p>
            </div>
          </div>
        </button>

        {/* کارت زیر دپارتمان */}
        <button
          type="button"
          onClick={() => setValue("type", "SUB")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            selectedType === "SUB"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                selectedType === "SUB"
                  ? "bg-[#FFF4E5] text-[#FF8A00]"
                  : "bg-[#F8F7F4] text-[#8E929F]"
              }`}
            >
              <CornerDownLeft className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-extrabold sm:text-sm">
                  زیر دپارتمان
                </p>
                {selectedType === "SUB" && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FFCC00]" />
                )}
              </div>
              <p
                className={`mt-0.5 text-[10px] font-medium ${
                  selectedType === "SUB" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                زیرمجموعه یک واحد اصلی
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* بخش ۲: کارت اصلی فرم */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-10px_rgba(20,21,26,0.05)] sm:p-8">
        {/* نوار بالای کارت: بج وضعیت + دکمه بازگشت کپسولی */}
        <div className="mb-6 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold ${
              isEditMode
                ? "bg-[#FFF4E5] text-[#FF8A00]"
                : selectedType === "SUB"
                  ? "bg-[#EEF2FF] text-[#3B5BDB]"
                  : "bg-[#ECFDF5] text-[#059669]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isEditMode
                  ? "bg-[#FF8A00]"
                  : selectedType === "SUB"
                    ? "bg-[#3B5BDB]"
                    : "bg-[#059669]"
              }`}
            />
            {isEditMode
              ? "حالت ویرایش"
              : selectedType === "SUB"
                ? "ایجاد زیر دپارتمان"
                : "ایجاد دپارتمان اصلی"}
          </span>

          <Link
            href="/dashboard/admin/departments"
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
            {isEditMode ? "ویرایش دپارتمان" : "ایجاد دپارتمان جدید"}
          </h1>
          <p className="mt-1 text-xs font-medium text-[#8E929F]">
            عنوان نمایشی و جایگاه واحد پشتیبانی را مشخص کنید
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
              className="mb-5 flex items-center justify-between gap-2.5 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-4 py-3 text-xs font-extrabold text-[#E11D48]"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{serverError}</span>
              </div>
              <button
                type="button"
                onClick={() => setServerError("")}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E11D48]/10"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={handleSubmit(handleDepartmentSubmit)}
          className="space-y-5"
        >
          {/* ۱. فیلد نام دپارتمان */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14151A]">
                نام دپارتمان
              </label>

              <AnimatePresence mode="wait">
                {errors.title ? (
                  <motion.span
                    key="title-error"
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
                    عنوان واحد
                  </span>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <input
                {...register("title", {
                  required: "نام دپارتمان الزامی است",
                  validate: (value) =>
                    value.trim().length > 0 || "نام دپارتمان الزامی است",
                })}
                type="text"
                placeholder="مثلاً: پشتیبانی فنی یا امور مالی"
                className={`w-full rounded-2xl border py-3.5 pr-10 pl-4 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] ${
                  errors.title
                    ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48] focus:bg-[#FFF2F2]"
                    : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                }`}
              />
              <Type className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-[#8E929F]" />
            </div>
          </div>

          {/* ۲. انتخاب دپارتمان والد (فقط در حالت زیر دپارتمان) */}
          <AnimatePresence initial={false}>
            {selectedType === "SUB" && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                className="space-y-2 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#14151A]">
                    انتخاب دپارتمان والد
                  </label>

                  <AnimatePresence mode="wait">
                    {errors.parent ? (
                      <motion.span
                        key="parent-error"
                        variants={badgeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                      >
                        <span className="h-1 w-1 rounded-full bg-[#E11D48]" />
                        {errors.parent.message}
                      </motion.span>
                    ) : (
                      <span className="rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                        فقط واحدهای اصلی
                      </span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <select
                    {...register("parent", {
                      validate: (value) =>
                        selectedType !== "SUB" ||
                        Boolean(value) ||
                        "انتخاب دپارتمان والد الزامی است",
                    })}
                    disabled={isLoadingMainDepartments}
                    className={`w-full appearance-none rounded-2xl border py-3.5 pr-10 pl-10 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.parent
                        ? "border-[#FECDD3] bg-[#FFF2F2]/60 text-[#E11D48] focus:border-[#E11D48]"
                        : "border-transparent bg-[#F8F7F4] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                    }`}
                  >
                    <option value="">
                      {isLoadingMainDepartments
                        ? "در حال دریافت دپارتمان‌ها..."
                        : "یک دپارتمان اصلی را انتخاب کنید..."}
                    </option>

                    {mainDepartments.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title}
                      </option>
                    ))}
                  </select>

                  <Building2 className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-[#8E929F]" />
                  <ChevronDown className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* خط جداکننده مینیمال */}
          <div className="pt-2">
            <div className="h-[1px] w-full bg-[#F1F0EC]" />
          </div>

          {/* ۳. دکمه‌های عملیات (انصراف + ثبت کپسولی طلایی) */}
          <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard/admin/departments"
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
                  <span>{isEditMode ? "ذخیره تغییرات" : "ایجاد دپارتمان"}</span>
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

export default DepartmentForm;
