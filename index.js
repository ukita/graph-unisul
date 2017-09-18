'use strict';

class Graph {
  constructor(args = {}) {
    this.oriented      = args['oriented'] || false;
    this.weighted      = args['weighted'] || false;
    this.vertices      = [];
    this.edges         = [];
    this.adjacencyList = [];
  }

  addVertex(vertex) {
    this.vertices.push(vertex);
    this.adjacencyList[vertex] = [];
  }

  addEdge(originVertex, destinationVertex, value = null) {
    this.hasVertex(originVertex);
    this.hasVertex(destinationVertex);

    this.addToAdjacencyList(originVertex, destinationVertex);

    const edge = [originVertex, destinationVertex];

    if (this.weighted) edge.push(value);

    this.edges.push(edge);
  }

  buildAdjacencyMatrix() {
    const matrix = {};

    this.vertices.forEach(rowVertex => {
      matrix[rowVertex] = this.vertices.reduce((prev, columnVertex) => {
        prev[columnVertex] = 0;
        return prev;
      }, {});
    });

    return matrix;
  }

  computeAdjacencyMatrix() {
    const matrix = this.buildAdjacencyMatrix();

    this.edges.forEach(edge => {
      const [originVertex, destVertex, weight] = edge;

      if (this.weighted) {
        matrix[originVertex][destVertex] = weight;

        if (!this.oriented) matrix[destVertex][originVertex] = weight;
      } else {
        matrix[originVertex][destVertex] += 1;

        // The first statement verify if the edge is a cycle and must no be oriented
        if((destVertex === originVertex && !this.oriented) || !this.oriented) {
          matrix[destVertex][originVertex] += 1;
        }
      }
    });

    return matrix;
  }

  buildIncidenceMatrix() {
    const matrix = {};

    this.vertices.forEach(vertex => {
      matrix[vertex] = this.edges.reduce((prev, edge, index) => {
        prev[`E${index+1}`] = 0;
        return prev;
      }, {});
    });

    return matrix
  }

  computeIncidenceMatrix() {
    const matrix = this.buildIncidenceMatrix();

    this.edges.forEach((edge, i) => {
      const index = `E${i+1}`;
      const [originVertex, destVertex] = edge;

      matrix[originVertex][index] = 1

      if(this.oriented) {
        matrix[destVertex][index] = -1
      }else {
        matrix[destVertex][index] = 1
      }
    });

    return matrix;
  }

  computeDijkstra(startVertex) {
    let allNodesVisited = false;
    const nodes = this.vertices.reduce((prev, vertex) => {
      const sameAsStart = vertex === startVertex;
      prev.push({
        name: vertex,
        distance: sameAsStart ? 0 : Infinity, // Distance is 0 if the vertex is equal to origin
        previous: undefined,
        visited: false
      });

      return prev;
    }, []);

    while(!allNodesVisited) {
      const node = this.getVertexByShortestDistance(nodes);
      const adjacencyList = this.adjacencyList[node.name];

      adjacencyList.forEach(adjVertex => {
        const vertex = nodes.find(n => n.name === adjVertex);
        const distance = node.distance + this.getDistance(node.name, adjVertex);

        if (vertex.distance > distance) {
          vertex.distance = distance;
          vertex.previous = node;
        }
      });

      node.visited = true;
      allNodesVisited = nodes.every(n => n.visited);
    }

    return nodes;
  }

  pathFromTo(originVertex, destinationVertex) {
    this.hasVertex(originVertex);
    this.hasVertex(destinationVertex);

    const nodes = this.computeDijkstra(originVertex);
    let   node  = nodes.find(n => n.name === destinationVertex);
    const path  = [];

    while(node.previous) {
      path.push(node.name);
      node = node.previous;
    }

    return [originVertex, ...path.reverse()];
  }

  /*
   * Helpers functions
   */

  addToAdjacencyList(vertex1, vertex2) {
    this.adjacencyList[vertex1].push(vertex2);

    // If is not oriented, add vertex1 to adjacency list of vertex2.
    if (!this.oriented) this.adjacencyList[vertex2].push(vertex1);
  }

  hasVertex(vertex) {
    if (this.vertices.includes(vertex)) return;

    throw new Error(`${vertex} does not exists`);
  }

  getVertexByShortestDistance(vertices) {
    return vertices
      .filter(vertex => !vertex.visited)
      .sort((left, right) => left.distance > right.distance)[0];
  }

  getDistance(originVertex, destinationVertex) {
    const matrix = this.computeAdjacencyMatrix();

    return matrix[originVertex][destinationVertex];
  }
}

module.exports = Graph;
