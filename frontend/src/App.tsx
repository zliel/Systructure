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
import { GET_EDGES, GET_NODES } from './queries';


const FlowContent = () => {
  const reactFlowWrapper = useRef(null);

  const { loading, error, data: projectNodes } = useQuery<ProjectNode[]>(GET_NODES);
  const { loading: edgesLoading, error: edgesError, data: projectEdges } = useQuery<ProjectEdge[]>(GET_EDGES);
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const { screenToFlowPosition } = useReactFlow();
  console.dir(projectEdges);

  useEffect(() => {
    if (projectNodes && projectEdges) {
      const mappedNodes = mapProjectNodesToFlowNodes(projectNodes.allNodes);
      const mappedEdges = mapProjectEdgesToFlowEdges(projectEdges.allEdges);

      setNodes(mappedNodes);
      setEdges(mappedEdges);
    }
  }, [projectNodes, projectEdges, setNodes, setEdges]);

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
