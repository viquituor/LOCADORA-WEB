import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../img/car.png"; 
import "../style/veiculos.css";
import "../style/global.css";
import { Link, useNavigate } from 'react-router-dom';

const Veiculos = () => {

    const [ListaLocacao ,setListaLocacao] = useState(true);
    const [AddLocacao, setAddLocacao] = useState(false);
    const [categorias, setCategorias] = useState(false);
    const [veiculos, setVeiculos] = useState([]);
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();


     useEffect(() => {
         const carregarVeiculos = async () => {
            try {
              const response = await axios.get('http://localhost:3001/veiculo');
              setVeiculos(response.data);
            } catch (error) {
              console.error("Erro ao carregar veículos:", error);
            }
         };
         carregarVeiculos();
     }, []);

  return (
    <div className="container">
      <header>
        <nav>
        <Link to="/"><img src={logo} alt="logo"></img></Link>
        
            <button onClick={() => navigate(`/`, {replace: true})} >locação</button>
            <button onClick={() => navigate(`/Veiculos`, {replace: true})} className="atv">veiculos</button>
            <button onClick={() => navigate(`/Clientes`, {replace: true})}>clientes</button>
        
        <Link to="/"><img src={logo} alt="logo"></img></Link>
        </nav>
        <div className="add">
            <input
            name="busca"
            type="text"
            placeholder="Buscar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
                    />
            <button onClick={() => {setCategorias(true);setListaLocacao(false)}}>CATEGORIAS</button>
            <button onClick={() => {setAddLocacao(true);setListaLocacao(false)}}>ADICIONAR</button>
        </div>
      </header>
      <main>
                {ListaLocacao && (
                    <div className="Lista-vec">
                        <table>
                            <thead><tr><th>PLACA</th><th>CHASSI</th><th>MARCA</th><th>MODELO</th><th>ANO</th><th>COR</th><th>CATEGORIA</th><th>valor diaria</th><th>RECEITA</th></tr></thead>
                            <tbody>{veiculos.map(veiculo => (
                                <tr key={veiculo.chassi}>
                                <td >{veiculo.placa}</td>
                                <td>{veiculo.chassi}</td>
                                <td>{veiculo.marca}</td>
                                <td>{veiculo.modelo}</td>
                                <td>{veiculo.ano}</td>
                                <td>{veiculo.cor}</td>
                                <td>{veiculo.categoria}</td>
                                <td>R$ {veiculo.preco_diaria}</td>
                                <td>R$ {veiculo.receita_total}</td>
                                </tr>
                            ))}</tbody>

                        </table>
                    </div>
                )}
                {AddLocacao && (
                    <div className="add-loc">
                        <h2>ADICIONE UMA NOVA LOCAÇÃO</h2>
                        <form>
                            <select name="cliente">
                                <option value=''>Clientes</option>
                            </select>
                            <select name="veiculo">
                                <option value=''>Veiculos</option>
                            </select>

                            <label>
                                data de inicio <br/>
                                <input
                                type="date"
                                id="data_inicio"
                                />
                            </label>
                            <label> 
                                data de termino <br/>
                                <input
                                type="date"
                                id="data_termino"
                                />
                            </label>
                            <button className="salvar">SALVAR</button>
                            <button className="voltar" onClick={() => {setAddLocacao(false);setListaLocacao(true)}}>VOLTAR</button>

                        </form>
                    </div>
                )}
                {categorias && (
                    <div className="categorias">
                    
                    </div>
                )}
      </main>

      <footer>
        
      </footer>
    </div>
  );
};

export default Veiculos;