# diario-de-emocoes

Repositório central do aplicativo Diario de emoções

Este repositório deve ser utilizado como uma raiz para os componentes da aplicação, os componentes integrantes são:

- ![Rails](https://img.shields.io/badge/rails-%23CC0000.svg?style=for-the-badge&logo=ruby-on-rails&logoColor=white) **backend:** Backend principal da aplicação que será responsável por gerenciar os dados dos usuários
- ![Rails](https://img.shields.io/badge/rails-%23CC0000.svg?style=for-the-badge&logo=ruby-on-rails&logoColor=white) **redis:** Backend secundário que irá gerenciar os serviços de mensageria
- ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) **front:** Front end da aplicação.

## Requisitos

Para executar esse projeto é necessário possuir as seguintes aplicações

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Instruções para execução do projeto

Clone o projeto em um diretorio de sua preferencia

```bash
git clone
```
Faça o build dos serviços do projeto utilizando o docker compose

```bash
docker compose up --build
```

Crie e o banco no backend e rode as migrates

```bash
docker compose exec backend bundle exec rails db:create db:migrate
```

Pronto, se tudo correu bem até aqui você já deve ser capaz de acessar a aplicação no endereço abaixo:

```bash
http://localhost:3000
```
