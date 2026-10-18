import {
  createTicketApi,
  getAllTicketsApi,
  getTicketAnswerApi,
  getUserTicketsApi,
  setTicketAnswerApi,
} from "@/services/ticketService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ticketKeys = {
  all: ["tickets"],
  list: () => [...ticketKeys.all, "list"],
  user: () => [...ticketKeys.all, "user"],
  answer: (id) => [...ticketKeys.all, "answer", id],
};

export function useAllTickets() {
  return useQuery({
    queryKey: ticketKeys.list(),
    queryFn: getAllTicketsApi,
  });
}

export function useUserTickets() {
  return useQuery({
    queryKey: ticketKeys.user(),
    queryFn: getUserTicketsApi,
  });
}

export function useTicketAnswer(ticketId) {
  return useQuery({
    queryKey: ticketKeys.answer(ticketId),
    queryFn: () => getTicketAnswerApi(ticketId),
    enabled: Boolean(ticketId),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicketApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.user() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.list() });
    },
  });
}

export function useSetTicketAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setTicketAnswerApi,
    onSuccess: (_, variables) => {
      if (variables?.ticketID) {
        queryClient.invalidateQueries({
          queryKey: ticketKeys.answer(variables.ticketID),
        });
      }
      queryClient.invalidateQueries({ queryKey: ticketKeys.list() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.user() });
    },
  });
}
