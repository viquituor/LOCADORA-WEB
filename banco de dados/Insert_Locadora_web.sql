-- Seleciona o banco de dados para garantir que os comandos sejam executados no lugar certo.
USE LOCADORA_WEB;

-- =================================================================
-- INSERÇÃO DE DADOS NA TABELA: Categoria
-- Primeiro, populamos as categorias, pois elas são referenciadas pelos veículos.
-- =================================================================
INSERT INTO Categoria (descricao, preco_diaria, caracteristicas) VALUES
('Econômico', 120.50, 'Ar-condicionado, 4 portas, Direção Hidráulica'),
('Intermediário', 180.00, 'Ar-condicionado, Câmbio Automático, Multimídia'),
('SUV', 250.75, 'Espaço para 5 pessoas, Tração 4x4, Câmbio Automático'),
('Luxo', 450.00, 'Bancos de couro, Teto solar, Motor Turbo');

-- =================================================================
-- INSERÇÃO DE DADOS NA TABELA: Cliente
-- Populamos os clientes com habilitações únicas.
-- =================================================================
INSERT INTO Cliente (nome, habilitacao, endereco, data_nascimento) VALUES
('Victor Hugo', '12345678901', 'Rua das Flores, 123, Centro, Vitória da Conquista', '1995-08-10'),
('Ana Carolina', '23456789012', 'Avenida Brasil, 456, Candeias, Vitória da Conquista', '1998-04-22'),
('Marcos Paulo', '34567890123', 'Praça da Bandeira, 789, Recreio, Vitória da Conquista', '1987-11-30'),
('Beatriz Lima', '45678901234', 'Rua dos Artistas, 321, Alto Maron, Vitória da Conquista', '2001-01-15');

-- =================================================================
-- INSERÇÃO DE DADOS NA TABELA: Veiculo
-- Populamos os veículos, associando cada um a uma categoria existente.
-- =================================================================
INSERT INTO Veiculo (chassi, placa, marca, modelo, ano, cor, id_categoria) VALUES
('9BWCA05UX8P012345', 'RPA1B23', 'Fiat', 'Argo', '2022', 'Branco', 1), -- Econômico
('9BDZE54T6P067890', 'QPD2C34', 'Hyundai', 'HB20', '2023', 'Prata', 2), -- Intermediário
('9BGDA12E1P011121', 'OSD3D45', 'Jeep', 'Renegade', '2021', 'Preto', 3), -- SUV
('9CDEA45B9P031313', 'NPA4E56', 'BMW', '320i', '2024', 'Azul', 4), -- Luxo
('9AWBB04UX8P054321', 'RXF5F67', 'Volkswagen', 'Gol', '2020', 'Vermelho', 1); -- Econômico

-- =================================================================
-- INSERÇÃO DE DADOS NA TABELA: Locacao
-- Finalmente, criamos os registros de locação, ligando clientes e veículos.
-- =================================================================
INSERT INTO Locacao (data_inicio, data_termino, situacao, habilitacao_cliente, chassi_veiculo) VALUES
-- Locação ENCERRADA: cliente Victor, veículo HB20
('2025-06-01', '2025-06-10', 'ENCERRADA', '12345678901', '9BDZE54T6P067890'),
-- Locação ABERTA: cliente Ana, veículo Argo
('2025-06-15', NULL, 'EM ABERTO', '23456789012', '9BWCA05UX8P012345'),
-- Locação ABERTA: cliente Marcos, veículo BMW
('2025-06-20', NULL, 'EM ABERTO', '34567890123', '9CDEA45B9P031313'),
-- Locação que foi encerrada no mesmo dia: cliente Beatriz, veículo Gol
('2025-05-20', '2025-05-20', 'ENCERRADA', '45678901234', '9AWBB04UX8P054321');

