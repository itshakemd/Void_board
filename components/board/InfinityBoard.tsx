"use client";

import {
  ReactFlow,
  Background,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Edge,
  Node,
  ProOptions,
  NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const proOptions: ProOptions = { hideAttribution: true };

// Simple Square component that doesn't look like a "node"
const SquareNode = ({ data }: NodeProps) => {
  return (
    <div 
      className="w-full h-full border-none shadow-lg transition-transform duration-200 active:scale-95 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-md" 
      style={{ backgroundColor: data.color as string }}
    >
      <div className="border-r border-b border-white/10" />
      <div className="border-b border-white/10" />
      <div className="border-r border-white/10" />
      <div className="border-white/10" />
      
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

const nodeTypes = {
  square: SquareNode,
};

interface InfinityBoardProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

export function InfinityBoard({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: InfinityBoardProps) {
  return (
    <div className="w-full h-full min-h-screen relative bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={proOptions}
      >
        <Background color="#ccc" gap={16} />
      </ReactFlow>
    </div>
  );
}
