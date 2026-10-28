import { Produto } from "../classes/Produtos.js";
import { updateProduto } from "../data/produtos.js";
import { renderProduto } from "./componentes.js"

let idEmEdicao = null;

const form            = document.getElementById('form-produto');
const campoNome       = document.getElementById('nome');
const campoDescricao  = document.getElementById('descricao');
const campoPreco      = document.getElementById('preco');
const campoDisponivel = document.getElementById('disponivel');
const btnSalvar       = document.getElementById('btn-salvar');
const btnCancelar     = document.getElementById('btn-cancelar');
const tituloForm      = document.getElementById('titulo-form');
const listaProdutos   = document.getElementById('lista-produtos');

/** Preenche o formulário com os dados do produto selecionado. */
function iniciarEdicao(id) {
    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
    const produto = produtos
        .map((item) => typeof item === "string" ? JSON.parse(item) : item)
        .find((item) => item.id === id);
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
  

/** Reconstrói a lista de produtos a partir dos dados persistidos. */
export function renderizar() {
    listaProdutos.innerHTML = '';
    const lista_produtos = JSON.parse(localStorage.getItem("produtos"));
    if (!lista_produtos || lista_produtos.length === 0) {
      const vazio = document.createElement('p');
      vazio.className = 'vazio';
      vazio.textContent = 'Nenhum produto cadastrado.';
      listaProdutos.append(vazio);
      return;
    }

    lista_produtos.forEach((produto) => {
        const prod = Produto.load(produto);
        /*
         Movemos o renderizador do produto para o arquivo de compontentes (./componentes.js)
         Agora a função renderProduto(prod, iniciarEdicao) faz todo o trabalho de renderizar o produto e a sua edição
         */
        listaProdutos.appendChild(renderProduto(prod, iniciarEdicao, renderizar));
    });

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

if (form != null){
    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        console.log(campoPreco.value);

        const lista_produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
            .map((produto) => typeof produto === "string" ? JSON.parse(produto) : produto);
        const nome       = campoNome.value.trim();
        const descricao  = campoDescricao.value.trim();
        const preco      = parseFloat(campoPreco.value);
        const disponivel = campoDisponivel.value === 'true';

        console.log("Preco", preco);

        if (!nome || !descricao || Number.isNaN(preco)) return;

        if (idEmEdicao === null) {
            // Cadastro: cria um novo objeto instanciado da classe Produto
            updateProduto(new Produto(nome, descricao, preco, disponivel));
            form.reset();
            campoNome.focus();
        } else {
            // Alteração: modifica o objeto já existente no array
            const produtoData = lista_produtos.find((p) => p.id === idEmEdicao);
            if (produtoData) {
                const produto = Produto.load(produtoData);
                produto.atualizarDados(nome, descricao, preco, disponivel);
                updateProduto(produto);
            }

            finalizarEdicao();
        }

        renderizar();
    });
}

btnCancelar.addEventListener('click', () => {
    finalizarEdicao();
    renderizar();
});
