import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getOffsApi,
  createOffApi,
  setDiscountOnAllApi,
  getOffApi,
  deleteOffApi,
} from "@/services/offService";

// Get all discount codes
export const useAllOffs = () => {
  return useQuery({
    queryKey: ["offs"],
    queryFn: getOffsApi,
  });
};

// Get one discount code
export const useOff = ({ code, course }) => {
  return useQuery({
    queryKey: ["offs", code, course],
    queryFn: () =>
      getOffApi({
        code,
        course,
      }),
    enabled: Boolean(code && course),
  });
};

// Create discount
export const useCreateOff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOffApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["offs"],
      });
    },
  });
};

// Set discount on all courses
export const useSetDiscountOnAll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDiscountOnAllApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["offs"],
      });
    },
  });
};

// Delete discount
export const useDeleteOff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOffApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["offs"],
      });
    },
  });
};