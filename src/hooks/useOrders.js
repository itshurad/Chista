import { useQuery } from "@tanstack/react-query";

import { getOrdersApi, getOrderApi } from "@/services/orderService";

// Get all orders
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersApi,
  });
};

// Get one order
export const useOrder = (id) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderApi(id),
    enabled: Boolean(id),
  });
};
