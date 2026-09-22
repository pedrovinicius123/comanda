export class Mesa {
  static proximoId = 1;

  #id
  #localizacao
  #reservada
  #numero

  // o ID da mesa já é o seu número

  constructor(numero, localizacao, reservada = false) {
    this.#id = Mesa.proximoId++;
    this.#numero = numero,
    this.#localizacao = localizacao;
    this.#reservada = reservada;
  }


  set localizacao (novaLocalizacao) {this.#localizacao = novaLocalizacao;}
  set reservada (reservada) {this.#reservada = reservada};

  get id (){return this.#id}
  get localizacao (){return this.#localizacao}
  get reservada (){return this.#reservada}
  get numero (){return this.#numero}

  /** Alterna a situação entre reservada e não reservada. */
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
}