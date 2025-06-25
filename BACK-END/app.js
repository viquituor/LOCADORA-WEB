const express = require('express');
const cors = require('cors');
const locacaoRouter = require('./routes/locacao.js');
const clienteRouter = require('./routes/cliente.js');
const veiculoRouter = require('./routes/veiculo.js');


const app = express();

// Configuração CORS simplificada e eficaz
app.use(cors());

// Middlewares essenciais
app.use(express.json());


// Middleware de log
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rotas PRINCIPAIS (importante vir antes do router)
app.get('/', (req, res) => {
  res.send('API da Locadora');
});

// Usar o router
app.use('/', locacaoRouter);
app.use('/', clienteRouter);
app.use('/', veiculoRouter);





// Rota de teste direta (adicione esta rota NOVA)

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});