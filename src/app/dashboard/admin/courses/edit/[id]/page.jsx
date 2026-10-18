// app/dashboard/admin/courses/edit/[id]/page.js

"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useAllCourses } from "@/hooks/useCourses";
import CourseForm from "../../components/CourseForm";

export default function EditCoursePage() {
  const params = useParams();
  const id = params?.id;

  const { data, isLoading, isError } = useAllCourses();

  const courses = data?.allCourse || data?.courses || data || [];

  const course = useMemo(() => {
    if (!id || !Array.isArray(courses)) return null;

    return courses.find((item) => String(item?._id) === String(id));
  }, [courses, id]);

  if (isLoading) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
          <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
          <span>در حال دریافت اطلاعات دوره...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-6 py-4 text-xs font-bold text-[#E11D48]">
          دریافت اطلاعات دوره با خطا مواجه شد.
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-6 py-4 text-xs font-bold text-[#E11D48]">
          دوره مورد نظر پیدا نشد.
        </div>
      </div>
    );
  }

  return <CourseForm course={course} />;
}
