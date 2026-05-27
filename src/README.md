# INOVATECH – Gestão de Fornecedores API

API REST em Node.js com Express + Sequelize (MySQL) para o sistema INOVATECH.

---

## Requisitos

- Node.js 18+
- MySQL 8+

---

## Configuração

1. Copie o arquivo de ambiente:
   ```bash
   cp .env.example .env
   ```

2. Edite o `.env` com suas credenciais do banco:
   ```
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=inovatech
   DB_USER=root
   DB_PASS=sua_senha
   PORT=8080
   ```

3. Crie o banco de dados no MySQL:
   ```sql
   CREATE DATABASE inovatech;
   ```

4. Instale as dependências:
   ```bash
   npm install
   ```

5. Inicie o servidor:
   ```bash
   npm start
   # ou em modo desenvolvimento:
   npm run dev
   ```

---

## Estrutura do Projeto

```
src/
├── index.js                  # Ponto de entrada
├── .env.example
├── config/
│   └── database.js           # Conexão com o MySQL via Sequelize
├── models/
│   ├── index.js              # Exporta todos os models
│   ├── Fornecedor.js
│   ├── Produto.js
│   ├── Custo.js
│   └── Documento.js
├── controllers/
│   ├── fornecedorController.js
│   ├── produtoController.js
│   ├── custoController.js
│   ├── documentoController.js
│   └── dashboardController.js
├── routes/
│   ├── fornecedores.js
│   ├── produtos.js
│   ├── custos.js
│   ├── documentos.js
│   └── dashboard.js
└── middlewares/
    └── errorHandler.js
```

---

## Endpoints

### 🏢 Fornecedores

| Método | Rota                         | Descrição                              |
|--------|------------------------------|----------------------------------------|
| GET    | `/api/fornecedores`          | Listar fornecedores (`?busca=`, `?categoria=`, `?ativo=`) |
| GET    | `/api/fornecedores/:id`      | Detalhar (com produtos, custos e docs) |
| POST   | `/api/fornecedores`          | Cadastrar                              |
| PUT    | `/api/fornecedores/:id`      | Atualizar                              |
| DELETE | `/api/fornecedores/:id`      | Excluir                                |

**Body (POST/PUT):**
```json
{
  "nome": "Fornecedor XPTO",
  "categoria": "Tecnologia",
  "cnpj": "00.000.000/0001-00",
  "email": "contato@xpto.com",
  "telefone": "(41) 99999-0000",
  "endereco": "Rua das Flores, 123 - Curitiba/PR",
  "ativo": true
}
```

---

### 📦 Produtos

| Método | Rota                         | Descrição                              |
|--------|------------------------------|----------------------------------------|
| GET    | `/api/produtos`              | Listar (`?fornecedor_id=`)             |
| GET    | `/api/produtos/estoque-baixo`| Produtos com estoque abaixo do mínimo  |
| GET    | `/api/produtos/:id`          | Detalhar                               |
| POST   | `/api/produtos`              | Cadastrar                              |
| PUT    | `/api/produtos/:id`          | Atualizar                              |
| DELETE | `/api/produtos/:id`          | Excluir                                |

**Body (POST/PUT):**
```json
{
  "nome": "Notebook Dell",
  "descricao": "Notebook Core i7 16GB",
  "preco_custo": 3500.00,
  "preco_venda": 4200.00,
  "quantidade_estoque": 10,
  "estoque_minimo": 2,
  "fornecedor_id": 1
}
```

---

### 💰 Custos

| Método | Rota                     | Descrição                                       |
|--------|--------------------------|-------------------------------------------------|
| GET    | `/api/custos`            | Listar (`?fornecedor_id=`, `?tipo=`, `?data_inicio=`, `?data_fim=`) |
| GET    | `/api/custos/resumo`     | Resumo financeiro agrupado por fornecedor       |
| GET    | `/api/custos/:id`        | Detalhar                                        |
| POST   | `/api/custos`            | Registrar entrada ou saída                      |
| PUT    | `/api/custos/:id`        | Atualizar                                       |
| DELETE | `/api/custos/:id`        | Excluir                                         |

**Body (POST/PUT):**
```json
{
  "descricao": "Pagamento nota fiscal #1234",
  "tipo": "saida",
  "valor": 15000.00,
  "data_custo": "2025-05-27",
  "fornecedor_id": 1
}
```

---

### 📄 Documentos

| Método | Rota                          | Descrição                                  |
|--------|-------------------------------|--------------------------------------------|
| GET    | `/api/documentos`             | Listar (`?fornecedor_id=`, `?tipo=`)       |
| GET    | `/api/documentos/vencimentos` | Documentos vencendo em breve (`?dias=30`)  |
| GET    | `/api/documentos/:id`         | Detalhar                                   |
| POST   | `/api/documentos`             | Cadastrar                                  |
| PUT    | `/api/documentos/:id`         | Atualizar                                  |
| DELETE | `/api/documentos/:id`         | Excluir                                    |

**Body (POST/PUT):**
```json
{
  "nome": "Contrato de Fornecimento 2025",
  "tipo": "contrato",
  "caminho_arquivo": "/uploads/contratos/contrato_2025.pdf",
  "data_vencimento": "2025-12-31",
  "fornecedor_id": 1
}
```

---

### 📊 Dashboard

| Método | Rota                                   | Descrição                                    |
|--------|----------------------------------------|----------------------------------------------|
| GET    | `/api/dashboard`                       | Métricas gerais do sistema                   |
| GET    | `/api/dashboard/lucro-por-categoria`   | Entradas vs saídas por categoria             |

**Exemplo de resposta `/api/dashboard`:**
```json
{
  "fornecedores": {
    "total": 10,
    "ativos": 8,
    "inativos": 2,
    "por_categoria": [{ "categoria": "Tecnologia", "quantidade": 4 }]
  },
  "produtos": { "total": 50, "estoque_baixo": 3 },
  "financeiro": {
    "total_entradas": 120000.00,
    "total_saidas": 95000.00,
    "saldo": 25000.00
  },
  "documentos": { "total": 25, "vencendo_30_dias": 2 }
}
```

---

## Respostas de erro

Todos os erros seguem o padrão:
```json
{ "erro": "Descrição do erro." }
```

Erros de validação (422):
```json
{
  "erro": "Erro de validação.",
  "detalhes": ["O nome não pode estar vazio."]
}
```
