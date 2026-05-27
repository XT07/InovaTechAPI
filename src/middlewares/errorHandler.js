/**
 * Middleware global de tratamento de erros.
 * Captura erros lançados por qualquer rota e retorna uma resposta JSON padronizada.
 */
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor.';

  // Erros de validação do Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => e.message);
    return res.status(422).json({ erro: 'Erro de validação.', detalhes: errors });
  }

  res.status(status).json({ erro: message });
}

module.exports = errorHandler;
