"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAllMenus, useDeleteMenu } from "@/hooks/useMenus";

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

function DashboardMenuPage() {
  const { data, isLoading, isError } = useAllMenus();
  const menus = data || [];

  const { mutate: deleteMenu, isPending: isDeleting } = useDeleteMenu();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMenu(deleteTarget._id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  // تفکیک آماری برای هدر خلاصه (مشابه Courses Overview در تصویر)
  const rootMenusCount = menus.filter((m) => !m.parent).length;
  const subMenusCount = menus.filter((m) => Boolean(m.parent)).length;

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* بخش ۱: هدر و دکمه افزودن + کارت‌های خلاصه آماری (Overview) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* دایره شمارنده نارنجی مشابه کارت‌های بالای تصویر رفرنس */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00] shadow-sm">
            {menus.length}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                مدیریت منوها
              </h1>
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                {rootMenusCount} اصلی
              </span>
              {subMenusCount > 0 && (
                <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#3B5BDB]">
                  {subMenusCount} زیرمنو
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              ساختار ناوبری و لینک‌های سایت
            </p>
          </div>
        </div>

        {/* دکمه کپسولی طلایی مشابه Get Course */}
        <Link
          href="/dashboard/admin/menus/new"
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
          <span>منوی جدید</span>
        </Link>
      </div>

      {/* بخش ۲: وضعیت‌های Loading / Error / Empty */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال بارگذاری منوها...</span>
          </div>
        </div>
      ) : isError ? (
        /* بج خطا با پس‌زمینه قرمز نزدیک به سفید و متن قرمز پررنگ */
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] py-14 text-center">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
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
            خطا در دریافت اطلاعات از سرور
          </p>
        </div>
      ) : menus.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            لیست خالی
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            هنوز هیچ منویی ثبت نشده است
          </p>
        </div>
      ) : (
        <>
          {/* 📱 نمای موبایل (Mobile-First Card List): تجربه اپ نیتیو */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3 md:hidden"
          >
            {menus.map((menu, idx) => {
              const isSubMenu = Boolean(menu.parent);
              return (
                <motion.div
                  key={menu._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[26px] bg-white p-4 shadow-[0_8px_25px_-8px_rgba(20,21,26,0.05)]"
                >
                  {/* نوار رنگی کنار کارت (سبز برای اصلی، نارنجی برای زیرمنو) */}
                  <span
                    className={`absolute right-0 top-4 bottom-4 w-1 rounded-l-full ${
                      isSubMenu ? "bg-[#FF8A00]" : "bg-[#059669]"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-3 pr-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] text-xs font-extrabold text-[#FF8A00]">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#14151A]">
                          {menu.title}
                        </h3>
                        <span
                          dir="ltr"
                          className="mt-1 inline-block rounded-full bg-[#F3F0FF] px-2.5 py-0.5  text-[10px] font-bold text-[#7048E8]"
                        >
                          {menu.href?.startsWith("/")
                            ? menu.href
                            : `/${menu.href}`}
                        </span>
                      </div>
                    </div>

                    {/* دکمه‌های اکشن دایره‌ای */}
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/dashboard/admin/menus/edit/${menu._id}`}
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
                        onClick={() => setDeleteTarget(menu)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF2F2] text-[#E11D48] transition-transform active:scale-90"
                        title="حذف"
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
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* فوتر کارت موبایل: بج والد + تاریخ */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-[#F4F3F0] pt-3 pr-2">
                    {isSubMenu ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[10px] font-bold text-[#FF8A00]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                        والد: {menu.parent.title || menu.parent}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-bold text-[#059669]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                        منوی اصلی (سردسته)
                      </span>
                    )}

                    <span className="text-[10px] font-semibold text-[#8E929F]">
                      {menu.updatedAt
                        ? new Date(menu.updatedAt).toLocaleDateString("fa-IR")
                        : "---"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 💻 نمای دسکتاپ: دقیقاً مشابه بخش My Courses در تصویر رفرنس */}
          <div className="hidden md:block">
            {/* هدر ستون‌ها بیرون از کارت سفید (مشابه تصویر اول) */}
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">عنوان منو</div>
              <div className="col-span-3">جایگاه / والد</div>
              <div className="col-span-2">آدرس (Href)</div>
              <div className="col-span-2">بروزرسانی</div>
              <div className="col-span-1 text-center">عملیات</div>
            </div>

            {/* کانتینر سفید گرد برای ردیف‌ها */}
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]"
            >
              {menus.map((menu, idx) => {
                const isSubMenu = Boolean(menu.parent);
                return (
                  <motion.div
                    key={menu._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center px-4 py-4 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    {/* شماره ردیف */}
                    <div className="col-span-1 text-center font-bold text-[#8E929F]">
                      {idx + 1}
                    </div>

                    {/* عنوان منو + آیکون مشابه My Courses */}
                    <div className="col-span-3 flex items-center gap-3">
                   
                      <span className="truncate font-extrabold text-[#14151A]">
                        {menu.title}
                      </span>
                    </div>

                    {/* بج وضعیت والد (سبز برای اصلی، نارنجی برای زیرمنو) */}
                    <div className="col-span-3">
                      {isSubMenu ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3 py-1 text-[11px] font-bold text-[#FF8A00]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                          {menu.parent.title || menu.parent}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-bold text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          منوی اصلی (سردسته)
                        </span>
                      )}
                    </div>

                    {/* بج آدرس Href */}
                    <div className="col-span-2">
                      <span
                        dir="ltr"
                        className="inline-block rounded-full bg-[#F3F0FF] px-3 py-1  text-[11px] font-bold text-[#7048E8]"
                      >
                        {menu.href?.startsWith("/")
                          ? menu.href
                          : `/${menu.href}`}
                      </span>
                    </div>

                    {/* تاریخ */}
                    <div className="col-span-2 text-[11px] font-semibold text-[#8E929F]">
                      {menu.updatedAt
                        ? new Date(menu.updatedAt).toLocaleDateString("fa-IR")
                        : menu.createdAt
                          ? new Date(menu.createdAt).toLocaleDateString("fa-IR")
                          : "---"}
                    </div>

                    {/* اکشن‌ها: دقیقاً با استایل آیکون‌های دایره‌ای رنگی در جدول تصویر رفرنس */}
                    <div className="col-span-1 flex items-center justify-center gap-2">
                      <Link
                        href={`/dashboard/admin/menus/edit/${menu._id}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
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
                        onClick={() => setDeleteTarget(menu)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF2F2] text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-90"
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
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}

      {/* بخش ۳: مدال تایید حذف (Bottom-Sheet در موبایل و Modal در دسکتاپ) */}
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
              {/* دستگیره بالای شیت برای موبایل */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E4E0] sm:hidden" />

              {/* هدر مدال با بج قرمز مکمل */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-3 py-1 text-[11px] font-bold text-[#E11D48]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48]" />
                  حذف دائمی
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

              {/* محتوای مدال */}
              <div className="mt-5 text-right ">
                <h3 className="text-base font-extrabold text-[#14151A]">
                  آیا از حذف این منو مطمئن هستید؟
                </h3>
                <p className="mt-2 text-xs leading-relaxed font-medium text-[#8E929F]">
                  منوی{" "}
                  <span className=" mx-0.5 inline-flex items-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 font-extrabold text-[#E11D48]">
                    {deleteTarget.title}
                  </span>{" "}
                  به صورت کامل حذف خواهد شد.
                </p>
              </div>

              {/* دکمه‌های مدال */}
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

export default DashboardMenuPage;
