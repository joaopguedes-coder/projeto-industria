const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());



// =========================
// Página inicial
// =========================

app.get("/", (req, res) => {

    res.json({
        projeto: "Projeto Indústria",
        status: "API funcionando com PostgreSQL",
        versao: "2.0"
    });

});

// =========================
// RF01 - Listar Produtos
// =========================

app.get("/produtos", async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT * FROM produtos ORDER BY id"
        );

        res.status(200).json(resultado.rows);

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

// =========================
// RF02 - Buscar Produto por ID
// =========================

app.get("/produtos/:id", async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT * FROM produtos WHERE id = $1",
            [req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: "Produto não encontrado."
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }
});

// =========================
// RF03 - Buscar por Nome
// =========================

app.get("/buscar/:nome", async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT * FROM produtos WHERE LOWER(nome) LIKE LOWER($1)",
            [`%${req.params.nome}%`]
        );

        res.json(resultado.rows);

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

// =========================
// RF04 - Cadastrar Produto
// =========================

app.post("/produtos", async (req, res) => {

    try {

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

        const resultado = await pool.query(

            `INSERT INTO produtos (nome, preco)
             VALUES ($1, $2)
             RETURNING *`,

            [nome, preco]

        );

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            produto: resultado.rows[0]
        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});
// =========================
// RF05 - Atualizar Produto
// =========================

app.put("/produtos/:id", async (req, res) => {

    try {

        const { nome, preco } = req.body;

        const resultado = await pool.query(

            `UPDATE produtos
             SET nome = $1,
                 preco = $2
             WHERE id = $3
             RETURNING *`,

            [nome, preco, req.params.id]

        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: "Produto não encontrado."
            });

        }

        res.json({
            mensagem: "Produto atualizado com sucesso!",
            produto: resultado.rows[0]
        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

// =========================
// RF06 - Excluir Produto
// =========================

app.delete("/produtos/:id", async (req, res) => {

    try {

        const resultado = await pool.query(

            "DELETE FROM produtos WHERE id = $1 RETURNING *",

            [req.params.id]

        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: "Produto não encontrado."
            });

        }

        res.json({
            mensagem: "Produto excluído com sucesso!"
        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

// =========================
// Estatísticas
// =========================

app.get("/estatisticas", async (req, res) => {

    try {

        const resultado = await pool.query(

            `SELECT
                COUNT(*) AS quantidade,
                COALESCE(SUM(preco),0) AS valor_total,
                COALESCE(AVG(preco),0) AS preco_medio
             FROM produtos`

        );

        res.json(resultado.rows[0]);

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

// =========================
// Servidor
// =========================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Servidor rodando em http://localhost:${PORT}`);

});