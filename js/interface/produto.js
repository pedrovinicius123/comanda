import { lista_produtos } from "../data/produto.js";
import { Produto } from "../classes/produtos.js";

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

function iniciarEdicao(id) {
    const produto = lista_produtos.find((p) => p.id === id);
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
  

export function renderizar() {
    listaProdutos.innerHTML = '';
    console.log(lista_produtos.length);
    if (lista_produtos.length === 0) {
      const vazio = document.createElement('p');
      vazio.className = 'vazio';
      vazio.textContent = 'Nenhum produto cadastrado.';
      listaProdutos.append(vazio);
      return;
    }

    lista_produtos.forEach((produto) => {
        listaProdutos.appendChild(produto.render(iniciarEdicao));
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

        const nome       = campoNome.value.trim();
        const descricao  = campoDescricao.value.trim();
        const preco      = parseFloat(campoPreco.value);
        const disponivel = campoDisponivel.value === 'true';

        console.log("Preco", preco);

        if (!nome || !descricao || Number.isNaN(preco)) return;

        if (idEmEdicao === null) {
            // Cadastro: cria um novo objeto instanciado da classe Produto
            lista_produtos.push(new Produto(nome, descricao, preco, disponivel));
            form.reset();
            campoNome.focus();
        } else {
            // Alteração: modifica o objeto já existente no array
            const produto = lista_produtos.find((p) => p.id === idEmEdicao);
            console.log(produto);
            if (produto) {
                produto.atualizarDados(nome, descricao, preco, disponivel);
                console.log(produto);
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
