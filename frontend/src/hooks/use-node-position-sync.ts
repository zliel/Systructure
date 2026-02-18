import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_NODE } from '@/features/editor/api/mutations';
import type { Node } from '@xyflow/react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface PendingPosition {
  x: number;
  y: number;
}

interface UseNodePositionSyncOptions {
  /** Debounce delay in ms (default: 1500) */
  debounceMs?: number;
  /** Whether syncing is enabled (disable for viewers) */
  enabled?: boolean;
}

/**
 * Hook that batches and debounces node position changes, then persists them
 * via UPDATE_NODE mutations. Minimizes server calls by:
 * - Collecting all position changes in a map (deduplicating per node)
 * - Waiting for a quiet period after the last drag stop before saving
 * - Firing mutations only for nodes whose positions actually changed
 * - Not refetching the full project (local state is already correct)
 */
export function useNodePositionSync({
  debounceMs = 1500,
  enabled = true,
}: UseNodePositionSyncOptions = {}) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const pendingRef = useRef<Map<string, PendingPosition>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [updateNode] = useMutation(UPDATE_NODE);

  const flush = useCallback(async () => {
    const pending = new Map(pendingRef.current);
    pendingRef.current.clear();

    if (pending.size === 0) return;

    setSaveStatus('saving');

    try {
      // Fire all mutations in parallel (one per moved node)
      const mutations = Array.from(pending.entries()).map(([nodeId, pos]) =>
        updateNode({
          variables: {
            nodeId,
            input: { xPos: pos.x, yPos: pos.y },
          },
        })
      );

      await Promise.all(mutations);
      setSaveStatus('saved');

      // Clear "saved" indicator after 2s
      savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [updateNode]);

  const enqueue = useCallback(
    (nodeId: string, x: number, y: number) => {
      if (!enabled) return;

      pendingRef.current.set(nodeId, { x, y });

      // Reset debounce timer
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, debounceMs);
    },
    [enabled, debounceMs, flush]
  );

  /**
   * Handler for React Flow's `onNodeDragStop`.
   * Call this directly — it extracts the node ID and position.
   */
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      enqueue(node.id, node.position.x, node.position.y);
    },
    [enqueue]
  );

  /**
   * Handler for multi-node drag stop.
   * React Flow calls this with an array of changed nodes.
   */
  const onNodesDragStop = useCallback(
    (_event: React.MouseEvent, _node: Node, nodes: Node[]) => {
      for (const n of nodes) {
        enqueue(n.id, n.position.x, n.position.y);
      }
    },
    [enqueue]
  );

  // Flush on unmount so we don't lose pending changes
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      // Synchronous best-effort flush — fire mutations without awaiting
      if (pendingRef.current.size > 0) {
        flush();
      }
    };
  }, [flush]);

  return { saveStatus, onNodeDragStop, onNodesDragStop };
}

