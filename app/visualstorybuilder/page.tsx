'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// Types
interface StoryNode {
    id: string;
    title: string;
    content: string;
    tags: string[];
    visibility: 'draft' | 'public' | 'locked';
    author: string;
    lastEdited: Date;
    isAIGenerated: boolean;
    x: number;
    y: number;
    choices: Choice[];
}

interface Choice {
    id: string;
    text: string;
    targetNodeId?: string;
}

interface Collaborator {
    id: string;
    name: string;
    avatar: string;
    isTyping: boolean;
    currentNode?: string;
}

interface Connection {
    id: string;
    fromNodeId: string;
    toNodeId: string;
    choiceId: string;
}

export default function VisualStoryBuilder() {
    const [nodes, setNodes] = useState<StoryNode[]>([
        {
            id: '1',
            title: 'Opening Scene',
            content:
                'The rain drummed against the window as Sarah sat alone in the dimly lit café, her fingers tracing the rim of her coffee cup. She had been waiting for twenty minutes, and doubt began to creep in...',
            tags: ['romantic', 'atmospheric'],
            visibility: 'public',
            author: 'You',
            lastEdited: new Date(),
            isAIGenerated: false,
            x: 300,
            y: 200,
            choices: [
                { id: 'c1', text: 'Wait a little longer', targetNodeId: '2' },
                { id: 'c2', text: 'Leave the café' },
            ],
        },
        {
            id: '2',
            title: 'The Arrival',
            content:
                'Just as Sarah was about to give up, the door chimed and a familiar silhouette appeared through the rain-streaked glass...',
            tags: ['tension', 'romantic'],
            visibility: 'draft',
            author: 'You',
            lastEdited: new Date(),
            isAIGenerated: false,
            x: 600,
            y: 150,
            choices: [
                { id: 'c3', text: 'Smile and wave' },
                { id: 'c4', text: 'Pretend not to notice' },
            ],
        },
    ]);

    const [connections] = useState<Connection[]>([
        { id: 'conn1', fromNodeId: '1', toNodeId: '2', choiceId: 'c1' },
    ]);

    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [storyTitle, setStoryTitle] = useState('Untitled Story');
    const [isViewerMode, setIsViewerMode] = useState(false);
    const [viewerCount, setViewerCount] = useState(247);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    // Mock collaborators
    const [collaborators] = useState<Collaborator[]>([
        { id: '1', name: 'Alex', avatar: '👩‍💻', isTyping: false },
        { id: '2', name: 'Jordan', avatar: '👨‍🎨', isTyping: true, currentNode: '1' },
        { id: '3', name: 'Sam', avatar: '👩‍🔬', isTyping: false },
    ]);

    // Mock floating emojis
    const [floatingEmojis, setFloatingEmojis] = useState<
        Array<{ id: string; emoji: string; x: number; y: number }>
    >([]);

    const canvasRef = useRef<HTMLDivElement>(null);

    const handleNodeMouseDown = useCallback(
        (e: React.MouseEvent, nodeId: string) => {
            e.preventDefault();
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const node = nodes.find((n) => n.id === nodeId);
            if (!node) return;

            setDraggedNode(nodeId);
            setDragOffset({
                x: e.clientX - rect.left - node.x * zoom - canvasOffset.x,
                y: e.clientY - rect.top - node.y * zoom - canvasOffset.y,
            });
        },
        [nodes, zoom, canvasOffset],
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!draggedNode || !canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const newX = (e.clientX - rect.left - dragOffset.x - canvasOffset.x) / zoom;
            const newY = (e.clientY - rect.top - dragOffset.y - canvasOffset.y) / zoom;

            setNodes((prev) =>
                prev.map((node) =>
                    node.id === draggedNode ? { ...node, x: newX, y: newY } : node,
                ),
            );
        },
        [draggedNode, dragOffset, canvasOffset, zoom],
    );

    const handleMouseUp = useCallback(() => {
        setDraggedNode(null);
    }, []);

    const addNewNode = useCallback(() => {
        const newNode: StoryNode = {
            id: `node-${Date.now()}`,
            title: 'New Scene',
            content: 'Start writing your scene here...',
            tags: [],
            visibility: 'draft',
            author: 'You',
            lastEdited: new Date(),
            isAIGenerated: false,
            x: Math.random() * 400 + 200,
            y: Math.random() * 300 + 200,
            choices: [],
        };
        setNodes((prev) => [...prev, newNode]);
    }, []);

    const generateWithAI = useCallback(async () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);
        setTimeout(() => {
            const newNode: StoryNode = {
                id: `ai-${Date.now()}`,
                title: 'AI Generated Scene',
                content: `Generated content based on: "${aiPrompt}". The tension builds as characters face their deepest desires, the air thick with unspoken words and electric anticipation...`,
                tags: ['ai-generated', 'tension'],
                visibility: 'draft',
                author: 'AI Assistant',
                lastEdited: new Date(),
                isAIGenerated: true,
                x: Math.random() * 400 + 200,
                y: Math.random() * 300 + 200,
                choices: [
                    { id: `choice-${Date.now()}`, text: 'Continue the tension' },
                    { id: `choice-${Date.now() + 1}`, text: 'Break the moment' },
                ],
            };
            setNodes((prev) => [...prev, newNode]);
            setAiPrompt('');
            setIsGenerating(false);
        }, 2000);
    }, [aiPrompt]);

    // Simulate floating emojis
    useEffect(() => {
        const interval = setInterval(() => {
            const emojis = ['💖', '🔥', '😮', '💕', '✨', '🌹', '💋'];
            const newEmoji = {
                id: Date.now().toString(),
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                x: Math.random() * (window.innerWidth - 100),
                y: Math.random() * (window.innerHeight - 100),
            };
            setFloatingEmojis((prev) => [...prev.slice(-5), newEmoji]);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null;

    const updateSelectedNode = useCallback(
        (updates: Partial<StoryNode>) => {
            if (!selectedNode) return;
            setNodes((prev) =>
                prev.map((node) => (node.id === selectedNode ? { ...node, ...updates } : node)),
            );
        },
        [selectedNode],
    );

    // Connection rendering helper
    const renderConnection = (conn: Connection) => {
        const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
        const toNode = nodes.find((n) => n.id === conn.toNodeId);
        if (!fromNode || !toNode) return null;

        const startX = (fromNode.x + 160) * zoom + canvasOffset.x;
        const startY = (fromNode.y + 80) * zoom + canvasOffset.y;
        const endX = toNode.x * zoom + canvasOffset.x;
        const endY = (toNode.y + 80) * zoom + canvasOffset.y;

        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        return (
            <g key={conn.id} data-oid="z2ezkup">
                <path
                    d={`M ${startX} ${startY} Q ${midX} ${startY} ${endX} ${endY}`}
                    stroke="#ec4899"
                    strokeWidth="2"
                    fill="none"
                    className="opacity-70"
                    data-oid="2p4:a-0"
                />

                <circle cx={endX} cy={endY} r="4" fill="#ec4899" data-oid="_obbu2-" />
            </g>
        );
    };

    return (
        <div
            className="w-full h-screen bg-gray-950 text-white flex flex-col overflow-hidden"
            data-oid="zicqrgy"
        >
            {/* Top Navbar */}
            <nav
                className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between z-50"
                data-oid="w3ma23d"
            >
                <div className="flex items-center gap-4" data-oid="t0m8cjz">
                    <div className="flex items-center gap-2" data-oid="t_jp-lc">
                        <span className="text-2xl" data-oid="-2tvqfj">
                            🔥
                        </span>
                        <input
                            value={storyTitle}
                            onChange={(e) => setStoryTitle(e.target.value)}
                            className="bg-transparent text-xl font-semibold border-none outline-none text-white min-w-[200px]"
                            placeholder="Story Title"
                            data-oid="3r34xbk"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4" data-oid="bc:lny8">
                    {/* Collaborators */}
                    <div className="flex -space-x-2" data-oid="4lh-uxw">
                        {collaborators.map((collab) => (
                            <div key={collab.id} className="relative" data-oid="q:tgjny">
                                <div
                                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-900 text-sm"
                                    data-oid="domsiwv"
                                >
                                    {collab.avatar}
                                </div>
                                {collab.isTyping && (
                                    <div
                                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"
                                        data-oid="vxa:ycz"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Viewer Count */}
                    <div
                        className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full"
                        data-oid="c5-s1vq"
                    >
                        <span className="text-sm" data-oid="jcg6l0v">
                            👁️
                        </span>
                        <span className="text-sm" data-oid="epn9_g2">
                            {viewerCount}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2" data-oid="curnv2u">
                        <button
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                            data-oid="2b10f3_"
                        >
                            📤 Save Draft
                        </button>
                        <button
                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-sm transition-all"
                            data-oid="d5c55gi"
                        >
                            🚀 Publish
                        </button>
                        <button
                            onClick={() => setIsViewerMode(!isViewerMode)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                isViewerMode
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                            data-oid="49i88tl"
                        >
                            👁️ {isViewerMode ? 'Exit Viewer' : 'Viewer Mode'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden" data-oid="pdeu62e">
                {/* Left Sidebar - Node Editor */}
                <div
                    className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 p-4 overflow-y-auto"
                    data-oid="618m-1h"
                >
                    <h2 className="text-lg font-semibold mb-4" data-oid="6z.k81_">
                        📝 Scene Editor
                    </h2>

                    {selectedNodeData ? (
                        <div className="space-y-4" data-oid="rd_gyb3">
                            <div data-oid=":-s36-_">
                                <label
                                    className="block text-sm font-medium mb-2"
                                    data-oid="_0.ubym"
                                >
                                    Scene Title
                                </label>
                                <input
                                    value={selectedNodeData.title}
                                    onChange={(e) => updateSelectedNode({ title: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 outline-none"
                                    placeholder="Enter scene title..."
                                    data-oid=".ds21gy"
                                />
                            </div>

                            <div data-oid="wy:c5jf">
                                <label
                                    className="block text-sm font-medium mb-2"
                                    data-oid="heprfhh"
                                >
                                    Content
                                </label>
                                <textarea
                                    value={selectedNodeData.content}
                                    onChange={(e) =>
                                        updateSelectedNode({ content: e.target.value })
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm h-32 resize-none focus:border-pink-500 outline-none"
                                    placeholder="Write your scene content..."
                                    data-oid="o21vq.."
                                />
                            </div>

                            <div data-oid="x1-ajm1">
                                <label
                                    className="block text-sm font-medium mb-2"
                                    data-oid="vjdt05:"
                                >
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2" data-oid="5463ia8">
                                    {selectedNodeData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className={`px-2 py-1 rounded text-xs ${
                                                tag === 'romantic'
                                                    ? 'bg-pink-500/20 text-pink-300'
                                                    : tag === 'dark'
                                                      ? 'bg-gray-500/20 text-gray-300'
                                                      : tag === 'kinky'
                                                        ? 'bg-red-500/20 text-red-300'
                                                        : tag === 'tension'
                                                          ? 'bg-orange-500/20 text-orange-300'
                                                          : 'bg-purple-500/20 text-purple-300'
                                            }`}
                                            data-oid="5q8np-d"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <input
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 outline-none"
                                    placeholder="Add tags (romantic, dark, kinky, tension)..."
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            const value = e.currentTarget.value.trim();
                                            if (value && !selectedNodeData.tags.includes(value)) {
                                                updateSelectedNode({
                                                    tags: [...selectedNodeData.tags, value],
                                                });
                                                e.currentTarget.value = '';
                                            }
                                        }
                                    }}
                                    data-oid="cyy_h.l"
                                />
                            </div>

                            <div data-oid="1_s9iie">
                                <label
                                    className="block text-sm font-medium mb-2"
                                    data-oid="utvhjr7"
                                >
                                    Visibility
                                </label>
                                <select
                                    value={selectedNodeData.visibility}
                                    onChange={(e) =>
                                        updateSelectedNode({ visibility: e.target.value as any })
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 outline-none"
                                    data-oid="gnae2e8"
                                >
                                    <option value="draft" data-oid="ge5bywi">
                                        📝 Draft
                                    </option>
                                    <option value="public" data-oid="ermo:0b">
                                        🌍 Public
                                    </option>
                                    <option value="locked" data-oid="jgn85fh">
                                        🔒 Locked
                                    </option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-700" data-oid="7m7nqtc">
                                <h3 className="text-sm font-medium mb-2" data-oid="9w.:405">
                                    Choices ({selectedNodeData.choices.length})
                                </h3>
                                <div className="space-y-2 mb-3" data-oid="8_ed5w3">
                                    {selectedNodeData.choices.map((choice, index) => (
                                        <div
                                            key={choice.id}
                                            className="bg-gray-800 rounded-lg p-2"
                                            data-oid="loy4wvn"
                                        >
                                            <input
                                                value={choice.text}
                                                onChange={(e) => {
                                                    const newChoices = [
                                                        ...selectedNodeData.choices,
                                                    ];

                                                    newChoices[index] = {
                                                        ...choice,
                                                        text: e.target.value,
                                                    };
                                                    updateSelectedNode({ choices: newChoices });
                                                }}
                                                className="w-full bg-transparent text-sm outline-none"
                                                placeholder="Choice text..."
                                                data-oid="c2r43q."
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        const newChoice = {
                                            id: `choice-${Date.now()}`,
                                            text: 'New choice',
                                        };
                                        updateSelectedNode({
                                            choices: [...selectedNodeData.choices, newChoice],
                                        });
                                    }}
                                    className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-sm transition-colors"
                                    data-oid="yru:b23"
                                >
                                    + Add Choice
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8" data-oid="-g_oixs">
                            <div className="text-4xl mb-4" data-oid="d.cubm1">
                                📝
                            </div>
                            <p data-oid="r257dw.">Select a node to edit its content</p>
                            <p className="text-sm mt-2" data-oid="pa7zgxw">
                                Click on any story node in the canvas
                            </p>
                        </div>
                    )}
                </div>

                {/* Center - Canvas */}
                <div className="flex-1 relative overflow-hidden bg-gray-950" data-oid="f8.obd1">
                    <div
                        ref={canvasRef}
                        className="w-full h-full relative cursor-grab active:cursor-grabbing"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        data-oid="qu112bn"
                    >
                        {/* Grid Background */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: '20px 20px',
                                transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
                            }}
                            data-oid="4:2jhgy"
                        />

                        {/* Connections SVG */}
                        <svg
                            className="absolute inset-0 pointer-events-none z-10"
                            data-oid="k2k7lbe"
                        >
                            {connections.map(renderConnection)}
                        </svg>

                        {/* Story Nodes */}
                        {nodes.map((node) => (
                            <div
                                key={node.id}
                                className={`absolute bg-gray-900/90 backdrop-blur-sm border-2 rounded-xl p-4 min-w-[320px] max-w-[320px] cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl z-20 ${
                                    selectedNode === node.id
                                        ? 'border-pink-500 shadow-pink-500/20'
                                        : 'border-gray-700 hover:border-gray-600'
                                }`}
                                style={{
                                    left: node.x * zoom + canvasOffset.x,
                                    top: node.y * zoom + canvasOffset.y,
                                    transform: `scale(${zoom})`,
                                }}
                                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                                onClick={() => setSelectedNode(node.id)}
                                data-oid="y0x315w"
                            >
                                {/* Node Header */}
                                <div
                                    className="flex items-center justify-between mb-3"
                                    data-oid="a23uzst"
                                >
                                    <div className="flex items-center gap-2" data-oid="9es4fgu">
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                node.visibility === 'public'
                                                    ? 'bg-green-400'
                                                    : node.visibility === 'draft'
                                                      ? 'bg-yellow-400'
                                                      : 'bg-red-400'
                                            }`}
                                            data-oid="n:wj41m"
                                        />

                                        <span className="text-xs text-gray-400" data-oid="w28n2-0">
                                            {node.author}
                                        </span>
                                    </div>
                                    {node.isAIGenerated && (
                                        <div
                                            className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
                                            data-oid="m1.jkk-"
                                        >
                                            🤖 AI
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <h3
                                    className="text-white font-semibold mb-2 text-sm"
                                    data-oid="5_:osa7"
                                >
                                    {node.title}
                                </h3>

                                {/* Content Preview */}
                                <p
                                    className="text-gray-300 text-xs mb-3 line-clamp-3 leading-relaxed"
                                    data-oid="5_pz9_m"
                                >
                                    {node.content.length > 120
                                        ? node.content.substring(0, 120) + '...'
                                        : node.content}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-2" data-oid="e63r9cq">
                                    {node.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                tag === 'romantic'
                                                    ? 'bg-pink-500/20 text-pink-300'
                                                    : tag === 'dark'
                                                      ? 'bg-gray-500/20 text-gray-300'
                                                      : tag === 'kinky'
                                                        ? 'bg-red-500/20 text-red-300'
                                                        : tag === 'tension'
                                                          ? 'bg-orange-500/20 text-orange-300'
                                                          : 'bg-purple-500/20 text-purple-300'
                                            }`}
                                            data-oid="urd2hlv"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Choices */}
                                {node.choices.length > 0 && (
                                    <div
                                        className="border-t border-gray-700 pt-2 mt-2"
                                        data-oid="_p8-o55"
                                    >
                                        <div
                                            className="text-xs text-gray-400 mb-1"
                                            data-oid="f2i8c6x"
                                        >
                                            Choices:
                                        </div>
                                        {node.choices.slice(0, 2).map((choice, index) => (
                                            <div
                                                key={choice.id}
                                                className="text-xs text-gray-300 mb-1"
                                                data-oid="wjmqn:a"
                                            >
                                                • {choice.text}
                                            </div>
                                        ))}
                                        {node.choices.length > 2 && (
                                            <div
                                                className="text-xs text-gray-500"
                                                data-oid="9.9ipif"
                                            >
                                                +{node.choices.length - 2} more...
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Last Edited */}
                                <div className="text-xs text-gray-500 mt-2" data-oid="2dtaoe5">
                                    {node.lastEdited.toLocaleTimeString()}
                                </div>
                            </div>
                        ))}

                        {/* Floating Add Button */}
                        <button
                            onClick={addNewNode}
                            className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-110 shadow-lg z-30"
                            data-oid="5qqukyx"
                        >
                            +
                        </button>

                        {/* Canvas Controls */}
                        <div
                            className="absolute top-4 right-4 flex flex-col gap-2 z-30"
                            data-oid="8ehqoy:"
                        >
                            <button
                                onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
                                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-sm transition-colors"
                                data-oid="m0_7_dd"
                            >
                                +
                            </button>
                            <button
                                onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
                                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-sm transition-colors"
                                data-oid="hsuxp7t"
                            >
                                −
                            </button>
                            <button
                                onClick={() => {
                                    setZoom(1);
                                    setCanvasOffset({ x: 0, y: 0 });
                                }}
                                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-xs transition-colors"
                                data-oid="jdsuf6m"
                            >
                                ⌂
                            </button>
                        </div>
                    </div>

                    {/* Floating Emojis */}
                    {floatingEmojis.map((emoji) => (
                        <div
                            key={emoji.id}
                            className="absolute pointer-events-none text-2xl animate-bounce z-40"
                            style={{
                                left: emoji.x,
                                top: emoji.y,
                                animation: 'float 3s ease-in-out infinite',
                            }}
                            data-oid="ep-6xv7"
                        >
                            {emoji.emoji}
                        </div>
                    ))}
                </div>

                {/* Right Sidebar - AI & Collaboration */}
                <div
                    className="w-80 bg-gray-900/50 backdrop-blur-sm border-l border-gray-800 p-4 overflow-y-auto"
                    data-oid="vga62jb"
                >
                    <div className="space-y-6" data-oid="b8hm74h">
                        {/* AI Assistant */}
                        <div data-oid="r-qi:0b">
                            <h2 className="text-lg font-semibold mb-4" data-oid="i8:xq4n">
                                🧠 AI Co-Author
                            </h2>
                            <div className="space-y-3" data-oid="7hfs6pm">
                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:border-purple-500 outline-none"
                                    placeholder="Continue the story, add branching options, change tone to romantic..."
                                    data-oid="mw2nd8f"
                                />

                                <button
                                    onClick={generateWithAI}
                                    disabled={isGenerating || !aiPrompt.trim()}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg px-3 py-2 text-sm transition-colors"
                                    data-oid="g-dq:be"
                                >
                                    {isGenerating ? '🔄 Generating...' : '✨ Generate Scene'}
                                </button>

                                <div className="grid grid-cols-1 gap-2" data-oid="lwg1znq">
                                    <button
                                        onClick={() =>
                                            setAiPrompt('Suggest what happens next in this scene')
                                        }
                                        className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-xs transition-colors text-left"
                                        data-oid="lw-t3us"
                                    >
                                        💡 Suggest next scene
                                    </button>
                                    <button
                                        onClick={() =>
                                            setAiPrompt('Rewrite this scene with more tension')
                                        }
                                        className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-xs transition-colors text-left"
                                        data-oid="l-y15ij"
                                    >
                                        🔄 Add more tension
                                    </button>
                                    <button
                                        onClick={() =>
                                            setAiPrompt(
                                                'Create 3 different choice options for this scene',
                                            )
                                        }
                                        className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-xs transition-colors text-left"
                                        data-oid="5z-x68:"
                                    >
                                        🔀 Generate choices
                                    </button>
                                    <button
                                        onClick={() =>
                                            setAiPrompt(
                                                'Make this scene more romantic and intimate',
                                            )
                                        }
                                        className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-xs transition-colors text-left"
                                        data-oid="i5u0oow"
                                    >
                                        🌹 Enhance romance
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Live Collaboration */}
                        <div data-oid="8aql.dl">
                            <h2 className="text-lg font-semibold mb-4" data-oid="j2-p0__">
                                👥 Collaborators
                            </h2>
                            <div className="space-y-2" data-oid="xqa:qgf">
                                {collaborators.map((collab) => (
                                    <div
                                        key={collab.id}
                                        className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg"
                                        data-oid="5.wzs6t"
                                    >
                                        <div className="text-lg" data-oid="rab3c14">
                                            {collab.avatar}
                                        </div>
                                        <div className="flex-1" data-oid="3.2miel">
                                            <div className="text-sm font-medium" data-oid="kwkra.i">
                                                {collab.name}
                                            </div>
                                            {collab.isTyping && (
                                                <div
                                                    className="text-xs text-green-400"
                                                    data-oid="8hp1.cu"
                                                >
                                                    Typing in scene...
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className={`w-2 h-2 rounded-full ${collab.isTyping ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}
                                            data-oid="y.od0u6"
                                        />
                                    </div>
                                ))}
                                <button
                                    className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-sm transition-colors"
                                    data-oid="u_ss-2f"
                                >
                                    + Invite Collaborator
                                </button>
                            </div>
                        </div>

                        {/* Version History */}
                        <div data-oid="_ivxx4f">
                            <h2 className="text-lg font-semibold mb-4" data-oid="-noro1_">
                                🔗 Version History
                            </h2>
                            <div className="space-y-2" data-oid="-7tyi9b">
                                <div
                                    className="p-2 bg-gray-800 rounded-lg border-l-2 border-green-400"
                                    data-oid="n75ij4c"
                                >
                                    <div className="text-sm font-medium" data-oid="3cx6qdr">
                                        Current Version
                                    </div>
                                    <div className="text-xs text-gray-400" data-oid="asdq:pe">
                                        2 minutes ago • You
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-800/50 rounded-lg" data-oid="g6upinw">
                                    <div className="text-sm" data-oid="pqpq:p5">
                                        Added opening scene
                                    </div>
                                    <div className="text-xs text-gray-400" data-oid="nxr1:cz">
                                        15 minutes ago • You
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-800/50 rounded-lg" data-oid=".z:cm57">
                                    <div className="text-sm" data-oid="g1xjm9m">
                                        Initial story creation
                                    </div>
                                    <div className="text-xs text-gray-400" data-oid="514wj.u">
                                        1 hour ago • You
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg px-3 py-2 text-sm transition-all"
                                    data-oid="hztii_p"
                                >
                                    🍴 Fork this story
                                </button>
                            </div>
                        </div>

                        {/* Live Stats */}
                        <div data-oid="h_ldc2p">
                            <h2 className="text-lg font-semibold mb-4" data-oid="bcb75-4">
                                📊 Live Stats
                            </h2>
                            <div className="space-y-2" data-oid="t2-57b:">
                                <div
                                    className="flex justify-between items-center p-2 bg-gray-800 rounded-lg"
                                    data-oid="7mqe1o9"
                                >
                                    <span className="text-sm" data-oid="7n86u1j">
                                        👁️ Viewers
                                    </span>
                                    <span className="text-sm font-medium" data-oid="r6bk5zp">
                                        {viewerCount}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between items-center p-2 bg-gray-800 rounded-lg"
                                    data-oid="n9zp3vf"
                                >
                                    <span className="text-sm" data-oid="7yw8z35">
                                        📝 Scenes
                                    </span>
                                    <span className="text-sm font-medium" data-oid="q35sbg0">
                                        {nodes.length}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between items-center p-2 bg-gray-800 rounded-lg"
                                    data-oid="_jvro34"
                                >
                                    <span className="text-sm" data-oid="z6my7i5">
                                        🔗 Connections
                                    </span>
                                    <span className="text-sm font-medium" data-oid="0-r.mx3">
                                        {connections.length}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between items-center p-2 bg-gray-800 rounded-lg"
                                    data-oid="3ojagrr"
                                >
                                    <span className="text-sm" data-oid="-c0dhmp">
                                        👥 Collaborators
                                    </span>
                                    <span className="text-sm font-medium" data-oid="pt2jsl6">
                                        {collaborators.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx data-oid="iz_t5s0">{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(-20px) rotate(5deg);
                        opacity: 0.8;
                    }
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
