import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMenusApi,
  createMenuApi,
  updateMenuApi,
  deleteMenuApi,
  getAllInPanel,
} from "@/services/menuService";

export const MENUS_KEY = ["menus"];

// دریافت لیست منوها
export function useMenus() {
  return useQuery({
    queryKey: MENUS_KEY,
    queryFn: getMenusApi,
    select: (data) => data.menus || [],
  });
}
export function useAllMenus() {
  return useQuery({
    queryKey: MENUS_KEY,
    queryFn: getAllInPanel,
    select: (data) => data.menus || [],
  });
}


// ساخت منوی جدید
export function useCreateMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMenuApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENUS_KEY });
    },
  });
}

// به‌روزرسانی منو
export function useUpdateMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMenuApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENUS_KEY });
    },
  });
}

// حذف منو
export function useDeleteMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMenuApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENUS_KEY });
    },
  });
}