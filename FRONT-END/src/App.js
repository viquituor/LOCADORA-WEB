import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Locacao from './pages/locacao.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Locacao />}/>
      </Routes>
    </Router>
  );
}
export default App;