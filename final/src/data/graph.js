export function buildGraph(edges) {
  const graph = {};
  edges.forEach((edge) => {
    (graph[edge.from] ||= []).push(edge);
    (graph[edge.to] ||= []).push({ ...edge, from: edge.to, to: edge.from });
  });
  return graph;
}

export function findRoutes(graph, start, end, { maxDepth = 7, maxRoutes = 200 } = {}) {
  const results = [];
  const visited = new Set([start]);

  function dfs(node, path) {
    if (results.length >= maxRoutes) return;
    if (node === end) {
      results.push([...path]);
      return;
    }
    if (path.length >= maxDepth) return;

    for (const edge of graph[node] || []) {
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      path.push(edge);
      dfs(edge.to, path);
      path.pop();
      visited.delete(edge.to);
    }
  }

  dfs(start, []);
  return results;
}
