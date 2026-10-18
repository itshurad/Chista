"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  Home,
  BookOpen,
  LayoutGrid,
  Users,
  FileText,
  MessageSquare,
  ShoppingBag,
  Ticket,
  Tags,
  Building2,
  Menu as MenuIcon,
  Bell,
  MessageCircle,
} from "lucide-react";

import { useSidebar } from "@/context/SidebarContext";

const menuItems = [
  {
    title: "خانه",
    href: "/dashboard/admin",
    icon: <Home size={20} strokeWidth={1.9} />,
    exact: true,
  },
  {
    title: "دوره‌ها و درس‌ها",
    href: "/dashboard/admin/courses",
    icon: <BookOpen size={20} strokeWidth={1.9} />,
  },
  {
    title: "دسته‌بندی‌ها",
    href: "/dashboard/admin/categories",
    icon: <LayoutGrid size={20} strokeWidth={1.9} />,
  },
  {
    title: "کاربران",
    href: "/dashboard/admin/users",
    icon: <Users size={20} strokeWidth={1.9} />,
  },
  {
    title: "مقالات",
    href: "/dashboard/admin/articles",
    icon: <FileText size={20} strokeWidth={1.9} />,
  },
  {
    title: "دیدگاه‌ها",
    href: "/dashboard/admin/comments",
    icon: <MessageSquare size={20} strokeWidth={1.9} />,
  },
  {
    title: "سفارشات",
    href: "/dashboard/admin/orders",
    icon: <ShoppingBag size={20} strokeWidth={1.9} />,
  },
  {
    title: "ارتباط با ما",
    href: "/dashboard/admin/contact",
    icon: <MessageCircle size={20} strokeWidth={1.9} />,
  },
  {
    title: "تیکت‌ها",
    href: "/dashboard/admin/tickets",
    icon: <Ticket size={20} strokeWidth={1.9} />,
    compactGroup: "support",
  },
  {
    title: "دپارتمان",
    href: "/dashboard/admin/departments",
    icon: <Building2 size={20} strokeWidth={1.9} />,
    compactGroup: "support",
  },
  {
    title: "کدهای تخفیف",
    href: "/dashboard/admin/offs",
    icon: <Tags size={20} strokeWidth={1.9} />,
  },
  {
    title: "منوها",
    href: "/dashboard/admin/menus",
    icon: <MenuIcon size={20} strokeWidth={1.9} />,
  },
  {
    title: "اطلاعیه‌ها",
    href: "/dashboard/admin/notifications",
    icon: <Bell size={20} strokeWidth={1.9} />,
  },
];

