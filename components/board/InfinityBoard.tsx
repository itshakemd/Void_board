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
import { useState, useEffect } from "react";
import { StickyNote, X, Timer, Play, Pause, RotateCcw } from "lucide-react";

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

const TimerNode = ({ data }: NodeProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="w-full h-full border-none shadow-lg transition-transform duration-200 rounded-md p-2 flex flex-col items-center justify-between" 
      style={{ backgroundColor: data.color as string }}
    >
      <div className="flex-1 flex items-center justify-center">
        <span className="text-white font-mono text-xl font-bold tracking-tighter tabular-nums">
          {formatTime(time)}
        </span>
      </div>

      <div className="mb-1">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsRunning(!isRunning);
          }}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors nodrag active:scale-90"
        >
          {isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </button>
      </div>

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
      <div 
        className="border-b border-white/10 flex items-center justify-center p-2 hover:bg-white/10 cursor-pointer transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          if (typeof data.onChangeType === 'function') {
            data.onChangeType(id, 'timer');
          }
        }}
      >
        <Timer className="w-full h-full text-white/80" />
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
  timer: TimerNode,
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
