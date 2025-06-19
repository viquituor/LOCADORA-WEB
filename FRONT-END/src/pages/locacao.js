
import "../style/locacao.css";
import "../style/global.css";
import { Link} from 'react-router-dom';

const locacao = () => {



  return (
    <div className="container">
      <header>
        <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>
      </header>

      <main>
       
          <h3 className="select-adv">SELECIONE UM ADVOGADO</h3>
      
        
      </main>

      <footer>
        <Link to="/CadastroAdv">CADASTRE UM ADVOGADO</Link>
      </footer>
    </div>
  );
};

export default locacao;