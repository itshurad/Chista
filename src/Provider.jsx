"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Provider({ children }) {
  // ساخت QueryClient با useState تا در رندرهای مجدد کلاینت، کش بازنشانی نشود
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // ۱ دقیقه داده‌ها تازه می‌مانند و دوباره واکشی نمی‌شوند
            gcTime: 5 * 60 * 1000, // نگهداری کش تا ۵ دقیقه
            refetchOnWindowFocus: false, // جلوگیری از درخواست مجدد هنگام فوکوس روی تب مرورگر
            retry: 1, // تعداد دفعات تلاش مجدد در صورت بروز خطا
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
