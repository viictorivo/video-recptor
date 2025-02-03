## Description

Projeto desenvolvido como trabalho final do curso Software Architecture da Pós-Tech Fiap 2024.

**Projeto**

Sistema de processamento de imagens, onde ao usuário estar autenticado ele pode enviar um video e retorna as imagens dele em um arquivo .zip. Caso haja algum problema no processamento ele é informado que houve um erro via e-mail

## Link Video demonstração

[Link Video demonstração](https://www.youtube.com/watch?v=zTSFxMMnUKk)

## Arquitetura

![arquitetura](/ArqPos.png)

## Intruções de uso

- **01. Buscar o pedido pelo ID**

  > GET/upload?user_id={user_id}

- **02. Criar um pedido**

  > POST/upload

- **04. Excluir um pedido**

  > DELETE/upload/{video_id}

## Cobertura do código

![coverage](/coverage.png)

## Developers

- Author - [Felipe José do Nascimento Lima](https://www.linkedin.com/in/felipe-lima-00bb62171/)
- Author - [Victor Ivo Gomes Henrique](https://www.linkedin.com/in/victor-ivo-henrique-68557313a/)
- Author - [Rafael Zanatta Paes Landim](https://www.linkedin.com/in/rafael-landim-81b7aa1ab/)
