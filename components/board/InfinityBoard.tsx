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
import { StickyNote, X } from "lucide-react";

const proOptions: ProOptions = { hideAttribution: true };

const NoteNode = ({ id, data }: NodeProps) => {
  return (
    <div 
      className="w-full h-full border-none shadow-lg transition-transform duration-200 rounded-md p-3" 
      style={{ backgroundColor: data.color as string }}
    >
      <textarea
        className="w-full h-full bg-transparent border-none outline-none text-white/90 placeholder:text-white/30 resize-none font-medium text-[10px] leading-tight nodrag cursor-text"
        placeholder="Type..."
        value={(data.content as string) || ""}
        onChange={(e) => {
          if (typeof data.onDataChange === 'function') {
            data.onDataChange(id, { content: e.target.value });
          }
        }}
        autoFocus
      />
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

// Simple Square component that doesn't look like a "node"
const SquareNode = ({ id, data }: NodeProps) => {
  return (
    <div 
      className="w-full h-full border-none shadow-lg transition-transform duration-200 active:scale-95 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-md" 
      style={{ backgroundColor: data.color as string }}
    >
      <div 
        className="border-r border-b border-white/10 flex items-center justify-center p-2 hover:bg-white/10 cursor-pointer transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          if (typeof data.onChangeType === 'function') {
            data.onChangeType(id, 'note');
          }
        }}
      >
        <StickyNote className="w-full h-full text-white/80" />
      </div>
      <div className="border-b border-white/10 flex items-center justify-center p-2">
        <X className="w-full h-full text-white/80" />
      </div>
      <div className="border-r border-white/10 flex items-center justify-center p-2">
        <X className="w-full h-full text-white/80" />
      </div>
      <div className="flex items-center justify-center p-2">
        <X className="w-full h-full text-white/80" />
      </div>
      
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

const nodeTypes = {
  square: SquareNode,
  note: NoteNode,
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
