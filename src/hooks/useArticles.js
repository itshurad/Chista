import {
  createArticleApi,
  createArticleDraftApi,
  deleteArticleApi,
  getArticleApi,
  getArticleByHrefApi,
  getArticlesApi,
  updateArticleApi,
} from "@/services/articleService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ==========================================
// Query Keys
// ==========================================

export const ARTICLES_KEY = ["articles"];

// ==========================================
// Get all articles
// ==========================================

export const useAllArticles = () => {
  return useQuery({
    queryKey: ARTICLES_KEY,
    queryFn: getArticlesApi,
  });
};

// ==========================================
// Get one article
// ==========================================

export const useArticle = (id) => {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => getArticleApi(id),
    enabled: Boolean(id),
  });
};
export const useArticleByHref = (href) => {
  return useQuery({
    queryKey: ["articles", href],
    queryFn: () => getArticleByHrefApi(href),
    enabled: Boolean(href),
  });
};

// ==========================================
// Create article
// ==========================================

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticleApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ARTICLES_KEY,
      });
    },
  });
};

// ==========================================
// Create draft
// ==========================================

export const useCreateArticleDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticleDraftApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ARTICLES_KEY,
      });
    },
  });
};

// ==========================================
// Update article
// ==========================================

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArticleApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ARTICLES_KEY,
      });
    },
  });
};

// ==========================================
// Delete article
// ==========================================

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticleApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ARTICLES_KEY,
      });
    },
  });
};
