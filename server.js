const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const ARQUIVO = "./produtos.json";

// =========================
// Funções
// =========================

function lerProdutos() {

    if (!fs.existsSync(ARQUIVO)) {
        fs.writeFileSync(ARQUIVO, JSON.stringify([], null, 2));
    }

    return JSON.parse(fs.readFileSync(ARQUIVO));

}

function salvarProdutos(produtos) {

    fs.writeFileSync(
        ARQUIVO,
        JSON.stringify(produtos, null, 2)
    );

}

// =========================
// Página inicial
// =========================

app.get("/", (req, res) => {

    res.json({
        projeto: "Projeto Indústria",
        status: "API funcionando",
        versao: "1.0"
    });

});

// =========================
// RF01 - Listar Produtos
// =========================

app.get("/produtos", (req, res) => {

    const produtos = lerProdutos();

    res.status(200).json(produtos);

});

// =========================
// RF02 - Buscar por ID
// =========================

app.get("/produtos/:id", (req, res) => {

    const produtos = lerProdutos();

    const produto = produtos.find(
        p => p.id == req.params.id
    );

    if (!produto) {

        return res.status(404).json({
            erro: "Produto não encontrado."
        });

    }

    res.json(produto);

});

// =========================
// RF03 - Buscar por Nome
// =========================

app.get("/buscar/:nome", (req, res) => {

    const produtos = lerProdutos();

    const resultado = produtos.filter(p =>
        p.nome.toLowerCase().includes(
            req.params.nome.toLowerCase()
        )
    );

    res.json(resultado);

});

// =========================
// RF04 - Cadastrar Produto
// =========================

app.post("/produtos", (req, res) => {

    const { nome, preco } = req.body;

    if (!nome || nome.trim() === "") {
        return res.status(400).json({
            erro: "O nome do produto é obrigatório."
        });
    }

    if (preco == null || preco <= 0) {
        return res.status(400).json({
            erro: "O preço deve ser maior que zero."
        });
    }

    const produtos = lerProdutos();

    const novoProduto = {
        id: Date.now(),
        nome,
        preco: Number(preco),
        criadoEm: new Date().toLocaleString("pt-BR")
    };

    produtos.push(novoProduto);

    salvarProdutos(produtos);

    res.status(201).json({
        mensagem: "Produto cadastrado com sucesso!",
        produto: novoProduto
    });

});

// =========================
// RF05 - Atualizar Produto
// =========================

app.put("/produtos/:id", (req, res) => {

    const produtos = lerProdutos();

    const produto = produtos.find(p => p.id == req.params.id);

    if (!produto) {
        return res.status(404).json({
            erro: "Produto não encontrado."
        });
    }

    if (req.body.nome)
        produto.nome = req.body.nome;

    if (req.body.preco)
        produto.preco = Number(req.body.preco);

    salvarProdutos(produtos);

    res.json({
        mensagem: "Produto atualizado com sucesso!",
        produto
    });

});

// =========================
// RF06 - Excluir Produto
// =========================

app.delete("/produtos/:id", (req, res) => {

    const produtos = lerProdutos();

    const existe = produtos.find(p => p.id == req.params.id);

    if (!existe) {
        return res.status(404).json({
            erro: "Produto não encontrado."
        });
    }

    const novaLista = produtos.filter(
        p => p.id != req.params.id
    );

    salvarProdutos(novaLista);

    res.json({
        mensagem: "Produto excluído com sucesso!"
    });

});

// =========================
// Estatísticas
// =========================

app.get("/estatisticas", (req, res) => {

    const produtos = lerProdutos();

    const quantidade = produtos.length;

    const valorTotal = produtos.reduce(
        (total, produto) => total + Number(produto.preco),
        0
    );

    const precoMedio =
        quantidade > 0 ? valorTotal / quantidade : 0;

    res.json({
        quantidade,
        valorTotal,
        precoMedio
    });

});

// =========================
// Servidor
// =========================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Servidor rodando em http://localhost:${PORT}`);

});