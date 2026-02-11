import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Position,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { AppSidebar } from '@/components/AppSidebar';
import { nodeTypes } from '@/components/flow';
import { mapProjectEdgesToFlowEdges, mapProjectNodesToFlowNodes } from '@/utils/transformers';
import { type Node as ProjectNode, type Edge as ProjectEdge, NodeType, type EdgeInput, type NodeInput } from '@/types';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_EDGE, CREATE_NODE, DELETE_EDGES, DELETE_NODES, GET_PROJECT_COMPONENTS } from '@/queries';
import { SpinnerBadge } from '@/components/SpinnerBadge';
import { useTheme } from '@/components/theme-provider';
import { NodeDetailsPanel } from '@/components/NodeDetailsPanel';
import { SidebarInset } from '@/components/ui/sidebar';
import { useProjectRole } from '@/hooks/use-project-role';
import { toast } from 'sonner';
import { Eye } from 'lucide-react';

interface ProjectComponents {
  id: number;
  name: string;
  nodes: ProjectNode[];
  edges: ProjectEdge[];
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string }).message;
    if (msg.toLowerCase().includes('access denied') || msg.toLowerCase().includes('forbidden')) {
      return "You don't have permission to perform this action";
    }
    return msg;
  }
  return 'An unexpected error occurred';
}

interface FlowContentProps {
  projectId: number;
}

function FlowContent({ projectId }: FlowContentProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const { screenToFlowPosition, updateNodeData } = useReactFlow();

  // Queries & Mutations
  const { canEdit, role, isLoading: roleLoading } = useProjectRole(projectId);

  const { loading, data } = useQuery<{ projectById: ProjectComponents }>(GET_PROJECT_COMPONENTS, { variables: { projectId } });

  const [createNode] = useMutation<{ createNode: ProjectNode }>(CREATE_NODE, {
    refetchQueries: [{ query: GET_PROJECT_COMPONENTS, variables: { projectId } }],
    onCompleted: (data) => {
      const newNode: Node = {
        id: `${data.createNode.id}`,
        type: 'system',
        position: { x: data.createNode.xPos, y: data.createNode.yPos },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: { label: data.createNode.name, type: data.createNode.type },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const [createEdge] = useMutation<{ createEdge: ProjectEdge }>(CREATE_EDGE, {
    refetchQueries: [{ query: GET_PROJECT_COMPONENTS, variables: { projectId } }],
    onCompleted: (data) => {
      const newEdge: Edge = {
        id: `${data.createEdge.id}`,
        source: `${data.createEdge.sourceNode.id}`,
        target: `${data.createEdge.targetNode.id}`,
        animated: true,
      };
      setEdges((eds) => eds.concat(newEdge));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const [deleteNodes] = useMutation(DELETE_NODES, {
    refetchQueries: [{ query: GET_PROJECT_COMPONENTS, variables: { projectId } }],
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const [deleteEdges] = useMutation(DELETE_EDGES, {
    refetchQueries: [{ query: GET_PROJECT_COMPONENTS, variables: { projectId } }],
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const { theme } = useTheme();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (data) {
      const mappedNodes = mapProjectNodesToFlowNodes(data.projectById.nodes);
      const mappedEdges = mapProjectEdgesToFlowEdges(data.projectById.edges);
      setNodes(mappedNodes);
      setEdges(mappedEdges);
    }
  }, [data, setNodes, setEdges]);

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
    [screenToFlowPosition, createNode, projectId, canEdit]
  );

  const onConnect = useCallback((params: any) => {
    if (!canEdit) {
      toast.error("You don't have permission to edit this project");
      return;
    }
    const edgeInput: EdgeInput = {
      sourceNodeId: parseInt(params.source),
      targetNodeId: parseInt(params.target),
      projectId,
    }
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
  }, [screenToFlowPosition, createNode, projectId, canEdit]);

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, []);

  const handleNodeSave = useCallback((nodeId: string, updatedData: { label: string; type: NodeType }) => {
    updateNodeData(nodeId, { label: updatedData.label });
  }, [updateNodeData]);

  return (
    <div className="flex h-screen w-full" ref={reactFlowWrapper}>
      <AppSidebar onDragStart={onDragStart} onDoubleClick={onClickComponent} canEdit={canEdit} />
      <SidebarInset className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={canEdit ? onConnect : undefined}
          onNodesDelete={canEdit ? onNodesDelete : undefined}
          onEdgesDelete={canEdit ? onEdgesDelete : undefined}
          onNodeDoubleClick={onNodeDoubleClick}
          onDrop={canEdit ? onDrop : undefined}
          onDragOver={canEdit ? onDragOver : undefined}
          nodesDraggable={canEdit}
          nodesConnectable={canEdit}
          elementsSelectable={true}
          deleteKeyCode={canEdit ? ['Backspace', 'Delete'] : []}
          colorMode={theme === 'dark' ? 'dark' : 'light'}
          defaultEdgeOptions={{ animated: true }}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {loading && (
          <div style={{ position: 'absolute', top: 22, right: 60, zIndex: 100 }}>
            <SpinnerBadge text="Loading" />
          </div>
        )}

        {!roleLoading && role && !canEdit && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-muted/80 backdrop-blur-sm border border-border px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Eye className="size-4" />
            View Only
          </div>
        )}

        <NodeDetailsPanel
          node={selectedNode}
          projectId={projectId}
          open={isPanelOpen}
          onOpenChange={setIsPanelOpen}
          onSave={handleNodeSave}
        />
      </SidebarInset>
    </div>
  );
}

export default function FlowEditor() {
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const projectId = projectIdParam ? parseInt(projectIdParam, 10) : NaN;

  // Redirect to dashboard if projectId is invalid
  if (isNaN(projectId)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ReactFlowProvider>
      <FlowContent projectId={projectId} />
    </ReactFlowProvider>
  );
}

