import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { type Node, type Edge, Position } from '@xyflow/react';
import { toast } from 'sonner';
import { CREATE_EDGE, CREATE_NODE, DELETE_EDGES, DELETE_NODES } from '@/features/editor/api/mutations';
import { GET_PROJECT_COMPONENTS } from '@/features/editor/api/queries';
import { type Node as ProjectNode, type Edge as ProjectEdge } from '@/features/editor/types';
import { mapProjectNodesToFlowNodes, mapProjectEdgesToFlowEdges } from '@/utils/transformers';
import { getErrorMessage } from '@/features/editor/helpers/error-messages';

interface ProjectComponents {
  id: number;
  name: string;
  nodes: ProjectNode[];
  edges: ProjectEdge[];
}

interface UseFlowMutationsOptions {
  projectId: number;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export function useFlowMutations({ projectId, setNodes, setEdges }: UseFlowMutationsOptions) {
  const refetchConfig = { refetchQueries: [{ query: GET_PROJECT_COMPONENTS, variables: { projectId } }] };

  const { loading, data } = useQuery<{ projectById: ProjectComponents }>(
    GET_PROJECT_COMPONENTS,
    { variables: { projectId } },
  );

  const [createNode] = useMutation<{ createNode: ProjectNode }>(CREATE_NODE, {
    ...refetchConfig,
    onCompleted: (result) => {
      const newNode: Node = {
        id: `${result.createNode.id}`,
        type: 'system',
        position: { x: result.createNode.xPos, y: result.createNode.yPos },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: { label: result.createNode.name, type: result.createNode.type },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const [createEdge] = useMutation<{ createEdge: ProjectEdge }>(CREATE_EDGE, {
    ...refetchConfig,
    onCompleted: (result) => {
      const newEdge: Edge = {
        id: `${result.createEdge.id}`,
        source: `${result.createEdge.sourceNode.id}`,
        target: `${result.createEdge.targetNode.id}`,
        animated: true,
      };
      setEdges((eds) => eds.concat(newEdge));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const [deleteNodes] = useMutation(DELETE_NODES, {
    ...refetchConfig,
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const [deleteEdges] = useMutation(DELETE_EDGES, {
    ...refetchConfig,
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const flowNodes = useMemo(
    () => (data ? mapProjectNodesToFlowNodes(data.projectById.nodes) : []),
    [data],
  );
  const flowEdges = useMemo(
    () => (data ? mapProjectEdgesToFlowEdges(data.projectById.edges) : []),
    [data],
  );

  return {
    loading,
    initialNodes: flowNodes,
    initialEdges: flowEdges,
    createNode,
    createEdge,
    deleteNodes,
    deleteEdges,
  };
}
