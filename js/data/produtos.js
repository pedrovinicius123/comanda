export const addProduto = (mesa) => {
    let produtos = localStorage.getItem("produtos");
    if (!produtos){
        localStorage.setItem("produtos", new Array());
    }
    produtos = localStorage.getItem("produtos")  
    console.log(produtos)  
    produtos.push(mesa.jsonify());
    
}

export const updateProduto = (novoProdutoData) => {
    let produtos = localStorage.getItem("produtos");
    if (!produtos){
        localStorage.setItem("produtos", new Array());
    }
    produtos = localStorage.getItem("produtos");  
    for (let i = 0; i < produtos.length; i++){        
        if (produtos[i].id === novoProdutoData.id){
            produtos[i] = novaProdutoData.jsonify();
            return;
        
        }
    }
    addProduto(novoProdutoData);

}

export const removeProduto = (mesaId) => {
    const produtos = localStorage.getItem("produtos");
    if (produtos){
        for (let i = 0; i < mesas.length; i++) {
            if (mesas[i].id === mesaId){
                mesas.splice(i, 1);
                return;    
            }
        
        }

    }

}
