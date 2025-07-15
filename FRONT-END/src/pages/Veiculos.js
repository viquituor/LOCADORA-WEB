import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../img/car.png"; 
import "../style/veiculos.css";
import "../style/global.css";
import { Link, useNavigate } from 'react-router-dom';


const Veiculos = () => {

    const [ListaVeiculos , setListaVeiculos] = useState(true);
    const [AddVeiculo, setAddVeiculo] = useState(false);
    const [listaCategorias, setListaCategorias] = useState(false);
    const [addcat, setAddCat] = useState(false);
    const [editVec, setEditVec] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [busca, setBusca] = useState("");
    const [filteredVeiculos, setFilteredVeiculos] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        chassi: '',
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        cor: '',
        id_categoria: ''
    });

    const handleChange = (e) => {
    const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    useEffect(() => {
  if (busca.trim() === '') {
    setFilteredVeiculos(veiculos);
  } else {
    const filtered = veiculos.filter(veiculo =>
      veiculo.placa.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.marca.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.chassi.toLowerCase().includes(busca.toLowerCase())
    );
    setFilteredVeiculos(filtered);
  }
    }, [busca, veiculos]);

     useEffect(() => {
         const carregarVeiculos = async () => {
            try {
              const response = await axios.get('http://localhost:3001/veiculo');
              setVeiculos(response.data);
              setFilteredVeiculos(response.data);
            } catch (error) {
              console.error("Erro ao carregar veículos:", error);
            }
         };
         const carregarCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:3001/categorias');
                setCategorias(response.data);
                console.log("Categorias carregadas:", response.data);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
    }};
        carregarVeiculos();
        carregarCategorias();
    }, []);

    const deletarcat = async (id_categoria) => {
        try {
            const confirmacao = window.confirm("Tem certeza que deseja excluir esta categoria?");
    if (!confirmacao) return;

    const response = await axios.delete(`http://localhost:3001/categorias/${id_categoria}`);

    if (response.data.success) {
      alert(response.data.message);
      const res = await axios.get(`http://localhost:3001/categorias`);
      setCategorias(res.data);
      setAddCat(false);
      setListaCategorias(true);
    }
        } catch (error) {
            console.error("Erro ao deletar categoria:", error);
        }
    };

    const addCategoria = async (dados) => {
        try {
            const response = await axios.post('http://localhost:3001/categorias', dados);
            console.log("Categoria adicionada:", response.data);
            setCategorias([...categorias, response.data]);
        } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
        }
    };

    const addVeiculo = async () => {
    setLoading(true);
    setError(null); // Limpa erros anteriores
    
    // Validação formatada como string
    let errorMessage = '';
    
    if (!formData.chassi || formData.chassi.length !== 17) {
        errorMessage += "Chassi deve ter 17 caracteres. ";
    }
    if (!formData.placa || formData.placa.length !== 7) {
        errorMessage += "Placa deve ter 7 caracteres. ";
    }
    if (!formData.id_categoria) {
        errorMessage += "Selecione uma categoria. ";
    }
    
    if (errorMessage) {
        setError(errorMessage.trim()); // Envia como string única
        setLoading(false);
        return;
    }
    
    try {
        const response = await axios.post('http://localhost:3001/veiculo', {
            ...formData,
            placa: formData.placa.toUpperCase().replace(/-/g, ''),
            chassi: formData.chassi.toUpperCase()
        });
        
        alert("Veículo adicionado com sucesso!", response.data);
        const vec = await axios.get('http://localhost:3001/veiculo');
        setVeiculos(vec.data);
        setAddVeiculo(false);
        setListaVeiculos(true);
        
    } catch (err) {
        // Converte erros de API para string
        const apiError = err.response?.data?.error || err.message;
        setError(typeof apiError === 'object' ? JSON.stringify(apiError) : apiError);
    } finally {
        setLoading(false);
    }
};

    const deletarVeiculo = async (chassi) => {
        try {
            const confirmacao = window.confirm("Tem certeza que deseja excluir este veículo?");
            if (!confirmacao) return;

            const response = await axios.delete(`http://localhost:3001/veiculo/${chassi}`);

            if (response.data.success) {
                alert(response.data.message);
                const vec = await axios.get('http://localhost:3001/veiculo');
                setVeiculos(vec.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    };

    const editVeiculo = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:3001/veiculo/${formData.chassi}`, formData);
            console.log("Veículo editado:", response.data);
            const vec = await axios.get('http://localhost:3001/veiculo');
            setVeiculos(vec.data);
            setEditVec(false);
            setListaVeiculos(true);
            setFormData({
                placa: '',
                chassi: '',
                marca: '',
                modelo: '',
                ano: '',
                cor: '',
                categoria: '',
                preco_diaria: '',
                receita_total: ''
            });
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

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
            <button onClick={() => {setListaCategorias(true);setListaVeiculos(false);setAddCat(false); setAddVeiculo(false);}}>CATEGORIAS</button>
            <button onClick={() => {setAddVeiculo(true);setListaVeiculos(false); setAddCat(false); setFormData({
                                                                                                                placa: '',
                                                                                                                chassi: '',
                                                                                                                marca: '',
                                                                                                                modelo: '',
                                                                                                                ano: '',
                                                                                                                cor: '',
                                                                                                                categoria: '',
                                                                                                                preco_diaria: '',
                                                                                                                receita_total: ''});}}>ADICIONAR</button>
        </div>
      </header>
      <main>
                {ListaVeiculos && (
                    <div className="Lista-vec">
                        <table>
                            <thead><tr>
                                <th>Excluir</th>
                                <th>PLACA</th>
                                <th>CHASSI</th>
                                <th>MARCA</th>
                                <th>MODELO</th>
                                <th>ANO</th>
                                <th>COR</th>
                                <th>CATEGORIA</th>
                                <th>valor diaria</th>
                                <th>RECEITA</th>
                                <th>EDITAR</th>
                            </tr></thead>
                            <tbody>{filteredVeiculos.map(veiculo => (
                                <tr key={veiculo.chassi}>
                                <td onClick={() => deletarVeiculo(veiculo.chassi)}>&times;</td>
                                <td>{veiculo.placa}</td>
                                <td>{veiculo.chassi}</td>
                                <td>{veiculo.marca}</td>
                                <td>{veiculo.modelo}</td>
                                <td>{veiculo.ano}</td>
                                <td>{veiculo.cor}</td>
                                <td>{veiculo.categoria}</td>
                                <td>R$ {veiculo.preco_diaria}</td>
                                <td>R$ {veiculo.receita_total}</td>
                                <td onClick={() => {setEditVec(true);setAddVeiculo(false);setListaVeiculos(false); setAddCat(false); setFormData(veiculo);}}>&#9998;</td>
                                </tr>
                            ))}</tbody>

                        </table>
                    </div>
                )}
                {AddVeiculo && (
                    <div className="add-vec">
                        <h2>ADICIONE UM NOVO VEÍCULO</h2>
                        <form onSubmit={(e) => { e.preventDefault(); addVeiculo(); }}>
                            <label>
                                CHASSI <br/>
                                <input
                                type="text"
                                id="chassi"
                                value={formData.chassi}
                                onChange={handleChange} 
                                />
                            </label>
                            <label>
                                PLACA <br/>
                                <input
                                type="text"
                                id="placa"
                                value={formData.placa}
                                onChange={handleChange}
                                />
                            </label>

                            <label>
                                MARCA <br/>
                                <input
                                type="text"
                                id="marca"
                                value={formData.marca}
                                onChange={handleChange}
                                />
                            </label>
                            <label> 
                                MODELO <br/>
                                <input
                                type="text"
                                id="modelo"
                                value={formData.modelo}
                                onChange={handleChange}
                                />  
                            </label>
                            <label>
                                ANO <br/>
                                <input
                                type="text"
                                id="ano"
                                value={formData.ano}
                                onChange={handleChange}
                                />
                            </label>
                            <label>
                                COR <br/>
                                <input
                                type="text"
                                id="cor"
                                value={formData.cor}
                                onChange={handleChange}
                                />
                            </label>
                            <label>
                                CATEGORIA <br/>
                                <select name="id_categoria" id="id_categoria" value={formData.id_categoria} onChange={handleChange}>
                                    <option value=''>--</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id_categoria} value={cat.id_categoria}>
                                            {cat.descricao}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="btn">
        <button className="voltar" onClick={() => {setAddVeiculo(false);setListaVeiculos(true)}}>VOLTAR</button>
        <button className="salvar" type="submit" disabled={loading}>
            {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : "SALVAR"}
        </button>
        
        {/* Exibição de erros como string simples */}
        {error && (
            <div className="alert alert-danger mt-2">
                {error}
            </div>
        )}
    </div>
                        </form>
                    </div>
                )}
                {listaCategorias && (
                    <div className="categorias">
                        <h2>Lista de Categorias</h2>
                    <table>
                            <thead><tr><th>id</th><th>nome</th><th>preco de diaria</th><th>caracteristicas</th><th>receita total</th></tr></thead>
                            <tbody>{categorias.map(cat => (
                                <tr key={cat.id_categoria}>
                                <td>{cat.id_categoria}</td>
                                <td>{cat.descricao}</td>
                                <td>R$ {cat.preco_diaria}</td>
                                <td>{cat.caracteristicas}</td>
                                <td>{cat.receita_total}</td>
                                <td>
                                    <button className="deletar" onClick={() => {deletarcat(cat.id_categoria)}}>Excluir</button>
                                </td>
                                </tr>
                            ))}</tbody>
                        </table>
                        <div className="btn">
                            <button  className="salvar" onClick={() => {setAddCat(true);setListaCategorias(false)}}>Adicionar Categoria</button>
                            <button className="voltar" onClick={() => {setListaCategorias(false);setListaVeiculos(true)}}>VOLTAR</button>
                        </div>
                    </div>
                )}
                {addcat && (
                    <div className="categorias">
                        <h2>ADICIONE UMA NOVA CATEGORIA</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const descricao = e.target.descricao.value;
                            const preco_diaria = parseFloat(e.target.preco_diaria.value);
                            const caracteristicas = e.target.caracteristicas.value;
                            addCategoria({ descricao, preco_diaria, caracteristicas });
                            setAddCat(false);
                            setListaCategorias(true);
                        }}>
                            <label>
                                NOME:<br/>
                                <input type="text" name="descricao" required />
                            </label>
                            <label>
                                PREÇO DIÁRIA:<br/>
                                <input type="text" name="preco_diaria" required />
                            </label>
                            <label>
                                CARACTERÍSTICAS:<br/>
                                <textarea name="caracteristicas" required></textarea>
                            </label>
                            <button type="submit">Salvar</button>
                            <button className="voltar" onClick={() => {setAddCat(false);setListaCategorias(true)}}>VOLTAR</button>  
                        </form>
                    </div>
                )}
                {editVec && (
                    <div className="add-vec">
                        <h2>EDITAR VEÍCULO</h2>
                        <form onSubmit={(e) => {e.preventDefault();editVeiculo();}}>
                            <label>
                                CHASSI <br/>
                                <input
                                type="text"
                                id="chassi"
                                value={formData.chassi}
                                readOnly
                                />
                            </label>
                            <label>
                                PLACA <br/>
                                <input
                                type="text"
                                id="placa"
                                value={formData.placa}
                                onChange={handleChange}
                                />
                            </label>

                            <label>
                                MARCA <br/>
                                <input
                                type="text"
                                id="marca"
                                value={formData.marca}
                                onChange={handleChange}
                                />
                            </label>
                            <label> 
                                MODELO <br/>
                                <input
                                type="text"
                                id="modelo"
                                value={formData.modelo}
                                onChange={handleChange}
                                />  
                            </label>
                            <label>
                                ANO <br/>
                                <input
                                type="text"
                                id="ano"
                                value={formData.ano}
                                onChange={handleChange}
                                />
                            </label>
                            <label>
                                COR <br/>
                                <input
                                type="text"
                                id="cor"
                                value={formData.cor}
                                onChange={handleChange}
                                />
                            </label>
                            <label>
                                CATEGORIA <br/>
                                    <select name="id_categoria" id="id_categoria" value={formData.id_categoria} onChange={handleChange}>
                                        {categorias.map(cat => (
                                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                                {cat.descricao}
                                            </option>
                                        ))}
                                    </select>
                            </label>
                            <div className="btn">
                                    <button className="voltar" onClick={() => {setEditVec(false);setListaVeiculos(true)}}>VOLTAR</button>
                                    <button className="salvar" type="submit" disabled={loading}>
                                    {loading ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>) : ("SALVAR")}</button>
                                    {error && (<div className="alert alert-danger mt-2">{error}</div>)}
                            </div>
                        </form>
                    </div>
                )}
            </main>

      <footer>
        
      </footer>
    </div>
  );
};

export default Veiculos;