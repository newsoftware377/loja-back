<h1 align="center">End-point backend loja</h1>

## URL base: https://loja-back-1.onrender.com/

### Autenticação

- (Fazer o login) **POST** : "auth/loja/login"


Enviar isso no _body_

```json
{
  "empresaId": "vinicius-aguiar-31158a5edbe1c8f027b595d91e13bf9c5469984a",
  "lojaId": "loja-1-1a3317ffbb490572c6347adb7996974381d15a3b"
}
```

_Retorno de sucesso_

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoibG9qYSAxIiwiZW1wcmVzYUlkIjoidmluaWNpdXMtYWd1aWFyLTMxMTU4YTVlZGJlMWM4ZjAyN2I1OTVkOTFlMTNiZjljNTQ2OTk4NGEiLCJjbnBqIjoiMTIxMjMxMjMzMzMiLCJsb2phSWQiOiJsb2phLTEtMWEzMzE3ZmZiYjQ5MDU3MmM2MzQ3YWRiNzk5Njk3NDM4MWQxNWEzYiIsImlkIjoiNjY5MmYwYTIzZjJmNmExYmYyNGY0NDllIiwiaWF0IjoxNzIwOTI1NzMyLCJleHAiOjE3MjM1MTc3MzJ9.1iLnfcaBEKyEie7QQwTxwrxwKaUDaFV_FHGzT03zPEs"
}
```

- (Fazer o login  no deposito) **POST** : "auth/loja/deposito"

Enviar isso no _body_

```json
{
  "empresaId": "vinicius-aguiar-31158a5edbe1c8f027b595d91e13bf9c5469984a",
  "depositoId": "deposito-1-1a3317ffbb490572c6347adb7996974381d15a3b"
}
```

_Retorno de sucesso_

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoibG9qYSAxIiwiZW1wcmVzYUlkIjoidmluaWNpdXMtYWd1aWFyLTMxMTU4YTVlZGJlMWM4ZjAyN2I1OTVkOTFlMTNiZjljNTQ2OTk4NGEiLCJjbnBqIjoiMTIxMjMxMjMzMzMiLCJsb2phSWQiOiJsb2phLTEtMWEzMzE3ZmZiYjQ5MDU3MmM2MzQ3YWRiNzk5Njk3NDM4MWQxNWEzYiIsImlkIjoiNjY5MmYwYTIzZjJmNmExYmYyNGY0NDllIiwiaWF0IjoxNzIwOTI1NzMyLCJleHAiOjE3MjM1MTc3MzJ9.1iLnfcaBEKyEie7QQwTxwrxwKaUDaFV_FHGzT03zPEs"
}
```

- ⚠️ <span style="color: #e4911e">essa empresa e essa loja já foram criadas quando testei</span>
- ⚠️ <span style="color: #e4911e">Todas os outros endpoints precisam passar esse token no header authorization</span>

```bash
authorization: "Bearer {token}"
```

### Produto

- (Criar categoria) **POST** "produto/loja/categoria"

Enviar isso no _body_

```json
{
  "nome": "Vestido"
}
```

_Retorno de sucesso_

```json
{
  "nome": "Vestido",
  "id": "669a94b45455bc666c787215",
  "empresaId": "loja-1-1a3317ffbb490572c6347adb7996974381d15a3b"
}
```

- (Listar categorias) **GET** 'produto/categoria/loja/:lojaId'

Enviar o _Id da loja_ como parâmetro

_Retorno de sucesso_

```json
[
  {
    "nome": "Vestido",
    "id": "669a94b45455bc666c787215",
    "empresaId": "loja-1-1a3317ffbb490572c6347adb7996974381d15a3b"
  },
  {
    "nome": "Vestido",
    "id": "669a94b45455bc666c787215",
    "empresaId": "loja-1-1a3317ffbb490572c6347adb7996974381d15a3b"
  }
]
```

- (Deletar categoria) **DELETE** 'produto/categoria/:id'

Enviar o _Id da categoria_ como parâmetro

_Retorno de sucesso_

```json
{
  "nome": "Vestido",
  "id": "669a94b45455bc666c787215",
  "lojaId": "loja-1-1a3317ffbb490572c6347adb7996974381d15a3b"
}
```

- (Atualizar nome da categoria) **PATCH** 'produto/categoria/:id'

Enviar o _Id da categoria_ como parâmetro

```json
{
  "nome": "Calçado"
}
```

