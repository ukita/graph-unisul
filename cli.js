#!/usr/bin/env node
const inquirer = require('inquirer');
const figlet   = require('figlet');
const chalk    = require('chalk');
const clear    = require('clear');
const cliTable = require('cli-table2');

const Graph    = require('./index');

clear();

const welcomeText = figlet.textSync('Graph', { horizontalLayout: 'full' });
console.log(chalk.keyword('orange').bold(welcomeText));

function parseVertices(value) {
  if (value === '') return [];
  return value
    .toUpperCase()
    .replace(/\s/g, '')
    .split(',');
}

function parseEdges(value) {
  if (value === '') return [];
  const regex = /\[(.*?)\]/gi;
  const edges = [];
  let matches;
  let string = value
    .toUpperCase()
    .replace(/\s/g, '');

  while ((matches = regex.exec(string)) !== null ) {
    edges.push(
      matches[1].split(',')
    );
  }

  return edges;
}

async function showOptions(graph) {
  const choices = {
    'Adjacency List': showAdjacencyList,
    'Adjacency Matrix': showAdjacencyMatrix,
    'Incidence Matrix': showIncidenceMatrix,
    'Shortest Path': showShortestPath
  };

  const options = [
    {
      type: 'list',
      name: 'option',
      message: 'What you want?',
      choices: Object.keys(choices)
    }
  ];

  const { option } = await inquirer.prompt(options);
  await choices[option](graph);

  showOptions(graph);
}

async function showAdjacencyList(graph) {
  const { vertices, adjacencyList } = graph;

  const table = new cliTable({
    head: ['Vertex', 'Adjacency List']
  });

  vertices.forEach(vertex => {
    table.push({
      [vertex]: adjacencyList[vertex].join(' => ')
    });
  });

  console.log(table.toString());
}

async function showAdjacencyMatrix(graph) {
  const adjacencyMatrix = graph.computeAdjacencyMatrix();
  const { vertices } = graph;

  const table = new cliTable({
    head: ['', ...vertices]
  });

  vertices.forEach(vertex => {
    const row = adjacencyMatrix[vertex];

    table.push({
      [vertex]: Object.values(row)
    });
  });

  console.log(table.toString());
}

async function showIncidenceMatrix(graph) {
  const incidenceMatrix = graph.computeIncidenceMatrix();
  const { vertices } = graph;
  const columns = graph.edges.map((edge, i) => `E${i+1}`);

  const table = new cliTable({
    head: ['', ...columns]
  });

  vertices.forEach(vertex => {
    const row = incidenceMatrix[vertex]

    table.push({
      [vertex]: Object.values(row)
    });
  });

  console.log(table.toString());
}

async function showShortestPath(graph) {
  const options = [
    {
      type: 'checkbox',
      name: 'vertices',
      message: 'Select the origin and destination',
      choices: graph.vertices,
      validate: (input) => {
        if (input.length === 0) return 'Select the origin vertex'
        if (input.length < 2)  return 'Select the destination vertex';
        if (input.length > 2)  return 'Select only two vertices';

        return true;
      }
    }
  ];

  const { vertices } = await inquirer.prompt(options);
  const [originVertex, destinationVertex] = vertices;

  const path = graph.pathFromTo(originVertex, destinationVertex);

  const table = new cliTable({
    head: path,
    chars: {
      'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
      'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
      'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '',
      'right': '' , 'right-mid': '' , 'middle': '=>'
    }
  });

  console.log(table.toString());
}

async function init() {
  const configuration = [
    {
      type: 'confirm',
      name: 'isOriented',
      message: 'Is this graph oriented?',
      default: false
    },
    {
      type: 'confirm',
      name: 'isWeighted',
      message: 'Is this graph weighted?',
      default: false
    },
    {
      type: 'input',
      name: 'vertices',
      message: 'Add the list of vertices. Ex: A,B,C',
      default: '',
      filter: parseVertices
    },
    {
      type: 'input',
      name: 'edges',
      message: 'Add the list of edges. Ex: [A, B, 1], [A, C, 1]',
      filter: parseEdges
    }
  ];

  const { isOriented, isWeighted, vertices, edges } = await inquirer.prompt(configuration);

  const graph = new Graph({
    oriented: isOriented,
    weighted: isWeighted
  });

  try {
    vertices.forEach(vertex => graph.addVertex(vertex));
    edges.forEach(edge => graph.addEdge(...edge));
  } catch (e) {
    console.log(chalk.red.bold(e))
    return;
  }

  await showOptions(graph);
}

init();
