const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const arquivo = "./produtos.json";

function lerProdutos() {
    return JSON.parse(fs.readFileSync(arquivo));
}

function salvarProdutos(produtos) {
    fs.writeFileSync(arquivo, JSON.stringify(produtos, null, 2));
}

// Listar
app.get("/produtos", (req, res) => {
    res.json(lerProdutos());
});

// Cadastrar
app.post("/produtos", (req, res) => {
    const produtos = lerProdutos();

    const novo = {
        id: Date.now(),
        nome: req.body.nome,
        preco: req.body.preco
    };

    produtos.push(novo);
    salvarProdutos(produtos);

    res.status(201).json(novo);
});

// Atualizar
app.put("/produtos/:id", (req, res) => {
    const produtos = lerProdutos();

    const produto = produtos.find(p => p.id == req.params.id);

    if (!produto)
        return res.status(404).json({ mensagem: "Produto não encontrado" });

    produto.nome = req.body.nome;
    produto.preco = req.body.preco;

    salvarProdutos(produtos);

    res.json(produto);
});

// Excluir
app.delete("/produtos/:id", (req, res) => {
    const produtos = lerProdutos().filter(p => p.id != req.params.id);

    salvarProdutos(produtos);

    res.status(204).send();
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});