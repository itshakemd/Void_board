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
import { StickyNote, X, Timer, Play, Pause, RotateCcw, ListTodo, Plus, ExternalLink } from "lucide-react";

const proOptions: ProOptions = { hideAttribution: true };

const NoteNode = ({ id, data }: NodeProps) => {
  return (
    <div 
      className="w-full h-full border-none shadow-lg transition-transform duration-200 rounded-md p-3" 
      style={{ backgroundColor: data.color as string }}
    >
      <textarea
        className="w-full h-full bg-transparent border-none outline-none text-white/90 placeholder:text-white/30 resize-none font-medium text-[10px] leading-tight nodrag cursor-text custom-scrollbar"
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

const TodoNode = ({ id, data }: NodeProps) => {
  const todos = (data.todos as any[]) || [];

  const updateTodos = (newTodos: any[]) => {
    if (typeof data.onDataChange === 'function') {
      data.onDataChange(id, { todos: newTodos });
    }
  };

  const addTodo = () => {
    const newTodo = { id: Date.now(), text: "", completed: false };
    updateTodos([...todos, newTodo]);
  };

  const toggleTodo = (todoId: number) => {
    const newTodos = todos.map((t) => 
      t.id === todoId ? { ...t, completed: !t.completed } : t
    );
    updateTodos(newTodos);
  };

  const updateTodoText = (todoId: number, text: string) => {
    const newTodos = todos.map((t) => 
      t.id === todoId ? { ...t, text } : t
    );
    updateTodos(newTodos);
  };

  return (
    <div 
      className="w-full h-full border-none shadow-lg transition-transform duration-200 rounded-md p-2 flex flex-col" 
      style={{ backgroundColor: data.color as string }}
    >
      <div className="flex-1 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden mb-2 pr-1 custom-scrollbar">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center py-0.5 group w-full gap-1.5">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleTodo(todo.id);
              }}
              className={`w-3 h-3 rounded-sm border border-white/20 flex items-center justify-center transition-colors nodrag shrink-0
                ${todo.completed ? 'bg-white/20 border-white/40' : 'hover:border-white/40'}
              `}
            >
              {todo.completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </button>
            <input 
              type="text"
              value={todo.text}
              onChange={(e) => updateTodoText(todo.id, e.target.value)}
              placeholder="Item..."
              className={`flex-1 min-w-0 bg-transparent border-none outline-none text-[9px] text-white/90 placeholder:text-white/20 nodrag ${todo.completed ? 'line-through opacity-40' : ''}`}
              autoFocus={todo.text === ""}
            />
          </div>
        ))}
      </div>
      
      <button 
        className="h-5 w-full rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 nodrag active:scale-95 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          addTodo();
        }}
      >
        <Plus size={12} />
      </button>
      
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

const LinkNode = ({ id, data }: NodeProps) => {
  const [inputValue, setInputValue] = useState("");
  const savedUrl = (data.url as string) || "";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue) {
      if (typeof data.onDataChange === 'function') {
        data.onDataChange(id, { url: inputValue });
      }
    }
  };

  return (
    <div 
      className="w-full h-full border-none shadow-lg transition-transform duration-200 rounded-md p-2 flex flex-col items-center justify-center overflow-hidden" 
      style={{ backgroundColor: data.color as string }}
    >
      {!savedUrl ? (
        <div className="w-full h-7 rounded-lg bg-black/10 border border-white/10 flex items-center px-2">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste URL"
            className="w-full bg-transparent border-none outline-none text-[10px] text-white/90 placeholder:text-white/20 nodrag"
            autoFocus
          />
        </div>
      ) : (
        <a 
          href={savedUrl.startsWith('http') ? savedUrl : `https://${savedUrl}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full h-full flex flex-col items-center justify-center gap-1.5 nodrag hover:bg-white/5 transition-colors p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <ExternalLink size={14} className="text-white/80" />
          </div>
          <span className="text-[8px] text-white/60 truncate w-full text-center px-1 font-medium">
            {savedUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
          </span>
        </a>
      )}
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
      <div 
        className="border-r border-white/10 flex items-center justify-center p-2 hover:bg-white/10 cursor-pointer transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          if (typeof data.onChangeType === 'function') {
            data.onChangeType(id, 'todo');
          }
        }}
      >
        <ListTodo className="w-full h-full text-white/80" />
      </div>
      <div 
        className="flex items-center justify-center p-2 hover:bg-white/10 cursor-pointer transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          if (typeof data.onChangeType === 'function') {
            data.onChangeType(id, 'link');
          }
        }}
      >
        <ExternalLink className="w-full h-full text-white/80" />
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
  todo: TodoNode,
  link: LinkNode,
};

interface InfinityBoardProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeDrag?: (event: React.MouseEvent, node: Node) => void;
  onNodeDragStop?: (event: React.MouseEvent, node: Node) => void;
}

export function InfinityBoard({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDrag,
  onNodeDragStop,
}: InfinityBoardProps) {
  return (
    <div className="w-full h-full min-h-screen relative bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        proOptions={proOptions}
      >
        <Background color="#ccc" gap={16} />
      </ReactFlow>
    </div>
  );
}
