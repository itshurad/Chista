"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Star,
  Headphones,
  CheckCircle2,
  Lock,
  Unlock,
  PlayCircle,
  MessageSquare,
  ChevronLeft,
  Sparkles,
  Layers,
  ShieldCheck,
  AlertCircle,
  CornerDownLeft,
  Share2,
  Check,
  Loader2,
  Send,
} from "lucide-react";

import {
  useCourse,
  useRegisterCourse,
  // useCreateComment,
} from "@/hooks/useCourses";
import { useCreateComment } from "@/hooks/useComments";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ======================================================
// Helpers
// ======================================================

const getCoverUrl = (course) => {
  if (!course) return "";

  if (course.coverUrl) return course.coverUrl;

  if (course.cover) {
    if (course.cover.startsWith("http") || course.cover.startsWith("/")) {
      return course.cover;
    }

    return `${API_URL}/courses/covers/${course.cover}`;
  }

  return "";
};

const getVideoUrl = (session) => {
  if (!session) return "";

  if (session.videoUrl) return session.videoUrl;

  if (session.video) {
    if (session.video.startsWith("http") || session.video.startsWith("/")) {
      return session.video;
    }

    return `${API_URL}/courses/videos/${session.video}`;
  }

  return "";
};

// ======================================================
// Main Page
// ======================================================

