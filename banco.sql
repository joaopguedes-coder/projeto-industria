CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco NUMERIC(10,2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO produtos (nome, preco)
VALUES
('Parafuso', 15.90),
('Porca', 7.50),
('Arruela', 3.20);