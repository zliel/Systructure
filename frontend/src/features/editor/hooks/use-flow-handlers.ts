import { useCallback, type RefObject } from 'react';
import { useReactFlow, type Node, type Edge, type Connection } from '@xyflow/react';
import { toast } from 'sonner';
import type { NodeType, NodeInput, EdgeInput } from '@/features/editor/types';

interface UseFlowHandlersOptions {
  projectId: number;
  canEdit: boolean;
  reactFlowWrapper: RefObject<HTMLDivElement | null>;
  edges: Edge[];
  createNode: (opts: { variables: { input: NodeInput } }) => void;
  createEdge: (opts: { variables: { input: EdgeInput } }) => void;
  deleteNodes: (opts: { variables: { nodeIds: number[] } }) => void;
  deleteEdges: (opts: { variables: { edgeIds: number[] } }) => void;
}

export function useFlowHandlers({
  projectId,
  canEdit,
  reactFlowWrapper,
  edges,
  createNode,
  createEdge,
  deleteNodes,
  deleteEdges,
}: UseFlowHandlersOptions) {
  const { screenToFlowPosition } = useReactFlow();

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    if (!canEdit) return;
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, [canEdit]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!canEdit) {
        toast.error("You don't have permission to edit this project");
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const flowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!flowBounds) return;

      const position = screenToFlowPosition({
        x: event.clientX - flowBounds.left,
        y: event.clientY - flowBounds.top,
      });

      const nodeInput: NodeInput = {
        type: type as NodeType,
        name: `${type} node(created)`,
        xPos: position.x,
        yPos: position.y,
        projectId,
      };
      createNode({ variables: { input: nodeInput } });
    },
    [screenToFlowPosition, createNode, projectId, canEdit, reactFlowWrapper],
  );

  const onConnect = useCallback((params: Connection) => {
    if (!canEdit) {
      toast.error("You don't have permission to edit this project");
      return;
    }
    const edgeInput: EdgeInput = {
      sourceNodeId: parseInt(params.source),
      targetNodeId: parseInt(params.target),
      projectId,
    };
    createEdge({ variables: { input: edgeInput } });
  }, [createEdge, projectId, canEdit]);

  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    if (!canEdit) {
      toast.error("You don't have permission to edit this project");
      return;
    }
    const nodeIds = deletedNodes.map((node) => parseInt(node.id));
    deleteNodes({ variables: { nodeIds } });
  }, [deleteNodes, canEdit]);

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    if (!canEdit) {
      toast.error("You don't have permission to edit this project");
      return;
    }
    const edgeIds = deletedEdges.map((edge) => parseInt(edge.id));
    deleteEdges({ variables: { edgeIds } });
  }, [deleteEdges, canEdit]);

  const onClickComponent = useCallback((type: string) => {
    if (!canEdit) {
      toast.error("You don't have permission to edit this project");
      return;
    }
    const flowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!flowBounds) return;
    const position = screenToFlowPosition({
      x: flowBounds.left + flowBounds.width / 2,
      y: flowBounds.top + flowBounds.height / 2,
    });

    const nodeInput: NodeInput = {
      type: type as NodeType,
      name: `${type} node`,
      xPos: position.x,
      yPos: position.y,
      projectId,
    };
    createNode({ variables: { input: nodeInput } });
  }, [screenToFlowPosition, createNode, projectId, canEdit, reactFlowWrapper]);

  /** Prevent self-loops and duplicate edges */
  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      if (connection.source === connection.target) return false;
      const exists = edges.some(
        (e) => e.source === connection.source && e.target === connection.target,
      );
      return !exists;
    },
    [edges],
  );

  return {
    onDragStart,
    onDragOver,
    onDrop,
    onConnect,
    onNodesDelete,
    onEdgesDelete,
    onClickComponent,
    isValidConnection,
  };
}

