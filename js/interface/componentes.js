import { updateProduto } from "../data/produtos.js";
import { updateMesa } from "../data/mesa.js";

/** Cria o elemento de produto e conecta edição, disponibilidade e atualização da lista.
 * @param {import("../classes/Produtos.js").Produto} produto
 */
export const renderProduto = (produto, edit_callback, render_callback) => {
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
    preco.textContent = produto.precoFormatado();

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
      updateProduto(produto);
      render_callback();
    });

    // Ação de edição
    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn-editar';
    btnEditar.textContent = 'Alterar';
    btnEditar.addEventListener('click', () => edit_callback(produto.id));

    acoes.append(btnDisponibilidade, btnEditar);

    /* ---- Montagem do item ---- */
    const item = document.createElement("article");
    item.className = 'item';
    item.append(info, acoes);

    return item
}

/** Cria o elemento de mesa e conecta edição, reserva e atualização da lista.
 * @param {import("../classes/Mesas.js").Mesa} mesa
 */
export const renderMesa = (mesa, edit_callback, render_callback) => {
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
      updateMesa(mesa);
      render_callback();
    });

    // Ação de edição da localização (e também da reserva)
    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn-editar';
    btnEditar.textContent = 'Alterar';
    btnEditar.addEventListener('click', () => edit_callback(mesa.id));

    acoes.append(btnReserva, btnEditar);

    /* ---- Montagem do item ---- */
    const item = document.createElement('article');
    item.className = 'item';
    item.append(info, acoes);

    return item;
  }
