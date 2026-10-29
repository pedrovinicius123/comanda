export class Produto {
    constructor({ id, id_commanda, nome, preco, descricao = "" }) {
        this.id = id;
        this.id_commanda = id_commanda;
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
    }

    get precoFormatado() {
        return Number(this.preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }
}