import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../img/car.png"; 
import "../style/clientes.css";
import "../style/global.css";
import { Link, useNavigate } from 'react-router-dom';

const Clientes = () => {

    const [formData, setFormData] = useState({
            nome: '',
            habilitacao: '',
            endereco: '',
            data_nascimento: ''
          });

    const [Listacli ,setListacli] = useState(true);
    const [Addcli, setAddcli] = useState(false);
    const [Infocli, setInfocli] = useState(false);
    const [editcli, setEditcli] = useState(false);
    const [Cliselecionado, setCliselecionado] = useState(null);
    const [Clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();


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

    const filtrarClientes = () => {
  if (!busca.trim()) return Clientes;
  
  const searchTerm = busca.toLowerCase();
  return Clientes.filter(cli => {
    // Verifica campos mais relevantes primeiro para melhor performance
    if (cli.nome.toLowerCase().includes(searchTerm)) return true;
    if (cli.habilitacao.includes(searchTerm)) return true;
    
    // Formata data para busca no formato brasileiro
    try {
      const dataFormatada = new Date(cli.data_nascimento).toLocaleDateString('pt-BR');
      if (dataFormatada.includes(searchTerm)) return true;
    } catch (e) {
      console.error("Erro ao formatar data:", e);
    }
    
    return false;
  });
};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const criarCliente = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              if (!formData.habilitacao.match(/^[0-9]{11}$/)) {
                throw new Error("Habilitação deve conter 11 dígitos");
              }
              await axios.post(`http://localhost:3001/clientes`,{...formData});
              alert("Cliente cadastrado!");
              setAddcli(false);
              setListacli(true);
              const res = await axios.get(`http://localhost:3001/clientes`);
              setClientes(res.data);
              setFormData({
                nome: '',
                habilitacao: '',
                endereco: '',
                data_nascimento: ''
              });
            } catch (err) {
              setError(err.response?.data?.error || err.message);
            } finally {
              setLoading(false);
            }
    };

    const excluirCliente = async (habilitacao) => {
  try {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirmacao) return;

    const response = await axios.delete(
      `http://localhost:3001/clientes/${habilitacao}`
    );

    if (response.data.success) {
      alert(response.data.message);
      const res = await axios.get(`http://localhost:3001/clientes`);
      setClientes(res.data);
      setInfocli(false);
      setListacli(true);
    }
  } catch (error) {
    alert(error.response?.data?.error || "Erro ao excluir cliente");
  }
    };

    const editarCliente = async (e,habilitacao) =>{
      e.preventDefault();
      setLoading(true);
      try {
        if (!formData.habilitacao.match(/^[0-9]{11}$/)) {
                throw new Error("Habilitação deve conter 11 dígitos");
              }
         await axios.put(`http://localhost:3001/clientes/${Cliselecionado.habilitacao}`,{...formData});
              alert("Cliente Atualizado!");
              setEditcli(false);
              setListacli(true);
              const res = await axios.get(`http://localhost:3001/clientes`);
              setClientes(res.data);
              setFormData({
                nome: '',
                habilitacao: '',
                endereco: '',
                data_nascimento: ''
              });
      } catch (error) {
        setError(error.response?.data?.error || error.message);
      }finally {
        setLoading(false);
      }};

  return (
    <div className="container">
      <header>
        <nav>
        <Link to="/"><img src={logo} alt="logo"></img></Link>

            <button onClick={() => navigate(`/`, {replace: true})} >locação</button>
            <button onClick={() => navigate(`/Veiculos`, {replace: true})}>veiculos</button>
            <button onClick={() => navigate(`/Clientes`, {replace: true})} className="atv">clientes</button>

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
            <button onClick={() => {setFormData({
                nome: '',
                habilitacao: '',
                endereco: '',
                data_nascimento: ''
              });setAddcli(true);setListacli(false)}}>ADICIONAR</button>
        </div>
      </header>
      <main>
                {Listacli && (
                    <div className="Lista-cli">
                     { filtrarClientes().map((cli) =>
                         <button className="cli-card" key={cli.habilitacao} onClick={() => {setListacli(false);setInfocli(true);setCliselecionado(cli)}}>
                            <h2>{cli.nome}</h2>
                            <p>{cli.habilitacao}</p>
                        </button>)}
                    </div>
                )}
                {Addcli && (
                    <div className="add-cli">
                        <h2>ADICIONE UM NOVO CLIENTE</h2>
                        <form onSubmit={criarCliente}>
                            <label>
                                Nome <br/>
                            <input
                            required
                            type="text"
                            name="nome"
                            placeholder="Nome"
                            value={formData.nome}
                            onChange={handleChange}
                            />
                            </label>
                            <label>
                                data de nascimento <br/>
                            <input
                            required
                            type="date"
                            name="data_nascimento"
                            value={formData.data_nascimento}
                            onChange={handleChange}
                                />
                            </label>

                            <label>
                                habilitação<br/>
                            <input
                            required
                            type="text"
                            name="habilitacao"
                            placeholder="habilitação"
                            value={formData.habilitacao}
                            onChange={handleChange}
                            />
                            </label>

                            <label> 
                                endereço <br/>
                            <input
                            required
                            type="text"
                            name="endereco"
                            placeholder="endereco"
                            value={formData.endereco}
                            onChange={handleChange}
                                />
                            </label>
                            
                            <button className="voltar" onClick={() => {setAddcli(false);setListacli(true)}}>VOLTAR</button>
                            <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                            {error && <button className="error-message">{error}</button>}
                        </form>
                    </div>
                )}
                {Infocli && Cliselecionado && (
                    <div className="info-cli">
                        <h2>INFORMAÇÕES DO CLIENTE</h2>
                        
                        <div className="card-info">
                        <label>
                            Nome <br/>
                            <p>{Cliselecionado.nome}</p>
                        </label>
                        <label>
                            habilitação <br/>
                            <p>{Cliselecionado.habilitacao}</p>
                        </label>
                        <label>
                            data de nascimento <br/>
                            <p>{new Date(Cliselecionado.data_nascimento).toLocaleDateString()}</p>
                        </label>
                        <label className="end">
                            endereço <br/>
                            <p>{Cliselecionado.endereco}</p>
                        </label>
                        <button className="editar" onClick={() => {setEditcli(true); setInfocli(false);setFormData({
                        ...Cliselecionado,data_nascimento: Cliselecionado.data_nascimento.split('T')[0]});}}>EDITAR</button>
                        <button className="voltar" onClick={() => {setInfocli(false);setListacli(true)} }>VOLTAR</button>
                        <button className="deletar"onClick={() => excluirCliente(Cliselecionado.habilitacao)} >EXCLUIR</button>
                        </div>
                    </div>
                )}
                {editcli && Cliselecionado && (
                    <div className="edit-cli">
                        <h2>EDITAR CLIENTE</h2>
                        <form onSubmit={editarCliente}>
                            <label>
                                Nome <br/>
                            <input
                            required
                            type="text"
                            name="nome"
                            placeholder="Nome"
                            value={formData.nome}
                            onChange={handleChange}
                            />
                            </label>
                            <label>
                                data de nascimento <br/>
                            <input
                            required
                            type="date"
                            name="data_nascimento"
                            value={formData.data_nascimento}
                            onChange={handleChange}
                                />
                            </label>

                            <label>
                                habilitação<br/>
                            <input
                            required
                            type="text"
                            name="habilitacao"
                            placeholder="habilitação"
                            value={formData.habilitacao}
                            onChange={handleChange}
                            />
                            </label>

                            <label> 
                                endereço <br/>
                            <input
                            required
                            type="text"
                            name="endereco"
                            placeholder="endereco"
                            value={formData.endereco}
                            onChange={handleChange}
                                />
                            </label>
                            
                            <button className="voltar" onClick={() => {setEditcli(false);setListacli(true)}}>VOLTAR</button>
                            <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                            {error && <button className="error-message">{error}</button>}
                        </form>
                    </div>
                )}


      </main>

      <footer>
      </footer>
    </div>
  );
};

export default Clientes;