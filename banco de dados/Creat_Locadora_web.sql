DROP DATABASE IF EXISTS locadora;

CREATE DATABASE locadora;

USE locadora;

CREATE TABLE Cliente (
  nome VARCHAR(100) NOT NULL,
  habilitacao CHAR(11) PRIMARY KEY,
  endereco VARCHAR(200) NOT NULL,
  data_nascimento DATE NOT NULL
);

-- Tabela para definir as categorias dos veículos e seus preços
CREATE TABLE Categoria (
  id_categoria SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(100) NOT NULL,
  preco_diaria DECIMAL(10,2) UNSIGNED NOT NULL,
  caracteristicas VARCHAR(200) NOT NULL
);

-- Tabela para o cadastro de cada veículo da frota
CREATE TABLE Veiculo (
  chassi CHAR(17) PRIMARY KEY,
  placa CHAR(7) NOT NULL UNIQUE,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  ano CHAR(4) NOT NULL,
  cor VARCHAR(30) NOT NULL,
  id_categoria SMALLINT UNSIGNED NOT NULL,

  -- Definição da Chave Estrangeira
  CONSTRAINT FK_Veiculo_Categoria
    FOREIGN KEY (id_categoria)
    REFERENCES Categoria (id_categoria)
    ON DELETE RESTRICT -- Impede deletar uma categoria se veículos estiverem associados a ela
);

-- Tabela para registrar as locações
CREATE TABLE Locacao (
  cod_loc SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- Chave primária essencial para identificar a locação
  data_inicio DATE NOT NULL,
  data_termino DATE, 
  situacao ENUM('ABERTA','ENCERRADA') NOT NULL DEFAULT 'ABERTA',
  habilitacao_cliente CHAR(11),
  chassi_veiculo CHAR(17),
  
  -- Definição das Chaves Estrangeiras
  CONSTRAINT FK_Locacao_Cliente
    FOREIGN KEY (habilitacao_cliente)
    REFERENCES Cliente (habilitacao)
    ON DELETE RESTRICT, -- Impede que um cliente com locações seja apagado

  CONSTRAINT FK_Locacao_Veiculo
    FOREIGN KEY (chassi_veiculo)
    REFERENCES Veiculo (chassi)
    ON DELETE RESTRICT -- Impede que um veículo com locações seja apagado
);