import { addMesa, updateMesa, removeMesa } from "../data/mesa.js"
import { Mesa } from "../classes/Mesas.js"

let idEmEdicao = null;

const form             = document.getElementById('form-mesa');
const campoNumero      = document.getElementById('numero');
const campoLocalizacao = document.getElementById('localizacao');
const campoReservada   = document.getElementById('reservada');
const btnSalvar        = document.getElementById('btn-salvar');
const btnCancelar      = document.getElementById('btn-cancelar');
const tituloForm       = document.getElementById('titulo-form');
const listaMesas       = document.getElementById('lista-mesas');

function iniciarEdicao(id) {

    const mesas = localStorage.getItem("mesas");
    if (!mesas) return;
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



export function renderizar(){
    listaMesas.innerHTML = '';
    if (localStorage.hasOwnProperty("mesas")){
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
            listaMesas.appendChild(mesa.render(iniciarEdicao));

        });
    
    }

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
if (form != null){
    form.addEventListener('submit', (evento) => {
        evento.preventDefault();

        if (idEmEdicao === null) {
            // Cadastro: cria um novo objeto instanciado da classe Mesa
            const numero      = parseInt(campoNumero.value, 10);
            const localizacao = campoLocalizacao.value.trim();
            const reservada   = campoReservada.value === 'true';

            if (Number.isNaN(numero) || !localizacao) return;

            updateMesa(new Mesa(numero, localizacao, reservada));
            form.reset();
            campoNumero.focus();
        } else {
        // Alteração: modifica o objeto já existente no array
            const mesa = mesas.find((m) => m.id === idEmEdicao);
            const localizacao = campoLocalizacao.value.trim();
            const reservada   = campoReservada.value === 'true';

            if (mesa && localizacao) {
                mesa.localizacao = localizacao;
                mesa.atualizar_reserva = reservada;
            }

            updateMesa(mesa);
            finalizarEdicao();
        }
        renderizar();
    });
}

btnCancelar.addEventListener('click', () => {
    finalizarEdicao();
    renderizar();
});

