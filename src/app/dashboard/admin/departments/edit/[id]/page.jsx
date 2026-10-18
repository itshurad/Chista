"use client";

import React from "react";
import { useParams } from "next/navigation";

import { useDepartment } from "@/hooks/useDepartments";
import DepartmentForm from "../../components/DepartmentForm";

export default function EditDepartmentPage() {
  const params = useParams();
  const id = params?.id;

  const { data, isLoading, isError } = useDepartment(id);

  const department = data?.department || data?.data || data || null;

  if (isLoading) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
          <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
          <span>در حال دریافت اطلاعات دپارتمان...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-6 py-4 text-xs font-bold text-[#E11D48]">
          دریافت اطلاعات دپارتمان با خطا مواجه شد.
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-6 py-4 text-xs font-bold text-[#E11D48]">
          دپارتمان مورد نظر پیدا نشد.
        </div>
      </div>
    );
  }

  return <DepartmentForm department={department} />;
}
