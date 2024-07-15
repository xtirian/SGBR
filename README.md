# Desafio do Desenvolvedor Backend

Este é um desafio para avaliar suas habilidades na construção de APIs utilizando NodeJS/NestJs. O objetivo é criar uma API simples para gerenciar lugares, utilizando PostgreSQL como banco de dados. Conhecimento em Domain Driven Design será considerado um diferencial na avaliação.

## Como executar

1. Configuração inicial do ambiente:

    Copie o arquivo de exemplo de configuração .env para o arquivo de configuração real:

    ```bash
    cp example.local.env .env
    ```
2. Configuração do arquivo .env:

    Edite o arquivo .env para configurar suas variáveis de ambiente conforme necessário para o seu ambiente de desenvolvimento. Certifique-se de definir corretamente os valores de DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT, ENVIRONMENT, APP_HOST, e APP_PORT.

3. Execução usando Docker Compose:

  Para construir e iniciar seu ambiente Docker, utilize o comando:

  ```bash
  docker-compose up --build
  ```
  OU
  ```bash
   yarn install
  ```
  e depois
  ```bash
  yarn start:dev
  ```


## Endpoints
### Usuários

#### POST /api/signup
* Cria um novo usuário.
* Corpo da requisição (signupDto): JSON contendo dados do usuário.
* Retorna um objeto JSON com status, mensagem e dados do usuário criado.
**Payload da Requisição:**
``` json
{
	"username": "user",
	"password": "Acesso1!"
}
```

#### POST /api/signin

* Autentica um usuário existente.
* Corpo da requisição (signupDto): JSON contendo dados de login do usuário.
* Retorna um objeto JSON com status, mensagem, dados do usuário autenticado e token de autenticação.
**Payload da Requisição:**
``` json
{
	"username": "user",
	"password": "Acesso1!"
}
```

### Perfil

#### PUT /api/auth/profile

* Edita o perfil de um usuário autenticado.
* Requer autenticação.
* Corpo da requisição (profileDto): JSON contendo dados a serem atualizados no perfil.
* Retorna um objeto JSON com status, mensagem e dados do perfil atualizado.
**Payload da Requisição:**
``` json
{
	"name": "user edit",
	"email": "email@email.com"
}
```

### Lugares

* Somente o criador do lugar pode editar o lugar

#### POST /api/auth/place

* Cria um novo lugar.
* Requer autenticação.
* Corpo da requisição (placeDto): JSON contendo dados do lugar a ser criado, incluindo imagem (opcional).
* Retorna um objeto JSON com status, mensagem e dados do lugar criado.
**Payload da Requisição:**
``` json
{
	"city": "Nilopolis",
	"state": "RJ",
	"name": "Praca Dois"	
}
```

#### PUT /api/auth/place/:id

* Edita um lugar existente.
* Requer autenticação.
* Parâmetro da URL (id): ID do lugar a ser atualizado.
* Corpo da requisição (placeDto): JSON contendo dados a serem atualizados no lugar.
* Retorna um objeto JSON com status, mensagem e dados do lugar atualizado.
**URL da Requisição:**
``` bash
PUT /api/auth/place/1

```
**Payload da Requisição:**
``` json
{
	"city": "Nilopolis",
	"state": "RJ",
	"name": "Praca um"	
}
```

#### DELETE /api/auth/place/:id

* Deleta um lugar existente.
* Requer autenticação.
* Parâmetro da URL (id): ID do lugar a ser deletado.
* Retorna um objeto JSON com status, mensagem e dados da operação de exclusão.
**URL da Requisição:**
``` bash
DELETE /api/auth/place/3
```

#### GET /api/auth/place/:id

* Obtém detalhes de um lugar específico.
* Requer autenticação.
* Parâmetro da URL (id): ID do lugar a ser consultado.
* Retorna um objeto JSON com status, mensagem e dados do lugar.
**URL da Requisição:**
``` bash
GET /api/auth/place/11

```

#### GET /api/auth/places

* Lista todos os lugares ou filtra por critérios específicos (busca, estado, cidade, take, skip).
* Requer autenticação.
* Parâmetros de consulta (search, state, city, take, skip): Filtros opcionais para consulta.
* Retorna um objeto JSON com status, mensagem e lista de lugares.
**URL da Requisição:**
``` bash
GET /api/auth/places?search=Parque&state=São%20Paulo&city=São%20Paulo&take=10&skip=0

```


## Estrutura de Pastas

``` lua
src/ 
|-- @types/ 
|-- application/ 
|    |-- dtos/ 
|    |-- controllers/ 
|    |-- middlewares/ 
|-- domain/ 
|    |-- __test__/ 
|    |-- services/ 
|    |-- entities/ 
|        |-- User.ts 
|-- infrastructure/ 
|    |-- models/ 
|    |-- repository/ 
|-- lib/ 
|-- utils/ 
|-- main.ts 
|-- app.module.ts
```