import { Comanda } from "../classes/Comandas.js";

const formatarData = (valor) => valor
    ? new Date(valor).toLocaleString("pt-BR")
    : "Em andamento";

const criarBotao = (texto, classe, acao) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = classe;
    botao.textContent = texto;
    botao.addEventListener("click", acao);
    return botao;
};

export const renderComanda = (dados, aoAdicionarProduto) => {
    const comanda = new Comanda(dados);
    const item = document.createElement("article");
    item.className = "comanda-item";

    const info = document.createElement("div");
    info.className = "item-info";
    const titulo = document.createElement("h3");
    titulo.textContent = `Comanda #${comanda.id}`;
    const saldo = document.createElement("p");
    saldo.className = "preco";
    saldo.textContent = Number(comanda.valor_a_pagar).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    info.append(titulo, saldo);

    const produtos = document.createElement("ul");
    produtos.className = "produtos-comanda";
    comanda.produtos.forEach((produto) => {
        const linha = document.createElement("li");
        linha.textContent = `${produto.nome} - ${produto.precoFormatado}`;
        produtos.append(linha);
    });
    if (comanda.produtos.length === 0) {
        const vazio = document.createElement("li");
        vazio.textContent = "Sem produtos";
        produtos.append(vazio);
    }

    const acoes = document.createElement("div");
    acoes.className = "item-acoes";
    acoes.append(criarBotao("Adicionar produto", "btn-editar", () => aoAdicionarProduto(comanda.id)));
    item.append(info, produtos, acoes);
    return item;
};

export const renderAtendimento = (dados, { aoAdicionarComanda, aoFinalizar }) => {
    const item = document.createElement("article");
    item.className = "item";

    const info = document.createElement("div");
    info.className = "item-info";
    const titulo = document.createElement("h3");
    titulo.textContent = `Atendimento #${dados.id}`;
    const inicio = document.createElement("p");
    inicio.className = "descricao";
    inicio.textContent = `Início: ${formatarData(dados.inicio)}`;
    const fim = document.createElement("p");
    fim.className = "descricao";
    fim.textContent = `Fim: ${dados.fim ? formatarData(dados.fim) : "Em andamento"}`;
    info.append(titulo, inicio, fim);

    const comandas = document.createElement("div");
    comandas.className = "comandas-atendimento";
    dados.comandas.forEach((comanda) => {
        comandas.append(renderComanda(comanda, aoAdicionarProduto));
    });

    const acoes = document.createElement("div");
    acoes.className = "item-acoes";
    if (!dados.fim) {
        acoes.append(
            criarBotao("Adicionar comanda", "btn-editar", () => aoAdicionarComanda(dados.id)),
            criarBotao("Finalizar atendimento", "btn-secundario", () => aoFinalizar(dados.id)),
        );
    }

    item.append(info, comandas, acoes);
    return item;
};

export const renderProduto = (produto) => {
    const item = document.createElement("article");
    item.className = "item";
    const info = document.createElement("div");
    info.className = "item-info";

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;
    const descricao = document.createElement("p");
    descricao.className = "descricao";
    descricao.textContent = produto.descricao || "Sem descrição";
    const preco = document.createElement("p");
    preco.className = "preco";
    preco.textContent = Number(produto.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    const vinculo = document.createElement("p");
    vinculo.className = "descricao";
    vinculo.textContent = `Comanda #${produto.id_commanda}`;
    info.append(nome, descricao, preco, vinculo);
    item.append(info);
    return item;
};