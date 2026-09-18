/* ==========================================================
    1. MODELO — classe Mesa
    ========================================================== */
class Mesa {
    static proximoId = 1;

    constructor(numero, localizacao, reservada = false) {
    this.id = Mesa.proximoId++;
    this.numero = numero;
    this.localizacao = localizacao;
    this.reservada = reservada;
    }

    atualizarLocalizacao(novaLocalizacao) {
    this.localizacao = novaLocalizacao;
    }

    alternarReserva() {
    this.reservada = !this.reservada;
    return this.reservada;
    }

    get situacaoFormatada() {
    return this.reservada ? 'Reservada' : 'Não reservada';
    }
}

/* ==========================================================
    2. ESTADO
    ========================================================== */
const mesas = [];
let idEmEdicao = null;

/* ==========================================================
    3. REFERÊNCIAS DO DOM
    ========================================================== */
const form             = document.getElementById('form-mesa');
const campoNumero      = document.getElementById('numero');
const campoLocalizacao = document.getElementById('localizacao');
const campoReservada   = document.getElementById('reservada');
const btnSalvar        = document.getElementById('btn-salvar');
const btnCancelar      = document.getElementById('btn-cancelar');
const tituloForm       = document.getElementById('titulo-form');
const listaMesas       = document.getElementById('lista-mesas');

/* ==========================================================
    4. RENDERIZAÇÃO
    ========================================================== */
function renderizar() {
    listaMesas.innerHTML = '';

    if (mesas.length === 0) {
    const vazio = document.createElement('p');
    vazio.className = 'vazio';
    vazio.textContent = 'Nenhuma mesa cadastrada.';
    listaMesas.append(vazio);
    return;
    }

    const ordenadas = [...mesas].sort((a, b) => a.numero - b.numero);

    ordenadas.forEach((mesa) => {
    const info = document.createElement('div');
    info.className = 'item-info';

    const titulo = document.createElement('h3');
    titulo.textContent = `Mesa ${mesa.numero}`;

    const localizacao = document.createElement('p');
    localizacao.className = 'descricao';
    localizacao.textContent = mesa.localizacao;

    info.append(titulo, localizacao);

    const acoes = document.createElement('div');
    acoes.className = 'item-acoes';

    // Ação de reserva (clique alterna)
    const btnReserva = document.createElement('button');
    btnReserva.type = 'button';
    btnReserva.className = 'badge ' + (mesa.reservada ? 'reservada' : 'livre');
    btnReserva.textContent = mesa.situacaoFormatada;
    btnReserva.title = 'Clique para alternar a situação de reserva';
    btnReserva.addEventListener('click', () => {
        mesa.alternarReserva();
        renderizar();
    });

    // Ação de edição da localização
    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn-editar';
    btnEditar.textContent = 'Alterar localização';
    btnEditar.addEventListener('click', () => iniciarEdicao(mesa.id));

    acoes.append(btnReserva, btnEditar);

    const item = document.createElement('article');
    item.className = 'item';
    item.append(info, acoes);

    listaMesas.append(item);
    });
}

/* ==========================================================
    5. EDIÇÃO (apenas a localização)
    ========================================================== */
function iniciarEdicao(id) {
    const mesa = mesas.find((m) => m.id === id);
    if (!mesa) return;

    idEmEdicao = id;

    campoNumero.value      = mesa.numero;
    campoNumero.disabled   = true;
    campoLocalizacao.value = mesa.localizacao;

    tituloForm.textContent = 'Alterar Localização';
    btnSalvar.textContent  = 'Salvar';
    btnCancelar.hidden     = false;

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    campoLocalizacao.focus();
}

function finalizarEdicao() {
    idEmEdicao = null;
    form.reset();
    campoNumero.disabled   = false;
    tituloForm.textContent = 'Adicionar Mesa +';
    btnSalvar.textContent  = 'Cadastrar';
    btnCancelar.hidden     = true;
}

/* ==========================================================
    6. EVENTOS
    ========================================================== */
form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (idEmEdicao === null) {
    const numero      = parseInt(campoNumero.value, 10);
    const localizacao = campoLocalizacao.value.trim();
    const reservada   = campoReservada.value === 'true';

    if (Number.isNaN(numero) || !localizacao) return;

    mesas.push(new Mesa(numero, localizacao, reservada));
    form.reset();
    campoNumero.focus();
    } else {
    const mesa = mesas.find((m) => m.id === idEmEdicao);
    const localizacao = campoLocalizacao.value.trim();

    if (mesa && localizacao) {
        mesa.atualizarLocalizacao(localizacao);
    }
    finalizarEdicao();
    }

    renderizar();
});

btnCancelar.addEventListener('click', () => {
    finalizarEdicao();
    renderizar();
});

/* ==========================================================
    7. INICIALIZAÇÃO
    ========================================================== */
function atualizarData() {
    const agora = new Date();
    const texto = agora.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    document.getElementById('data-atual').textContent = 'data: ' + texto;
}
atualizarData();
setInterval(atualizarData, 1000);

renderizar();