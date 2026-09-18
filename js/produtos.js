/* ============================================================
   Sabor da Orla — Página de Produtos
   Gerenciamento em memória: classe Produto + array + DOM
   ============================================================ */

/* ------------------------------------------------------------
   1. MODELO — classe Produto
   ------------------------------------------------------------ */
class Produto {
  static proximoId = 1;

  constructor(nome, descricao, preco, disponivel = true) {
    this.id = Produto.proximoId++;
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.disponivel = disponivel;
  }

  /** Atualiza todos os dados editáveis do produto. */
  atualizarDados({ nome, descricao, preco, disponivel }) {
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.disponivel = disponivel;
  }

  /** Alterna a situação do produto entre disponível e indisponível. */
  alternarDisponibilidade() {
    this.disponivel = !this.disponivel;
    return this.disponivel;
  }

  /** Preço já formatado em Real. */
  get precoFormatado() {
    return this.preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}

/* ------------------------------------------------------------
   2. ESTADO — array de objetos em memória
   ------------------------------------------------------------ */
const produtos = [];
let idEmEdicao = null;

/* ------------------------------------------------------------
   3. REFERÊNCIAS DO DOM
   ------------------------------------------------------------ */
const form            = document.getElementById('form-produto');
const campoNome       = document.getElementById('nome');
const campoDescricao  = document.getElementById('descricao');
const campoPreco      = document.getElementById('preco');
const campoDisponivel = document.getElementById('disponivel');
const btnSalvar       = document.getElementById('btn-salvar');
const btnCancelar     = document.getElementById('btn-cancelar');
const tituloForm      = document.getElementById('titulo-form');
const listaProdutos   = document.getElementById('lista-produtos');

/* ------------------------------------------------------------
   4. RENDERIZAÇÃO
   ------------------------------------------------------------ */
function renderizar() {
  listaProdutos.innerHTML = '';

  if (produtos.length === 0) {
    const vazio = document.createElement('p');
    vazio.className = 'vazio';
    vazio.textContent = 'Nenhum produto cadastrado.';
    listaProdutos.append(vazio);
    return;
  }

  produtos.forEach((produto) => {
    /* ---- Bloco de informações ---- */
    const info = document.createElement('div');
    info.className = 'item-info';

    const titulo = document.createElement('h3');
    titulo.textContent = produto.nome;

    const descricao = document.createElement('p');
    descricao.className = 'descricao';
    descricao.textContent = produto.descricao;

    const preco = document.createElement('p');
    preco.className = 'preco';
    preco.textContent = produto.precoFormatado;

    info.append(titulo, descricao, preco);

    /* ---- Bloco de ações ---- */
    const acoes = document.createElement('div');
    acoes.className = 'item-acoes';

    // Ação própria de disponibilidade (o clique alterna a situação)
    const btnDisponibilidade = document.createElement('button');
    btnDisponibilidade.type = 'button';
    btnDisponibilidade.className =
      'badge ' + (produto.disponivel ? 'disponivel' : 'indisponivel');
    btnDisponibilidade.textContent =
      produto.disponivel ? 'Disponível' : 'Indisponível';
    btnDisponibilidade.title = 'Clique para alternar a disponibilidade';
    btnDisponibilidade.addEventListener('click', () => {
      produto.alternarDisponibilidade();
      renderizar();
    });

    // Ação de edição
    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn-editar';
    btnEditar.textContent = 'Alterar';
    btnEditar.addEventListener('click', () => iniciarEdicao(produto.id));

    acoes.append(btnDisponibilidade, btnEditar);

    /* ---- Montagem do item ---- */
    const item = document.createElement('article');
    item.className = 'item';
    item.append(info, acoes);

    listaProdutos.append(item);
  });
}

/* ------------------------------------------------------------
   5. EDIÇÃO
   ------------------------------------------------------------ */
function iniciarEdicao(id) {
  const produto = produtos.find((p) => p.id === id);
  if (!produto) return;

  idEmEdicao = id;

  campoNome.value       = produto.nome;
  campoDescricao.value  = produto.descricao;
  campoPreco.value      = produto.preco;
  campoDisponivel.value = String(produto.disponivel);

  tituloForm.textContent = 'Alterar Produto';
  btnSalvar.textContent  = 'Salvar';
  btnCancelar.hidden     = false;

  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  campoNome.focus();
}

function finalizarEdicao() {
  idEmEdicao = null;
  form.reset();
  tituloForm.textContent = 'Adicionar Produto +';
  btnSalvar.textContent  = 'Cadastrar';
  btnCancelar.hidden     = true;
}

/* ------------------------------------------------------------
   6. EVENTOS
   ------------------------------------------------------------ */
form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const nome       = campoNome.value.trim();
  const descricao  = campoDescricao.value.trim();
  const preco      = parseFloat(campoPreco.value);
  const disponivel = campoDisponivel.value === 'true';

  if (!nome || !descricao || Number.isNaN(preco)) return;

  if (idEmEdicao === null) {
    // Cadastro: cria um novo objeto instanciado da classe Produto
    produtos.push(new Produto(nome, descricao, preco, disponivel));
    form.reset();
    campoNome.focus();
  } else {
    // Alteração: modifica o objeto já existente no array
    const produto = produtos.find((p) => p.id === idEmEdicao);
    if (produto) {
      produto.atualizarDados({ nome, descricao, preco, disponivel });
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