_Retorno de sucesso_

```json
    {
        "nome": "Calçado",
        "id": "669a94b45455bc666c787215",
        "empresaId": "loja-1-1a3317ffbb490572c6347adb7996974381d15a3b"
    },

```

- (Criar um produto) **POST** : "produto/loja"

Enviar isso no _body_

```json
{
  "nome": "Roupa 10",
  "categoriaId": "669a94b45455bc666c787215",
  "valorCompra": 10,
  "valorOriginal": 30,
  "valorAtual": 15,
  "qtdMinima": 2,
  "lojaId": "loja-1-asndoisadadajnduhbadjspaksdasdb" 
}
```

_Retorno de sucesso_

```json
{
  "nome": "Roupa 10",
  "categoria": "vestido",
  "categoriaId": "669a94b45455bc666c787215",
  "valorAtual": 15,
  "valorCompra": 10,
  "id": "6691e7f63ce2d9cece459208",
  "valorOriginal": 30,
  "codigoBarra": 17208381340,
  "qtdMinima": 2
}
```

- (Criar um produto no deposito) **POST** : "produto/deposito"

Enviar isso no _body_

```json
{
  "nome": "Roupa 10",
  "categoriaId": "669a94b45455bc666c787215",
  "valorCompra": 10,
  "valorOriginal": 30,
  "valorAtual": 15,
  "qtdMinima": 2,
  "lojaId": "loja-1-asndoisadadajnduhbadjspaksdasdb" ,
  "qtdDeposito": 1
}
```

_Retorno de sucesso_

```json
{
  "nome": "Roupa 10",
  "categoria": "vestido",
  "categoriaId": "669a94b45455bc666c787215",
  "valorAtual": 15,
  "valorCompra": 10,
  "id": "6691e7f63ce2d9cece459208",
  "valorOriginal": 30,
  "codigoBarra": 17208381340,
  "qtdMinima": 2
}
```

- (Listar os produtos) **GET** "produto/lista/:lojaId"

Enviar como parametro o **_Id da loja_**

_Retorno de sucesso_

```json
[
  {
    "nome": "Roupa x",
    "categoria": "vestido",
    "categoriaId": "669a94b45455bc666c787215",
    "valorAtual": 10,
    "id": "66904fe28e922184c9a7da88",
    "valorOriginal": 10,
    "valorCompra": 10,
    "codigoBarra": 17207336667,
    "qtdMinima": 2
  },
  {
    "nome": "Roupa x",
    "categoria": "vestido",
    "categoriaId": "669a94b45455bc666c787215",
    "valorAtual": 10,
    "id": "669055b4a717a7829b9c96d2",
    "valorOriginal": 10,
    "valorCompra": 10,
    "codigoBarra": 17207351569,
    "qtdMinima": 2
  },
  {
    "nome": "Roupa 5",
    "categoria": "vestido",
    "categoriaId": "669a94b45455bc666c787215",
    "valorAtual": 15,
    "valorCompra": 10,
    "id": "669055e0a717a7829b9c96d5",
    "valorOriginal": 20,
    "codigoBarra": 17207352008,
    "qtdMinima": 2
  }

```

- (Deletar produto) **DELETE** "produto/loja/:lojaId"

Enviar como parametro o **_Id da loja_**

- (Editar o produto) **PATCH** "produto/loja/:produto_id"

Enviar como parametro o **_Id do produto_**

Enviar isso no _body_, todos os campos são opcionais

```json
{
  "nome": "Roupa 10",
  "categoriaId": "669a94b45455bc666c787215",
  "valorOriginal": 30,
  "valorAtual": 15
}
```

_Retorno de sucesso_

```json
{
  "nome": "Roupa 10",
  "categoria": "vestido",
  "categoriaId": "669a94b45455bc666c787215",
  "valorAtual": 15,
  "id": "6691e7f63ce2d9cece459208",
  "valorOriginal": 30,
  "valorCompra": 10,
  "codigoBarra": 17208381340,
  "qtdMinima": 2
}
```

- (Editar o produto no deposito) **PATCH** "produto/deposito/:produto_id"

Enviar como parametro o **_Id do produto_**

Enviar isso no _body_, todos os campos são opcionais

```json
{
  "nome": "Roupa 10",
  "categoriaId": "669a94b45455bc666c787215",
  "valorOriginal": 30,
  "valorAtual": 15,
  "lojaId": "loaj-1-inaondadad",
  "qtdDeposito": 2
}
```

