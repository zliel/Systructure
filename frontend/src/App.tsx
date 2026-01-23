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
  Position,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { AppSidebar } from './components/AppSidebar';
import { mapProjectEdgesToFlowEdges, mapProjectNodesToFlowNodes } from './utils/transformers';
import { type Node as ProjectNode, type Edge as ProjectEdge } from './types';

const dummyNodes: ProjectNode[] = [
  {
    id: 1,
    name: 'Node 1',
    type: 'SERVICE',
    xPos: 0,
    yPos: 150,
  },
  {
    id: 2,
    name: 'Node 2',
    type: 'DATABASE',
    xPos: 250,
    yPos: 0,
  },
  {
    id: 3,
    name: 'Node 3',
    type: 'QUEUE',
    xPos: 250,
    yPos: 150,
  },
  {
    id: 4,
    name: 'Node 4',
    type: 'GATEWAY',
    xPos: 250,
    yPos: 300,
  }
]

const dummyEdges: ProjectEdge[] = [
  {
    id: 1,
    sourceNodeId: 1,
    targetNodeId: 2,
  },
  {
    id: 2,
    sourceNodeId: 1,
    targetNodeId: 3,
  },
  {
    id: 3,
    sourceNodeId: 1,
    targetNodeId: 4,
  }
];

const FlowContent = () => {
  const reactFlowWrapper = useRef(null);
  const mappedNodes = mapProjectNodesToFlowNodes(dummyNodes);
  const mappedEdges = mapProjectEdgesToFlowEdges(dummyEdges);
  const [nodes, setNodes, onNodesChange] = useNodesState(mappedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mappedEdges);
  const { screenToFlowPosition } = useReactFlow();

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
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
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
