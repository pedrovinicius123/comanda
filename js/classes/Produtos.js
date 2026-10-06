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

  render(edit_callback) {
    /* ---- Bloco de informações ---- */
    const info = document.createElement('div');
    info.className = 'item-info';

    const titulo = document.createElement('h3');
    titulo.textContent = this.nome;

    const descricao = document.createElement('p');
    descricao.className = 'descricao';
    descricao.textContent = this.descricao;

    const preco = document.createElement('p');
    preco.className = 'preco';
    preco.textContent = this.precoFormatado();

    info.append(titulo, descricao, preco);

    /* ---- Bloco de ações ---- */
    const acoes = document.createElement('div');
    acoes.className = 'item-acoes';

    // Ação própria de disponibilidade (o clique alterna a situação)
    const btnDisponibilidade = document.createElement('button');
    btnDisponibilidade.type = 'button';
    btnDisponibilidade.className =
      'badge ' + (this.disponivel ? 'disponivel' : 'indisponivel');
    btnDisponibilidade.textContent =
      this.disponivel ? 'Disponível' : 'Indisponível';
    btnDisponibilidade.title = 'Clique para alternar a disponibilidade';
    
    let item = null;
    btnDisponibilidade.addEventListener('click', () => {
      this.alternarDisponibilidade();
      item = this.render(edit_callback);
    });

    // Ação de edição
    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn-editar';
    btnEditar.textContent = 'Alterar';
    btnEditar.addEventListener('click', () => edit_callback(this.id));

    acoes.append(btnDisponibilidade, btnEditar);

    /* ---- Montagem do item ---- */
    if (item == null){
      item = document.createElement("article")
      item.className = 'item';
      item.append(info, acoes);
    }

    return item
  }

  jsonify() {
    const obj = {
      id:this.#id,
      nome: this.#nome,
      descricao: this.#descricao,
      preco: this.#preco,
      disponivel: this.#disponivel
    };

    return JSON.stringify(obj);

  }

  static load(json) {
    const obj = JSON.parse(json);
    const produto = new Produto(obj.nome, obj.descricao, obj.preco, obj.disponivel);
    return produto;
  }

}
