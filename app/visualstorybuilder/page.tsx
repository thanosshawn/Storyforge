"use client";
import React, { useCallback, useState } from "react";
import "reactflow/dist/style.css";
import ReactFlow, {



    addEdge,
    Background,
    Controls,
    MiniMap,
    useEdgesState,
    useNodesState,
    Connection,
    Edge,
    Node,
} from "reactflow";

const initialNodes: Node[] = [
    {
        id: "1",
        type: "input",
        data: { label: "Start Story" },
        position: { x: 250, y: 5 },
    },
];

const initialEdges: Edge[] = [];

export default function VisualStoryBuilder() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const addStoryNode = () => {
        const id = (nodes.length + 1).toString();
        setNodes((nds) => [
            ...nds,
            {
                id,
                data: { label: `Story Node ${id}` },
                position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 400 },
            },
        ]);
    };

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <button
                onClick={addStoryNode}
                style={{
                    position: "absolute",
                    zIndex: 10,
                    left: 10,
                    top: 10,
                    padding: "8px 16px",
                }}
            >
                Add Story Node
            </button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
}