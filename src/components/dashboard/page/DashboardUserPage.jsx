"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  Ban,
  CheckCircle2,
  ArrowUpDown,
  X,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { useChangeRole, useUsers } from "@/hooks/useUsers";

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
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

export default function UsersListPage() {
  const { data, isLoading, isError } = useUsers();
  const users = data?.users || data || [];

  const { mutate: changeRole, isPending: isChangingRole } = useChangeRole();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL | ADMIN | USER
  const [roleModalUser, setRoleModalUser] = useState(null);

  // -----------------------------
  // آمار کاربران
  // -----------------------------
  const adminsCount = useMemo(
    () => users.filter((u) => u.role === "ADMIN").length,
    [users],
  );
  const normalUsersCount = users.length - adminsCount;
  const bannedCount = useMemo(
    () => users.filter((u) => Boolean(u.isBan)).length,
    [users],
  );

  // -----------------------------
  // فیلتر و جستجوی زنده
  // -----------------------------
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // فیلتر بر اساس کارت‌های بالای صفحه
      if (roleFilter === "ADMIN" && user.role !== "ADMIN") return false;
      if (roleFilter === "USER" && user.role === "ADMIN") return false;

      // فیلتر بر اساس عبارت جستجو
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      const nameMatch = user.name?.toLowerCase().includes(q);
      const usernameMatch = user.username?.toLowerCase().includes(q);
      const emailMatch = user.email?.toLowerCase().includes(q);
      const phoneMatch = user.phone?.toLowerCase().includes(q);

      return nameMatch || usernameMatch || emailMatch || phoneMatch;
    });
  }, [users, searchTerm, roleFilter]);

  // -----------------------------
  // تغییر نقش کاربر
  // -----------------------------
  const handleChangeRole = () => {
    if (!roleModalUser) return;
    changeRole(roleModalUser._id, {
      onSettled: () => setRoleModalUser(null),
    });
  };

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* بخش ۱: هدر + کادر جستجوی کپسولی (مشابه Search something در تصویر رفرنس) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <Users className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                کاربران و دسترسی‌ها
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {users.length - bannedCount} فعال
              </span>

              {bannedCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48]" />
                  {bannedCount} مسدود
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              مدیریت اعضا و سطوح دسترسی سیستم
            </p>
          </div>
        </div>

        {/* نوار جستجوی کپسولی سفید دقیقاً مشابه بالای تصویر رفرنس */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی نام، ایمیل یا تلفن..."
            className="w-full rounded-full border border-transparent bg-white py-3 pr-5 pl-11 text-xs font-semibold text-[#14151A] shadow-[0_6px_24px_-6px_rgba(20,21,26,0.06)] outline-none transition-all placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:ring-4 focus:ring-[#FFF4E5]"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 left-3 my-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] hover:text-[#14151A]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Search className="pointer-events-none absolute inset-y-0 left-4 my-auto h-4 w-4 text-[#8E929F]" />
          )}
        </div>
      </div>

      {/* بخش ۲: کارت‌های Overview برای فیلتر سریع (الهام گرفته از ردیف اول تصویر رفرنس) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* همه کاربران */}
        <button
          type="button"
          onClick={() => setRoleFilter("ALL")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            roleFilter === "ALL"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                roleFilter === "ALL"
                  ? "bg-white text-[#14151A]"
                  : "bg-[#FFF4E5] text-[#FF8A00]"
              }`}
            >
              {users.length}
            </div>
            <div>
              <p className="text-sm font-extrabold">همه کاربران</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  roleFilter === "ALL" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                کل اعضای ثبت‌نام شده
              </p>
            </div>
          </div>
        </button>

        {/* مدیران سیستم */}
        <button
          type="button"
          onClick={() => setRoleFilter("ADMIN")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            roleFilter === "ADMIN"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
              {adminsCount}
            </div>
            <div>
              <p className="text-sm font-extrabold">مدیران کل (ADMIN)</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  roleFilter === "ADMIN" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                دارای دسترسی مدیریت
              </p>
            </div>
          </div>
        </button>

        {/* کاربران عادی */}
        <button
          type="button"
          onClick={() => setRoleFilter("USER")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            roleFilter === "USER"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-extrabold text-[#3B5BDB]">
              {normalUsersCount}
            </div>
            <div>
              <p className="text-sm font-extrabold">کاربران عادی (USER)</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  roleFilter === "USER" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                دانشجویان و اعضای سایت
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* بخش ۳: وضعیت‌های Loading / Error / Empty */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت لیست کاربران...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-8 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            خطا در دریافت اطلاعات کاربران از سرور
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            بدون نتیجه
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            {searchTerm
              ? "کاربری مطابق با عبارت جستجو شده یافت نشد"
              : "هنوز کاربری در این بخش ثبت نشده است"}
          </p>
        </div>
      ) : (
        <>
          {/* 📱 نمای موبایل (Mobile-First Cards): تجربه اپ نیتیو */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3.5 lg:hidden"
          >
            {filteredUsers.map((user) => {
              const isAdmin = user.role === "ADMIN";
              const isBanned = Boolean(user.isBan);

              return (
                <motion.div
                  key={user._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.05)]"
                >
                  {/* نوار عمودی رنگی کنار کارت (قرمز برای مسدود، نارنجی برای ادمین، آبی برای کاربر) */}
                  <span
                    className={`absolute right-0 top-4 bottom-4 w-1 rounded-l-full ${
                      isBanned
                        ? "bg-[#E11D48]"
                        : isAdmin
                          ? "bg-[#FF8A00]"
                          : "bg-[#3B5BDB]"
                    }`}
                  />

                  {/* هدر کارت موبایل: آواتار + نام + بج وضعیت */}
                  <div className="flex items-start justify-between gap-2 pr-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-extrabold ${
                          isAdmin
                            ? "bg-[#FFF4E5] text-[#FF8A00]"
                            : "bg-[#EEF2FF] text-[#3B5BDB]"
                        }`}
                      >
                        {user.name?.charAt(0) ||
                          user.username?.charAt(0) ||
                          "U"}
                      </div>

                      <div>
                        <h3 className="text-sm font-extrabold text-[#14151A]">
                          {user.name || "بی‌نام"}
                        </h3>
                        {user.username && (
                          <span
                            dir="ltr"
                            className="mt-0.5 inline-block rounded-full bg-[#F3F0FF] px-2 py-0.5   text-[10px] font-bold text-[#7048E8]"
                          >
                            @{user.username}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* بج‌های نقش و وضعیت حساب */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          isAdmin
                            ? "bg-[#FFF4E5] text-[#FF8A00]"
                            : "bg-[#EEF2FF] text-[#3B5BDB]"
                        }`}
                      >
                        {isAdmin ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <UserCheck className="h-3 w-3" />
                        )}
                        {isAdmin ? "مدیر کل" : "کاربر عادی"}
                      </span>

                      {isBanned ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-extrabold text-[#E11D48]">
                          <Ban className="h-3 w-3" />
                          مسدود شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                          <CheckCircle2 className="h-3 w-3" />
                          فعال
                        </span>
                      )}
                    </div>
                  </div>

                  {/* اطلاعات تماس در موبایل */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 pr-2 text-[11px] text-[#8E929F]">
                    {user.email && (
                      <span
                        dir="ltr"
                        className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-2.5 py-1   font-semibold text-[#14151A]"
                      >
                        <Mail className="h-3 w-3 text-[#8E929F]" />
                        {user.email}
                      </span>
                    )}
                    {user.phone && (
                      <span
                        dir="ltr"
                        className="inline-flex items-center gap-1 rounded-full bg-[#F8F7F4] px-2.5 py-1   font-semibold text-[#14151A]"
                      >
                        <Phone className="h-3 w-3 text-[#8E929F]" />
                        {user.phone}
                      </span>
                    )}
                  </div>

                  {/* فوتر کارت موبایل: تاریخ ثبت‌نام + دکمه تغییر نقش */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-[#F4F3F0] pt-3 pr-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8E929F]">
                      <Calendar className="h-3 w-3" />
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("fa-IR")
                        : "---"}
                    </span>

                    <button
                      type="button"
                      onClick={() => setRoleModalUser(user)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-transform active:scale-95 ${
                        isAdmin
                          ? "bg-[#F8F7F4] text-[#14151A]"
                          : "bg-[#FFCC00] text-[#14151A] shadow-sm"
                      }`}
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      <span>
                        {isAdmin ? "تنزل به کاربر" : "ارتقا به ادمین"}
                      </span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 💻 نمای دسکتاپ: دقیقاً مشابه جدول My Courses در تصویر رفرنس */}
          <div className="hidden lg:block">
            {/* هدر ستون‌ها بیرون از کارت سفید */}
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">کاربر</div>
              <div className="col-span-3">ایمیل / شماره تماس</div>
              <div className="col-span-2 text-center">نقش فعلی</div>
              <div className="col-span-1 text-center">وضعیت</div>
              <div className="col-span-1 text-center">عضویت</div>
              <div className="col-span-1 text-center">دسترسی</div>
            </div>

            {/* کانتینر سفید گرد برای ردیف‌ها */}
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]"
            >
              {filteredUsers.map((user, idx) => {
                const isAdmin = user.role === "ADMIN";
                const isBanned = Boolean(user.isBan);

                return (
                  <motion.div
                    key={user._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center gap-2 px-4 py-3.5 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    {/* ۱. شماره ردیف */}
                    <div className="col-span-1 text-center font-bold text-[#8E929F]">
                      {idx + 1}
                    </div>

                    {/* ۲. اطلاعات کاربر */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-extrabold ${
                          isAdmin
                            ? "bg-[#FFF4E5] text-[#FF8A00]"
                            : "bg-[#EEF2FF] text-[#3B5BDB]"
                        }`}
                      >
                        {user.name?.charAt(0) ||
                          user.username?.charAt(0) ||
                          "U"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold text-[#14151A]">
                          {user.name || "بی‌نام"}
                        </p>
                        {user.username && (
                          <span
                            dir="ltr"
                            className="mt-0.5 inline-block truncate rounded-full bg-[#F3F0FF] px-2 py-0.2   text-[10px] font-bold text-[#7048E8]"
                          >
                            @{user.username}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ۳. ایمیل و شماره تماس */}
                    <div className="col-span-3 flex flex-col items-start gap-1">
                      <span
                        dir="ltr"
                        className="max-w-full truncate   text-[11px] font-bold text-[#14151A]"
                      >
                        {user.email || "---"}
                      </span>
                      {user.phone && (
                        <span
                          dir="ltr"
                          className="  text-[10px] font-semibold text-[#8E929F]"
                        >
                          {user.phone}
                        </span>
                      )}
                    </div>

                    {/* ۴. بج نقش فعلی */}
                    <div className="col-span-2 flex justify-center">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3 py-1 text-[11px] font-extrabold text-[#FF8A00]">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          مدیر کل (ADMIN)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-extrabold text-[#3B5BDB]">
                          <UserCheck className="h-3.5 w-3.5" />
                          کاربر عادی (USER)
                        </span>
                      )}
                    </div>

                    {/* ۵. بج وضعیت حساب (سبز برای فعال / قرمز مکمل برای مسدود) */}
                    <div className="col-span-1 flex justify-center">
                      {isBanned ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-1 text-[10px] font-extrabold text-[#E11D48]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48]" />
                          مسدود
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          فعال
                        </span>
                      )}
                    </div>

                    {/* ۶. تاریخ ثبت‌نام */}
                    <div className="col-span-1 text-center text-[11px] font-semibold text-[#8E929F]">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("fa-IR")
                        : "---"}
                    </div>

                    {/* ۷. دکمه تغییر دسترسی */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setRoleModalUser(user)}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-extrabold transition-all active:scale-95 ${
                          isAdmin
                            ? "bg-[#F8F7F4] text-[#8E929F] hover:bg-[#EFECE6] hover:text-[#14151A]"
                            : "bg-[#FFCC00] text-[#14151A] shadow-sm hover:bg-[#FFD633]"
                        }`}
                        title={
                          isAdmin ? "تنزل به کاربر عادی" : "ارتقا به مدیر کل"
                        }
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        <span>{isAdmin ? "تنزل" : "ارتقا"}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}

      {/* بخش ۴: مدال تایید تغییر نقش (Bottom-Sheet در موبایل / Modal در دسکتاپ) */}
      <AnimatePresence>
        {roleModalUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRoleModalUser(null)}
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

              {/* هدر مدال */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3 py-1 text-[11px] font-extrabold text-[#FF8A00]">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  تغییر سطح دسترسی
                </span>

                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] transition-colors hover:text-[#14151A] active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* محتوای مدال */}
              <div className="mt-5 text-right">
                <h3 className="text-base font-extrabold text-[#14151A]">
                  تغییر نقش کاربری
                </h3>
                <p className="mt-2 text-xs leading-relaxed font-medium text-[#8E929F]">
                  آیا از تغییر نقش{" "}
                  <span className="mx-0.5 inline-flex items-center rounded-full bg-[#EEF2FF] px-2.5 py-0.5 font-extrabold text-[#3B5BDB]">
                    {roleModalUser.name || roleModalUser.username || "کاربر"}
                  </span>{" "}
                  به{" "}
                  <span
                    className={`mx-0.5 inline-flex items-center rounded-full px-2.5 py-0.5 font-extrabold ${
                      roleModalUser.role === "ADMIN"
                        ? "bg-[#F8F7F4] text-[#14151A]"
                        : "bg-[#ECFDF5] text-[#059669]"
                    }`}
                  >
                    {roleModalUser.role === "ADMIN"
                      ? "کاربر عادی (USER)"
                      : "مدیر کل (ADMIN)"}
                  </span>{" "}
                  اطمینان دارید؟
                </p>
              </div>

              {/* دکمه‌های عملیات مدال */}
              <div className="mt-6 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="flex-1 rounded-full bg-[#F8F7F4] py-3 text-xs font-bold text-[#14151A] transition-colors hover:bg-[#EFECE6] active:scale-95"
                >
                  انصراف
                </button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  disabled={isChangingRole}
                  onClick={handleChangeRole}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FFCC00] py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isChangingRole ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                      <span>در حال اعمال...</span>
                    </>
                  ) : (
                    <span>تأیید تغییر نقش</span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
