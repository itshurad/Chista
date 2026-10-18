"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Trash2,
  Send,
  X,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  useAllContacts,
  useAnswerContact,
  useDeleteContact,
} from "@/hooks/useContacts";

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 340,
      damping: 28,
    },
  },
};

const formatDate = (date) => {
  if (!date) return "---";
  return new Date(date).toLocaleDateString("fa-IR");
};

function DashboardContactPage() {
  const { data, isLoading, isError } = useAllContacts();

  const contacts = useMemo(() => {
    const raw = data?.contacts || data?.allContacts || data || [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();
  const { mutateAsync: answerContact, isPending: isAnswering } =
    useAnswerContact();

  // فیلتر سریع بالای صفحه (ALL | ANSWERED | PENDING)
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [answer, setAnswer] = useState("");

  const answeredCount = useMemo(
    () => contacts.filter((c) => Number(c.answer) === 1).length,
    [contacts],
  );
  const pendingCount = contacts.length - answeredCount;

  const filteredContacts = useMemo(() => {
    if (statusFilter === "ANSWERED") {
      return contacts.filter((c) => Number(c.answer) === 1);
    }
    if (statusFilter === "PENDING") {
      return contacts.filter((c) => Number(c.answer) !== 1);
    }
    return contacts;
  }, [contacts, statusFilter]);

  const openContactModal = (contact) => {
    setSelectedContact(contact);
    setAnswer("");
  };

  const closeContactModal = () => {
    if (isAnswering) return;
    setSelectedContact(null);
    setAnswer("");
  };

  const handleAnswer = async (e) => {
    e.preventDefault();
    if (!selectedContact || !answer.trim()) return;

    try {
      await answerContact({
        id: selectedContact._id,
        email: selectedContact.email,
        answer: answer.trim(),
      });

      closeContactModal();
    } catch (error) {
      console.error("خطا در پاسخ به پیام:", error);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteContact(deleteTarget._id, {
      onSettled: () => {
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* ========================================================= */}
      {/* بخش ۱: هدر صفحه یکپارچه با سایر صفحات داشبورد */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <MessageSquare className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                پیام‌های ارتباط با ما
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {answeredCount} پاسخ داده شده
              </span>

              {pendingCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                  {pendingCount} در انتظار پاسخ
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              مدیریت و پاسخگویی ایمیلی به پیام‌های ارسالی کاربران
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* بخش ۲: ۳ کارت Overview برای فیلتر سریع (مشابه صفحه تیکت‌ها و دوره‌ها) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* همه پیام‌ها */}
        <button
          type="button"
          onClick={() => setStatusFilter("ALL")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            statusFilter === "ALL"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                statusFilter === "ALL"
                  ? "bg-white text-[#14151A]"
                  : "bg-[#FFF4E5] text-[#FF8A00]"
              }`}
            >
              {contacts.length}
            </div>
            <div>
              <p className="text-sm font-extrabold">همه پیام‌ها</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  statusFilter === "ALL" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                کل درخواست‌های ثبت‌شده
              </p>
            </div>
          </div>
        </button>

        {/* پاسخ داده شده */}
        <button
          type="button"
          onClick={() => setStatusFilter("ANSWERED")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            statusFilter === "ANSWERED"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-sm font-extrabold text-[#059669]">
              {answeredCount}
            </div>
            <div>
              <p className="text-sm font-extrabold">پاسخ داده شده</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  statusFilter === "ANSWERED"
                    ? "text-white/60"
                    : "text-[#8E929F]"
                }`}
              >
                ارسال‌شده به ایمیل کاربر
              </p>
            </div>
          </div>
        </button>

        {/* در انتظار پاسخ */}
        <button
          type="button"
          onClick={() => setStatusFilter("PENDING")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            statusFilter === "PENDING"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
              {pendingCount}
            </div>
            <div>
              <p className="text-sm font-extrabold">در انتظار پاسخ</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  statusFilter === "PENDING"
                    ? "text-white/60"
                    : "text-[#8E929F]"
                }`}
              >
                نیازمند بررسی و پاسخگویی
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* ========================================================= */}
      {/* بخش ۳: وضعیت‌های Loading / Error / Empty و لیست پیام‌ها */}
      {/* ========================================================= */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت پیام‌ها...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-8 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            خطا در دریافت پیام‌های ارتباط با ما
          </p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            بدون پیام
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            در این بخش هیچ پیامی ثبت نشده است
          </p>
        </div>
      ) : (
        <>
          {/* 📱 نمای موبایل (Mobile-First Cards) */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3.5 lg:hidden"
          >
            {filteredContacts.map((contact) => {
              const isAnswered = Number(contact.answer) === 1;

              return (
                <motion.div
                  key={contact._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.05)]"
                >
                  {/* نوار عمودی سبز/نارنجی کنار کارت */}
                  <span
                    className={`absolute right-0 top-4 bottom-4 w-1 rounded-l-full ${
                      isAnswered ? "bg-[#059669]" : "bg-[#FF8A00]"
                    }`}
                  />

                  {/* هدر کارت موبایل */}
                  <div className="mb-3 flex items-center justify-between gap-2 pr-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                        isAnswered
                          ? "bg-[#ECFDF5] text-[#059669]"
                          : "bg-[#FFF4E5] text-[#FF8A00]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isAnswered ? "bg-[#059669]" : "bg-[#FF8A00]"
                        }`}
                      />
                      {isAnswered ? "پاسخ داده شده" : "در انتظار پاسخ"}
                    </span>

                    <span className="text-[10px] font-semibold text-[#8E929F]">
                      {formatDate(contact.createdAt)}
                    </span>
                  </div>

                  {/* عنوان و خلاصه متن پیام */}
                  <div
                    onClick={() => openContactModal(contact)}
                    className="cursor-pointer pr-2"
                  >
                    <h3 className="truncate text-sm font-extrabold text-[#14151A]">
                      {contact.title || "بدون عنوان"}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed font-medium text-[#8E929F]">
                      {contact.body || "بدون متن"}
                    </p>
                  </div>

                  {/* فوتر کارت موبایل: فرستنده + اکشن‌ها */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-[#F4F3F0] pt-3 pr-2">
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-extrabold text-[#14151A]">
                        {contact.name || "کاربر"}
                      </span>
                      <span
                        dir="ltr"
                        className="block truncate   text-[10px] font-semibold text-[#8E929F]"
                      >
                        {contact.email || contact.phone || "---"}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openContactModal(contact)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-transform active:scale-95 ${
                          isAnswered
                            ? "bg-[#EEF2FF] text-[#3B5BDB]"
                            : "bg-[#FFCC00] text-[#14151A] shadow-2xs"
                        }`}
                      >
                        {isAnswered ? (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            <span>مشاهده</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3" />
                            <span>پاسخ</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(contact)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-transform active:scale-90"
                        title="حذف"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 💻 نمای دسکتاپ: دقیقاً مشابه جدول صفحات قبلی داشبورد */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">عنوان و متن پیام</div>
              <div className="col-span-2">فرستنده</div>
              <div className="col-span-2">اطلاعات تماس</div>
              <div className="col-span-2 text-center">وضعیت</div>
              <div className="col-span-1 text-center">تاریخ</div>
              <div className="col-span-1 text-center">عملیات</div>
            </div>

            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]"
            >
              {filteredContacts.map((contact, index) => {
                const isAnswered = Number(contact.answer) === 1;

                return (
                  <motion.div
                    key={contact._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center gap-2 px-4 py-4 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    {/* ۱. ردیف */}
                    <div className="col-span-1 text-center font-bold text-[#8E929F]">
                      {index + 1}
                    </div>

                    {/* ۲. عنوان و خلاصه متن پیام */}
                    <div
                      onClick={() => openContactModal(contact)}
                      className="col-span-3 flex cursor-pointer items-center gap-3 pl-2"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isAnswered
                            ? "bg-[#ECFDF5] text-[#059669]"
                            : "bg-[#FFF4E5] text-[#FF8A00]"
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold text-[#14151A] transition-colors hover:text-[#FF8A00]">
                          {contact.title || "بدون عنوان"}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-[#8E929F]">
                          {contact.body || "---"}
                        </p>
                      </div>
                    </div>

                    {/* ۳. نام فرستنده */}
                    <div className="col-span-2 flex min-w-0 items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB]">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate font-extrabold text-[#14151A]">
                        {contact.name || "---"}
                      </span>
                    </div>

                    {/* ۴. اطلاعات تماس (ایمیل و تلفن) */}
                    <div className="col-span-2 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#14151A]">
                        <Mail className="h-3 w-3 shrink-0 text-[#3B5BDB]" />
                        <span dir="ltr" className="truncate  ">
                          {contact.email || "---"}
                        </span>
                      </div>

                      {contact.phone && (
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#8E929F]">
                          <Phone className="h-3 w-3 shrink-0 text-[#059669]" />
                          <span dir="ltr" className=" ">
                            {contact.phone}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ۵. بج وضعیت */}
                    <div className="col-span-2 flex justify-center">
                      {isAnswered ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
                          <CheckCircle2 className="h-3 w-3" />
                          پاسخ داده شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3 py-1 text-[10px] font-extrabold text-[#FF8A00]">
                          <Clock3 className="h-3 w-3" />
                          در انتظار پاسخ
                        </span>
                      )}
                    </div>

                    {/* ۶. تاریخ ثبت */}
                    <div className="col-span-1 text-center text-[11px] font-semibold text-[#8E929F]">
                      {formatDate(contact.createdAt)}
                    </div>

                    {/* ۷. اکشن‌های دایره‌ای رنگی */}
                    <div className="col-span-1 flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openContactModal(contact)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-90 ${
                          isAnswered
                            ? "bg-[#EEF2FF] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white"
                            : "bg-[#FFF4E5] text-[#FF8A00] hover:bg-[#FF8A00] hover:text-white"
                        }`}
                        title={isAnswered ? "مشاهده و پاسخ مجدد" : "پاسخ به پیام"}
                      >
                        {isAnswered ? (
                          <Eye className="h-4 w-4" strokeWidth={2.2} />
                        ) : (
                          <Send className="h-3.5 w-3.5" strokeWidth={2.2} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(contact)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-90"
                        title="حذف پیام"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* بخش ۴: مدال مشاهده کامل پیام و ارسال پاسخ ایمیلی */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeContactModal}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#14151A]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px]"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E4E0] sm:hidden" />

              {/* هدر مدال */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3 py-1 text-[11px] font-extrabold text-[#FF8A00]">
                    <Send className="h-3 w-3" />
                    مشاهده و پاسخ به پیام
                  </span>

                  {Number(selectedContact.answer) === 1 && (
                    <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-extrabold text-[#059669]">
                      پاسخ داده شده
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={closeContactModal}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] transition-colors hover:text-[#14151A]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* مشخصات فرستنده و متن پیام */}
              <div className="mt-5 rounded-[24px] bg-[#F8F7F4] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE8E1] pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#14151A]">
                      {selectedContact.name || "کاربر"}
                    </h3>
                    <p
                      dir="ltr"
                      className="mt-0.5 text-right   text-[11px] font-bold text-[#3B5BDB]"
                    >
                      {selectedContact.email}
                    </p>
                  </div>

                  {selectedContact.phone && (
                    <span
                      dir="ltr"
                      className="rounded-full bg-white px-3 py-1   text-[11px] font-bold text-[#14151A] shadow-2xs"
                    >
                      {selectedContact.phone}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-xs font-extrabold text-[#14151A]">
                    {selectedContact.title || "بدون عنوان"}
                  </p>
                  <p className="mt-1.5 whitespace-pre-line text-xs leading-7 font-medium text-[#14151A]/85">
                    {selectedContact.body || "بدون متن"}
                  </p>
                </div>
              </div>

              {/* فرم ارسال پاسخ */}
              <form onSubmit={handleAnswer} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#14151A]">
                      متن پاسخ ارسالی به ایمیل
                    </label>
                    <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                      ارسال مستقیم
                    </span>
                  </div>

                  <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    rows={4}
                    placeholder="متن پاسخ خود را برای ارسال به ایمیل کاربر وارد کنید..."
                    className="w-full resize-none rounded-2xl border border-transparent bg-[#F8F7F4] p-4 text-xs leading-6 font-semibold text-[#14151A] outline-none transition-all placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={closeContactModal}
                    disabled={isAnswering}
                    className="rounded-full bg-[#F8F7F4] px-5 py-3 text-xs font-bold text-[#8E929F] transition-colors hover:bg-[#EFECE6] hover:text-[#14151A] disabled:opacity-50"
                  >
                    بستن
                  </button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={isAnswering || !answer.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-6 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAnswering ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#14151A]/25 border-t-[#14151A]" />
                        <span>در حال ارسال...</span>
                      </>
                    ) : (
                      <>
                        <span>ارسال پاسخ</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* بخش ۵: مدال تایید حذف با بج قرمز مکمل (یکپارچه با سایر صفحات) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#14151A]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            dir="rtl"
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
                  حذف پیام
                </span>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] hover:text-[#14151A]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 text-right">
                <h3 className="text-base font-extrabold text-[#14151A]">
                  آیا از حذف این پیام مطمئن هستید؟
                </h3>

                <p className="mt-2 text-xs leading-relaxed font-medium text-[#8E929F]">
                  پیام{" "}
                  <span className="mx-0.5 inline-flex rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 font-extrabold text-[#E11D48]">
                    {deleteTarget.title || "بدون عنوان"}
                  </span>{" "}
                  از طرف «{deleteTarget.name}» برای همیشه حذف خواهد شد.
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
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#FECDD3] bg-[#FFF2F2] py-3 text-xs font-extrabold text-[#E11D48] transition-all hover:bg-[#E11D48] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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

export default DashboardContactPage;