export default function SingleCoursePage() {
  const params = useParams();

  const href = decodeURIComponent(params?.href || params?.slug || "");

  const { data: courseData, isLoading, isError, refetch } = useCourse(href);
  console.log(courseData);

  const registerCourse = useRegisterCourse();
  const createComment = useCreateComment();

  // ======================================================
  // UI States
  // ======================================================

  const [activeTab, setActiveTab] = useState("sessions");
  const [activeSession, setActiveSession] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [isRegisteredState, setIsRegisteredState] = useState(false);

  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Comment states
  const [commentBody, setCommentBody] = useState("");
  const [commentScore, setCommentScore] = useState(5);
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");

  // ======================================================
  // Course Data
  // ======================================================

  const course = courseData?.course || {};

  const sessions = courseData?.sessions || course?.sessions || [];

  const comments = courseData?.comments || course?.comments || [];

  const studentCount = courseData?.courseStudentCount ?? course?.students ?? 0;

  const serverRegistered = Boolean(
    courseData?.isUserRegisterdToThisCourse ??
    courseData?.isUserRegisteredToThisCourse,
  );

  const isRegistered = isRegisteredState || serverRegistered;

  // ======================================================
  // Sync Registration State
  // ======================================================

  useEffect(() => {
    setIsRegisteredState(serverRegistered);
  }, [serverRegistered]);

  // ======================================================
  // Price
  // ======================================================

  const price = Number(course.price) || 0;

  const discount = Number(course.discount) || 0;

  const finalPrice =
    discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

  const isCompleted = course.status === "COMPLETED";

  const rating = course.courseAverageScore || course.score || 5;

  const coverUrl = getCoverUrl(course);

  // ======================================================
  // Share
  // ======================================================

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);

      setCopiedLink(true);

      setTimeout(() => {
        setCopiedLink(false);
      }, 2000);
    }
  };

  // ======================================================
  // Register Course
  // ======================================================

  const handleRegisterCourse = async () => {
    if (isRegistered) return;

    if (!course?._id) return;

    setRegisterError("");
    setRegisterSuccess("");

    try {
      await registerCourse.mutateAsync({
        courseId: course._id,
        price: finalPrice,
      });

      setIsRegisteredState(true);

      setRegisterSuccess("ثبت‌نام شما با موفقیت انجام شد.");

      await refetch();
    } catch (error) {
      console.error("Register course error:", error);

      setRegisterSuccess("");

      setRegisterError(
        error?.response?.data?.message ||
          "ثبت‌نام در دوره انجام نشد. دوباره تلاش کنید.",
      );
    }
  };

  // ======================================================
  // Create Comment
  // ======================================================

  const handleCreateComment = async (event) => {
    event.preventDefault();

    if (!isRegistered) {
      setCommentError("برای ثبت دیدگاه ابتدا باید در این دوره ثبت‌نام کنید.");
      return;
    }

    const trimmedBody = commentBody.trim();

    if (!trimmedBody) {
      setCommentError("لطفاً متن دیدگاه خود را وارد کنید.");
      return;
    }

    if (!course?.href) {
      setCommentError("شناسه دوره پیدا نشد. لطفاً صفحه را دوباره باز کنید.");
      return;
    }

    setCommentError("");
    setCommentSuccess("");

    try {
      await createComment.mutateAsync({
        body: trimmedBody,
        courseHref: course.href,
        score: commentScore,
      });

      setCommentBody("");
      setCommentScore(5);
      setCommentSuccess(
        "دیدگاه شما با موفقیت ثبت شد و پس از تأیید نمایش داده می‌شود.",
      );

      await refetch();
    } catch (error) {
      console.error("Create comment error:", error);

      setCommentError(
        error?.response?.data?.message ||
          error?.response?.data?.errors?.body ||
          "ثبت دیدگاه انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    }
  };

  // ======================================================
  // Loading
  // ======================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] pb-24 lg:pb-0" dir="rtl">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-24 shadow-sm">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
              <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
              <span>در حال دریافت اطلاعات دوره...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ======================================================
  // Error
  // ======================================================

  if (isError || !course?._id) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] pb-24 lg:pb-0" dir="rtl">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col items-center justify-center rounded-[32px] border border-[#FFE0E3] bg-[#FFF2F2] p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h2 className="text-base font-extrabold text-[#E11D48]">
              دوره مورد نظر یافت نشد یا خطایی در ارتباط رخ داده است
            </h2>

            <Link
              href="/courses"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-[#14151A] shadow-sm transition-transform active:scale-95"
            >
              <span>بازگشت به لیست دوره‌ها</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ======================================================
  // Render
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-24 lg:pb-0" dir="rtl">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="space-y-7">
          {/* =========================================================
              Breadcrumb
          ========================================================= */}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8E929F]">
              <Link href="/" className="hover:text-[#14151A]">
                خانه
              </Link>

              <ChevronLeft className="h-3.5 w-3.5 opacity-60" />

              <Link href="/courses" className="hover:text-[#14151A]">
                دوره‌ها
              </Link>

              <ChevronLeft className="h-3.5 w-3.5 opacity-60" />

              <span className="max-w-[200px] truncate rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[#14151A] shadow-sm sm:max-w-xs">
                {course.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold shadow-sm transition-colors ${
                  copiedLink
                    ? "bg-[#ECFDF5] text-[#059669]"
                    : "bg-white text-[#14151A] hover:bg-[#FFF4E5] hover:text-[#FF8A00]"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>لینک کپی شد</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-[#8E929F]" />
                    <span>اشتراک‌گذاری</span>
                  </>
                )}
              </button>

              <Link
                href="/courses"
                className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#14151A] shadow-sm transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00]"
              >
                <span>همه دوره‌ها</span>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* =========================================================
              Hero
          ========================================================= */}

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
            }}
            className="overflow-hidden rounded-[34px] bg-white p-5 shadow-[0_14px_45px_-12px_rgba(20,21,26,0.06)] sm:p-8"
          >
            <div className="grid grid-cols-1 items-center gap-7 lg:grid-cols-12">
              <div className="relative h-60 w-full overflow-hidden rounded-[26px] bg-[#F8F7F4] sm:h-80 lg:col-span-5">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={course.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#FFF4E5] to-[#EEF2FF]">
                    <BookOpen className="mb-2 h-12 w-12 text-[#FF8A00]" />

                    <span className="text-xs font-extrabold text-[#14151A]">
                      دوره تخصصی آکادمی لرن
                    </span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="absolute right-3.5 top-3.5">
                    <span className="rounded-full border border-[#FFE0E3] bg-[#FFF2F2]/95 px-3 py-1 text-xs font-extrabold text-[#E11D48] shadow-sm backdrop-blur-md">
                      {discount}% تخفیف ویژه
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between space-y-5 lg:col-span-7">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3.5 py-1.5 text-[11px] font-extrabold text-[#3B5BDB]">
                      <Layers className="h-3.5 w-3.5" />
                      {course.categoryID?.title || "برنامه‌نویسی و توسعه"}
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#059669]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        تکمیل شده
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#FF8A00]">
                        <Sparkles className="h-3.5 w-3.5" />
                        در حال پیش‌فروش
                      </span>
                    )}

                    {isRegistered && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3.5 py-1.5 text-[11px] font-extrabold text-[#059669] ring-1 ring-[#A7F3D0]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        شما دانشجوی این دوره هستید
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-3 py-1.5 text-[11px] font-extrabold text-[#14151A]">
                      <Star className="h-3.5 w-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                      {rating}
                    </span>
                  </div>

                  <div className="relative pr-4">
                    <span className="absolute bottom-1 right-0 top-1 w-1.5 rounded-full bg-[#FF8A00]" />

                    <h1 className="text-xl font-extrabold leading-snug tracking-tight text-[#14151A] sm:text-3xl">
                      {course.name}
                    </h1>
                  </div>

                  <p className="text-xs font-medium leading-7 text-[#8E929F] sm:text-sm">
                    {course.semiDescription || course.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#F4F3F0] pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF4E5] text-xs font-extrabold text-[#FF8A00]">
                      {course.creator?.name?.charAt(0) || "T"}
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-[#8E929F]">
                        مدرس دوره
                      </p>

                      <p className="text-xs font-extrabold text-[#14151A]">
                        {course.creator?.name || "مدرس آکادمی"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F7F4] px-3.5 py-2 text-xs font-bold text-[#14151A]">
                      <Headphones className="h-3.5 w-3.5 text-[#3B5BDB]" />
                      پشتیبانی: {course.support || "اختصاصی"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* =========================================================
              Overview
          ========================================================= */}

          <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
            <div className="flex items-center gap-3.5 rounded-[26px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] sm:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-sm font-extrabold text-[#FF8A00]">
                {Number(studentCount).toLocaleString("fa-IR")}
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#14151A] sm:text-sm">
                  دانشجویان دوره
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-[#8E929F]">
                  ثبت‌نام قطعی
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-[26px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-4 text-white shadow-[0_14px_34px_-10px_rgba(20,21,26,0.22)] sm:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#14151A]">
                {sessions.length}
              </div>

              <div>
                <p className="text-xs font-extrabold text-white sm:text-sm">
                  جلسات آموزشی
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-white/60">
                  ویدیوی باکیفیت
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-[26px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] sm:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3B5BDB]">
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#14151A] sm:text-sm">
                  {course.time || "در حال بروزرسانی"}
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-[#8E929F]">
                  مدت زمان آموزش
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-[26px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(20,21,26,0.04)] sm:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-sm font-extrabold text-[#059669]">
                {comments.length}
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#14151A] sm:text-sm">
                  دیدگاه ثبت‌شده
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-[#8E929F]">
                  نظرات دانشجویان
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================
              Main Content
          ========================================================= */}

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              {/* Tabs */}

              <div className="flex items-center gap-2 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_6px_24px_-8px_rgba(20,21,26,0.06)] scrollbar-none">
                {[
                  {
                    id: "sessions",
                    label: "سرفصل و جلسات دوره",
                    count: sessions.length,
                  },
                  {
                    id: "description",
                    label: "توضیحات تکمیلی",
                  },
                  {
                    id: "comments",
                    label: "دیدگاه‌های دانشجویان",
                    count: comments.length,
                  },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-1 shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-extrabold transition-all ${
                        isActive
                          ? "bg-[#FFCC00] text-[#14151A] shadow-sm"
                          : "text-[#8E929F] hover:text-[#14151A]"
                      }`}
                    >
                      <span>{tab.label}</span>

                      {tab.count !== undefined && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${
                            isActive
                              ? "bg-[#14151A] text-white"
                              : "bg-[#F8F7F4] text-[#8E929F]"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* =====================================================
                  Sessions
              ===================================================== */}

              {activeTab === "sessions" && (
                <div className="rounded-[32px] bg-white p-5 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)] sm:p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="relative pr-4">
                      <span className="absolute bottom-0.5 right-0 top-0.5 w-1.5 rounded-full bg-[#FF8A00]" />

                      <h2 className="text-base font-extrabold text-[#14151A] sm:text-lg">
                        لیست جلسات دوره
                      </h2>

                      <p className="mt-0.5 text-xs font-medium text-[#8E929F]">
                        ویدیوهای آموزشی و فایل‌های پیوست
                      </p>
                    </div>

                    <span className="rounded-full bg-[#FFF4E5] px-3 py-1 text-[11px] font-extrabold text-[#FF8A00]">
                      {sessions.length} جلسه
                    </span>
                  </div>

                  <AnimatePresence>
                    {activeSession && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        className="mb-6 overflow-hidden rounded-[24px] bg-[#14151A] p-4 text-white"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#FFCC00]">
                            در حال پخش: {activeSession.title}
                          </span>

                          <button
                            type="button"
                            onClick={() => setActiveSession(null)}
                            className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white hover:bg-white/20"
                          >
                            بستن پلیر
                          </button>
                        </div>

                        {getVideoUrl(activeSession) ? (
                          <video
                            controls
                            playsInline
                            preload="metadata"
                            className="max-h-96 w-full rounded-2xl bg-black"
                            src={getVideoUrl(activeSession)}
                          />
                        ) : (
                          <div className="flex h-48 items-center justify-center rounded-2xl bg-white/5 text-xs font-bold text-white/60">
                            پیش‌نمایش جلسه «{activeSession.title}»
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {sessions.length === 0 ? (
                    <div className="rounded-2xl bg-[#F8F7F4] py-12 text-center text-xs font-bold text-[#8E929F]">
                      هنوز جلسه‌ای برای این دوره آپلود نشده است.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F4F3F0]">
                      {sessions.map((session, idx) => {
                        const isFreeSession =
                          Number(session.free) === 1 ||
                          session.free === true ||
                          price === 0;

                        const canWatch = isRegistered || isFreeSession;

                        return (
                          <div
                            key={session._id || idx}
                            className="flex flex-col justify-between gap-3 py-4 transition-colors first:pt-1 last:pb-1 sm:flex-row sm:items-center"
                          >
                            <div className="flex items-center gap-3.5">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-extrabold ${
                                  canWatch
                                    ? "bg-[#ECFDF5] text-[#059669]"
                                    : "bg-[#F8F7F4] text-[#8E929F]"
                                }`}
                              >
                                {idx + 1}
                              </div>

                              <div>
                                <h3 className="text-xs font-extrabold text-[#14151A] sm:text-sm">
                                  {session.title || `جلسه ${idx + 1}`}
                                </h3>

                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  {session.time && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8E929F]">
                                      <Clock className="h-3 w-3 text-[#FF8A00]" />
                                      {session.time}
                                    </span>
                                  )}

                                  {isFreeSession ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                                      <Unlock className="h-3 w-3" />
                                      رایگان
                                    </span>
                                  ) : canWatch ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#3B5BDB]">
                                      <Unlock className="h-3 w-3" />
                                      باز شده
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-extrabold text-[#E11D48]">
                                      <Lock className="h-3 w-3" />
                                      مخصوص دانشجویان
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              {canWatch ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveSession(session)}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FFCC00] px-4 py-2 text-xs font-extrabold text-[#14151A] shadow-sm transition-transform active:scale-95"
                                >
                                  <PlayCircle className="h-4 w-4" />
                                  <span>مشاهده جلسه</span>
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F7F4] px-4 py-2 text-[11px] font-bold text-[#8E929F]">
                                  <Lock className="h-3.5 w-3.5" />
                                  <span>نیاز به ثبت‌نام</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =====================================================
                  Description
              ===================================================== */}

              {activeTab === "description" && (
                <div className="rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)] sm:p-8">
                  <div className="relative mb-5 pr-4">
                    <span className="absolute bottom-0.5 right-0 top-0.5 w-1.5 rounded-full bg-[#3B5BDB]" />

                    <h2 className="text-base font-extrabold text-[#14151A] sm:text-lg">
                      معرفی و توضیحات کامل دوره
                    </h2>
                  </div>

                  <div className="whitespace-pre-line text-sm font-medium leading-8 text-[#14151A]/90">
                    {course.description ||
                      "توضیحاتی برای این دوره ثبت نشده است."}
                  </div>
                </div>
              )}

              {/* =====================================================
                  Comments
              ===================================================== */}

              {activeTab === "comments" && (
                <div className="rounded-[32px] bg-white p-6 shadow-[0_14px_40px_-12px_rgba(20,21,26,0.05)] sm:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="relative pr-4">
                      <span className="absolute bottom-0.5 right-0 top-0.5 w-1.5 rounded-full bg-[#059669]" />

                      <h2 className="text-base font-extrabold text-[#14151A] sm:text-lg">
                        نظرات و دیدگاه‌های دانشجویان
                      </h2>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-extrabold text-[#059669]">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {comments.length} دیدگاه
                    </span>
                  </div>

                  {/* =================================================
                      Create Comment
                  ================================================= */}

                  {isRegistered ? (
                    <form
                      onSubmit={handleCreateComment}
                      className="mb-6 rounded-[26px] bg-[#F8F7F4] p-4 sm:p-5"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xs font-extrabold text-[#14151A] sm:text-sm">
                            نظر شما درباره این دوره چیست؟
                          </h3>

                          <p className="mt-1 text-[10px] font-medium text-[#8E929F]">
                            دیدگاه شما پس از تأیید نمایش داده می‌شود.
                          </p>
                        </div>

                        <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 shadow-sm">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setCommentScore(score)}
                              className="rounded-full p-0.5 transition-transform active:scale-90"
                              aria-label={`امتیاز ${score}`}
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  score <= commentScore
                                    ? "fill-[#FF8A00] text-[#FF8A00]"
                                    : "text-[#D7D7D7]"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={commentBody}
                        onChange={(event) => {
                          setCommentBody(event.target.value);
                          setCommentError("");
                          setCommentSuccess("");
                        }}
                        rows={4}
                        maxLength={1000}
                        placeholder="نظر خود را درباره این دوره بنویسید..."
                        className="w-full resize-none rounded-2xl border border-[#F1F0EC] bg-white px-4 py-3 text-xs font-medium leading-7 text-[#14151A] outline-none transition focus:border-[#FFCC00] focus:ring-4 focus:ring-[#FFCC00]/10"
                      />

                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-[10px] font-medium text-[#8E929F]">
                          {commentBody.length}/1000 کاراکتر
                        </span>

                        <button
                          type="submit"
                          disabled={
                            createComment.isPending || !commentBody.trim()
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFCC00] px-5 py-2.5 text-xs font-extrabold text-[#14151A] shadow-sm transition-all hover:bg-[#FFD633] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {createComment.isPending ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>در حال ارسال...</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-3.5 w-3.5" />
                              <span>ارسال دیدگاه</span>
                            </>
                          )}
                        </button>
                      </div>

                      {commentError && (
                        <div className="mt-3 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] p-3 text-xs font-bold leading-6 text-[#E11D48]">
                          {commentError}
                        </div>
                      )}

                      {commentSuccess && (
                        <div className="mt-3 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-3 text-xs font-bold leading-6 text-[#059669]">
                          {commentSuccess}
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="mb-6 flex items-center gap-3 rounded-[26px] border border-[#DCE4FF] bg-[#EEF2FF] p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#3B5BDB] shadow-sm">
                        <Lock className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-xs font-extrabold text-[#14151A]">
                          فقط دانشجویان دوره می‌توانند دیدگاه ثبت کنند.
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-[#8E929F]">
                          برای ثبت نظر ابتدا در دوره ثبت‌نام کنید.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      Comments List
                  ================================================= */}

                  {comments.length === 0 ? (
                    <div className="rounded-2xl bg-[#F8F7F4] py-12 text-center text-xs font-bold text-[#8E929F]">
                      هنوز دیدگاهی برای این دوره ثبت نشده است.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => {
                        const creatorName =
                          typeof comment.creator === "object"
                            ? comment.creator?.name ||
                              comment.creator?.username ||
                              "دانشجو"
                            : "دانشجو";

                        return (
                          <div
                            key={comment._id}
                            className="rounded-[24px] bg-[#F8F7F4] p-4 sm:p-5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-xs font-extrabold text-[#3B5BDB] shadow-sm">
                                  {creatorName.charAt(0)}
                                </div>

                                <div>
                                  <p className="text-xs font-extrabold text-[#14151A]">
                                    {creatorName}
                                  </p>

                                  <p className="text-[10px] font-semibold text-[#8E929F]">
                                    {comment.createdAt
                                      ? new Date(
                                          comment.createdAt,
                                        ).toLocaleDateString("fa-IR")
                                      : "دانشجوی دوره"}
                                  </p>
                                </div>
                              </div>

                              {comment.score && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#14151A] shadow-sm">
                                  <Star className="h-3 w-3 fill-[#FF8A00] text-[#FF8A00]" />
                                  {comment.score}
                                </span>
                              )}
                            </div>

                            <p className="mt-3 whitespace-pre-line text-xs font-semibold leading-7 text-[#14151A]">
                              {comment.body}
                            </p>

                            {comment.answerComment && (
                              <div className="mt-3 rounded-2xl border border-[#DCE4FF] bg-[#EEF2FF] p-3.5">
                                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-extrabold text-[#3B5BDB]">
                                  <CornerDownLeft className="h-3.5 w-3.5" />
                                  <span>پاسخ مدرس / پشتیبانی:</span>
                                </div>

                                <p className="text-xs font-medium leading-6 text-[#14151A]">
                                  {comment.answerComment.body}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* =====================================================
                Sidebar
            ===================================================== */}

            <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4">
              <div className="rounded-[32px] bg-gradient-to-br from-[#1E2029] via-[#232128] to-[#3B2618] p-6 text-white shadow-[0_20px_48px_-12px_rgba(20,21,26,0.28)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold text-[#FFCC00]">
                    شرایط ثبت‌نام
                  </span>

                  {isRegistered ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-extrabold text-[#059669]">
                      <CheckCircle2 className="h-3 w-3" />
                      دانشجوی دوره
                    </span>
                  ) : discount > 0 ? (
                    <span className="rounded-full border border-[#FFE0E3] bg-[#FFF2F2] px-2.5 py-0.5 text-[10px] font-extrabold text-[#E11D48]">
                      {discount}% تخفیف
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669]">
                      ثبت‌نام باز است
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-baseline justify-between border-b border-white/10 pb-5">
                  <span className="text-xs font-bold text-white/70">
                    مبلغ قابل پرداخت:
                  </span>

                  <div className="text-left">
                    {discount > 0 && (
                      <span className="block text-xs font-semibold text-white/45 line-through">
                        {price.toLocaleString("fa-IR")} تومان
                      </span>
                    )}

                    <span className="text-2xl font-extrabold text-[#FFCC00]">
                      {finalPrice === 0
                        ? "رایگان!"
                        : finalPrice.toLocaleString("fa-IR")}
                    </span>

                    {finalPrice > 0 && (
                      <span className="mr-1 text-xs font-bold text-white/70">
                        تومان
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">وضعیت دوره:</span>

                    <span className="font-extrabold text-white">
                      {isCompleted ? "تکمیل شده" : "در حال برگزاری (پیش‌فروش)"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">نحوه پشتیبانی:</span>

                    <span className="font-extrabold text-white">
                      {course.support || "آنلاین و دائمی"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">بروزرسانی دوره:</span>

                    <span className="font-extrabold text-white">
                      {course.updatedAt
                        ? new Date(course.updatedAt).toLocaleDateString("fa-IR")
                        : "مادام‌العمر"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">شناسه یکتا:</span>

                    <span
                      dir="ltr"
                      className="rounded-full bg-white/10 px-2.5 py-0.5   text-[10px] font-bold text-[#FFCC00]"
                    >
                      /{course.href}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  {isRegistered ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab("sessions")}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ECFDF5] py-3.5 text-xs font-extrabold text-[#059669] shadow-sm transition-transform active:scale-95"
                    >
                      <CheckCircle2 className="h-4 w-4" />

                      <span>شما دانشجوی این دوره هستید</span>
                    </button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ scale: 1.01 }}
                      type="button"
                      onClick={handleRegisterCourse}
                      disabled={registerCourse.isPending}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FFCC00] py-3.5 text-xs font-extrabold text-[#14151A] shadow-[0_10px_24px_-4px_rgba(255,204,0,0.45)] transition-colors hover:bg-[#FFD633] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {registerCourse.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>در حال ثبت‌نام...</span>
                        </>
                      ) : (
                        <>
                          <span>ثبت‌نام و شروع یادگیری</span>

                          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                        </>
                      )}
                    </motion.button>
                  )}

                  {registerError && (
                    <div className="mt-3 rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] p-3 text-xs font-bold leading-6 text-[#E11D48]">
                      {registerError}
                    </div>
                  )}

                  {registerSuccess && (
                    <div className="mt-3 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-3 text-xs font-bold leading-6 text-[#059669]">
                      {registerSuccess}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_-10px_rgba(20,21,26,0.05)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-[#14151A]">
                      دسترسی دائمی و بدون محدودیت
                    </h4>

                    <p className="mt-0.5 text-[11px] font-medium text-[#8E929F]">
                      شامل تمامی آپدیت‌های آینده این دوره
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* =========================================================
          Mobile Sticky CTA
      ========================================================= */}

      {!isLoading && course?._id && (
        <div
          dir="rtl"
          className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-full bg-[#14151A]/95 px-4 py-2.5 text-white shadow-2xl backdrop-blur-xl lg:hidden"
        >
          <div>
            <span className="block text-[10px] text-white/60">قیمت نهایی:</span>

            <span className="text-sm font-extrabold text-[#FFCC00]">
              {finalPrice === 0
                ? "رایگان!"
                : `${finalPrice.toLocaleString("fa-IR")} تومان`}
            </span>
          </div>

          {isRegistered ? (
            <button
              type="button"
              onClick={() => setActiveTab("sessions")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-5 py-2.5 text-xs font-extrabold text-[#059669]"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />

              <span>شما دانشجوی این دوره هستید</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRegisterCourse}
              disabled={registerCourse.isPending}
              className="inline-flex items-center gap-1 rounded-full bg-[#FFCC00] px-5 py-2.5 text-xs font-extrabold text-[#14151A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {registerCourse.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>در حال ثبت‌نام...</span>
                </>
              ) : (
                <>
                  <span>ثبت‌نام در دوره</span>

                  <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
