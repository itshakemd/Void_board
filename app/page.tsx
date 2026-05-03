"use client";

import { useCallback, useState } from "react";
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from "@xyflow/react";
import { InfinityBoard } from "@/components/board/InfinityBoard";
import { BottomBar } from "@/components/layout/BottomBar";

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const updateNodeType = useCallback((id: string, type: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, type };
        }
        return node;
      })
    );
  }, [setNodes]);

  const updateNodeData = useCallback((id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const addNode = useCallback((color: string) => {
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: "square",
      data: { 
        color, 
        onChangeType: updateNodeType,
        onDataChange: updateNodeData 
      },
      position: { 
        x: Math.random() * 400 - 200, 
        y: Math.random() * 400 - 200 
      },
      style: { 
        width: 100,
        height: 100,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, updateNodeType, updateNodeData]);

  const onNodeDrag = useCallback((event: React.MouseEvent) => {
    const deleteBtn = document.querySelector('[aria-label="Delete"]');
    if (deleteBtn) {
      const rect = deleteBtn.getBoundingClientRect();
      const padding = 20;
      const isOver = (
        event.clientX >= rect.left - padding &&
        event.clientX <= rect.right + padding &&
        event.clientY >= rect.top - padding &&
        event.clientY <= rect.bottom + padding
      );
      setIsDeleting(isOver);
    }
  }, []);

  const onNodeDragStop = useCallback((_: any, node: Node) => {
    if (isDeleting) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
    }
    setIsDeleting(false);
  }, [isDeleting, setNodes]);

  return (
    <main className="w-full h-screen overflow-hidden relative">
      <InfinityBoard 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
      />
      <BottomBar onAddNode={addNode} isDeleteActive={isDeleting} />
    </main>
  );
}
