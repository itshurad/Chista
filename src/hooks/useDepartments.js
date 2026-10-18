import {
  createDepartmentApi,
  deleteDepartmentApi,
  getAllDepartmentsInPanelApi,
  getDepartmentApi,
  getDepartmentInPanelApi,
  getDepartmentsApi,
  getDepartmentSubsApi,
  getDepartmentSubsApiAll,
  updateDepartmentApi,
} from "@/services/departmentService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ============================================
// Queries
// ============================================

// Get all main departments
export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartmentsApi,
  });
};

// Get one department
// Can be Main or Sub
export const useDepartment = (id) => {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: () => getDepartmentApi(id),
    enabled: Boolean(id),
  });
};

// Get sub departments of one main department
export const useDepartmentSubs = (id) => {
  return useQuery({
    queryKey: ["departments", "subs", id],
    queryFn: () => getDepartmentSubsApi(id),
    enabled: Boolean(id),
  });
};

// Get all sub departments
export const useAllDepartmentSubs = () => {
  return useQuery({
    queryKey: ["departments", "subs", "all"],
    queryFn: getDepartmentSubsApiAll,
  });
};

// Get all departments for panel
// Main + Sub
export const useAllDepartments = () => {
  return useQuery({
    queryKey: ["departments", "all"],
    queryFn: getAllDepartmentsInPanelApi,
  });
};

// Get one department for panel
export const useDepartmentInPanel = (id) => {
  return useQuery({
    queryKey: ["departments", "panel", id],
    queryFn: () => getDepartmentInPanelApi(id),
    enabled: Boolean(id),
  });
};

// ============================================
// Mutations
// ============================================

// Create Main or Sub Department
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDepartmentApi,

    onSuccess: () => {
      // Main departments
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      // All sub departments
      queryClient.invalidateQueries({
        queryKey: ["departments", "subs"],
      });

      // Panel
      queryClient.invalidateQueries({
        queryKey: ["departments", "all"],
      });
    },
  });
};

// Update Main or Sub Department
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDepartmentApi,

    onSuccess: (_, variables) => {
      // Main departments
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      // Sub departments
      queryClient.invalidateQueries({
        queryKey: ["departments", "subs"],
      });

      // All departments
      queryClient.invalidateQueries({
        queryKey: ["departments", "all"],
      });

      if (variables?.id) {
        // Single department
        queryClient.invalidateQueries({
          queryKey: ["departments", variables.id],
        });

        // Panel single department
        queryClient.invalidateQueries({
          queryKey: ["departments", "panel", variables.id],
        });
      }

      // اگر parent یک Department عوض شده باشد،
      // لیست Sub های parent قبلی/جدید باید refresh شود.
      if (variables?.data?.parent) {
        queryClient.invalidateQueries({
          queryKey: ["departments", "subs", variables.data.parent],
        });
      }
    },
  });
};

// Delete Main or Sub Department
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartmentApi,

    onSuccess: () => {
      // Main departments
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      // Sub departments
      queryClient.invalidateQueries({
        queryKey: ["departments", "subs"],
      });

      // Panel
      queryClient.invalidateQueries({
        queryKey: ["departments", "all"],
      });
    },
  });
};
