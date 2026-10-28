/** Lê os produtos e converte registros legados em strings JSON para objetos. */
const getProdutos = () => {
    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
    return produtos.map((produto) =>
        typeof produto === "string" ? JSON.parse(produto) : produto
    );
};

/** Persiste a lista de produtos como um array de objetos JSON. */
const saveProdutos = (produtos) => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
};

/** Adiciona um produto à lista persistida.
 * @param {import("../classes/Produtos.js").Produto} produto
 */
export const addProduto = (produto) => {
    const produtos = getProdutos();
    produtos.push(JSON.parse(produto.jsonify()));
    saveProdutos(produtos);
};

/** Atualiza o produto pelo ID ou o adiciona se ainda não existir.
 * @param {import("../classes/Produtos.js").Produto} novoProdutoData
 */
export const updateProduto = (novoProdutoData) => {
    const produtos = getProdutos();
    for (let i = 0; i < produtos.length; i++){
        if (produtos[i].id === novoProdutoData.id){
            produtos[i] = JSON.parse(novoProdutoData.jsonify());
            saveProdutos(produtos);
            return;
        }
    }
    addProduto(novoProdutoData);
}

/** Remove da persistência o produto com o ID informado.
 * @param {number} prodId
 */
export const removeProduto = (prodId) => {
    const produtos = getProdutos();
    const produtosAtualizados = produtos.filter((produto) => produto.id !== prodId);
    if (produtosAtualizados.length !== produtos.length){
        saveProdutos(produtosAtualizados);
    }
}
