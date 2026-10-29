import { Produto } from "./Produtos.js";

export class Comanda {
    constructor({ id, id_atendimento, valor_a_pagar = 0, produtos = [] }) {
        this.id = id;
        this.id_atendimento = id_atendimento;
        this.valor_a_pagar = valor_a_pagar;
        this.produtos = produtos.map((produto) => new Produto(produto));
    }
}