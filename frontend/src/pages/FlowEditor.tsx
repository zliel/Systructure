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
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { AppSidebar } from '@/components/AppSidebar';
import { nodeTypes } from '@/components/flow';
import { useProjectRole } from '@/hooks/use-project-role';
import { useNodePositionSync } from '@/hooks/use-node-position-sync';
import { useFlowMutations } from '@/features/editor/hooks/use-flow-mutations';
import { useFlowHandlers } from '@/features/editor/hooks/use-flow-handlers';
import { NodeDetailsPanel } from '@/features/editor/components/NodeDetailsPanel';
import { PageTransition } from '@/components/PageTransition';
import { SpinnerBadge } from '@/components/SpinnerBadge';
import { SidebarInset } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/theme-provider';
import { Check, CloudUpload, Eye } from 'lucide-react';

interface FlowContentProps {
  projectId: number;
}

function FlowContent({ projectId }: FlowContentProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const { updateNodeData } = useReactFlow();

  const { canEdit, canManage, role, isLoading: roleLoading } = useProjectRole(projectId);
  const { saveStatus, onNodeDragStop } = useNodePositionSync({ enabled: canEdit });
  const { theme } = useTheme();

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Data fetching & mutations
  const {
    loading,
    initialNodes,
    initialEdges,
    createNode,
    createEdge,
    deleteNodes,
    deleteEdges,
  } = useFlowMutations({ projectId, setNodes, setEdges });

  useEffect(() => {
    if (initialNodes.length > 0 || initialEdges.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Interaction handlers
  const {
    onDragStart,
    onDragOver,
    onDrop,
    onConnect,
    onNodesDelete,
    onEdgesDelete,
    onClickComponent,
    isValidConnection,
  } = useFlowHandlers({
    projectId,
    canEdit,
    reactFlowWrapper,
    edges,
    createNode,
    createEdge,
    deleteNodes,
    deleteEdges,
  });

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, []);

  const handleNodeSave = useCallback((nodeId: string, updatedData: { label: string }) => {
    updateNodeData(nodeId, { label: updatedData.label });
  }, [updateNodeData]);

  return (
    <PageTransition className="flex h-screen w-full">
      <div className="flex h-full w-full" ref={reactFlowWrapper}>
        <AppSidebar onDragStart={onDragStart} onDoubleClick={onClickComponent} canEdit={canEdit} canManage={canManage} projectId={projectId} />
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
            isValidConnection={isValidConnection}
            onNodeDragStop={canEdit ? onNodeDragStop : undefined}
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

          {saveStatus === 'saving' && (
            <div style={{ position: 'absolute', top: 22, right: 60, zIndex: 100 }}>
              <Badge variant="secondary" className="gap-1.5">
                <CloudUpload className="size-3.5 animate-pulse" />
                Saving...
              </Badge>
            </div>
          )}
          {saveStatus === 'saved' && (
            <div style={{ position: 'absolute', top: 22, right: 60, zIndex: 100 }}>
              <Badge variant="secondary" className="gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Check className="size-3.5" />
                Saved
              </Badge>
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
    </PageTransition>
  );
}

export default function FlowEditor() {
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const projectId = projectIdParam ? parseInt(projectIdParam, 10) : NaN;

  if (isNaN(projectId)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ReactFlowProvider>
      <FlowContent projectId={projectId} />
    </ReactFlowProvider>
  );
}
