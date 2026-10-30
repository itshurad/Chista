"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Send,
  X,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Eye,
  Building2,
  BookOpen,
  CornerDownLeft,
  ChevronLeft,
} from "lucide-react";

import {
  useAllTickets,
  useCreateTicket,
  useTicketAnswer,
} from "@/hooks/useTickets";
import { useDepartments } from "@/hooks/useDepartments";
import { useOrders } from "@/hooks/useOrders";

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

const formatDate = (date) => {
  if (!date) return "---";
  try {
    return new Date(date).toLocaleDateString("fa-IR");
  } catch {
    return "---";
  }
};

function TicketStatus({ answered }) {
  if (answered) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
        پاسخ داده شده
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3 py-1 text-[10px] font-extrabold text-[#FF8A00]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
      منتظر پاسخ
    </span>
  );
}

// ============================================================================
// مدال مشاهده تاریخچه تیکت
// ============================================================================
function TicketDetailsModal({ ticket, onClose }) {
  const { data: answerData, isLoading: isLoadingAnswers } = useTicketAnswer(
    ticket?._id,
  );

  const answers = useMemo(() => {
    if (!answerData) return [];
    if (Array.isArray(answerData)) return answerData;
    if (Array.isArray(answerData?.answers)) return answerData.answers;
    if (Array.isArray(answerData?.ticketAnswers))
      return answerData.ticketAnswers;
    if (answerData?.answerTicket) return [answerData.answerTicket];
    return [];
  }, [answerData]);

  if (!ticket) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#14151A]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      dir="rtl"
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 360, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px]"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E4E0] sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <TicketStatus answered={Number(ticket.answer) === 1} />
            <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-extrabold text-[#3B5BDB]">
              {ticket.department?.title || "پشتیبانی"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] hover:text-[#14151A]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-[#F8F7F4] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#14151A]">
              {ticket.title}
            </span>
            <span className="text-[10px] font-bold text-[#8E929F]">
              {formatDate(ticket.createdAt)}
            </span>
          </div>
          <p className="whitespace-pre-line text-xs leading-7 font-medium text-[#14151A]/85">
            {ticket.body}
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          <span className="block text-xs font-bold text-[#14151A]">
            پاسخ‌های تیم پشتیبانی
          </span>

          {isLoadingAnswers ? (
            <div className="rounded-2xl bg-[#F8F7F4] py-6 text-center text-xs font-bold text-[#FF8A00]">
              در حال بارگذاری پاسخ‌ها...
            </div>
          ) : answers.length === 0 ? (
            <div className="rounded-2xl bg-[#F8F7F4] py-6 text-center text-xs font-semibold text-[#8E929F]">
              هنوز پاسخی ثبت نشده است. کارشناسان ما به زودی بررسی خواهند کرد.
            </div>
          ) : (
            answers.map((ans, idx) => (
              <div
                key={ans._id || idx}
                className="rounded-2xl bg-[#ECFDF5] p-4 text-xs"
              >
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-extrabold text-[#059669]">
                  <span className="inline-flex items-center gap-1">
                    <CornerDownLeft className="h-3.5 w-3.5" />
                    {ans.title || "پاسخ پشتیبانی"}
                  </span>
                  <span>{formatDate(ans.createdAt)}</span>
                </div>
                <p className="whitespace-pre-line leading-6 font-semibold text-[#14151A]">
                  {ans.body}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#F8F7F4] px-6 py-3 text-xs font-bold text-[#8E929F] hover:text-[#14151A]"
          >
            بستن
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// صفحه اصلی تیکت‌های دانشجو
// ============================================================================
export default function UserTicketsPage() {
  const { data, isLoading, isError } = useAllTickets();
  const tickets = useMemo(() => {
    const raw =
      data?.tickets || data?.allTickets || data?.mainTickets || data || [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | ANSWERED | PENDING
  const [selectedTicket, setSelectedTicket] = useState(null);

  const answeredCount = useMemo(
    () => tickets.filter((t) => Number(t?.answer) === 1).length,
    [tickets],
  );
  const pendingCount = tickets.length - answeredCount;

  const filteredTickets = useMemo(() => {
    if (statusFilter === "ANSWERED") {
      return tickets.filter((t) => Number(t?.answer) === 1);
    }
    if (statusFilter === "PENDING") {
      return tickets.filter((t) => Number(t?.answer) !== 1);
    }
    return tickets;
  }, [tickets, statusFilter]);

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <MessageSquare className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                تیکت‌های پشتیبانی من
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
              ارسال سوالات فنی و پیگیری وضعیت درخواست‌ها از مدرسین و پشتیبانی
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/tickets/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>ارسال تیکت جدید</span>
        </Link>
      </div>

      {/* کارت‌های Overview برای فیلتر سریع */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
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
              {tickets.length}
            </div>
            <div>
              <p className="text-sm font-extrabold">کل تیکت‌ها</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  statusFilter === "ALL" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                همه درخواست‌های من
              </p>
            </div>
          </div>
        </button>

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
                بررسی شده توسط پشتیبانی
              </p>
            </div>
          </div>
        </button>

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
              <p className="text-sm font-extrabold">منتظر پاسخ</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  statusFilter === "PENDING"
                    ? "text-white/60"
                    : "text-[#8E929F]"
                }`}
              >
                در صف بررسی
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* وضعیت‌ها و لیست */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-sm">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت تیکت‌ها...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-10 text-center">
          <AlertCircle className="mb-2.5 h-6 w-6 text-[#E11D48]" />
          <p className="text-xs font-extrabold text-[#E11D48]">
            خطا در دریافت لیست تیکت‌ها
          </p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-sm">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            بدون تیکت
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            هنوز هیچ تیکتی ثبت نکرده‌اید
          </p>
          <Link
            href="/dashboard/tickets/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-6 py-2.5 text-xs font-extrabold text-[#14151A] shadow-sm"
          >
            <span>ثبت اولین تیکت</span>
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      ) : (
        <>
          {/* موبایل */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3.5 lg:hidden"
          >
            {filteredTickets.map((ticket) => {
              const isAnswered = Number(ticket.answer) === 1;

              return (
                <motion.div
                  key={ticket._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.05)]"
                >
                  <span
                    className={`absolute right-0 top-4 bottom-4 w-1 rounded-l-full ${
                      isAnswered ? "bg-[#059669]" : "bg-[#FF8A00]"
                    }`}
                  />

                  <div className="mb-3 flex items-center justify-between gap-2 pr-2">
                    <TicketStatus answered={isAnswered} />
                    <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[10px] font-bold text-[#3B5BDB]">
                      {ticket.department?.title || "پشتیبانی"}
                    </span>
                  </div>

                  <div
                    onClick={() => setSelectedTicket(ticket)}
                    className="cursor-pointer pr-2"
                  >
                    <h3 className="truncate text-sm font-extrabold text-[#14151A]">
                      {ticket.title || "بدون عنوان"}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed font-medium text-[#8E929F]">
                      {ticket.body || "بدون متن"}
                    </p>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between border-t border-[#F4F3F0] pt-3 pr-2">
                    <span className="text-[10px] font-semibold text-[#8E929F]">
                      {formatDate(ticket.createdAt)}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedTicket(ticket)}
                      className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-4 py-2 text-[11px] font-extrabold text-[#3B5BDB]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>مشاهده و پاسخ‌ها</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* دسکتاپ */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">عنوان و متن تیکت</div>
              <div className="col-span-2">دپارتمان</div>
              <div className="col-span-2 text-center">تاریخ ثبت</div>
              <div className="col-span-1 text-center">وضعیت</div>
              <div className="col-span-1 text-center">عملیات</div>
            </div>

            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F3F0] overflow-hidden rounded-[28px] bg-white px-2 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)]"
            >
              {filteredTickets.map((ticket, idx) => {
                const isAnswered = Number(ticket.answer) === 1;

                return (
                  <motion.div
                    key={ticket._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center gap-2 px-4 py-4 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    <div className="col-span-1 text-center font-bold text-[#8E929F]">
                      {idx + 1}
                    </div>

                    <div
                      onClick={() => setSelectedTicket(ticket)}
                      className="col-span-5 flex cursor-pointer items-center gap-3 pl-2"
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
                        <p className="truncate font-extrabold text-[#14151A]">
                          {ticket.title || "بدون عنوان"}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-[#8E929F]">
                          {ticket.body || "بدون متن"}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-[#3B5BDB]">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {ticket.department?.title || "پشتیبانی"}
                        </span>
                      </span>
                    </div>

                    <div className="col-span-2 text-center text-[11px] font-semibold text-[#8E929F]">
                      {formatDate(ticket.createdAt)}
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <TicketStatus answered={isAnswered} />
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(ticket)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                        title="مشاهده جزئیات"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.2} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
