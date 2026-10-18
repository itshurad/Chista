"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TicketPercent,
  ChevronLeft,
  ChevronDown,
  BookOpen,
  Sparkles,
  Percent,
  Hash,
  Users,
  Check,
  AlertCircle,
  Layers,
} from "lucide-react";

import { useCreateOff, useSetDiscountOnAll } from "@/hooks/useOffs";
import { useAllCourses } from "@/hooks/useCourses";

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.8 },
  },
};

const formSwitchVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 30 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function OffForm() {
  const router = useRouter();

  const [type, setType] = useState("single"); // single | all

  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [max, setMax] = useState("");
  const [courseId, setCourseId] = useState("");

  const [allDiscount, setAllDiscount] = useState("");
  const [formError, setFormError] = useState("");

  const { data: coursesData, isLoading: isCoursesLoading } = useAllCourses();
  const courses = coursesData?.allCourse || coursesData?.courses || [];

  const { mutateAsync: createOff, isPending: isCreating } = useCreateOff();
  const { mutateAsync: setDiscountOnAll, isPending: isSettingAll } =
    useSetDiscountOnAll();

  // -----------------------------------------
  // Create discount for one course
  // -----------------------------------------
  const handleCreateForCourse = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!courseId || !code.trim() || !percent || !max) {
      setFormError("لطفاً تمام فیلدها را تکمیل کنید.");
      return;
    }

    const numericPercent = Number(percent);
    const numericMax = Number(max);

    if (
      Number.isNaN(numericPercent) ||
      numericPercent < 1 ||
      numericPercent > 100
    ) {
      setFormError("درصد تخفیف باید عددی بین ۱ تا ۱۰۰ باشد.");
      return;
    }

    if (Number.isNaN(numericMax) || numericMax < 1) {
      setFormError("حداقل سقف استفاده باید ۱ مرتبه باشد.");
      return;
    }

    try {
      await createOff({
        course: courseId,
        code: code.trim(),
        percent: numericPercent,
        max: numericMax,
      });

      router.push("/dashboard/admin/offs");
    } catch (error) {
      console.error("خطا در ایجاد کد تخفیف:", error);
      setFormError(
        error?.response?.data?.message || "خطا در ثبت کد تخفیف رخ داد.",
      );
    }
  };

  // -----------------------------------------
  // Set discount for all courses
  // -----------------------------------------
  const handleCreateForAll = async (event) => {
    event.preventDefault();
    setFormError("");

    if (
      allDiscount === "" ||
      Number(allDiscount) < 0 ||
      Number(allDiscount) > 100
    ) {
      setFormError("درصد تخفیف همگانی باید بین ۰ تا ۱۰۰ باشد.");
      return;
    }

    const numericDiscount = Number(allDiscount);

    if (Number.isNaN(numericDiscount)) {
      return;
    }

    try {
      await setDiscountOnAll(numericDiscount);
      router.push("/dashboard/admin/offs");
    } catch (error) {
      console.error("خطا در اعمال تخفیف روی همه دوره‌ها:", error);
      setFormError(
        error?.response?.data?.message || "خطا در اعمال تخفیف همگانی رخ داد.",
      );
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-2xl space-y-5 pb-10"
      dir="rtl"
    >
      {/* بخش ۱: انتخابگر نوع تخفیف به سبک کارت‌های Overview در تصویر رفرنس */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {/* کارت تخفیف تک دوره */}
        <button
          type="button"
          onClick={() => {
            setType("single");
            setFormError("");
          }}
          className={`flex items-center justify-between rounded-[28px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            type === "single"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                type === "single"
                  ? "bg-[#FFCC00] text-[#14151A]"
                  : "bg-[#EEF2FF] text-[#3B5BDB]"
              }`}
            >
              <TicketPercent className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-extrabold">کد تخفیف اختصاصی</p>
                {type === "single" && (
                  <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[9px] font-extrabold text-[#059669]">
                    انتخاب شده
                  </span>
                )}
              </div>
              <p
                className={`mt-1 text-[11px] font-medium ${
                  type === "single" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                ساخت کد برای یک دوره مشخص
              </p>
            </div>
          </div>
        </button>

        {/* کارت تخفیف همه دوره‌ها */}
        <button
          type="button"
          onClick={() => {
            setType("all");
            setFormError("");
          }}
          className={`flex items-center justify-between rounded-[28px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            type === "all"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                type === "all"
                  ? "bg-[#FFCC00] text-[#14151A]"
                  : "bg-[#FFF4E5] text-[#FF8A00]"
              }`}
            >
              <Sparkles className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-extrabold">تخفیف همگانی</p>
                {type === "all" && (
                  <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[9px] font-extrabold text-[#059669]">
                    انتخاب شده
                  </span>
                )}
              </div>
              <p
                className={`mt-1 text-[11px] font-medium ${
                  type === "all" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                اعمال روی تمام دوره‌های سایت
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
              type === "single"
                ? "bg-[#EEF2FF] text-[#3B5BDB]"
                : "bg-[#FFF4E5] text-[#FF8A00]"
            }`}
          >
            {type === "single" ? (
              <>
                <Layers className="h-3.5 w-3.5" />
                تک دوره
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                کمپین سراسری
              </>
            )}
          </span>

          <Link
            href="/dashboard/admin/offs"
            className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-4 py-2 text-xs font-bold text-[#14151A] transition-all hover:bg-[#EFECE6] active:scale-95"
          >
            <span>بازگشت</span>
            <ChevronLeft className="h-3.5 w-3.5 text-[#8E929F]" />
          </Link>
        </div>

        {/* نمایش خطا با بج قرمز مکمل (پس‌زمینه قرمز نزدیک به سفید + متن قرمز پررنگ) */}
        <AnimatePresence mode="wait">
          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-6 flex items-center gap-2.5 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-4 py-3 text-xs font-extrabold text-[#E11D48]"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* سوئیچ انیمیشنی بین دو فرم */}
        <AnimatePresence mode="wait">
          {type === "single" ? (
            <motion.form
              key="single-form"
              variants={formSwitchVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onSubmit={handleCreateForCourse}
              className="space-y-5"
            >
              {/* تیتر با نوار عمودی آبی (مشابه کارت‌های دوره در تصویر رفرنس) */}
              <div className="relative mb-6 pr-4">
                <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#3B5BDB]" />
                <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                  ساخت کد تخفیف برای یک دوره
                </h1>
                <p className="mt-1 text-xs font-medium text-[#8E929F]">
                  دوره، کد معرف، درصد و سقف دفعات مجاز استفاده را مشخص کنید
                </p>
              </div>

              {/* ۱. انتخاب دوره */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#14151A]">
                    انتخاب دوره آموزشی
                  </label>
                  {courseId ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                      انتخاب شد
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                      الزامی
                    </span>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={courseId}
                    onChange={(event) => setCourseId(event.target.value)}
                    disabled={isCoursesLoading}
                    className="w-full appearance-none rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 pr-10 pl-10 text-xs font-semibold text-[#14151A] outline-none transition-all duration-200 focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {isCoursesLoading
                        ? "در حال دریافت لیست دوره‌ها..."
                        : "یک دوره را انتخاب کنید..."}
                    </option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  <BookOpen className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-[#8E929F]" />
                  <ChevronDown className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
                </div>
              </div>

              {/* ۲. کد تخفیف */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#14151A]">
                    کد تخفیف (Code)
                  </label>
                  <span
                    dir="ltr"
                    className="rounded-full bg-[#F3F0FF] px-2.5 py-0.5   text-[10px] font-bold text-[#7048E8]"
                  >
                    OFF20
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="OFF20"
                    className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 pr-4 pl-10 text-left   text-xs font-extrabold uppercase text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  />
                  <Hash className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#7048E8]" />
                </div>
              </div>

              {/* ۳. درصد تخفیف و حداکثر استفاده (دو ستونه در دسکتاپ) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* درصد تخفیف */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#14151A]">
                      درصد تخفیف
                    </label>
                    <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                      ۱ تا ۱۰۰٪
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      dir="ltr"
                      value={percent}
                      onChange={(event) => setPercent(event.target.value)}
                      placeholder="20"
                      className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 pr-4 pl-10 text-left   text-xs font-bold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                    />
                    <Percent className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#059669]" />
                  </div>
                </div>

                {/* حداکثر استفاده */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#14151A]">
                      سقف تعداد استفاده
                    </label>
                    <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
                      نفر / مرتبه
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      dir="ltr"
                      value={max}
                      onChange={(event) => setMax(event.target.value)}
                      placeholder="100"
                      className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 pr-4 pl-10 text-left   text-xs font-bold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                    />
                    <Users className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#3B5BDB]" />
                  </div>
                </div>
              </div>

              {/* خط جداکننده */}
              <div className="pt-2">
                <div className="h-[1px] w-full bg-[#F1F0EC]" />
              </div>

              {/* دکمه‌های عملیات */}
              <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  href="/dashboard/admin/offs"
                  className="inline-flex items-center justify-center rounded-full bg-[#F8F7F4] px-6 py-3.5 text-xs font-bold text-[#8E929F] transition-colors hover:bg-[#EFECE6] hover:text-[#14151A] active:scale-95"
                >
                  انصراف
                </Link>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.01 }}
                  type="submit"
                  disabled={
                    isCreating || !courseId || !code.trim() || !percent || !max
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                      <span>در حال ساخت...</span>
                    </>
                  ) : (
                    <>
                      <span>ساخت کد تخفیف</span>
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="all-form"
              variants={formSwitchVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onSubmit={handleCreateForAll}
              className="space-y-5"
            >
              {/* تیتر با نوار عمودی نارنجی */}
              <div className="relative mb-6 pr-4">
                <span className="absolute right-0 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#FF8A00]" />
                <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                  اعمال تخفیف روی همه دوره‌ها
                </h1>
                <p className="mt-1 text-xs font-medium text-[#8E929F]">
                  درصد وارد شده به صورت مستقیم روی تمام دوره‌های سایت ثبت می‌شود
                  (برای حذف تخفیف همگانی عدد 0 را وارد کنید)
                </p>
              </div>

              {/* درصد تخفیف همگانی */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#14151A]">
                    درصد تخفیف همگانی
                  </label>
                  <span className="rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#FF8A00]">
                    ۰ تا ۱۰۰٪
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    dir="ltr"
                    value={allDiscount}
                    onChange={(event) => setAllDiscount(event.target.value)}
                    placeholder="30"
                    className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] py-3.5 pr-4 pl-10 text-left   text-xs font-bold text-[#14151A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                  />
                  <Percent className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#FF8A00]" />
                </div>
              </div>

              {/* خط جداکننده */}
              <div className="pt-2">
                <div className="h-[1px] w-full bg-[#F1F0EC]" />
              </div>

              {/* دکمه‌های عملیات */}
              <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  href="/dashboard/admin/offs"
                  className="inline-flex items-center justify-center rounded-full bg-[#F8F7F4] px-6 py-3.5 text-xs font-bold text-[#8E929F] transition-colors hover:bg-[#EFECE6] hover:text-[#14151A] active:scale-95"
                >
                  انصراف
                </Link>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.01 }}
                  type="submit"
                  disabled={isSettingAll || allDiscount === ""}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-7 py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSettingAll ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                      <span>در حال اعمال...</span>
                    </>
                  ) : (
                    <>
                      <span>اعمال روی همه دوره‌ها</span>
                      <Sparkles className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default OffForm;
