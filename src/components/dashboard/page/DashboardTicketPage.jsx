"use client";

import React, { useMemo, useState } from "react";
import {
  MessageSquare,
  User,
  Building2,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  X,
  Flag,
  CornerDownLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAllTickets,
  useSetTicketAnswer,
  useTicketAnswer,
} from "@/hooks/useTickets";

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

const priorityConfig = {
  1: { label: "عادی", className: "bg-[#EEF2FF] text-[#3B5BDB]" },
  2: { label: "مهم", className: "bg-[#FFF4E5] text-[#FF8A00]" },
  3: {
    label: "فوری",
    className: "border border-[#FFE0E3] bg-[#FFF2F2] text-[#E11D48]",
  },
};

function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || {
    label: "عادی",
    className: "bg-[#F8F7F4] text-[#8E929F]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${config.className}`}
    >
      <Flag className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function TicketStatus({ answered }) {
  if (answered) {
    return (
      <span className="inline-flex text-nowrap items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
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

const formatDate = (date) => {
  if (!date) return "---";
  return new Date(date).toLocaleDateString("fa-IR");
};

const getUserName = (ticket) =>
  ticket?.user?.name ||
  ticket?.user?.username ||
  ticket?.user?.email ||
  "کاربر";

const getDepartmentName = (ticket) => ticket?.department?.title || "عمومی";

const getCourseName = (ticket) => {
  if (!ticket?.course) return null;
  if (typeof ticket.course === "string") return ticket.course;
  return ticket.course?.name || ticket.course?.title || null;
};

const getTicketsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.tickets)) return data.tickets;
  if (Array.isArray(data?.allTickets)) return data.allTickets;
  if (Array.isArray(data?.mainTickets)) return data.mainTickets;
  if (Array.isArray(data?.allTickets?.tickets)) return data.allTickets.tickets;
  return [];
};

const getAnswersFromResponse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.answers)) return data.answers;
  if (Array.isArray(data?.ticketAnswers)) return data.ticketAnswers;
  if (Array.isArray(data?.answerTickets)) return data.answerTickets;
  if (Array.isArray(data?.tickets)) return data.tickets;
  if (data?.answerTicket) return [data.answerTicket];
  if (data?.ticketAnswer) return [data.ticketAnswer];
  if (data?._id) return [data];
  return [];
};

