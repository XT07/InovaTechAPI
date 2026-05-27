require('dotenv').config();

const express = require('express');
const { sequelize } = require('./config/database');

// Importa todos os models para que as associações sejam registradas
require('./models/index');

const app  = express();
const PORT = process.env.PORT || 8080;

// ─── Middlewares globais ───────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rotas da API ─────────────────────────────────────────────────────────────
app.use('/api/fornecedores', require('./routes/fornecedores'));
app.use('/api/produtos',     require('./routes/produtos'));
app.use('/api/custos',       require('./routes/custos'));
app.use('/api/documentos',   require('./routes/documentos'));
app.use('/api/dashboard',    require('./routes/dashboard'));

// Rota raiz de health-check
app.get('/', (req, res) => {
  res.json({ sistema: 'INOVATECH - Gestão de Fornecedores', status: 'online' });
});

// ─── Middleware de erros (deve ser o último) ───────────────────────────────────
app.use(require('./middlewares/errorHandler'));

// ─── Inicialização ─────────────────────────────────────────────────────────────
async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log('✅  Conexão com o banco de dados estabelecida.');

    // force: false para não destruir dados existentes em produção
    await sequelize.sync({ alter: true });
    console.log('✅  Banco de dados sincronizado.');

    app.listen(PORT, () => {
      console.log(`🚀  Servidor INOVATECH rodando em http://localhost:${PORT}`);
      console.log('\n📋  Endpoints disponíveis:');
      console.log(`    GET/POST   /api/fornecedores`);
      console.log(`    GET/PUT/DELETE /api/fornecedores/:id`);
      console.log(`    GET/POST   /api/produtos`);
      console.log(`    GET        /api/produtos/estoque-baixo`);
      console.log(`    GET/PUT/DELETE /api/produtos/:id`);
      console.log(`    GET/POST   /api/custos`);
      console.log(`    GET        /api/custos/resumo`);
      console.log(`    GET/PUT/DELETE /api/custos/:id`);
      console.log(`    GET/POST   /api/documentos`);
      console.log(`    GET        /api/documentos/vencimentos`);
      console.log(`    GET/PUT/DELETE /api/documentos/:id`);
      console.log(`    GET        /api/dashboard`);
      console.log(`    GET        /api/dashboard/lucro-por-categoria`);
    });
  } catch (error) {
    console.error('❌  Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

iniciar();
