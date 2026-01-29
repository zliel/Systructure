import { useCallback, useEffect, useRef, useState } from 'react';
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
import { mapProjectEdgesToFlowEdges, mapProjectNodesToFlowNodes } from '@/utils/transformers';
import { type Node as ProjectNode, type Edge as ProjectEdge, NodeType, type EdgeInput, type NodeInput } from '@/types';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_EDGE, CREATE_NODE, DELETE_EDGES, DELETE_NODES, GET_PROJECT_COMPONENTS } from '@/queries';
import { SpinnerBadge } from '@/components/SpinnerBadge';
import { useTheme } from '@/components/theme-provider';
import { NodeDetailsPanel } from '@/components/NodeDetailsPanel';
import { SidebarInset } from '@/components/ui/sidebar';

const PROJECT_ID = 552;

interface ProjectComponents {
  id: number;
  name: string;
  nodes: ProjectNode[];
  edges: ProjectEdge[];
}

function FlowContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const { screenToFlowPosition, updateNodeData } = useReactFlow();

  // Queries & Mutations
  const { loading, data } = useQuery<{ projectById: ProjectComponents }>(GET_PROJECT_COMPONENTS, { variables: { projectId: PROJECT_ID } });

  const [createNode] = useMutation<{ createNode: ProjectNode }>(CREATE_NODE, {
    onCompleted: (data) => {
      const newNode: Node = {
        id: `${data.createNode.id}`,
        type: 'default',
        position: { x: data.createNode.xPos, y: data.createNode.yPos },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: { label: data.createNode.name, type: data.createNode.type },
      };
      setNodes((nds) => nds.concat(newNode));
    }
  });

  const [createEdge] = useMutation<{ createEdge: ProjectEdge }>(CREATE_EDGE, {
    onCompleted: (data) => {
      const newEdge: Edge = {
        id: `${data.createEdge.id}`,
        source: `${data.createEdge.sourceNode.id}`,
        target: `${data.createEdge.targetNode.id}`,
        animated: true,
      };
      setEdges((eds) => eds.concat(newEdge));
    }
  });

  const [deleteNodes] = useMutation(DELETE_NODES, {
    onError: (error) => console.error("Error deleting nodes:", error)
  });

  const [deleteEdges] = useMutation(DELETE_EDGES, {
    onError: (error) => console.error("Error deleting edges:", error)
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
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
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
        projectId: PROJECT_ID,
      };
      createNode({ variables: { input: nodeInput } });
    },
    [screenToFlowPosition, createNode]
  );

  const onConnect = useCallback((params: any) => {
    const edgeInput: EdgeInput = {
      sourceNodeId: parseInt(params.source),
      targetNodeId: parseInt(params.target),
      projectId: PROJECT_ID,
    }
    createEdge({ variables: { input: edgeInput } });
  }, [createEdge]);

  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    const nodeIds = deletedNodes.map((node) => parseInt(node.id));
    deleteNodes({ variables: { nodeIds } });
  }, [deleteNodes]);

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    const edgeIds = deletedEdges.map((edge) => parseInt(edge.id));
    deleteEdges({ variables: { edgeIds } });
  }, [deleteEdges]);

  const onClickComponent = useCallback((type: string) => {
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
      projectId: PROJECT_ID,
    };
    createNode({ variables: { input: nodeInput } });
  }, [screenToFlowPosition, createNode]);

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, []);

  const handleNodeSave = useCallback((nodeId: string, updatedData: { label: string; type: NodeType }) => {
    updateNodeData(nodeId, { label: updatedData.label });
  }, [updateNodeData]);

  return (
    <div className="flex h-screen w-full" ref={reactFlowWrapper}>
      <AppSidebar onDragStart={onDragStart} onDoubleClick={onClickComponent} />
      <SidebarInset className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onNodeDoubleClick={onNodeDoubleClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
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

        <NodeDetailsPanel
          node={selectedNode}
          projectId={PROJECT_ID}
          open={isPanelOpen}
          onOpenChange={setIsPanelOpen}
          onSave={handleNodeSave}
        />
      </SidebarInset>
    </div>
  );
}

export default function FlowEditor() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  )
}
