import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotificationsApi,
  getNotificationAdminsApi,
  createNotificationApi,
  deleteNotificationApi,
  seeNotificationApi,
} from "@/services/notificationService";

// Get all notifications
export const useAllNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsApi,
  });
};

// Get admins
export const useNotificationAdmins = () => {
  return useQuery({
    queryKey: ["notification-admins"],
    queryFn: getNotificationAdminsApi,
  });
};

// Create notification
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNotificationApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotificationApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};

// Mark as seen
export const useSeeNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seeNotificationApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};
