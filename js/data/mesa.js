export const addMesa = (mesa) => {
    if (!localStorage.hasOwnProperty("mesas")){
        localStorage.setItem("mesas", new Array());
    }

    const mesas = localStorage.getItem("mesa");
    mesas.push(mesa.jsonify());

}

export const updateMesa = (novaMesaData) => {
    if (!localStorage.hasOwnProperty("mesas")){
        localStorage.setItem("mesas", new Array());
    }
    
    const mesas = localStorage.getItem("mesas");
    
    for (let i = 0; i < mesas.length; i++){        
        if (mesas[i].id === novaMesaData.id){
            mesas[i] = novaMesaData.jsonify();
            return;
        
        }
    }
    addMesa(novaMesaData);

}

export const removeMesa = (mesaId) => {
    const mesas = localStorage.getItem("mesa");

    for (let i = 0; i < mesas.length; i++) {
        if (mesas[i].id === mesaId){
            mesas.splice(i, 1);
            return;    
        }
    
    }

}
