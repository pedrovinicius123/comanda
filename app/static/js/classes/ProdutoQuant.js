export class ProdutoQuant {
    #produto
    #quant

    constructor(produto, quant){
        this.#produto = produto;
        this.#quant = quant
    }

    get produto() {return this.#produto};
    get quant() {return this.#quant};
    set quant(newQuant) {this.#quant = newQuant};

}