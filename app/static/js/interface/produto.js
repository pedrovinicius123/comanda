import { getAtendimentos } from "../api/comanda.js";
import { adicionarProdutos } from "../api/produtos.js";
import { Produto } from "../classes/Produtos.js";
import { renderProduto } from "./componentes.js";

const form = document.getElementById("form-produto");
const campoComanda = document.getElementById("id-commanda");
const campoNome = document.getElementById("nome");
const campoDescricao = document.getElementById("descricao");
const campoPreco = document.getElementById("preco");
const listaProdutos = document.getElementById("lista-produtos");
const mensagem = document.getElementById("mensagem-produtos");
const botaoSalvar = document.getElementById("btn-salvar");

export async function renderizar() {
    mensagem.textContent = "";
    listaProdutos.replaceChildren();
    campoComanda.replaceChildren();

    try {
        const atendimentos = await getAtendimentos();
        const comandaInicial = new URLSearchParams(window.location.search).get("comanda_id");
        const opcaoInicial = document.createElement("option");
        opcaoInicial.value = "";
        opcaoInicial.textContent = "Selecione uma comanda";
        opcaoInicial.disabled = true;
        opcaoInicial.selected = !comandaInicial;
        campoComanda.append(opcaoInicial);

        const produtos = [];
        atendimentos.forEach((atendimento) => {
            atendimento.comandas.forEach((comanda) => {
                produtos.push(...comanda.produtos);
                if (!atendimento.fim) {
                    const opcao = document.createElement("option");
                    opcao.value = comanda.id;
                    opcao.textContent = `Atendimento #${atendimento.id} / Comanda #${comanda.id}`;
                    campoComanda.append(opcao);
                }
            });
        });

        if (comandaInicial && [...campoComanda.options].some((opcao) => opcao.value === comandaInicial)) {
            campoComanda.value = comandaInicial;
        }

        if (produtos.length === 0) {
            const vazio = document.createElement("p");
            vazio.className = "vazio";
            vazio.textContent = "Nenhum produto registrado.";
            listaProdutos.append(vazio);
            return;
        }
        produtos.forEach((produto) => listaProdutos.append(renderProduto(new Produto(produto))));
    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensagem.textContent = "";
    botaoSalvar.disabled = true;

    const produto = new Produto({
        id_commanda: Number(campoComanda.value),
        nome: campoNome.value.trim(),
        descricao: campoDescricao.value.trim(),
        preco: Number(campoPreco.value),
    });

    try {
        await adicionarProdutos(produto.id_commanda, [produto]);
        form.reset();
        await renderizar();
    } catch (erro) {
        mensagem.textContent = erro.message;
    } finally {
        botaoSalvar.disabled = false;
    }
});

void renderizar();