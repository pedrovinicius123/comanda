# API Comanda

API Flask para cadastro de atendentes, abertura de atendimentos e controle de comandas e produtos.

## Executar localmente

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask --app app.py run --debug
```

A API fica disponível em `http://127.0.0.1:5000`. O banco padrão é SQLite (`app.db`). Para criar as tabelas usando as migrations:

```bash
flask --app app.py db upgrade
```

## Autenticação

O login usa sessão do Flask. Primeiro crie um atendente:

```http
POST /atendentes/register
Content-Type: application/json

{"password": "segredo"}
```

Depois faça login. O cookie de sessão deve ser mantido nas chamadas seguintes:

```http
POST /atendentes/login
Content-Type: application/json

{"id": 1, "password": "segredo"}
```

As rotas sob `/atendimentos` exigem autenticação e respondem `401` quando não existe uma sessão válida.

## Endpoints

| Método | Rota | Descrição | Resposta de sucesso |
| --- | --- | --- | --- |
| `POST` | `/atendentes/register` | Cadastra atendente. | `201` |
| `POST` | `/atendentes/login` | Inicia a sessão do atendente. | `200` |
| `PATCH` | `/atendentes/update` | Atualiza a senha usando `{"id": 1, "password": "nova"}`. | `200` |
| `DELETE` | `/atendentes/delete` | Remove atendente usando `{"id": 1}`. | `200` |
| `POST` | `/atendimentos/` | Abre atendimento e sua primeira comanda. | `201` |
| `PUT` | `/atendimentos/` | Finaliza atendimento usando `{"id": 1}`. | `200` |
| `POST` | `/atendimentos/comandas` | Cria comanda com `id_atendimento` e, opcionalmente, `valor_a_pagar`. | `201` |
| `PUT` | `/atendimentos/comandas` | Registra pagamento parcial com `{"id": 1, "valor": 10}`. | `200` |
| `PATCH` | `/atendimentos/comandas` | Adiciona produtos usando `{"c_id": 1, "prods": [{"nome": "Cafe", "preco": 7.5}]}`. | `200` |

Erros de entrada retornam JSON no formato `{"error": "...", "details": {...}}` e status `400`. Recursos inexistentes retornam `404` quando a rota usa busca obrigatória.

## Testes

Execute todos os testes com:

```bash
python -m unittest discover -v
```

Os testes usam SQLite em memória e cobrem autenticação, autorização, CRUD de atendente, ciclo de atendimento, comandas, produtos, pagamentos e validação de entrada.
