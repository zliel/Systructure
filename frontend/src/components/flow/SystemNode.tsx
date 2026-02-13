import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Server, Database, MessageSquare, Network, type LucideIcon } from 'lucide-react';
import { NodeType } from '@/features/editor/types';
import './system-node.css';

export type SystemNodeData = {
  label: string;
  type: NodeType;
};

export type SystemNode = Node<SystemNodeData, 'system'>;

const nodeConfig: Record<NodeType, { icon: LucideIcon; colorClass: string }> = {
  [NodeType.SERVICE]: { icon: Server, colorClass: 'node-service' },
  [NodeType.DATABASE]: { icon: Database, colorClass: 'node-database' },
  [NodeType.QUEUE]: { icon: MessageSquare, colorClass: 'node-queue' },
  [NodeType.GATEWAY]: { icon: Network, colorClass: 'node-gateway' },
};

export const SystemNode = memo(function SystemNode({
  data,
  selected,
  isConnectable,
}: NodeProps<SystemNode>) {
  const nodeType = data.type || NodeType.SERVICE;
  const config = nodeConfig[nodeType] || nodeConfig[NodeType.SERVICE];
  const Icon = config.icon;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div className={`system-node ${config.colorClass} ${selected ? 'selected' : ''}`}>
        <Icon className="system-node-icon" />
        <span className="system-node-label">{data.label}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});

