# Grafos

### Requisitos
* node v8.4.0
* npm 5.3.0

### Como usar

Primeiro deve-se clonar o projeto com `git clone git@github.com:ukita/graph-unisul.git`. Após isso entre no diretório e execute o `npm install` para instalar as dependências do projeto.

E após a finalização da instalação, execute esse comando para poder executar o projeto `npm start` ou `node cli.js`

### Exemplo

```BASH
ukita@ukita:~/graph$ npm start

   ____                          _
  / ___|  _ __    __ _   _ __   | |__
 | |  _  | '__|  / _` | | '_ \  | '_ \
 | |_| | | |    | (_| | | |_) | | | | |
  \____| |_|     \__,_| | .__/  |_| |_|
                        |_|
? Is this graph oriented? Yes
? Is this graph weighted? Yes
? Add the list of vertices. Ex: A,B,C A,B,C
? Add the list of edges. Ex: [A, B, 1], [A, C, 1] A,B,1,B,C,3
? What you want? Adjacency List
┌────────┬────────────────┐
│ Vertex │ Adjacency List │
├────────┼────────────────┤
│ A      │ B              │
├────────┼────────────────┤
│ B      │ C              │
├────────┼────────────────┤
│ C      │                │
└────────┴────────────────┘
? What you want? (Use arrow keys)
❯ Adjacency List
  Adjacency Matrix
  Incidence Matrix
  Shortest Path

```
