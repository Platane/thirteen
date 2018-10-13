/**
 * sort a dependency graph using kahn algorithm :
 *
 * take a node without dependency, put it on top of the list
 * remove it from the graph
 * repeat
 */

export type Graph = { id: string, dependencies: string[] }[]

export const sortDependencyGraph = (graph: Graph) => {
  /**
   * find a node without dependency
   */
  const nextNode = graph.find(({ dependencies }) => dependencies.length === 0)

  /**
   * terminal case ( or error case )
   */
  if (!nextNode) {
    if (graph.length > 0) throw new Error('cyclical graph')
    else return []
  }

  /**
   * remove nextNode from the graph
   */
  const nextGraph = graph.filter(({ id }) => id !== nextNode.id).map(x => ({
    ...x,
    dependencies: x.dependencies.filter(id => id !== nextNode.id),
  }))

  /**
   * rec
   */
  return [nextNode, ...sortDependencyGraph(nextGraph)]
}
