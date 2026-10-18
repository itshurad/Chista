"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  User,
  Sparkles,
  Home,
  FileText,
  PhoneCall,
  LayoutDashboard,
  ArrowUpLeft,
} from "lucide-react";

import { useMenus } from "@/hooks/useMenus";
import { useProfile } from "@/hooks/useUsers";
import { useAllCourses } from "@/hooks/useCourses";
import { useAllArticles } from "@/hooks/useArticles";
import { useOrders } from "@/hooks/useOrders";

// منوهای پیش‌فرض در صورت خالی بودن دیتابیس
const defaultNavLinks = [
  { _id: "1", title: "صفحه اصلی", href: "/" },
  { _id: "2", title: "دوره‌های آموزشی", href: "/courses" },
  { _id: "3", title: "مقالات", href: "/blog" },
  { _id: "4", title: "سفارشات من", href: "/orders" },
  { _id: "5", title: "ارتباط با ما", href: "/contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSubMenuId, setOpenSubMenuId] = useState(null);

  const searchContainerRef = useRef(null);

  // واکشی اطلاعات از هوک‌های پروژه
  const { data: menusData } = useMenus();
  const { data: profileData } = useProfile();
  const { data: coursesData } = useAllCourses();
  const { data: articlesData } = useAllArticles();
  const { data: ordersData } = useOrders();
  const ordersCount = ordersData?.orders?.length;

  const user = profileData?.me || profileData?.user || null;
  const isLoggedIn = Boolean(user && (user._id || user.username));

  // نرمال‌سازی منوها
  const navMenus = useMemo(() => {
    const raw = Array.isArray(menusData) ? menusData : menusData?.menus || [];
    if (raw.length === 0) return defaultNavLinks;
    return raw.map((item) => ({
      ...item,
      href: item.href?.startsWith("/") ? item.href : `/${item.href || ""}`,
    }));
  }, [menusData]);

  // جستجوی زنده در دوره‌ها و مقالات
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return { courses: [], articles: [] };

    const allCourses = coursesData?.allCourse || coursesData?.courses || [];
    const allArticles = articlesData?.articles || articlesData || [];

    const matchedCourses = (Array.isArray(allCourses) ? allCourses : [])
      .filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      )
      .slice(0, 3);

    const matchedArticles = (Array.isArray(allArticles) ? allArticles : [])
      .filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q),
      )
      .slice(0, 3);

    return { courses: matchedCourses, articles: matchedArticles };
  }, [searchQuery, coursesData, articlesData]);

  const hasResults =
    searchResults.courses.length > 0 || searchResults.articles.length > 0;

  // بستن دراپ‌داون سرچ با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // بستن منوی موبایل هنگام تغییر مسیر
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <header
        dir="rtl"
        className="sticky top-0 z-40 w-full bg-[#F8F7F4]/85 backdrop-blur-xl transition-all"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* ۱. بخش راست: دکمه منوی موبایل + لوگو + لینک‌های ناوبری */}
          <div className="flex items-center gap-3 lg:gap-7">
            {/* دکمه همبرگری موبایل */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#14151A] shadow-[0_4px_16px_-4px_rgba(20,21,26,0.06)] transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00] lg:hidden"
              aria-label="منو"
            >
              <Menu className="h-5 w-5" />
            </motion.button>

            {/* لوگو (دقیقاً مشابه آیکون کتاب نارنجی-طلایی در گوشه تصویر رفرنس) */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFCC00] to-[#FF8A00] text-white shadow-[0_6px_16px_-4px_rgba(255,138,0,0.45)]">
                <BookOpen className="h-5 w-5" strokeWidth={2.3} />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-[#14151A]">
                  آکادمی لرن
                </span>
                <span className="inline-flex w-fit items-center rounded-full bg-[#FFF4E5] px-2 py-0.2 text-[9px] font-extrabold text-[#FF8A00]">
                  پلتفرم آموزش مدرن
                </span>
              </div>
            </Link>

            {/* منوی ناوبری دسکتاپ */}
            <nav className="hidden items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_4px_20px_-6px_rgba(20,21,26,0.05)] lg:flex">
              {navMenus.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));
                const hasSubMenus =
                  Array.isArray(item.subMenus) && item.subMenus.length > 0;

                return (
                  <div key={item._id || item.href} className="group relative">
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-xs transition-all duration-200 ${
                        isActive
                          ? "bg-[#FFF4E5] font-extrabold text-[#14151A]"
                          : "font-bold text-[#8E929F] hover:text-[#14151A]"
                      }`}
                    >
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                      )}
                      <span>{item.title}</span>
                      {hasSubMenus && (
                        <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180" />
                      )}
                    </Link>

                    {/* دراپ‌داون زیرمنوها در دسکتاپ */}
                    {hasSubMenus && (
                      <div className="pointer-events-none invisible absolute right-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                        <div className="w-52 rounded-[24px] bg-white p-2 shadow-[0_18px_45px_-12px_rgba(20,21,26,0.14)] ring-1 ring-[#F1F0EC]">
                          {item.subMenus.map((sub) => (
                            <Link
                              key={sub._id || sub.href}
                              href={
                                sub.href?.startsWith("/")
                                  ? sub.href
                                  : `/${sub.href}`
                              }
                              className="flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#14151A] transition-colors hover:bg-[#FFF4E5] hover:text-[#FF8A00]"
                            >
                              <span>{sub.title}</span>
                              <ChevronLeft className="h-3.5 w-3.5 opacity-60" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* ۲. بخش چپ: کادر جستجوی کپسولی + سفارشات + ورود/پروفایل */}
          <div className="flex items-center gap-2.5">
            {/* باکس جستجوی کپسولی دسکتاپ (دقیقاً مشابه Search something در تصویر رفرنس) */}
            <div
              ref={searchContainerRef}
              className="relative hidden md:block lg:w-64 xl:w-72"
            >
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  placeholder="جستجوی دوره یا مقاله..."
                  className="w-full rounded-full border border-transparent bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-[#14151A] shadow-[0_4px_16px_-4px_rgba(20,21,26,0.05)] outline-none transition-all placeholder:font-normal placeholder:text-[#A0A4B0] focus:border-[#FF8A00]/40 focus:ring-4 focus:ring-[#FFF4E5]"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 left-3 my-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] hover:text-[#14151A]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                ) : (
                  <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
                )}
              </form>

              {/* نتایج زنده جستجو (Live Search Dropdown) */}
              <AnimatePresence>
                {isSearchOpen && searchQuery.trim().length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    className="absolute left-0 right-0 top-full mt-2.5 overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_20px_50px_-12px_rgba(20,21,26,0.16)] ring-1 ring-[#F1F0EC]"
                  >
                    {!hasResults ? (
                      <div className="py-6 text-center text-xs font-bold text-[#8E929F]">
                        نتیجه‌ای برای «{searchQuery}» یافت نشد
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {searchResults.courses.length > 0 && (
                          <div>
                            <span className="mb-1.5 inline-block rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#FF8A00]">
                              دوره‌های آموزشی
                            </span>
                            <div className="space-y-1">
                              {searchResults.courses.map((course) => (
                                <Link
                                  key={course._id}
                                  href={`/courses/${course.href}`}
                                  className="flex items-center justify-between rounded-2xl p-2 text-xs font-bold text-[#14151A] transition-colors hover:bg-[#F8F7F4]"
                                >
                                  <span className="truncate">
                                    {course.name}
                                  </span>
                                  <ArrowUpLeft className="h-3.5 w-3.5 shrink-0 text-[#8E929F]" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.articles.length > 0 && (
                          <div>
                            <span className="mb-1.5 inline-block rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#3B5BDB]">
                              مقالات
                            </span>
                            <div className="space-y-1">
                              {searchResults.articles.map((article) => (
                                <Link
                                  key={article._id}
                                  href={`/blog/${article.href}`}
                                  className="flex items-center justify-between rounded-2xl p-2 text-xs font-bold text-[#14151A] transition-colors hover:bg-[#F8F7F4]"
                                >
                                  <span className="truncate">
                                    {article.title}
                                  </span>
                                  <ArrowUpLeft className="h-3.5 w-3.5 shrink-0 text-[#8E929F]" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* دکمه باز کردن سرچ در موبایل */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#14151A] shadow-[0_4px_16px_-4px_rgba(20,21,26,0.06)] md:hidden"
              aria-label="جستجو"
            >
              <Search className="h-4 w-4" />
            </motion.button>

            {/* دکمه سفارشات / سبد خرید با بج سبز */}
            <Link
              href="/orders"
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#14151A] shadow-[0_4px_16px_-4px_rgba(20,21,26,0.06)] transition-colors hover:bg-[#ECFDF5] hover:text-[#059669] active:scale-95"
              title="سفارشات من"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ECFDF5] text-[9px] font-extrabold text-[#059669] ring-2 ring-[#F8F7F4]">
                {ordersCount}
              </span>
            </Link>

            {/* دکمه ورود / حساب کاربری کپسولی زرد طلایی (مشابه Get Course) */}
            {isLoggedIn ? (
              <Link
                href={user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard"}
                className="inline-flex items-center gap-2 rounded-full bg-[#14151A] px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition-transform active:scale-95"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-[#FFCC00]" />
                <span className="hidden sm:inline">
                  {user.name || "پنل کاربری"}
                </span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#FFCC00] px-5 py-2.5 text-xs font-extrabold text-[#14151A] shadow-[0_8px_20px_-4px_rgba(255,204,0,0.45)] transition-all hover:bg-[#FFD633] active:scale-95"
              >
                <User className="h-3.5 w-3.5" strokeWidth={2.4} />
                <span>ورود / عضویت</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* شیت جستجوی موبایل (Mobile Search Bottom-Sheet) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-50 flex items-start justify-center bg-[#14151A]/40 p-4 pt-16 backdrop-blur-sm md:hidden"
            dir="rtl"
          >
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[28px] bg-white p-4 shadow-2xl"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="نام دوره یا مقاله را بنویسید..."
                    className="w-full rounded-full bg-[#F8F7F4] py-3 pr-4 pl-10 text-xs font-bold text-[#14151A] outline-none focus:ring-2 focus:ring-[#FF8A00]"
                  />
                  <Search className=" absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8E929F]" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F]"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* منوی کشویی موبایل (Mobile Drawer) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-[#14151A]/40 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              dir="rtl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed top-0 right-0 z-50 flex h-[100dvh] w-72 flex-col justify-between rounded-l-[32px] bg-white p-5 shadow-2xl lg:hidden"
            >
              <div>
                {/* هدر منوی موبایل */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F4F3F0]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFCC00] to-[#FF8A00] text-white">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-extrabold text-[#14151A]">
                      آکادمی لرن
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* لینک‌های موبایل */}
                <nav className="mt-4 space-y-1.5">
                  {navMenus.map((item) => {
                    const isActive = pathname === item.href;
                    const hasSub =
                      Array.isArray(item.subMenus) && item.subMenus.length > 0;
                    const isSubOpen = openSubMenuId === item._id;

                    return (
                      <div key={item._id || item.href}>
                        <div className="flex items-center justify-between">
                          <Link
                            href={item.href}
                            className={`flex flex-1 items-center gap-2.5 rounded-2xl px-3.5 py-3 text-xs transition-colors ${
                              isActive
                                ? "bg-[#FFF4E5] font-extrabold text-[#14151A]"
                                : "font-bold text-[#8E929F] hover:bg-[#F8F7F4] hover:text-[#14151A]"
                            }`}
                          >
                            {isActive && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
                            )}
                            <span>{item.title}</span>
                          </Link>

                          {hasSub && (
                            <button
                              type="button"
                              onClick={() =>
                                setOpenSubMenuId(isSubOpen ? null : item._id)
                              }
                              className="p-2.5 text-[#8E929F]"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  isSubOpen ? "rotate-180 text-[#FF8A00]" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {hasSub && isSubOpen && (
                          <div className="mr-4 mt-1 space-y-1 border-r-2 border-[#FFF4E5] pr-3">
                            {item.subMenus.map((sub) => (
                              <Link
                                key={sub._id || sub.href}
                                href={
                                  sub.href?.startsWith("/")
                                    ? sub.href
                                    : `/${sub.href}`
                                }
                                className="block rounded-xl py-2 pr-2 text-[11px] font-bold text-[#8E929F] hover:text-[#14151A]"
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* فوتر منوی موبایل */}
              <div className="rounded-2xl bg-[#ECFDF5] p-3.5 text-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#059669]">
                  <Sparkles className="h-3.5 w-3.5" />
                  پشتیبانی ۲۴ ساعته دانشجویان
                </span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 📱 نوار ناوبری پایین موبایل (Native Bottom Navigation Bar) */}
      {/* ========================================================= */}
      <nav
        dir="rtl"
        className="fixed bottom-3 inset-x-4 z-40 flex h-16 items-center justify-around rounded-full bg-white/95 px-2 shadow-[0_12px_35px_-8px_rgba(20,21,26,0.16)] ring-1 ring-[#F1F0EC] backdrop-blur-xl md:hidden"
      >
        {[
          { title: "خانه", href: "/", icon: Home },
          { title: "دوره‌ها", href: "/courses", icon: BookOpen },
          { title: "مقالات", href: "/blog", icon: FileText },
          { title: "سفارشات", href: "/orders", icon: ShoppingBag },
          { title: "تماس", href: "/contact", icon: PhoneCall },
        ].map((nav) => {
          const IconComponent = nav.icon;
          const isActive =
            pathname === nav.href ||
            (nav.href !== "/" && pathname?.startsWith(nav.href));

          return (
            <Link
              key={nav.href}
              href={nav.href}
              className={`relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 text-[10px] transition-all active:scale-90 ${
                isActive
                  ? "font-extrabold text-[#14151A]"
                  : "font-bold text-[#8E929F]"
              }`}
            >
              <div
                className={`flex h-8 w-10 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-[#FFF4E5] text-[#FF8A00]" : "text-[#8E929F]"
                }`}
              >
                <IconComponent className="h-4 w-4" strokeWidth={2.2} />
              </div>
              <span>{nav.title}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
