import {
    finalizarAtendimento,
    getAtendimentos,
    iniciarAtendimento,
    registrarComanda,
} from "../api/comanda.js";
import { renderAtendimento } from "./componentes.js";

const listaAtendimentos = document.getElementById("lista-atendimentos");
const botaoIniciar = document.getElementById("btn-iniciar-atendimento");
const mensagem = document.getElementById("mensagem-atendimentos");

const mostrarErro = (erro) => {
    mensagem.textContent = erro.message;
};

export async function renderizar() {
    listaAtendimentos.replaceChildren();
    mensagem.textContent = "";

    try {
        const atendimentos = await getAtendimentos();
        if (atendimentos.length === 0) {
            const vazio = document.createElement("p");
            vazio.className = "vazio";
            vazio.textContent = "Nenhum atendimento registrado.";
            listaAtendimentos.append(vazio);
            return;
        }

        atendimentos.forEach((atendimento) => {
            listaAtendimentos.append(renderAtendimento(atendimento, {
                aoAdicionarComanda: async (id) => {
                    try {
                        await registrarComanda(id);
                        await renderizar();
                    } catch (erro) {
                        mostrarErro(erro);
                    }
                },
                aoFinalizar: async (id) => {
                    try {
                        await finalizarAtendimento(id);
                        await renderizar();
                    } catch (erro) {
                        mostrarErro(erro);
                    }
                },
                aoAdicionarProduto: (id) => {
                    window.location.href = `/produtos?comanda_id=${id}`;
                },
            }));
        });
    } catch (erro) {
        mostrarErro(erro);
    }
}

botaoIniciar.addEventListener("click", async () => {
    botaoIniciar.disabled = true;
    try {
        await iniciarAtendimento();
        await renderizar();
    } catch (erro) {
        mostrarErro(erro);
    } finally {
        botaoIniciar.disabled = false;
    }
});

void renderizar();