function Sidebar() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [pathname]);

  const showFullContent = !isCollapsed || isMobileOpen;

  const isItemActive = (item) => {
    if (!mounted) return false;

    if (item.exact) {
      return pathname === item.href;
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-[#14151A]/40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        dir="rtl"
        className={`
          fixed
          top-0
          right-0
          z-50
          flex
          h-[100dvh]
          flex-shrink-0
          flex-col
          justify-between
          bg-white
          p-3
          shadow-[0_10px_40px_-10px_rgba(20,21,26,0.06)]
          transition-all
          duration-300
          ease-out
          md:sticky
          md:my-3
          md:mr-3
          md:h-[calc(100dvh-24px)]
          md:rounded-[32px]
          ${
            isMobileOpen
              ? "translate-x-0 rounded-l-[32px] shadow-2xl"
              : "translate-x-full md:translate-x-0"
          }
          ${isCollapsed ? "md:w-[84px]" : "md:w-64"}
        `}
      >
        <div className="flex flex-col overflow-hidden">
          <div
            className={`
              flex
              h-16
              items-center
              ${showFullContent ? "justify-between px-3" : "justify-center"}
            `}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFCC00] to-[#FF8A00] text-white shadow-[0_6px_16px_-4px_rgba(255,138,0,0.45)]">
                <BookOpen size={21} strokeWidth={2.2} />
              </div>

              {showFullContent && (
                <div className="flex flex-col">
                  <span className="whitespace-nowrap text-sm font-extrabold tracking-tight text-[#14151A]">
                    پنل مدیریت
                  </span>

                  <span className="mt-0.5 inline-flex w-fit items-center rounded-full bg-[#FFF4E5] px-2 py-0.5 text-[9px] font-extrabold text-[#FF8A00]">
                    نسخه پیشرفته
                  </span>
                </div>
              )}
            </div>

            {isMobileOpen && (
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="بستن منو"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F4] text-[#8E929F] transition-colors hover:text-[#14151A] active:scale-90 md:hidden"
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
            )}
          </div>

          <div className="mx-3 my-2 h-px bg-[#F4F3F0]" />

          <nav className="scrollbar-none max-h-[calc(100dvh-180px)] space-y-1.5 overflow-y-auto px-1 py-2">
            {menuItems.map((item, index) => {
              const previousItem = menuItems[index - 1];

              if (
                item.compactGroup === "support" &&
                previousItem?.compactGroup === "support"
              ) {
                return null;
              }

              if (item.compactGroup === "support") {
                const supportItems = menuItems.filter(
                  (menuItem) => menuItem.compactGroup === "support",
                );

                return (
                  <div key="support-group" className="space-y-1.5">
                    {supportItems.map((supportItem) => {
                      const supportIsActive = isItemActive(supportItem);

                      return (
                        <Link
                          key={supportItem.href}
                          href={supportItem.href}
                          title={
                            !showFullContent ? supportItem.title : undefined
                          }
                          className={`
                            group
                            relative
                            flex
                            min-w-0
                            items-center
                            gap-3.5
                            rounded-2xl
                            py-3
                            text-xs
                            transition-all
                            duration-200
                            active:scale-[0.97]
                            ${
                              showFullContent
                                ? "justify-start px-3.5"
                                : "justify-center px-0"
                            }
                            ${
                              supportIsActive
                                ? "bg-[#FFF4E5] font-extrabold text-[#14151A]"
                                : "font-semibold text-[#8E929F] hover:bg-[#F8F7F4] hover:text-[#14151A]"
                            }
                          `}
                        >
                          {supportIsActive && (
                            <motion.span
                              layoutId="sidebarActivePill"
                              transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 30,
                              }}
                              className="absolute right-0 top-2.5 bottom-2.5 w-1.5 rounded-l-full bg-[#FF8A00]"
                            />
                          )}

                          <span
                            className={`
                              shrink-0
                              transition-colors
                              duration-200
                              ${
                                supportIsActive
                                  ? "text-[#FF8A00]"
                                  : "text-[#8E929F] group-hover:text-[#14151A]"
                              }
                            `}
                          >
                            {supportItem.icon}
                          </span>

                          {showFullContent && (
                            <span className="truncate">
                              {supportItem.title}
                            </span>
                          )}

                          {!showFullContent && (
                            <span className="pointer-events-none absolute right-full z-50 mr-3 hidden whitespace-nowrap rounded-full bg-[#14151A] px-3 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100">
                              {supportItem.title}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                );
              }

              const isActive = isItemActive(item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!showFullContent ? item.title : undefined}
                  className={`
                    group
                    relative
                    flex
                    items-center
                    gap-3.5
                    rounded-2xl
                    py-3
                    text-xs
                    transition-all
                    duration-200
                    active:scale-[0.97]
                    ${!showFullContent ? "justify-center px-0" : "px-3.5"}
                    ${
                      isActive
                        ? "bg-[#FFF4E5] font-extrabold text-[#14151A]"
                        : "font-semibold text-[#8E929F] hover:bg-[#F8F7F4] hover:text-[#14151A]"
                    }
                  `}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebarActivePill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute right-0 top-2.5 bottom-2.5 w-1.5 rounded-l-full bg-[#FF8A00]"
                    />
                  )}

                  <span
                    className={`
                      shrink-0
                      transition-colors
                      duration-200
                      ${
                        isActive
                          ? "text-[#FF8A00]"
                          : "text-[#8E929F] group-hover:text-[#14151A]"
                      }
                    `}
                  >
                    {item.icon}
                  </span>

                  {showFullContent && (
                    <span className="truncate">{item.title}</span>
                  )}

                  {!showFullContent && (
                    <span className="pointer-events-none absolute right-full z-50 mr-3 hidden whitespace-nowrap rounded-full bg-[#14151A] px-3 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100">
                      {item.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-2">
          <div
            className={`
              flex
              items-center
              rounded-2xl
              bg-[#ECFDF5]
              p-3
              text-[#059669]
              ${showFullContent ? "justify-between" : "justify-center"}
            `}
          >
            {showFullContent ? (
              <>
                <span className="text-[11px] font-bold text-[#059669]">
                  وضعیت سرور
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-[#059669] shadow-sm">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#059669]" />
                  آنلاین
                </span>
              </>
            ) : (
              <span
                className="relative flex h-2.5 w-2.5"
                title="وضعیت سرور: آنلاین"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#059669] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#059669]" />
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
