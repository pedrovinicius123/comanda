import { apiRequest } from "./request.js";

export const getAtendimentos = () => apiRequest("/atendimentos/");

export const iniciarAtendimento = () =>
    apiRequest("/atendimentos/", { method: "POST", body: {} });

export const finalizarAtendimento = (id) =>
    apiRequest("/atendimentos/", { method: "PUT", body: { id } });

export const registrarComanda = (id_atendimento) =>
    apiRequest("/atendimentos/comandas", {
        method: "POST",
        body: { id_atendimento, valor_a_pagar: 0 },
    });