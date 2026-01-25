import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { AppSidebar } from './components/AppSidebar';
import { mapProjectEdgesToFlowEdges, mapProjectNodesToFlowNodes } from './utils/transformers';
import { type Node as ProjectNode, type Edge as ProjectEdge } from './types';
import { useQuery } from '@apollo/client/react';
import { GET_PROJECT_COMPONENTS } from './queries';
import { SpinnerBadge } from './components/SpinnerBadge';
import { ThemeToggle } from './components/theme-toggle';
import { useTheme } from './components/theme-provider';

interface ProjectComponents {
  id: number;
  name: string;
  nodes: ProjectNode[];
  edges: ProjectEdge[];
}
const FlowContent = () => {
  const reactFlowWrapper = useRef(null);

  const { loading, error, data } = useQuery<{ projectById: ProjectComponents }>(GET_PROJECT_COMPONENTS, { variables: { projectId: 153 } });
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const { screenToFlowPosition } = useReactFlow();
  const { theme } = useTheme();
  useEffect(() => {
    if (data) {
      const mappedNodes = mapProjectNodesToFlowNodes(data.projectById.nodes);
      const mappedEdges = mapProjectEdgesToFlowEdges(data.projectById.edges);

      setNodes(mappedNodes);
      setEdges(mappedEdges);
    }
  }, [data, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((els) => addEdge(params, els)),
    [],
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'default',
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="flex h-screen w-screen" ref={reactFlowWrapper}>
      <AppSidebar onDragStart={onDragStart} />
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          colorMode={theme === 'dark' ? 'dark' : 'light'}
          defaultEdgeOptions={
            { animated: true }
          }
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 100 }}>
          <ThemeToggle />
        </div>
        {loading && (
          <div style={{ position: 'absolute', top: 22, right: 60, zIndex: 100 }}>
            <SpinnerBadge text="Loading" />
          </div>
        )}
      </div>
    </div>
  );
};

const Flow = () => (
  <ReactFlowProvider>
    <FlowContent />
  </ReactFlowProvider>
);

export default Flow;
