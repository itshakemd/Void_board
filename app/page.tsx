"use client";

import { useCallback } from "react";
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from "@xyflow/react";
import { InfinityBoard } from "@/components/board/InfinityBoard";
import { BottomBar } from "@/components/layout/BottomBar";

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback((color: string) => {
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: "square",
      data: { color },
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
  }, [setNodes]);

  return (
    <main className="w-full h-screen overflow-hidden relative">
      <InfinityBoard 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
      <BottomBar onAddNode={addNode} />
    </main>
  );
}
