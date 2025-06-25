import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../img/car.png"; 
import "../style/locacao.css";
import "../style/global.css";
import { Link, useNavigate } from 'react-router-dom';


const Locacao = () => {

    const [ListaLocacao ,setListaLocacao] = useState(true);
    const [AddLocacao, setAddLocacao] = useState(false);
    const [locacaoFiltradas, setlocacaoFiltradas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [Locacao, setLocacoes] = useState([]);
    const [LocacaoSelecionada, setLocacaoSelecionada] = useState(null);
    const [Infoloc, setInfoloc] = useState(false);
    const [EditLoc, setEditLoc] = useState(false);
    const [EncerrarLocacao, setEncerrarlocacao] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        chassi: '',
        habilitacao_cliente: '',
        data_inicio: '',
        data_termino: '',
        situacao: ''
    });


    useEffect(() => {
            const carregarClientes = async () => {
                try {
                    const response = await axios.get('http://localhost:3001/clientes');
                    console.log(response.data);
                    setClientes(response.data);
    
                } catch (error) {
                    console.error("Erro completo:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
                }
            };
            carregarClientes();
    
      }, []);

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

    useEffect(() => {
  const carregarLocacoes = async () => {
    try {
      
      const response = await axios.get('http://localhost:3001/locacoes', {
        timeout: 3000
      });
      
      console.log("Dados recebidos:", response.data);
      setLocacoes(response.data);
    } catch (error) {
      console.error("Erro completo:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };
  
  carregarLocacoes();
      }, []);

    useEffect(() => {
  if (busca.trim() === '') {
    setlocacaoFiltradas(Locacao);
  } else {
    const filtered = Locacao.filter(loc =>
      loc.nome.toLowerCase().includes(busca.toLowerCase()) ||
      loc.situacao.toLowerCase().includes(busca.toLowerCase()) ||
      loc.data_inicio.toString().includes(busca.toLowerCase()) ||
      loc.data_termino.toString().includes(busca.toLowerCase()) ||
      loc.habilitacao_cliente.toString().includes(busca.toLowerCase()) ||
      loc.modelo.toString().includes(busca.toLowerCase()) ||
      loc.marca.toString().includes(busca.toLowerCase())
    );
    setlocacaoFiltradas(filtered);
  }
      }, [busca, Locacao]);

    const AdicionarLocacao = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:3001/locacoes', {...formData});
            alert("Locação adicionada com sucesso:", response.data);
            setAddLocacao(false);
            setListaLocacao(true);
        } catch (error) {
            console.error("Erro ao adicionar locação:", error);
            setError("Erro ao adicionar locação. Verifique os dados e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="container">
      <header>
        <nav>
        <Link to="/"><img src={logo} alt="logo"></img></Link>
        
            <button onClick={() => navigate(`/`, {replace: true})} className="atv">locação</button>
            <button onClick={() => navigate(`/Veiculos`, {replace: true})}>veiculos</button>
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
            <button onClick={() => {setAddLocacao(true);setListaLocacao(false)}}>ADICIONAR</button>
        </div>
      </header>
      <main>
                {ListaLocacao && (
                    <div className="Lista-loc">
                        <table>
                            <thead><tr><th>&#9998;</th><th>ID</th><th>CLIENTE</th><th>HABILITAÇÃO</th><th>DATA INICIO</th><th>DATA FIM</th><th>SITUAÇÃO</th><th>MODELO</th><th>MARCA</th><th>PLACA</th></tr></thead>
                            <tbody>{locacaoFiltradas.map((loc) => (
                                    <tr key={loc.cod_loc} onClick={() => {setInfoloc(true) ;setLocacaoSelecionada(loc); setAddLocacao(false); setListaLocacao(false);}}>
                                        <td onClick={() => {setLocacaoSelecionada(loc); setEditLoc(true);setListaLocacao(false); setAddLocacao(false);}}>&#9998;</td>
                                        <td>{loc.cod_loc}</td>
                                        <td>{loc.nome}</td>
                                        <td>{loc.habilitacao_cliente}</td>
                                        <td>{new Date(loc.data_inicio).toLocaleDateString()}</td>
                                        <td>{loc.data_termino? new Date(loc.data_termino).toLocaleDateString() : loc.data_termino || "Em locação"}</td>
                                        <td>{loc.situacao}</td>
                                        <td>{loc.modelo}</td>
                                        <td>{loc.marca}</td>
                                        <td>{loc.placa}</td>
                                        </tr>
                            ))}</tbody>

                        </table>
                    </div>
                )}
                {AddLocacao && (
                    <div className="add-loc">
                        <h2>ADICIONE UMA NOVA LOCAÇÃO</h2>
                        <form onSubmit={AdicionarLocacao}>
                            <select name="habilitacao_cliente" onChange={(e) => setFormData({...formData, habilitacao_cliente: e.target.value})}>
                                <option value=''>Clientes</option>
                                {clientes.map((cliente) => (
                                    <option key={cliente.habilitacao} value={cliente.habilitacao}>
                                        {cliente.nome}
                                    </option>
                                ))} 
                            </select>
                            <select name="chassi" onChange={(e) => setFormData({...formData, chassi: e.target.value})}>
                                <option value=''>Veiculos</option>
                                {veiculos.map((veiculo) => (
                                    <option key={veiculo.chassi} value={veiculo.chassi}>
                                        {`${veiculo.modelo} -- ${veiculo.placa}`}
                                    </option>
                                ))}
                            </select>

                            <label>
                                data de inicio <br/>
                                <input
                                type="date"
                                id="data_inicio"
                                name="data_inicio"
                                value={formData.data_inicio}
                                onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                                />
                            </label>
                            <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                            {error && <button className="error-message">{error}</button>}
                            <button className="voltar" onClick={() => {setAddLocacao(false);setListaLocacao(true)}}>VOLTAR</button>

                        </form>
                    </div>
                )}
                {Infoloc && LocacaoSelecionada && (
                    <div className="info-loc">
                        <h2>INFORMAÇÕES DA LOCAÇÃO</h2>
                        <p><strong>ID:</strong> {LocacaoSelecionada.cod_loc}</p>
                        <p><strong>CLIENTE:</strong> {LocacaoSelecionada.nome}</p>
                        <p><strong>HABILITAÇÃO:</strong> {LocacaoSelecionada.habilitacao_cliente}</p>
                        <p><strong>DATA INICIO:</strong> {new Date(LocacaoSelecionada.data_inicio).toLocaleDateString()}</p>
                        <p><strong>DATA FIM:</strong> {LocacaoSelecionada.data_termino ? new Date(LocacaoSelecionada.data_termino).toLocaleDateString() : "Em locação"}</p>
                        <p><strong>SITUAÇÃO:</strong> {LocacaoSelecionada.situacao}</p>
                        <p><strong>MODELO:</strong> {LocacaoSelecionada.modelo}</p>
                        <p><strong>MARCA:</strong> {LocacaoSelecionada.marca}</p>
                        <p><strong>PLACA:</strong> {LocacaoSelecionada.placa}</p>
                        <button className="voltar" onClick={() => {setInfoloc(false);setListaLocacao(true)}}>VOLTAR</button>
                        <button className="editar" onClick={() => {setEncerrarlocacao(true);setInfoloc(false);setListaLocacao(false)}}>ENCERRAR LOCAÇÃO</button>
                        <button className="deletar">excluir</button>
                    </div>
                )}
                {EditLoc && LocacaoSelecionada && (
                    <div className="edit-loc">
                        <h2>EDITAR LOCAÇÃO</h2>
                        <form >
                            <label>
                                Data de término <br/>
                                <input
                                    type="date"
                                    id="data_termino"
                                    name="data_termino"
                                    value={formData.data_termino}
                                    onChange={(e) => setFormData({...formData, data_termino: e.target.value})}
                                />
                            </label>
                            <label>
                                Situação <br/>
                                <select
                                    name="situacao"
                                    value={formData.situacao}
                                    onChange={(e) => setFormData({...formData, situacao: e.target.value})}
                                >
                                    <option value="">Selecione</option>
                                    <option value="Finalizada">Finalizada</option>
                                    <option value="Em locação">Em locação</option>
                                </select>
                            </label>
                            <button className="salvar" type="submit" disabled={loading}>{loading ? "SALVANDO..." : "SALVAR"}</button>
                            {error && <button className="error-message">{error}</button>}
                            <button className="voltar" onClick={() => {setEditLoc(false);setListaLocacao(true)}}>VOLTAR</button>
                        </form>
                    </div>
                )}
                {EncerrarLocacao && LocacaoSelecionada && (
                    <div className="encerrar-loc">
                        <h2>ENCERRAR LOCAÇÃO</h2>
                        </div>
                )}
            </main>

      <footer>
        
      </footer>
    </div>
  );
};

export default Locacao;