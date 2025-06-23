import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Locacao from './pages/Locacao.js';
import Clientes from './pages/Clientes.js';
import Veiculos from './pages/Veiculos.js';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Locacao />}/>
        <Route path="/clientes" element={<Clientes />}/>
        <Route path="/veiculos" element={<Veiculos />}/>
      </Routes>
    </Router>
  );
}
export default App;