/* ============================================================
   Sabor da Orla — Página de Mesas
   Gerenciamento em memória: classe Mesa + array + DOM
   ============================================================ */

/* ------------------------------------------------------------
   1. MODELO — classe Mesa
   ------------------------------------------------------------ */
class Mesa {
  static proximoId = 1;

  constructor(numero, localizacao, reservada = false) {
    this.id = Mesa.proximoId++;
    this.numero = numero;
    this.localizacao = localizacao;
    this.reservada = reservada;
  }

  /** Altera a descrição da localização da mesa. */
  atualizarLocalizacao(novaLocalizacao) {
    this.localizacao = novaLocalizacao;
  }

  /** Define explicitamente a situação de reserva. */
  atualizarReserva(reservada) {
    this.reservada = reservada;
  }

  /** Alterna a situação entre reservada e não reservada. */
  alternarReserva() {
    this.reservada = !this.reservada;
    return this.reservada;
  }

  /** Situação já pronta para exibição. */
  get situacaoFormatada() {
    return this.reservada ? 'Reservada' : 'Não reservada';
  }
}

/* ------------------------------------------------------------
   2. ESTADO — array de objetos em memória
   ------------------------------------------------------------ */
const mesas = [];
let idEmEdicao = null;

/* ------------------------------------------------------------
   3. REFERÊNCIAS DO DOM
   ------------------------------------------------------------ */
const form             = document.getElementById('form-mesa');
const campoNumero      = document.getElementById('numero');
const campoLocalizacao = document.getElementById('localizacao');
const campoReservada   = document.getElementById('reservada');
const btnSalvar        = document.getElementById('btn-salvar');
const btnCancelar      = document.getElementById('btn-cancelar');
const tituloForm       = document.getElementById('titulo-form');
const listaMesas       = document.getElementById('lista-mesas');

/* ------------------------------------------------------------
   4. RENDERIZAÇÃO
   ------------------------------------------------------------ */
function renderizar() {
  listaMesas.innerHTML = '';

  if (mesas.length === 0) {
    const vazio = document.createElement('p');
    vazio.className = 'vazio';
    vazio.textContent = 'Nenhuma mesa cadastrada.';
    listaMesas.append(vazio);
    return;
  }

  // Exibe em ordem crescente de número (sem alterar o array original)
  const ordenadas = [...mesas].sort((a, b) => a.numero - b.numero);

  ordenadas.forEach((mesa) => {
    /* ---- Bloco de informações ---- */
    const info = document.createElement('div');
    info.className = 'item-info';

    const titulo = document.createElement('h3');
    titulo.textContent = 'Mesa ' + mesa.numero;

    const localizacao = document.createElement('p');
    localizacao.className = 'descricao';
    localizacao.textContent = mesa.localizacao;

    info.append(titulo, localizacao);

    /* ---- Bloco de ações ---- */
    const acoes = document.createElement('div');
    acoes.className = 'item-acoes';

    // Ação própria de reserva (o clique alterna a situação)
    const btnReserva = document.createElement('button');
    btnReserva.type = 'button';
    btnReserva.className = 'badge ' + (mesa.reservada ? 'reservada' : 'livre');
    btnReserva.textContent = mesa.situacaoFormatada;
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
    btnEditar.addEventListener('click', () => iniciarEdicao(mesa.id));

    acoes.append(btnReserva, btnEditar);

    /* ---- Montagem do item ---- */
    const item = document.createElement('article');
    item.className = 'item';
    item.append(info, acoes);

    listaMesas.append(item);
  });
}

/* ------------------------------------------------------------
   5. EDIÇÃO
   ------------------------------------------------------------ */
function iniciarEdicao(id) {
  const mesa = mesas.find((m) => m.id === id);
  if (!mesa) return;

  idEmEdicao = id;

  campoNumero.value      = mesa.numero;
  campoNumero.disabled   = true;   // o número da mesa não é alterável
  campoLocalizacao.value = mesa.localizacao;
  campoReservada.value   = String(mesa.reservada);

  tituloForm.textContent = 'Alterar Mesa ' + mesa.numero;
  btnSalvar.textContent  = 'Salvar';
  btnCancelar.hidden     = false;

  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  campoLocalizacao.focus();
}

function finalizarEdicao() {
  idEmEdicao = null;
  campoNumero.disabled = false;
  form.reset();
  tituloForm.textContent = 'Adicionar Mesa +';
  btnSalvar.textContent  = 'Cadastrar';
  btnCancelar.hidden     = true;
}

/* ------------------------------------------------------------
   6. EVENTOS
   ------------------------------------------------------------ */
form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  if (idEmEdicao === null) {
    // Cadastro: cria um novo objeto instanciado da classe Mesa
    const numero      = parseInt(campoNumero.value, 10);
    const localizacao = campoLocalizacao.value.trim();
    const reservada   = campoReservada.value === 'true';

    if (Number.isNaN(numero) || !localizacao) return;

    mesas.push(new Mesa(numero, localizacao, reservada));
    form.reset();
    campoNumero.focus();
  } else {
    // Alteração: modifica o objeto já existente no array
    const mesa = mesas.find((m) => m.id === idEmEdicao);
    const localizacao = campoLocalizacao.value.trim();
    const reservada   = campoReservada.value === 'true';

    if (mesa && localizacao) {
      mesa.atualizarLocalizacao(localizacao);
      mesa.atualizarReserva(reservada);
    }
    finalizarEdicao();
  }

  renderizar();
});

btnCancelar.addEventListener('click', () => {
  finalizarEdicao();
  renderizar();
});

/* ------------------------------------------------------------
   7. INICIALIZAÇÃO
   ------------------------------------------------------------ */
renderizar();
