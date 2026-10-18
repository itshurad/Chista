import Provider from "@/Provider";
import "./globals.css";
import { iranFont } from "@/context/localFont";
import { Suspense } from "react";

export const metadata = {
  title: "پنل مدیریت",
  description: "داشبورد ادمین",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${iranFont.variable} min-h-screen antialiased`}
    >
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
