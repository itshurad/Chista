import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCommentsApi,
  getCommentApi,
  createCommentApi,
  answerCommentApi,
  acceptCommentApi,
  rejectCommentApi,
  deleteCommentApi,
} from "@/services/commentService";

// ===============================
// Get All Comments
// ===============================

export const useAllComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: getCommentsApi,
  });
};

// ===============================
// Get One Comment
// ===============================

export const useComment = (id) => {
  return useQuery({
    queryKey: ["comments", id],
    queryFn: () => getCommentApi(id),
    enabled: Boolean(id),
  });
};

// ===============================
// Create Comment
// ===============================

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommentApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};

// ===============================
// Answer Comment
// ===============================

export const useAnswerComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: answerCommentApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};

// ===============================
// Accept Comment
// ===============================

export const useAcceptComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptCommentApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};

// ===============================
// Reject Comment
// ===============================

export const useRejectComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectCommentApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};

// ===============================
// Delete Comment
// ===============================

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommentApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};
