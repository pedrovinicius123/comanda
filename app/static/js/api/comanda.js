/*Atualização: salvamento efetivo das mesas e dos produtos (JSON.parse e .stringify) */

/** Lê as mesas e converte registros legados em strings JSON para objetos. */
const getMesas = async () => {
    const response = await fetch("http://localhost:5000/")
    const mesas = JSON.parse(localStorage.getItem("mesas") || "[]");
    return mesas.map((mesa) =>
        typeof mesa === "string" ? JSON.parse(mesa) : mesa
    );
};

/** Persiste a lista de mesas como um array de objetos JSON. */
const saveMesas = (mesas) => {
    localStorage.setItem("mesas", JSON.stringify(mesas));
};

/** Adiciona uma mesa à lista persistida.
 * @param {import("../classes/Comandas.js").Mesa} mesa
 */
export const addMesa = (mesa) => {
    const mesas = getMesas();
    mesas.push(JSON.parse(mesa.jsonify()));
    saveMesas(mesas);

}

/** Atualiza a mesa pelo ID ou a adiciona se ainda não existir.
 * @param {import("../classes/Comandas.js").Mesa} novaMesaData
 */
export const updateMesa = (novaMesaData) => {
    const mesas = getMesas();
    
    for (let i = 0; i < mesas.length; i++){        
        if (mesas[i].id === novaMesaData.id){
            mesas[i] = JSON.parse(novaMesaData.jsonify());
            saveMesas(mesas);
            return;
        }
    }
    addMesa(novaMesaData);

}

/** Remove da persistência a mesa com o ID informado.
 * @param {number} mesaId
 */
export const removeMesa = (mesaId) => {
    const mesas = getMesas();
    const mesasAtualizadas = mesas.filter((mesa) => mesa.id !== mesaId);
    if (mesasAtualizadas.length !== mesas.length){
        saveMesas(mesasAtualizadas);
    }
}
