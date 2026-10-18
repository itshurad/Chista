import {
  banUser,
  changeRole,
  getProfileApi,
  getUsersApi,
  removeUser,
  unBanUser,
  updateUser,
} from "@/services/authService";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// =====================================================
// Query Keys
// =====================================================

// لیست کاربران
export const USERS_KEY = ["users"];

// پروفایل کاربر لاگین شده
export const PROFILE_KEY = ["profile"];

// =====================================================
// Get Users
// =====================================================

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: getUsersApi,
  });
}

// =====================================================
// Get Profile
// =====================================================

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: getProfileApi,
  });
}

// =====================================================
// Ban User
// =====================================================

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USERS_KEY,
      });
    },
  });
}

// =====================================================
// Unban User
// =====================================================

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unBanUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USERS_KEY,
      });
    },
  });
}

// =====================================================
// Remove User
// =====================================================

export function useRemoveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USERS_KEY,
      });
    },
  });
}

// =====================================================
// Update User
// =====================================================

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USERS_KEY,
      });
    },
  });
}

// =====================================================
// Change Role
// =====================================================

export function useChangeRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USERS_KEY,
      });
    },
  });
}
