import { apiRequest } from "./request.js";

export const adicionarProdutos = (id_commanda, produtos) =>
    apiRequest("/atendimentos/comandas", {
        method: "PATCH",
        body: {
            c_id: id_commanda,
            prods: produtos.map(({ nome, preco, descricao }) => ({
                nome,
                preco,
                descricao,
            })),
        },
    });