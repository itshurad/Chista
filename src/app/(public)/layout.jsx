import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import React, { Suspense } from "react";

function layout({ children }) {
  return (
    <div>
      <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse" />}>
        <SiteHeader />
      </Suspense>
      <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse" />}>
        {children}
      </Suspense>
      <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse" />}>
        <SiteFooter />
      </Suspense>
    </div>
  );
}

export default layout;
