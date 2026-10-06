import { updateMesa } from "../data/mesa.js";

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

  render(edit_callback){
    /* ---- Bloco de informações ---- */
    const info = document.createElement('div');
    info.className = 'item-info';

    const titulo = document.createElement('h3');
    titulo.textContent = 'Mesa ' + this.#numero;

    const localizacao = document.createElement('p');
    localizacao.className = 'descricao';
    localizacao.textContent = this.#localizacao;

    info.append(titulo, localizacao);

    /* ---- Bloco de ações ---- */
    const acoes = document.createElement('div');
    acoes.className = 'item-acoes';

    // Ação própria de reserva (o clique alterna a situação)
    const btnReserva = document.createElement('button');

    btnReserva.type = 'button';
    btnReserva.className = 'badge ' + (this.#reservada ? 'reservada' : 'livre');
    btnReserva.textContent = this.situacaoFormatada;
    btnReserva.title = 'Clique para alternar a situação de reserva';
    btnReserva.addEventListener('click', () => {
      mesa.alternarReserva();
      updateMesa(mesa);
      renderizar();
    });

    // Ação de edição da localização (e também da reserva)
    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn-editar';
    btnEditar.textContent = 'Alterar';
    btnEditar.addEventListener('click', () => edit_callback(this.#id));

    acoes.append(btnReserva, btnEditar);

    /* ---- Montagem do item ---- */
    const item = document.createElement('article');
    item.className = 'item';
    item.append(info, acoes);

    return item;
  }

  jsonify() {
    obj = {
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
    const obj = JSON.parse(json);
    const mesa = new Mesa(obj.id, obj.numero, obj.localizacao, obj.reservada);    
    const produtos = new Array()
    
    for (let prod of mesa.produtos){
      produtos.push(prodLoadCallback(prod));
    }

    mesa.produtos = produtos;
    return mesa;
  }
}