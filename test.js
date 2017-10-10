'use strict';

const Graph = require('./index.js');

describe('Graph', () => {
  it('should add a vertex to the graph', () => {
    const graph = new Graph();
    graph.addVertex('A');

    expect(graph.vertices).toContain('A');
  });

  it('should add an edge', () => {
    const graph = new Graph();
    graph.addVertex('A');
    graph.addVertex('B');

    graph.addEdge('A', 'B');

    expect(graph.edges).toEqual([['A', 'B']]);
  });

  it('should add vertex to adjacency list when adding a new edge', () => {
    const graph = new Graph();
    graph.addVertex('A');
    graph.addVertex('B');

    graph.addEdge('A', 'B');

    expect(graph.adjacencyList['A']).toContain('B');
    expect(graph.adjacencyList['B']).toContain('A');
  });

  it('should throw an error when the giving vertex does not exists', () => {
    const graph = new Graph();
    graph.addVertex('A');
    graph.addVertex('B');


    expect(() => graph.addEdge('Y', 'B')).toThrowError('Y does not exists');
    expect(() => graph.addEdge('B', 'Y')).toThrowError('Y does not exists');
  });

  it('should build an empty adjacency matrix', () => {
    const graph = new Graph();
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'A');

    const adjacencyMatrix = graph.buildAdjacencyMatrix();

    const keys = {
      'A': Object.keys(adjacencyMatrix['A']),
      'B': Object.keys(adjacencyMatrix['B'])
    };

    expect(keys['A']).toEqual(['A', 'B']);
    expect(keys['B']).toEqual(['A', 'B']);
  });

  it('should fill the adjacency matrix', () => {
    const graph = new Graph();
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'A');

    const adjacencyMatrix = graph.computeAdjacencyMatrix();

    expect(adjacencyMatrix['A']['A']).toEqual(2);
    expect(adjacencyMatrix['A']['B']).toEqual(1);
    expect(adjacencyMatrix['B']['B']).toEqual(0);
    expect(adjacencyMatrix['B']['A']).toEqual(1);
  });

  it('should build an empty incidence matrix', () => {
    const graph = new Graph();
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'A');

    const incidenceMatrix = graph.buildIncidenceMatrix();

    expect(incidenceMatrix['A']['E1']).toEqual(0);
    expect(incidenceMatrix['A']['E2']).toEqual(0);
    expect(incidenceMatrix['B']['E1']).toEqual(0);
    expect(incidenceMatrix['B']['E2']).toEqual(0);
  });

  it('should fill the incidence matrix', () => {
    const graph = new Graph();
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'A');

    const incidenceMatrix = graph.computeIncidenceMatrix();

    expect(incidenceMatrix['A']['E1']).toEqual(1);
    expect(incidenceMatrix['A']['E2']).toEqual(1);
    expect(incidenceMatrix['B']['E1']).toEqual(1);
    expect(incidenceMatrix['B']['E2']).toEqual(0);
  });

  it('should show the sortest path between two vertices', () => {
    const graph = new Graph();
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');

    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'D');
    graph.addEdge('A', 'D');

    const path = graph.pathFromTo('A', 'D');

    expect(path).toEqual(['A', 'D']);
  });

  describe('when is oriented', () => {
    let graph;

    beforeEach(() => {
      graph = new Graph({ oriented: true });
      graph.addVertex('A');
      graph.addVertex('B');
    });

    it('should throw an error when the vertex does not exists', () => {
      expect(() => graph.addEdge('Y', 'B')).toThrowError('Y does not exists');
      expect(() => graph.addEdge('B', 'Y')).toThrowError('Y does not exists');
    });

    it('should only add vertex to adjacency list of source vertex', () => {
      graph.addEdge('A', 'B');

      expect(graph.adjacencyList['A']).toContain('B');
      expect(graph.adjacencyList['B']).not.toContain('A');
    });

    it('should fill the adjacency matrix', () => {
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'A');

      const adjacencyMatrix = graph.computeAdjacencyMatrix();

      expect(adjacencyMatrix['A']['A']).toEqual(1);
      expect(adjacencyMatrix['A']['B']).toEqual(1);
      expect(adjacencyMatrix['B']['B']).toEqual(0);
      expect(adjacencyMatrix['B']['A']).toEqual(0);
    });

    it('should fill the incidence matrix', () => {
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'A');

      const incidenceMatrix = graph.computeIncidenceMatrix();

      expect(incidenceMatrix['A']['E1']).toEqual(1);
      expect(incidenceMatrix['A']['E2']).toEqual(-1);
      expect(incidenceMatrix['B']['E1']).toEqual(-1);
      expect(incidenceMatrix['B']['E2']).toEqual(0);
    });

    it('should show the sortest path between two vertices', () => {
      graph.addVertex('C');
      graph.addVertex('D');

      graph.addEdge('A', 'B');
      graph.addEdge('B', 'D');
      graph.addEdge('D', 'C');
      graph.addEdge('A', 'C');

      const path = graph.pathFromTo('A', 'D');

      expect(path).toEqual(['A', 'B', 'D']);
    });
  });

  describe('when is weighted', () => {
    let graph;

    beforeEach(() => {
      graph = new Graph({ weighted: true });
      graph.addVertex('A');
      graph.addVertex('B');
    });

    it('should add the edges with the weight', () => {
      graph.addEdge('A', 'B', 3);
      graph.addEdge('A', 'A', 2);

      expect(graph.edges[0]).toEqual(['A', 'B', 3]);
      expect(graph.edges[1]).toEqual(['A', 'A', 2]);
    });

    it('should fill the adjacency matrix with the weight', () => {
      graph.addEdge('A', 'B', 3);
      graph.addEdge('A', 'A', 2);

      const adjacencyMatrix = graph.computeAdjacencyMatrix();

      expect(adjacencyMatrix['A']['B']).toEqual(3);
      expect(adjacencyMatrix['A']['A']).toEqual(2);
    });

    it('should show the sortest path between two vertices', () => {
      graph.addVertex('C');

      graph.addEdge('A', 'B', 2);
      graph.addEdge('B', 'C', 5);
      graph.addEdge('A', 'C', 10);

      const path = graph.pathFromTo('A', 'C');

      expect(path).toEqual(['A', 'B', 'C']);
    });
  });

  describe('Minimum Spanning Tree', () => {
    let graph;

    beforeEach(() => {
      graph = new Graph({ weighted: true });
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addVertex('E');
      graph.addVertex('F');
      graph.addVertex('G');
      graph.addVertex('H');
      graph.addVertex('I');

      graph.addEdge('A', 'B', 4);
      graph.addEdge('A', 'H', 8);
      graph.addEdge('B', 'C', 8);
      graph.addEdge('C', 'F', 4);
      graph.addEdge('B', 'H', 11);
      graph.addEdge('C', 'D', 7);
      graph.addEdge('D', 'F', 14);
      graph.addEdge('D', 'E', 9);
      graph.addEdge('E', 'F', 10);
      graph.addEdge('F', 'G', 2);
      graph.addEdge('G', 'H', 1);
      graph.addEdge('H', 'I', 7);
      graph.addEdge('C', 'I', 2);
      graph.addEdge('G', 'I', 6);
    });

    it('should compute Kruskal algorithm', () => {
      const minimumSpanningTree = graph.computeKruskal();

      console.log(minimumSpanningTree);
    });

    it('should compute Prim-Jarnik algorithm', () => {
      const minimumSpanningTree = graph.computePrimJarnik();

      console.log(minimumSpanningTree);
    });
  });
});
