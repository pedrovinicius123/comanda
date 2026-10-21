import { updateMesa } from "../data/mesa.js";

/** Representa uma mesa e seus dados operacionais. */
export class Mesa {
  static proximoId = 1;

  #id
  #localizacao
  #reservada
  #numero
  #produtos
  #pagamento
  #precoTot

  // o ID da mesa já é o seu número

  constructor(id, numero, localizacao, reservada = false) {
    this.#id = id === null ? ++Mesa.proximoId: id;
    this.#numero = numero,
    this.#localizacao = localizacao;
    this.#reservada = reservada;
    this.#produtos = new Array();
    this.#pagamento = 0.0;
    this.#precoTot = 0.0
  }

  set localizacao (novaLocalizacao) {this.#localizacao = novaLocalizacao;}
  set reservada (reservada) {this.#reservada = reservada};
  set produtos (novosProdutos) {this.#produtos = novosProdutos};

  get id (){return this.#id};
  get localizacao (){return this.#localizacao};
  get reservada (){return this.#reservada};
  get numero (){return this.#numero};
  get pagamento (){return this.#pagamento};
  get precoTot (){return this.#precoTot};

  /* Adicionar produto */
  adicionarProduto(produtoQ) {
    this.#precoTot += produtoQ.produto.preco
    this.#produtos.push(produtoQ);
  }

  removerProdutoMesa(produto, quant){
    let idx = 0;
    for (let prodQ of this.#produtos){
      if (prodQ.nome === produto.nome){
        prodQ.quant -= quant;
        this.#precoTot -= quant*produto.preco;
        this.#pagamento += quant*produto.preco;

        if (prodQ.quant <= 0){
          this.#produtos.splice(idx, 1);
        } return;
      }
      
      idx++;

    } 

  }

  /* Alterna a situação entre reservada e não reservada. */
  alternarReserva() {
    this.#reservada = !this.#reservada;
    return this.#reservada;
  }

  get situacaoFormatada() {
    return this.#reservada ? 'Reservada' : 'Não reservada';
  }

  /** Serializa a mesa e seus produtos para armazenamento.
   * @returns {string} JSON da mesa.
   */
  jsonify() {
    const obj = {
      id: this.#id,
      numero: this.#numero,
      localizacao: this.#localizacao,
      reservada: this.#reservada,      
      produtos: new Array()    
    }

    for(let prod of this.#produtos){
      obj.produtos.push(prod.jsonify());
    }
    return JSON.stringify(obj);
  }

  static load(json, prodLoadCallback) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    const mesa = new Mesa(obj.id, obj.numero, obj.localizacao, obj.reservada);    
    const produtos = new Array()
    
    for (let prod of mesa.produtos){
      produtos.push(prodLoadCallback(prod));
    }

    mesa.produtos = produtos;
    return mesa;
  }
}