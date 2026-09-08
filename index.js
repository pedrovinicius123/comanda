class Produto {
    constructor(tipo, preco, qtd){
        this.tipo = tipo
        this.preco = preco
        this.qtd = qtd
    }

    render() {
        const item = document.createElement("div");
        
        item.className = "produto";
        const tipo = document.createElement("p");
        const preco = document.createElement("p");
        
        tipo.textContent = this.tipo;
        preco.textContent = `R$ ${this.qtd} x `+ this   .preco;

        item.appendChild(tipo)
        item.appendChild(preco)

        return item
    }
}

class Comanda {
    #show
    constructor(mesa_id, produtos){
        this.mesa_id = mesa_id;
        this.comanda_id = Math.floor(Math.random() * 10000)
        this.produtos_comanda = produtos;
        this.preco_total = 0.00;
        this.#show = false

        for (const prod of produtos){
            this.preco_total += prod.qtd * prod.preco;
        }
    }
    
    render (){
        // Cria o container principal e guarda a referência nele mesmo
        const item = document.createElement("div");
        
        const button = document.createElement("button")
        button.id = "button-"+this.comanda_id
        button.className = "showButton"
        button.textContent = "Ver Detalhes" 
        
        const detalhesContainer = document.createElement("div");

        button.addEventListener("click", () => {
            this.#show = !this.#show;
            console.log("Clicked! " + this.#show);
            
            detalhesContainer.innerHTML = "";
            item.className = ""; 

            if (this.#show){
                item.className = "borded"
                detalhesContainer.className = "borded"

                const preco_total = document.createElement("p")
                preco_total.textContent = "R$ " + this.preco_total.toFixed(2); 

                for (const produto of this.produtos_comanda){
                    const produto_elem = produto.render();
                    detalhesContainer.appendChild(produto_elem);
                }

                detalhesContainer.appendChild(preco_total);
            }
        })

        // Monta a estrutura inicial
        item.appendChild(button);
        item.appendChild(detalhesContainer);
        
        return item;
    }
}


const produtos = {
    hamburger: (qtd) => new Produto("Hamburguer", 10.00, qtd),
    pastel: (qtd) => new Produto("Pastel", 8.00, qtd),
    bebidas :{
        suco_de_laranja: (qtd) => new Produto("Suco de laranja", 5.00, qtd),
        refri: (qtd) => new Produto("Refri", 8.00, qtd)
    }
}

const pedidos_em_andamento = [
    new Comanda(0,[
        produtos.hamburger(2),
        produtos.bebidas.suco_de_laranja(1)
    ]), 
    new Comanda(0, [
        produtos.hamburger(1),
        produtos.bebidas.suco_de_laranja(1),
    ]),
    new Comanda(1, [
        produtos.pastel(2),
        produtos.bebidas.refri(1)
    ])
]

let n_mesas = 2

const listar_pedidos = () => {
    const pedidos = document.querySelector(".pedidos");
    for (let i = 0; i < n_mesas; i++){
        const item = document.createElement("div");
        item.className = "mesa";
        pedidos.appendChild(item);

    }

    for (const pedido of pedidos_em_andamento){
        const item = pedidos.querySelector(`.mesa:nth-child(${pedido.mesa_id+1})`);
        item.appendChild(pedido.render())        
    }
}

listar_pedidos()
