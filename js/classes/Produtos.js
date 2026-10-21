/** Representa um produto do cardápio e sua disponibilidade. */
export class Produto {
  static proximoId = 1;
  #id
  #nome
  #descricao
  #preco
  #disponivel

  constructor(nome, descricao, preco, disponivel = true) {
    this.#id = Produto.proximoId++;
    this.#nome = nome;
    this.#descricao = descricao;
    this.#preco = preco;
    this.#disponivel = disponivel;
  }

  get id () {return this.#id}
  get nome () {return this.#nome}
  get descricao () {return this.#descricao}
  get preco () {return this.#preco}
  get  disponivel () {return this.#disponivel}

  set id (id_n) {this.#id = id_n}
  set nome (nome_n) {this.#nome = nome_n}
  set descricao (desc_n) {this.#descricao = desc_n}
  set preco (prec_n) {this.#preco = prec_n}
  set disponivel (disp_n) {this.#disponivel = disp_n.n}

  alternarDisponibilidade(){
    this.#disponivel = !this.#disponivel;
  }

  atualizarDados(nome, descricao, preco, disponivel){
    this.#nome = nome;
    this.#descricao = descricao;
    this.#preco = preco;
    this.#disponivel = disponivel;
  }

  precoFormatado(){
    console.log(this.preco);
    return this.preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
  }

  /** Serializa os dados do produto para armazenamento.
   * @returns {string} JSON do produto.
   */
  jsonify() {
    console.log(this.id);
    const obj = {
      id:this.id,
      nome: this.nome,
      descricao: this.descricao,
      preco: this.preco,
      disponivel: this.disponivel
    };

    return JSON.stringify(obj);

  }

  /** Cria uma instância a partir de JSON ou de um objeto já decodificado.
   * @param {string|object} json Dados serializados ou objeto do produto.
   */
  static load(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    const produto = new Produto(obj.nome, obj.descricao, obj.preco, obj.disponivel);
    produto.id = obj.id
    Produto.proximoId--;
    return produto;
  }

}
