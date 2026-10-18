import http from "./httpService";


export async function getAllTicketsApi() {
  return http.get("/tickets").then(({ data }) => data);
}

export async function createTicketApi(ticketData) {
  return http.post("/tickets", ticketData).then(({ data }) => data);
}

export async function getUserTicketsApi() {
  return http.get("/tickets/user").then(({ data }) => data);
}

export async function getTicketAnswerApi(ticketId) {
  return http.get(`/tickets/${ticketId}/answer`).then(({ data }) => data);
}

export async function setTicketAnswerApi(answerData) {
  return http.post("/tickets/answer", answerData).then(({ data }) => data);
}
