"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  // در دسکتاپ: جمع یا باز بودن
  const [isCollapsed, setIsCollapsed] = useState(false);
  // در موبایل: باز یا بسته بودن دراور
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // بستن منوی موبایل هنگام تغییر مسیر
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // قفل کردن اسکرول صفحه موبایل هنگام باز بودن سایدبار
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileOpen]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        isMobileOpen,
        setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
