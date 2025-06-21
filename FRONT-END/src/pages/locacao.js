import React, { /* useEffect,*/ useState } from "react";
import logo from "../img/car.png"; 
import "../style/locacao.css";
import "../style/global.css";
import { Link} from 'react-router-dom';

const Locacao = () => {

    const [ListaLocacao ,setListaLocacao] = useState(true);
    const [AddLocacao, setAddLocacao] = useState(false);
    const [busca, setBusca] = useState("");


  return (
    <div className="container">
      <header>
        <nav>
        <Link to="/"><img src={logo} alt="logo"></img></Link>
        
            <button className="atv">locação</button>
            <button>veiculos</button>
            <button>clientes</button>
        
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
                            <thead><tr><th>ID</th><th>CLIENTE</th><th>HABILITAÇÃO</th><th>DATA INICIO</th><th>DATA FIM</th><th>SITUAÇÃO</th><th>MODELO</th><th>MARCA</th><th>PLACA</th></tr></thead>
                            <tbody><tr></tr></tbody>

                        </table>
                    </div>
                )}
                {AddLocacao && (
                    <div className="add-loc">
                        <h2>ADICIONE UMA NOVA LOCACAO</h2>
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
                            <button>SALVAR</button>
                            <button>VOLTAR</button>

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