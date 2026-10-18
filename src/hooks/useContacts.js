"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getContactsApi,
  deleteContactApi,
  answerContactApi,
  createContactApi,
} from "@/services/contactService";

export const CONTACTS_KEY = ["contacts"];

// ---------------------------------------------
// Get All Contacts
// ---------------------------------------------

export const useAllContacts = () =>
  useQuery({
    queryKey: CONTACTS_KEY,
    queryFn: getContactsApi,
  });

// ---------------------------------------------
// Delete Contact
// ---------------------------------------------

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CONTACTS_KEY,
      });
    },
  });
};

// ---------------------------------------------
// Answer Contact
// ---------------------------------------------

export const useAnswerContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: answerContactApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CONTACTS_KEY,
      });
    },
  });
};

export const useCreateContact = () => {
  return useMutation({
    mutationFn: createContactApi,
  });
};