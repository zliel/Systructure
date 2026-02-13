import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from '../theme-provider';
import { nodeTypes } from '@/components/flow';
import { NodeType } from '@/features/editor/types';

const demoNodes: Node[] = [
  {
    id: '1',
    type: 'system',
    position: { x: 50, y: 150 },
    data: { label: 'Frontend', type: NodeType.SERVICE },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '2',
    type: 'system',
    position: { x: 250, y: 150 },
    data: { label: 'API Gateway', type: NodeType.GATEWAY },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '3',
    type: 'system',
    position: { x: 450, y: 100 },
    data: { label: 'Backend', type: NodeType.SERVICE },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '4',
    type: 'system',
    position: { x: 450, y: 200 },
    data: { label: 'Database', type: NodeType.DATABASE },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

const demoEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    animated: true,
  },
];

export function ProductDemo() {
  const { theme } = useTheme();
  return (
    <section id="demo" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Product Preview
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            See Your Architecture Come to Life
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Drag, drop, and connect components to create comprehensive system diagrams
            that your whole team can understand.
          </p>
        </div>

        {/* Demo Preview Card */}
        <Card className="relative overflow-hidden border-2 border-border/50 bg-card/50 backdrop-blur-sm">
          {/* Blueprint Corner Decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30 z-10" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30 z-10" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30 z-10" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30 z-10" />

          {/* Mock Editor Interface */}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 text-center text-sm text-muted-foreground font-mono">
                my-project.systructure
              </div>
            </div>

            <div className="h-75 md:h-87.5 rounded-lg overflow-hidden border border-border/30">
              <ReactFlow
                nodes={demoNodes}
                edges={demoEdges}
                nodeTypes={nodeTypes}
                colorMode={theme === 'dark' ? 'dark' : 'light'}
                // nodesDraggable={false}
                // nodesConnectable={false}
                // elementsSelectable={false}
                // panOnDrag={false}
                zoomOnScroll={false}
                // zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                fitView
                fitViewOptions={{ padding: 0.3 }}
              >
                <Background gap={20} size={1} />
              </ReactFlow>
            </div>
          </div>
        </Card>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Badge variant="secondary" className="px-4 py-2">
            <ArrowRight className="w-3 h-3 mr-2" />
            Drag & Drop
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <ArrowRight className="w-3 h-3 mr-2" />
            Auto-Connect
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <ArrowRight className="w-3 h-3 mr-2" />
            Real-time Preview
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <ArrowRight className="w-3 h-3 mr-2" />
            Export to Docker Compose
          </Badge>
        </div>
      </div>
    </section>
  );
}
