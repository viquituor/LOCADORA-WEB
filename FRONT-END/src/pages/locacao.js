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
  if (formData.situacao === 'EM ABERTO') {
    setFormData(prev => ({...prev, data_termino: ''}));
  }
      }, [formData.situacao]);

    useEffect(() => {
  if (busca.trim() === '') {
    setlocacaoFiltradas(Locacao);
  } else {
    const searchTerm = busca.toLowerCase();
    const filtered = Locacao.filter(loc => {
      // Verifica campos de texto primeiro (mais eficiente)
      if (loc.nome.toLowerCase().includes(searchTerm)) return true;
      if (loc.situacao.toLowerCase().includes(searchTerm)) return true;
      if (loc.habilitacao_cliente.toString().includes(searchTerm)) return true;
      if (loc.modelo.toLowerCase().includes(searchTerm)) return true;
      if (loc.marca.toLowerCase().includes(searchTerm)) return true;
      if (loc.placa.toLowerCase().includes(searchTerm)) return true;

      // Verifica datas com formatação consistente
      const inicioFormatado = new Date(loc.data_inicio).toLocaleDateString('pt-BR');
      if (inicioFormatado.includes(searchTerm)) return true;

      if (loc.data_termino) {
        const terminoFormatado = new Date(loc.data_termino).toLocaleDateString('pt-BR');
        if (terminoFormatado.includes(searchTerm)) return true;
      } else if ("em locação".includes(searchTerm)) {
        return true;
      }

      return false;
    });
    setlocacaoFiltradas(filtered);
  }
      }, [busca, Locacao]);

    const AdicionarLocacao = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    if (!formData.chassi || !formData.habilitacao_cliente || !formData.data_inicio) {
      throw new Error('Preencha todos os campos obrigatórios');
    }
    
    const response = await axios.post('http://localhost:3001/locacoes', {...formData});
    alert("Locação adicionada com sucesso!", response.data);
    const loc = await axios.get('http://localhost:3001/locacoes');
    setLocacoes(loc.data);
    setAddLocacao(false);
    setListaLocacao(true);
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || "Erro ao adicionar locação";
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
};

    const EncerrarLoc = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put('http://localhost:3001/locacoes/encerrar', {
                cod_loc: LocacaoSelecionada.cod_loc,
                data_termino: formData.data_termino});
            alert("Locação encerrada com sucesso:", response.data);
            const loc = await axios.get('http://localhost:3001/locacoes');
            setLocacoes(loc.data);
            setEncerrarlocacao(false);
            setListaLocacao(true);
        } catch (error) {
            console.error("Erro ao encerrar locação:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const excluirLocacao = async (cod_loc) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`http://localhost:3001/locacoes/${cod_loc}`);
            alert("Locação excluída com sucesso:", response.data);
            const loc = await axios.get('http://localhost:3001/locacoes');
            setLocacoes(loc.data);
            setListaLocacao(true);
        } catch (error) {
            console.error("Erro ao excluir locação:", error);
            setError("Erro ao excluir locação. Verifique os dados e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const atualizarLocacao = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    if (!formData.chassi || !formData.habilitacao_cliente || !formData.data_inicio || !formData.situacao) {
      throw new Error('Preencha todos os campos obrigatórios');
    }
    
    if (formData.situacao === 'ENCERRADA' && !formData.data_termino) {
      throw new Error('Data de término é obrigatória para locações encerradas');
    }

    const response = await axios.put(`http://localhost:3001/locacoes/${LocacaoSelecionada.cod_loc}`, {
      chassi_veiculo: formData.chassi,
      habilitacao_cliente: formData.habilitacao_cliente,
      data_inicio: formData.data_inicio,
      data_termino: formData.situacao === 'EM ABERTO' ? null : formData.data_termino,
      situacao: formData.situacao
    });
    
    alert("Locação atualizada com sucesso!", response.data);
    const loc = await axios.get('http://localhost:3001/locacoes');
    setLocacoes(loc.data);
    setEditLoc(false);
    setListaLocacao(true);
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || "Erro ao atualizar locação";
    setError(errorMsg);
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
                                    <tr key={loc.cod_loc}>
                                        <td onClick={() => {setLocacaoSelecionada(loc); setFormData({
                                                                                      chassi: loc.chassi_veiculo,
                                                                                      habilitacao_cliente: loc.habilitacao_cliente,
                                                                                      data_inicio: loc.data_inicio.split('T')[0], // Formata a data
                                                                                      data_termino: loc.data_termino ? loc.data_termino.split('T')[0] : '',
                                                                                      situacao: loc.situacao
                                                                                    }); setEditLoc(true); setListaLocacao(false); setAddLocacao(false);}}>&#9998;</td>
                                        <td onClick={() => {setInfoloc(true) ;setLocacaoSelecionada(loc); setAddLocacao(false); setListaLocacao(false);}}>{loc.cod_loc}</td>
                                        <td onClick={() => {setInfoloc(true) ;setLocacaoSelecionada(loc); setAddLocacao(false); setListaLocacao(false);}}>{loc.nome}</td>
                                        <td onClick={() => {setInfoloc(true) ;setLocacaoSelecionada(loc); setAddLocacao(false); setListaLocacao(false);}}>{loc.habilitacao_cliente}</td>
                                        <td onClick={() => {setInfoloc(true) ;setLocacaoSelecionada(loc); setAddLocacao(false); setListaLocacao(false);}}>{new Date(loc.data_inicio).toLocaleDateString()}</td>
                                        <td onClick={() => {setInfoloc(true) ;setLocacaoSelecionada(loc); setAddLocacao(false); setListaLocacao(false);}}>{loc.data_termino? new Date(loc.data_termino).toLocaleDateString() : loc.data_termino || "Em locação"}</td>
                                        <td onClick={() => {setInfoloc(true) ;setLocacaoSelecionada(loc); setAddLocacao(false); setListaLocacao(false);}}>{loc.situacao}</td>
                                        <td onClick={() => {setInfoloc(true) ;setLocacaoSelecionada(loc); setAddLocacao(false); setListaLocacao(false);}}>{loc.modelo}</td>
                                        <td onClick={() => {setInfoloc(true) ;setLocacaoSelecionada(loc); setAddLocacao(false); setListaLocacao(false);}}>{loc.marca}</td>
                                        <td onClick={() => {setInfoloc(true) ;setLocacaoSelecionada(loc); setAddLocacao(false); setListaLocacao(false);}}>{loc.placa}</td>
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
                        <p><strong>ID</strong> <br/> {LocacaoSelecionada.cod_loc}</p>
                        <p><strong>CLIENTE</strong> <br/>  {LocacaoSelecionada.nome}</p>
                        <p><strong>HABILITAÇÃO</strong> <br/>  {LocacaoSelecionada.habilitacao_cliente}</p>
                        <p><strong>DATA INICIO</strong><br/>  {new Date(LocacaoSelecionada.data_inicio).toLocaleDateString()}</p>
                        <p><strong>DATA FIM</strong><br/>  {LocacaoSelecionada.data_termino ? new Date(LocacaoSelecionada.data_termino).toLocaleDateString() : "Em locação"}</p>
                        <p><strong>SITUAÇÃO</strong><br/>  {LocacaoSelecionada.situacao}</p>
                        <p><strong>MODELO</strong><br/>  {LocacaoSelecionada.modelo}</p>
                        <p><strong>MARCA</strong><br/>  {LocacaoSelecionada.marca}</p>
                        <p><strong>PLACA</strong> <br/> {LocacaoSelecionada.placa}</p>
                        <div className="botoes">
                        <button className="voltar" onClick={() => {setInfoloc(false);setListaLocacao(true)}}>VOLTAR</button>
                        {LocacaoSelecionada.situacao === 'EM ABERTO' && (
                        <button className="editar" onClick={() => {setEncerrarlocacao(true);setInfoloc(false);setListaLocacao(false)}}>ENCERRAR LOCAÇÃO</button>
                        )}
                        <button className="deletar" onClick={() => excluirLocacao(LocacaoSelecionada.cod_loc)}>excluir</button>
                        </div>
                    </div>
                )}
                {EditLoc && LocacaoSelecionada && (
                    <div className="edit-loc">
                        <h2>EDITAR LOCAÇÃO</h2>
                        <form onSubmit={atualizarLocacao}>
                            <label>
                                Cliente <br/>
                                <select
                                    name="habilitacao_cliente"
                                    value={formData.habilitacao_cliente}
                                    onChange={(e) => setFormData({...formData, habilitacao_cliente: e.target.value})}>
                                    <option value="">Selecione</option>
                                    {clientes.map((cliente) => (
                                        <option key={cliente.habilitacao} value={cliente.habilitacao}>
                                            {cliente.nome}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Veículo <br/>
                                <select
                                    name="chassi"
                                    value={formData.chassi}
                                    placeholder={`${LocacaoSelecionada.modelo} -- ${LocacaoSelecionada.placa}`}
                                    onChange={(e) => setFormData({...formData, chassi: e.target.value})}>
                                    <option value="">Selecione</option>
                                    {veiculos.map((veiculo) => (
                                        <option key={veiculo.chassi} value={veiculo.chassi}>
                                            {`${veiculo.modelo} -- ${veiculo.placa}`}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Data de término <br/>
                                <input
                                    type="date"
                                    id="data_termino"
                                    name="data_termino"
                                    value={formData.data_termino || ''}
                                    onChange={(e) => setFormData({...formData, data_termino: e.target.value})}
                                    placeholder={formData.data_termino ? '' : 'Em aberto'}
                                />
                            </label>
                            <label>
                                Data de início <br/>
                                <input
                                    type="date"
                                    id="data_inicio"
                                    name="data_inicio"
                                    value={formData.data_inicio}
                                    onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
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
                                    <option value="ENCERRADA">ENCERRADA</option>
                                    <option value="EM ABERTA">EM ABERTA</option>
                                </select>
                            </label>
                            <div className="botoes">
                            <button className="salvar" type="submit" disabled={loading}>{loading ? "SALVANDO..." : "SALVAR"}</button>
                            {error && <button className="error-message">{error}</button>}
                            <button className="voltar" onClick={() => {setEditLoc(false);setListaLocacao(true)}}>VOLTAR</button>
                            </div>
                        </form>
                    </div>
                )}
                {EncerrarLocacao && LocacaoSelecionada && (
                    <div className="encerrar-loc">
                        <h2>ENCERRAR LOCAÇÃO</h2>
                        <form onSubmit={EncerrarLoc}>
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
                            <button className="salvar" type="submit" disabled={loading}>{loading ? "SALVANDO..." : "SALVAR"}</button>
                            {error && <button className="error-message">{error}</button>}
                            <button className="voltar" onClick={() => {setEncerrarlocacao(false);setListaLocacao(true)}}>VOLTAR</button>
                        </form>
                        </div>
                )}
            </main>

      <footer>
        
      </footer>
    </div>
  );
};

export default Locacao;