// ============================================================================
// ۱. مدال مشاهده جزئیات تیکت
// ============================================================================
function TicketDetailsModal({ ticket, onClose, onAnswer }) {
  const { data: answerData, isLoading: isLoadingAnswers } = useTicketAnswer(
    ticket?._id,
  );

  const answers = useMemo(
    () => getAnswersFromResponse(answerData),
    [answerData],
  );

  if (!ticket) return null;

  const isAnswered = Number(ticket.answer) === 1;

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

        {/* هدر مدال */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <TicketStatus answered={isAnswered} />
            <PriorityBadge priority={ticket.priority} />
            <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[10px] font-bold text-[#3B5BDB]">
              {getDepartmentName(ticket)}
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

        {/* متن تیکت کاربر */}
        <div className="mt-5 rounded-2xl bg-[#F8F7F4] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#14151A]">
              {ticket.title}
            </span>
            <span className="text-[10px] font-bold text-[#8E929F]">
              {getUserName(ticket)} • {formatDate(ticket.createdAt)}
            </span>
          </div>
          <p className="whitespace-pre-line text-xs leading-7 font-medium text-[#14151A]/85">
            {ticket.body}
          </p>
        </div>

        {/* لیست پاسخ‌ها */}
        <div className="mt-5 space-y-2.5">
          <span className="block text-xs font-bold text-[#14151A]">
            پاسخ‌های ثبت‌شده ({answers.length})
          </span>

          {isLoadingAnswers ? (
            <div className="rounded-2xl bg-[#F8F7F4] py-6 text-center text-xs font-bold text-[#FF8A00]">
              در حال بارگذاری پاسخ‌ها...
            </div>
          ) : answers.length === 0 ? (
            <div className="rounded-2xl bg-[#F8F7F4] py-6 text-center text-xs font-semibold text-[#8E929F]">
              هنوز پاسخی ثبت نشده است
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

        {/* دکمه‌های پایین مدال */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#F8F7F4] px-5 py-3 text-xs font-bold text-[#8E929F] hover:text-[#14151A]"
          >
            بستن
          </button>

          <button
            type="button"
            onClick={() => onAnswer(ticket)}
            className="inline-flex items-center gap-2 rounded-full bg-[#FFCC00] px-6 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] hover:bg-[#FFD633]"
          >
            <span>{isAnswered ? "پاسخ مجدد" : "ثبت پاسخ"}</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// ۲. مدال ارسال پاسخ به تیکت
// ============================================================================
function AnswerTicketModal({ ticket, onClose }) {
  const [title, setTitle] = useState(
    ticket?.title ? `پاسخ: ${ticket.title}` : "",
  );
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { mutateAsync: setTicketAnswer, isPending } = useSetTicketAnswer();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim() || !body.trim()) {
      setErrorMessage("عنوان و متن پاسخ الزامی است.");
      return;
    }

    try {
      await setTicketAnswer({
        title: title.trim(),
        body: body.trim(),
        ticketID: ticket._id,
      });
      onClose();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "خطا در ارسال پاسخ به تیکت.",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#14151A]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      dir="rtl"
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 360, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px]"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E4E0] sm:hidden" />

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-extrabold text-[#3B5BDB]">
            <Send className="h-3.5 w-3.5" />
            پاسخ به تیکت
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] hover:text-[#14151A]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#14151A]">
              عنوان پاسخ
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان پاسخ..."
              className="w-full rounded-2xl border border-transparent bg-[#F8F7F4] px-4 py-3.5 text-xs font-semibold text-[#14151A] outline-none transition-all focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#14151A]">
              متن پاسخ
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="پاسخ خود را برای کاربر بنویسید..."
              className="w-full resize-none rounded-2xl border border-transparent bg-[#F8F7F4] p-4 text-xs leading-6 font-semibold text-[#14151A] outline-none transition-all focus:border-[#FF8A00]/40 focus:bg-white focus:ring-4 focus:ring-[#FFF4E5]"
              autoFocus
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-4 py-3 text-xs font-extrabold text-[#E11D48]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#F8F7F4] px-5 py-3 text-xs font-bold text-[#8E929F] hover:text-[#14151A]"
            >
              انصراف
            </button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-[#FFCC00] px-6 py-3 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] hover:bg-[#FFD633] disabled:opacity-50"
            >
              {isPending ? (
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
  );
}

// ============================================================================
// ۳. صفحه اصلی مدیریت تیکت‌ها (مینیمال و یکپارچه با سایر صفحات)
// ============================================================================
export default function DashboardTicketsPage() {
  const { data, isLoading, isError } = useAllTickets();
  const tickets = useMemo(() => getTicketsFromResponse(data), [data]);

  // فیلتر سریع بالای صفحه (all | pending | answered)
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [answerTicket, setAnswerTicket] = useState(null);

  const answeredCount = useMemo(
    () => tickets.filter((t) => Number(t?.answer) === 1).length,
    [tickets],
  );
  const pendingCount = tickets.length - answeredCount;

  const filteredTickets = useMemo(() => {
    if (activeFilter === "answered") {
      return tickets.filter((t) => Number(t?.answer) === 1);
    }
    if (activeFilter === "pending") {
      return tickets.filter((t) => Number(t?.answer) !== 1);
    }
    return tickets;
  }, [tickets, activeFilter]);

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* بخش ۱: هدر صفحه یکپارچه با صفحات کامنت‌ها و نوتیفیکیشن‌ها */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] shadow-sm">
            <MessageSquare className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[#14151A] sm:text-xl">
                مدیریت تیکت‌ها
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                {answeredCount} پاسخ داده شده
              </span>

              {pendingCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                  {pendingCount} منتظر پاسخ
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
              بررسی و پاسخگویی به درخواست‌های پشتیبانی کاربران
            </p>
          </div>
        </div>
      </div>

      {/* بخش ۲: ۳ کارت Overview برای فیلتر سریع (مشابه Courses Overview در تصویر اول) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* همه تیکت‌ها */}
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            activeFilter === "all"
              ? "bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)]"
              : "bg-white text-[#14151A] shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] hover:bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                activeFilter === "all"
                  ? "bg-white text-[#14151A]"
                  : "bg-[#FFF4E5] text-[#FF8A00]"
              }`}
            >
              {tickets.length}
            </div>
            <div>
              <p className="text-sm font-extrabold">همه تیکت‌ها</p>
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  activeFilter === "all" ? "text-white/60" : "text-[#8E929F]"
                }`}
              >
                نمایش کل درخواست‌ها
              </p>
            </div>
          </div>
        </button>

        {/* پاسخ داده شده */}
        <button
          type="button"
          onClick={() => setActiveFilter("answered")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            activeFilter === "answered"
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
                  activeFilter === "answered"
                    ? "text-white/60"
                    : "text-[#8E929F]"
                }`}
              >
                تیکت‌های بررسی شده
              </p>
            </div>
          </div>
        </button>

        {/* منتظر پاسخ */}
        <button
          type="button"
          onClick={() => setActiveFilter("pending")}
          className={`flex items-center justify-between rounded-[26px] p-5 text-right transition-all duration-200 active:scale-[0.98] ${
            activeFilter === "pending"
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
                  activeFilter === "pending"
                    ? "text-white/60"
                    : "text-[#8E929F]"
                }`}
              >
                نیازمند پاسخگویی
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* بخش ۳: وضعیت‌های Loading / Error / Empty و لیست تیکت‌ها */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
            <span>در حال دریافت تیکت‌ها...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-8 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
            <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-extrabold text-[#E11D48]">
            دریافت تیکت‌ها از سرور با خطا مواجه شد
          </p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-16 text-center shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)]">
          <span className="mb-3 rounded-full bg-[#EEF2FF] px-3.5 py-1 text-[11px] font-bold text-[#3B5BDB]">
            بدون تیکت
          </span>
          <p className="text-xs font-semibold text-[#8E929F]">
            در این بخش هیچ تیکتی وجود ندارد
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
            {filteredTickets.map((ticket) => {
              const isAnswered = Number(ticket.answer) === 1;
              const isUrgent = Number(ticket.priority) >= 3;

              return (
                <motion.div
                  key={ticket._id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.05)]"
                >
                  <span
                    className={`absolute right-0 top-4 bottom-4 w-1 rounded-l-full ${
                      isAnswered
                        ? "bg-[#059669]"
                        : isUrgent
                          ? "bg-[#E11D48]"
                          : "bg-[#FF8A00]"
                    }`}
                  />

                  <div className="mb-3 flex items-center justify-between gap-2 pr-2">
                    <div className="flex items-center gap-1.5">
                      <TicketStatus answered={isAnswered} />
                      <PriorityBadge priority={ticket.priority} />
                    </div>

                    <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[10px] font-bold text-[#3B5BDB]">
                      {getDepartmentName(ticket)}
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
                    <span className="text-xs font-extrabold text-[#14151A]">
                      {getUserName(ticket)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(ticket)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] active:scale-90"
                        title="مشاهده"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setAnswerTicket(ticket)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-3.5 py-1.5 text-[11px] font-extrabold text-[#14151A] shadow-2xs active:scale-95"
                      >
                        <Send className="h-3 w-3" />
                        <span>{isAnswered ? "پاسخ مجدد" : "پاسخ"}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 💻 نمای دسکتاپ: دقیقاً مشابه جدول My Courses در تصویر رفرنس */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 px-6 pb-3 text-[11px] font-extrabold text-[#14151A]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">عنوان تیکت</div>
              <div className="col-span-2">کاربر</div>
              <div className="col-span-2">دپارتمان</div>
              <div className="col-span-1 text-center">اولویت</div>
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
                const courseName = getCourseName(ticket);

                return (
                  <motion.div
                    key={ticket._id}
                    variants={itemVariants}
                    className="grid grid-cols-12 items-center gap-2 px-4 py-4 text-xs transition-colors hover:bg-[#F8F7F4]/60"
                  >
                    {/* ۱. ردیف */}
                    <div className="col-span-1 text-center font-bold text-[#8E929F]">
                      {idx + 1}
                    </div>

                    {/* ۲. عنوان و متن تیکت */}
                    <div
                      onClick={() => setSelectedTicket(ticket)}
                      className="col-span-4 flex cursor-pointer items-center gap-3 pl-2"
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

                    {/* ۳. کاربر */}
                    <div className="col-span-2 min-w-0">
                      <p className="truncate font-extrabold text-[#14151A]">
                        {getUserName(ticket)}
                      </p>
                      <span className="text-[10px] font-semibold text-[#8E929F]">
                        {courseName || formatDate(ticket.createdAt)}
                      </span>
                    </div>

                    {/* ۴. دپارتمان */}
                    <div className="col-span-2">
                      <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-[#3B5BDB]">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {getDepartmentName(ticket)}
                        </span>
                      </span>
                    </div>

                    {/* ۵. اولویت */}
                    <div className="col-span-1 flex justify-center">
                      <PriorityBadge priority={ticket.priority} />
                    </div>

                    {/* ۶. وضعیت */}
                    <div className="col-span-1 flex justify-center">
                      <TicketStatus answered={isAnswered} />
                    </div>

                    {/* ۷. عملیات */}
                    <div className="col-span-1 flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(ticket)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB] transition-all hover:bg-[#3B5BDB] hover:text-white active:scale-90"
                        title="مشاهده"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.2} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setAnswerTicket(ticket)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF4E5] text-[#FF8A00] transition-all hover:bg-[#FF8A00] hover:text-white active:scale-90"
                        title="ثبت پاسخ"
                      >
                        <Send className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}

      {/* مدال‌ها */}
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onAnswer={(ticket) => {
              setSelectedTicket(null);
              setAnswerTicket(ticket);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {answerTicket && (
          <AnswerTicketModal
            ticket={answerTicket}
            onClose={() => setAnswerTicket(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