_Retorno de sucesso_

```json
{
  "nome": "Roupa 10",
  "categoria": "vestido",
  "categoriaId": "669a94b45455bc666c787215",
  "valorAtual": 15,
  "id": "6691e7f63ce2d9cece459208",
  "valorOriginal": 30,
  "valorCompra": 10,
  "codigoBarra": 17208381340,
  "qtdMinima": 2
}
```

```json
{
  "nome": "Roupa 10",
  "categoriaId": "669a94b45455bc666c787215",
  "valorCompra": 10,
  "valorOriginal": 30,
  "valorAtual": 15,
  "qtdMinima": 2,
  "lojaId": "loja-1-asndoisadadajnduhbadjspaksdasdb" ,
  "qtdDeposito": 1
}
```

- (Remover da promoção) **PATCH** "produto/loja/removerPromocao/:produto_id"

Enviar como parametro o **_Id do produto_**

 - (Adicionar promocao para todos os produtos) **PATCH** "produto/loja/todosEmPromocao"

 Enviar isso no _body_ 

```json
{
    "porcentagemDesconto": 20
}
```

- (Remover todos as promocoes) **PATCH** "produto/loja/removerTodasPromocoes"

### Cliente

- (Criar cliente) POST "cliente/loja"

Enviar isso no _body_

```json
{
  "nome": "vincius",
  "telefone": 12331233,
  "cpf": "12333123",
  "endereco": {
    "endereco": "Rua vicene gomes",
    "bairro": "Centro",
    "cidade": "Mucambo",
    "numero": 23,
    "estado": "ce",
    "cep": "62170000"
  }
}
```

_Retorno de sucesso_

```json
{
  "cpf": "12333123",
  "nome": "vincius",
  "telefone": 12331233,
  "endereco": {
    "endereco": "Rua vicene gomes",
    "bairro": "Centro",
    "cidade": "Mucambo",
    "estado": "ce",
    "cep": "62170000",
    "numero": 23,
    "_id": "669096d8e8a29df75f28de25"
  },
  "id": "669096d8e8a29df75f28de24"
}
```

- (Listar os clientes) **GET** "cliente/loja/lista"

_Retorno de sucesso_

```json
[
  {
    "nome": "loja 1",
    "empresaId": "vinicius-aguiar-b65c64c3857b15ffeed28e2d3097e6a4af1fcd52",
    "cnpj": "12123123333",
    "lojaId": "loja-1-a94ff3e50eea14523e2ba51e066152ea76b9f3c2",
    "id": "66904e7b9b824a57644c378e",
    "endereco": {
      "endereco": "Rua vicene gomes",
      "bairro": "Centro",
      "cidade": "Mucambo",
      "estado": "ce",
      "cep": "62170000",
      "numero": 23,
      "_id": "66904e7b9b824a57644c378f"
    }
  }
]
```

- (Deletar cliente) DELETE "cliente/loja/:id"

Enviar como parametro o **_Id do cliente_**

- (Atualizar os dados do cliente) **PATCH** "cliente/loja/:id"

Enviar como parametro o **_Id do cliente_**

Enviar isso no _body_, todos os campos são opcionais

```json
{
  "nome": "vincius teste 11",
  "telefone": 12331233,
  "cpf": "12333123",
  "endereco": {
    "endereco": "Rua vicente gomes",
    "bairro": "Centro",
    "cidade": "Mucambo",
    "numero": 37,
    "estado": "ce",
    "cep": "62170000"
  }
}
```

### Estoque

- (Atualizar o estoque) **PATCH** "estoque/loja"

Enviar isso no _body_

```json
[{ "produtoId": "6691e7e53ce2d9cece459206", "qtd": 10 }]
```

- (Buscar estoque do produto) **GET** "estoque/loja/:produto_id"

Enviar como parametro o **_id do produito_**

Esse aqui é utilizando o **socket.io**

Se conectar com python: https://python-socketio.readthedocs.io/en/stable/api.html#socketio.Client.connect

Na conecção com o socket, precisa passar alguns paramentros

