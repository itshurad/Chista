import http from "./httpService";

export const CONTACT_ENDPOINT = "/contacts";

// Get all contact requests
export const getContactsApi = (options = {}) =>
  http.get(CONTACT_ENDPOINT, options).then(({ data }) => data);

// Delete contact request
export const deleteContactApi = (id) =>
  http.delete(`${CONTACT_ENDPOINT}/${id}`).then(({ data }) => data);

export const createContactApi = (data) =>
  http.post(CONTACT_ENDPOINT, data).then(({ data }) => data);
// Answer contact request
export const answerContactApi = ({ id, email, answer }) =>
  http
    .post(`${CONTACT_ENDPOINT}/${id}/answer`, {
      email,
      answer,
    })
    .then(({ data }) => data);
