"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useAllArticles } from "@/hooks/useArticles";
import ArticleForm from "../../components/ArticleForm";

export default function EditArticlePage() {
  const params = useParams();
  const id = params?.id;

  const { data, isLoading, isError } = useAllArticles();

  const articles = data?.articles || data || [];

  const article = useMemo(() => {
    if (!id || !Array.isArray(articles)) return null;

    return articles.find((item) => String(item?._id) === String(id));
  }, [articles, id]);

  if (isLoading) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF4E5] px-4 py-2 text-xs font-bold text-[#FF8A00]">
          <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#FF8A00]" />
          <span>در حال دریافت اطلاعات مقاله...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-6 py-4 text-xs font-bold text-[#E11D48]">
          دریافت اطلاعات مقاله با خطا مواجه شد.
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-[#FFE0E3] bg-[#FFF2F2] px-6 py-4 text-xs font-bold text-[#E11D48]">
          مقاله مورد نظر پیدا نشد.
        </div>
      </div>
    );
  }

  return <ArticleForm article={article} />;
}