- transports = ["websocket"]
- url = https://loja-back-1.onrender.com/
- auth

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoibG9qYSAxIiwiZW1wcmVzYUlkIjoidmluaWNpdXMtYWd1aWFyLTMxMTU4YTVlZGJlMWM4ZjAyN2I1OTVkOTFlMTNiZjljNTQ2OTk4NGEiLCJjbnBqIjoiMTIxMjMxMjMzMzMiLCJsb2phSWQiOiJsb2phLTEtMWEzMzE3ZmZiYjQ5MDU3MmM2MzQ3YWRiNzk5Njk3NDM4MWQxNWEzYiIsImlkIjoiNjY5MmYwYTIzZjJmNmExYmYyNGY0NDllIiwiaWF0IjoxNzIwOTI1NzMyLCJleHAiOjE3MjM1MTc3MzJ9.1iLnfcaBEKyEie7QQwTxwrxwKaUDaFV_FHGzT03zPEs"
}
```

- query

```json
{
  "lojaIds": "loja-1-1a3317ffbb490572c6347adb7996974381d15a3b"
}
```

Depois de conectar, precisa ouvir o evento

https://python-socketio.readthedocs.io/en/stable/api.html#socketio.Client.on

**event = "estoque/mudanca"**

Retorno

```json
[
  {
    "id": "66934f0f4de87eca803449d2"
    "lojaId": "loja-1-575b0c6fda653be0ef8a2b221089e35119ef867d"
    "qtd": 10
  }
]

```

Ele retorna todos os produtos que tiveram o estoque atualizado

### Pedido

- (Criar pedido) **POST** "pedido/loja"

pagamento tem que ser: pix , dinheiro ou cartao
Enviar isso no _body_

```json
{
  "produtos": [{ "id": "6695640530c2738d8cacb04d", "qtd": 20 }],
  "pagamento": "pix",
  "paraEntrega": false,
  "acressimo": 10,
  "desconto": 5
}
```

Retorno

```json
{
  "criadoEm": "2024-07-17T17:04:27.314Z",
  "lojaId": "loja-1-575b0c6fda653be0ef8a2b221089e35119ef867d",
  "paraEntrega": false,
  "id": "6697f99b7e510a04bb83d783",
  "total": 305,
  "produtos": [
    {
      "qtd": 20,
      "nome": "Roupa 10",
      "preco": 15,
      "id": "6695640530c2738d8cacb04d"
    }
  ],
  "pagamento": "pix",
  "desconto": 5,
  "acressimo": 10
}
```

- (Listar pedidos) **GET** "pedido/listarTodos"

Retorno

```json
[
  {
    "criadoEm": "2024-07-17T17:04:27.314Z",
    "lojaId": "loja-1-575b0c6fda653be0ef8a2b221089e35119ef867d",
    "paraEntrega": false,
    "id": "6697f99b7e510a04bb83d783",
    "total": 305,
    "produtos": [
      {
        "qtd": 20,
        "nome": "Roupa 10",
        "preco": 15,
        "id": "6695640530c2738d8cacb04d"
      }
    ],
    "pagamento": "pix",
    "desconto": 5,
    "acressimo": 10
  }
]
```

- (Listar pedidos de hoje) **GET** "pedido/listarDeHoje"

Retorno

```json
[
  {
    "criadoEm": "2024-07-17T17:04:27.314Z",
    "lojaId": "loja-1-575b0c6fda653be0ef8a2b221089e35119ef867d",
    "paraEntrega": false,
    "id": "6697f99b7e510a04bb83d783",
    "total": 305,
    "produtos": [
      {
        "qtd": 20,
        "nome": "Roupa 10",
        "preco": 15,
        "id": "6695640530c2738d8cacb04d"
      }
    ],
    "pagamento": "pix",
    "desconto": 5,
    "acressimo": 10
  }
]
```

### Caixa

- (Abrir o caixa) **POST** "caixa/abrir"

Enviar isso no _body_

```json
{
  "valorInicial": 30
}
```

- (Fechar o caixa) **PATCH** "caixa/fechar"

- (Criar despesa) **POST** "caixa/loja/despesa"

Enviar isso no *body*, descricao é opicional

```ts
    {
        "titulo": "Folha",
        "descricao": "faltou",
        "valor": 20
    }
```

- (Atualiar despesa) **PUT** "caixa/loja/despesa"

Enviar isso no *body*, descricao é opicional

```ts
    {
        "titulo": "Folha",
        "descricao": "faltou",
        "valor": 20,
        "id": "66eda7d8dcdd9bf4123b4528"
    }
```

- (Buscar caixa aberta) **GET** "caixa/loja/caixaAberto"

