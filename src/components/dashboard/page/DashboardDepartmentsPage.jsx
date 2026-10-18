"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ChevronDown,
  Pencil,
  Plus,
  Trash2,
  X,
  AlertCircle,
  Layers3,
  CornerDownLeft,
} from "lucide-react";
import { useAllDepartments, useDeleteDepartment, useDepartments } from "@/hooks/useDepartments";

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28 },
  },
};

export default function DashboardDepartmentsPage() {
  const { data, isLoading, isError } = useAllDepartments();
  const departments = data?.allDepartments || data?.departments || data || [];

  const { mutateAsync: deleteDepartment, isPending: isDeleting } =
    useDeleteDepartment();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [viewFilter, setViewFilter] = useState("ALL"); // ALL | MAIN | SUB

  const mainDepartments = useMemo(() => {
    return Array.isArray(departments)
      ? departments.filter((department) => !department?.parent)
      : [];
  }, [departments]);

  const subDepartments = useMemo(() => {
    return Array.isArray(departments)
      ? departments.filter((department) => Boolean(department?.parent))
      : [];
  }, [departments]);

  const getParentId = (department) => {
    if (!department?.parent) return null;
    if (typeof department.parent === "object") {
      return department.parent?._id || null;
    }
    return department.parent;
  };

  const getParentTitle = (department) => {
    if (!department?.parent) return "اصلی";
    if (typeof department.parent === "object" && department.parent?.title) {
      return department.parent.title;
    }
    const found = mainDepartments.find(
      (m) => String(m._id) === String(department.parent),
    );
    return found?.title || "دپارتمان اصلی";
  };

  const getChildren = (parentId) => {
    return subDepartments.filter(
      (department) => String(getParentId(department)) === String(parentId),
    );
  };

  const toggleExpanded = (id) => {
    setExpanded((previous) => ({
      ...previous,
      [id]: previous[id] === false ? true : false,
    }));
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteDepartment(deleteTarget._id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("خطا در حذف دپارتمان:", error);
    }
  };

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* ========================================================= */}
      {/* بخش ۱: هدر صفحه + بج‌های خلاصه + دکمه کپسولی طلایی */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <Building2 className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                مدیریت دپارتمان‌ها
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {mainDepartments.length} اصلی
              </span>

              {subDepartments.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                  {subDepartments.length} زیرمجموعه
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              سازماندهی واحدها و زیربخش‌های پشتیبانی و تیکتینگ
            </p>
          </div>
        </div>

        {/* دکمه کپسولی زرد طلایی مشابه Get Course */}
        <Link
          href="/dashboard/admin/departments/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>دپارتمان جدید</span>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* بخش ۲: کارت‌های Overview برای فیلتر سریع (مشابه Courses Overview در تصویر اول) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* کارت ۱: ساختار درختی کامل */}
        <button
          type="button"
          onClick={() => setViewFilter("ALL")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            viewFilter === "ALL"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                viewFilter === "ALL"
                  ? "bg-white text-[#14151A]"
                  : "bg-[#FFF4E5] text-[#FF8A00]"
              }`}
            >
              {departments.length}
            </div>
            <div>
              <p className="text-sm font-extrabold">همه دپارتمان‌ها</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  viewFilter === "ALL" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                نمایش درختی واحدها و زیرمجموعه‌ها
              </p>
            </div>
          </div>
        </button>

        {/* کارت ۲: دپارتمان‌های اصلی */}
        <button
          type="button"
          onClick={() => setViewFilter("MAIN")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            viewFilter === "MAIN"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-sm font-extrabold text-[#059669]">
              {mainDepartments.length}
            </div>
            <div>
              <p className="text-sm font-extrabold">واحدهای اصلی</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  viewFilter === "MAIN" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                سردسته‌های اصلی سیستم
              </p>
            </div>
          </div>
        </button>

        {/* کارت ۳: زیر دپارتمان‌ها */}
        <button
          type="button"
          onClick={() => setViewFilter("SUB")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            viewFilter === "SUB"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
              {subDepartments.length}
            </div>
            <div>
              <p className="text-sm font-extrabold">زیر دپارتمان‌ها</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  viewFilter === "SUB" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                واحدهای فرعی وابسته به والد
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* ========================================================= */}
      {/* بخش ۳: وضعیت‌های Loading / Error / Empty و لیست دپارتمان‌ها */}
      {/* ========================================================= */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال بارگذاری دپارتمان‌ها...</span>
          </div>
        </div>
      ) : isError ? (
        /* بج خطا با پس‌زمینه قرمز نزدیک به سفید و متن قرمز پررنگ مکمل */
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] py-14 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            خطا در دریافت اطلاعات دپارتمان‌ها از سرور
          </p>
        </div>
      ) : departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            لیست خالی
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            هنوز هیچ دپارتمانی ثبت نشده است
          </p>
        </div>
      ) : viewFilter === "SUB" ? (
        /* نمایش فقط زیر دپارتمان‌ها در صورت انتخاب تب سوم */
        <div className="overflow-hidden rounded-[28px] bg-white p-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]">
          {subDepartments.length === 0 ? (
            <div className="py-12 text-center text-xs font-bold text-[#8E929F]">
              هیچ زیر دپارتمانی ثبت نشده است
            </div>
          ) : (
            <div className="divide-y divide-[#F4F3F0]">
              {subDepartments.map((sub, idx) => (
                <div
                  key={sub._id}
                  className="flex items-center justify-between px-4 py-3.5 text-xs hover:bg-[#F8F7F4]/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF4E5] font-extrabold text-[#FF8A00]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-extrabold text-[#14151A]">
                        {sub.title}
                      </p>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#8E929F]">
                        <CornerDownLeft className="h-3 w-3 text-[#FF8A00]" />
                        والد: {getParentTitle(sub)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/dashboard/admin/departments/edit/${sub._id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(sub)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-90"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 📱 نمای موبایل (Mobile-First Cards): تجربه اپ نیتیو */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3.5 md:hidden"
          >
            {mainDepartments.map((mainDepartment) => {
              const children = getChildren(mainDepartment._id);
              const isExpanded =
                viewFilter !== "MAIN" && expanded[mainDepartment._id] !== false;

              return (
                <motion.div
                  key={mainDepartment._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[26px] bg-white p-4 shadow-[0_8px_25px_-8px_rgba(20,21,26,0.05)]"
                >
                  {/* نوار عمودی سبز کنار کارت اصلی */}
                  <span className="absolute right-0 top-4 bottom-4 w-1 rounded-l-full bg-[#059669]" />

                  <div className="flex items-start justify-between gap-2 pr-2">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(mainDepartment._id)}
                        disabled={children.length === 0}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform ${
                          children.length > 0
                            ? "bg-[#ECFDF5] text-[#059669] active:scale-90"
                            : "bg-[#F8F7F4] text-[#C5C3BE]"
                        }`}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? "" : "-rotate-90"
                          }`}
                        />
                      </button>

                      <div>
                        <h3 className="text-sm font-extrabold text-[#14151A]">
                          {mainDepartment.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[9px] font-extrabold text-[#059669]">
                            دپارتمان اصلی
                          </span>
                          <span className="rounded-full bg-[#FFF4E5] px-2 py-0.5 text-[9px] font-extrabold text-[#FF8A00]">
                            {children.length} زیرمجموعه
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* اکشن‌های دایره‌ای موبایل */}
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/dashboard/admin/departments/edit/${mainDepartment._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB]"
                        title="ویرایش"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(mainDepartment)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48]"
                        title="حذف"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* دکمه افزودن زیر دپارتمان در موبایل */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-[#F4F3F0] pt-3 pr-2">
                    <span className="text-[10px] font-bold text-[#8E929F]">
                      مدیریت واحدهای فرعی
                    </span>

                    <Link
                      href={`/dashboard/admin/departments/new?parent=${mainDepartment._id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-3 py-1.5 text-[10px] font-extrabold text-[#FF8A00]"
                    >
                      <Plus className="h-3 w-3" />
                      <span>افزودن زیر دپارتمان</span>
                    </Link>
                  </div>

                  {/* لیست بازشونده زیر دپارتمان‌ها در موبایل */}
                  <AnimatePresence initial={false}>
                    {isExpanded && children.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-2 rounded-2xl bg-[#F8F7F4] p-2.5">
                          {children.map((child, childIndex) => (
                            <div
                              key={child._id}
                              className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-2xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF4E5] text-[10px] font-extrabold text-[#FF8A00]">
                                  {childIndex + 1}
                                </span>
                                <span className="truncate text-xs font-extrabold text-[#14151A]">
                                  {child.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Link
                                  href={`/dashboard/admin/departments/edit/${child._id}`}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB]"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(child)}
                                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48]"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 💻 نمای دسکتاپ: دقیقاً مشابه جدول My Courses در تصویر رفرنس و صفحات قبلی */}
          <div className="hidden md:block">
            {/* هدر ستون‌ها بیرون از کارت سفید */}
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-5">نام دپارتمان</div>
              <div className="col-span-2 text-center">نوع واحد</div>
              <div className="col-span-2 text-center">زیرمجموعه / والد</div>
              <div className="col-span-3 text-left pl-4">عملیات</div>
            </div>

            {/* کانتینر سفید گرد برای ردیف‌ها */}
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]"
            >
              {mainDepartments.map((mainDepartment) => {
                const children = getChildren(mainDepartment._id);
                const isExpanded =
                  viewFilter !== "MAIN" &&
                  expanded[mainDepartment._id] !== false;

                return (
                  <div key={mainDepartment._id}>
                    {/* ردیف دپارتمان اصلی */}
                    <motion.div
                      variants={itemVariants}
                      className="grid grid-cols-12 items-center px-4 py-4 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                    >
                      {/* ۱. نام دپارتمان + دکمه باز/بسته کردن زیرمجموعه */}
                      <div className="col-span-5 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(mainDepartment._id)}
                          disabled={children.length === 0}
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
                            children.length > 0
                              ? "bg-[#ECFDF5] text-[#059669] hover:bg-[#059669] hover:text-white active:scale-90"
                              : "cursor-default bg-[#F8F7F4] text-[#C5C3BE]"
                          }`}
                          title={
                            children.length > 0
                              ? "نمایش / بستن زیر دپارتمان‌ها"
                              : "بدون زیرمجموعه"
                          }
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isExpanded ? "" : "-rotate-90"
                            }`}
                          />
                        </button>

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF4E5] text-[#FF8A00]">
                          <Building2 className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <span className="block truncate font-extrabold text-[#14151A]">
                            {mainDepartment.title}
                          </span>
                          <span className="text-[10px] font-semibold text-[#8E929F]">
                            {children.length > 0
                              ? `${children.length} زیر دپارتمان فعال`
                              : "بدون زیر دپارتمان"}
                          </span>
                        </div>
                      </div>

                      {/* ۲. بج نوع واحد (سبز مکمل برای اصلی) */}
                      <div className="col-span-2 flex justify-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          دپارتمان اصلی
                        </span>
                      </div>

                      {/* ۳. تعداد زیرمجموعه‌ها */}
                      <div className="col-span-2 flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold ${
                            children.length > 0
                              ? "bg-[#FFF4E5] text-[#FF8A00]"
                              : "bg-[#F8F7F4] text-[#8E929F]"
                          }`}
                        >
                          <Layers3 className="h-3 w-3" />
                          {children.length} زیرمجموعه
                        </span>
                      </div>

                      {/* ۴. دکمه‌های عملیات */}
                      <div className="col-span-3 flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/admin/departments/new?parent=${mainDepartment._id}`}
                          className="inline-flex h-8 items-center gap-1 rounded-full bg-[#FFF4E5] px-3 text-[10px] font-extrabold text-[#FF8A00] transition-all hover:bg-[#FF8A00] hover:text-white active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>زیر دپارتمان</span>
                        </Link>

                        <Link
                          href={`/dashboard/admin/departments/edit/${mainDepartment._id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                          title="ویرایش"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(mainDepartment)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-90"
                          title="حذف"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </button>
                      </div>
                    </motion.div>

                    {/* ردیف‌های زیر دپارتمان (Sub-Departments) */}
                    <AnimatePresence initial={false}>
                      {isExpanded && children.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="divide-y divide-[#EAE8E1]/60 overflow-hidden bg-[#F8F7F4]/70"
                        >
                          {children.map((child, childIndex) => (
                            <div
                              key={child._id}
                              className="grid grid-cols-12 items-center px-4 py-3 text-xs transition-colors hover:bg-[#F8F7F4]"
                            >
                              <div className="col-span-5 flex items-center gap-3 pr-11">
                                <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-[#FF8A00]" />
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF4E5] text-[10px] font-extrabold text-[#FF8A00]">
                                  {childIndex + 1}
                                </div>
                                <span className="truncate font-bold text-[#14151A]">
                                  {child.title}
                                </span>
                              </div>

                              <div className="col-span-2 flex justify-center">
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#FF8A00]">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                                  زیر دپارتمان
                                </span>
                              </div>

                              <div className="col-span-2 text-center text-[11px] font-semibold text-[#8E929F]">
                                {mainDepartment.title}
                              </div>

                              <div className="col-span-3 flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/dashboard/admin/departments/edit/${child._id}`}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                                  title="ویرایش"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(child)}
                                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-90"
                                  title="حذف"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* بخش ۴: مدال تایید حذف با بج قرمز مکمل (یکپارچه با سایر صفحات) */}
      {/* ========================================================= */}
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
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-sm rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px]"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E4E0] sm:hidden" />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-3 py-1 text-[11px] font-bold text-[#E11D48]">
                  <Trash2 className="h-3.5 w-3.5" />
                  حذف دپارتمان
                </span>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] transition-colors hover:text-[#14151A] active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 text-right">
                <h3 className="text-base font-extrabold text-[#14151A]">
                  آیا از حذف این دپارتمان مطمئن هستید؟
                </h3>

                <p className="mt-2 text-xs leading-relaxed font-medium text-[#8E929F]">
                  دپارتمان{" "}
                  <span className="mx-0.5 inline-flex items-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 font-extrabold text-[#E11D48]">
                    {deleteTarget.title}
                  </span>{" "}
                  به صورت کامل حذف خواهد شد.
                </p>

                {!deleteTarget.parent && (
                  <div className="mt-3 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] p-3 text-[10px] leading-relaxed font-bold text-[#E11D48]">
                    توجه: در صورتی که این دپارتمان دارای زیرمجموعه فعال باشد،
                    ابتدا زیر دپارتمان‌های آن را حذف کنید.
                  </div>
                )}
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
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#FECDD3] bg-[#FFF2F2] py-3 text-xs font-extrabold text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>در حال حذف...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>تأیید و حذف</span>
                    </>
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
