import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { type Node } from '@xyflow/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UPDATE_NODE } from '@/queries';
import { NodeType, type Node as ProjectNode, type UpdateNodeInput } from '@/types';

interface NodeDetailsPanelProps {
  node: Node | null;
  projectId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (nodeId: string, updatedData: { label: string; type: NodeType }) => void;
}

export function NodeDetailsPanel({
  node,
  projectId,
  open,
  onOpenChange,
  onSave,
}: NodeDetailsPanelProps) {
  const [name, setName] = useState('');
  const [nodeType, setNodeType] = useState<NodeType>(NodeType.SERVICE);

  const [updateNode, { loading }] = useMutation<{ updateNode: ProjectNode }>(UPDATE_NODE, {
    onCompleted: (data) => {
      if (node) {
        onSave(node.id, { label: data.updateNode.name, type: data.updateNode.type });
      }
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error updating node:', error);
    },
  });

  useEffect(() => {
    if (node) {
      setName((node.data as { label?: string, type?: NodeType }).label ?? '');
      setNodeType(node.data.type as NodeType);
    }
  }, [node]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!node) return;

      const input: UpdateNodeInput = {
        name,
        type: nodeType,
        xPos: node.position.x,
        yPos: node.position.y,
        projectId,
      };

      updateNode({
        variables: {
          nodeId: node.id,
          input,
        },
      });
    },
    [node, name, nodeType, projectId, updateNode]
  );

  if (!node) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-100 sm:max-w-100">
        <SheetHeader>
          <SheetTitle>Edit Node</SheetTitle>
          <SheetDescription>
            Update the properties of this node. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="node-name">Name</Label>
            <Input
              id="node-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter node name"
              className="nodrag nokey"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="node-type">Type</Label>
            <Select value={nodeType} onValueChange={(value) => setNodeType(value as NodeType)}>
              <SelectTrigger id="node-type" className="nodrag nokey w-full">
                <SelectValue placeholder="Select node type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NodeType.DATABASE}>Database</SelectItem>
                <SelectItem value={NodeType.GATEWAY}>Gateway</SelectItem>
                <SelectItem value={NodeType.QUEUE}>Queue</SelectItem>
                <SelectItem value={NodeType.SERVICE}>Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

