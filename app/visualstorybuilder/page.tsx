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
            <g key={conn.id}>
                <path
                    d={`M ${startX} ${startY} Q ${midX} ${startY} ${endX} ${endY}`}
                    stroke="#ec4899"
                    strokeWidth="2"
                    fill="none"
                    className="opacity-70"
                />

                <circle cx={endX} cy={endY} r="4" fill="#ec4899" />
            </g>
        );
    };

    return (
        <div className="w-full h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
            {/* Top Navbar */}
            <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🔥</span>
                        <input
                            value={storyTitle}
                            onChange={(e) => setStoryTitle(e.target.value)}
                            className="bg-transparent text-xl font-semibold border-none outline-none text-white min-w-[200px]"
                            placeholder="Story Title"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Collaborators */}
                    <div className="flex -space-x-2">
                        {collaborators.map((collab) => (
                            <div key={collab.id} className="relative">
                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-900 text-sm">
                                    {collab.avatar}
                                </div>
                                {collab.isTyping && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Viewer Count */}
                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                        <span className="text-sm">👁️</span>
                        <span className="text-sm">{viewerCount}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                            📤 Save Draft
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-sm transition-all">
                            🚀 Publish
                        </button>
                        <button
                            onClick={() => setIsViewerMode(!isViewerMode)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                isViewerMode
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                        >
                            👁️ {isViewerMode ? 'Exit Viewer' : 'Viewer Mode'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Node Editor */}
                <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">📝 Scene Editor</h2>

                    {selectedNodeData ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Scene Title
                                </label>
                                <input
                                    value={selectedNodeData.title}
                                    onChange={(e) => updateSelectedNode({ title: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 outline-none"
                                    placeholder="Enter scene title..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Content</label>
                                <textarea
                                    value={selectedNodeData.content}
                                    onChange={(e) =>
                                        updateSelectedNode({ content: e.target.value })
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm h-32 resize-none focus:border-pink-500 outline-none"
                                    placeholder="Write your scene content..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Tags</label>
                                <div className="flex flex-wrap gap-2 mb-2">
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
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Visibility</label>
                                <select
                                    value={selectedNodeData.visibility}
                                    onChange={(e) =>
                                        updateSelectedNode({ visibility: e.target.value as any })
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-pink-500 outline-none"
                                >
                                    <option value="draft">📝 Draft</option>
                                    <option value="public">🌍 Public</option>
                                    <option value="locked">🔒 Locked</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-700">
                                <h3 className="text-sm font-medium mb-2">
                                    Choices ({selectedNodeData.choices.length})
                                </h3>
                                <div className="space-y-2 mb-3">
                                    {selectedNodeData.choices.map((choice, index) => (
                                        <div key={choice.id} className="bg-gray-800 rounded-lg p-2">
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
                                >
                                    + Add Choice
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <div className="text-4xl mb-4">📝</div>
                            <p>Select a node to edit its content</p>
                            <p className="text-sm mt-2">Click on any story node in the canvas</p>
                        </div>
                    )}
                </div>

                {/* Center - Canvas */}
                <div className="flex-1 relative overflow-hidden bg-gray-950">
                    <div
                        ref={canvasRef}
                        className="w-full h-full relative cursor-grab active:cursor-grabbing"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
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
                        />

                        {/* Connections SVG */}
                        <svg className="absolute inset-0 pointer-events-none z-10">
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
                            >
                                {/* Node Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                node.visibility === 'public'
                                                    ? 'bg-green-400'
                                                    : node.visibility === 'draft'
                                                      ? 'bg-yellow-400'
                                                      : 'bg-red-400'
                                            }`}
                                        />

                                        <span className="text-xs text-gray-400">{node.author}</span>
                                    </div>
                                    {node.isAIGenerated && (
                                        <div className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                            🤖 AI
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-white font-semibold mb-2 text-sm">
                                    {node.title}
                                </h3>

                                {/* Content Preview */}
                                <p className="text-gray-300 text-xs mb-3 line-clamp-3 leading-relaxed">
                                    {node.content.length > 120
                                        ? node.content.substring(0, 120) + '...'
                                        : node.content}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-2">
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
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Choices */}
                                {node.choices.length > 0 && (
                                    <div className="border-t border-gray-700 pt-2 mt-2">
                                        <div className="text-xs text-gray-400 mb-1">Choices:</div>
                                        {node.choices.slice(0, 2).map((choice, index) => (
                                            <div
                                                key={choice.id}
                                                className="text-xs text-gray-300 mb-1"
                                            >
                                                • {choice.text}
                                            </div>
                                        ))}
                                        {node.choices.length > 2 && (
                                            <div className="text-xs text-gray-500">
                                                +{node.choices.length - 2} more...
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Last Edited */}
                                <div className="text-xs text-gray-500 mt-2">
                                    {node.lastEdited.toLocaleTimeString()}
                                </div>
                            </div>
                        ))}

                        {/* Floating Add Button */}
                        <button
                            onClick={addNewNode}
                            className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-110 shadow-lg z-30"
                        >
                            +
                        </button>

                        {/* Canvas Controls */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
                            <button
                                onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
                                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-sm transition-colors"
                            >
                                +
                            </button>
                            <button
                                onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
                                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-sm transition-colors"
                            >
                                −
                            </button>
                            <button
                                onClick={() => {
                                    setZoom(1);
                                    setCanvasOffset({ x: 0, y: 0 });
                                }}
                                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-xs transition-colors"
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
                        >
                            {emoji.emoji}
                        </div>
                    ))}
                </div>

                {/* Right Sidebar - AI & Collaboration */}
                <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-l border-gray-800 p-4 overflow-y-auto">
                    <div className="space-y-6">
                        {/* AI Assistant */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">🧠 AI Co-Author</h2>
                            <div className="space-y-3">
                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:border-purple-500 outline-none"
                                    placeholder="Continue the story, add branching options, change tone to romantic..."
                                />

                                <button
                                    onClick={generateWithAI}
                                    disabled={isGenerating || !aiPrompt.trim()}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg px-3 py-2 text-sm transition-colors"
                                >
                                    {isGenerating ? '🔄 Generating...' : '✨ Generate Scene'}
                                </button>

                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() =>
                                            setAiPrompt('Suggest what happens next in this scene')
                                        }
                                        className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-xs transition-colors text-left"
                                    >
                                        💡 Suggest next scene
                                    </button>
                                    <button
                                        onClick={() =>
                                            setAiPrompt('Rewrite this scene with more tension')
                                        }
                                        className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-xs transition-colors text-left"
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
                                    >
                                        🌹 Enhance romance
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Live Collaboration */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">👥 Collaborators</h2>
                            <div className="space-y-2">
                                {collaborators.map((collab) => (
                                    <div
                                        key={collab.id}
                                        className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg"
                                    >
                                        <div className="text-lg">{collab.avatar}</div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{collab.name}</div>
                                            {collab.isTyping && (
                                                <div className="text-xs text-green-400">
                                                    Typing in scene...
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className={`w-2 h-2 rounded-full ${collab.isTyping ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}
                                        />
                                    </div>
                                ))}
                                <button className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-sm transition-colors">
                                    + Invite Collaborator
                                </button>
                            </div>
                        </div>

                        {/* Version History */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">🔗 Version History</h2>
                            <div className="space-y-2">
                                <div className="p-2 bg-gray-800 rounded-lg border-l-2 border-green-400">
                                    <div className="text-sm font-medium">Current Version</div>
                                    <div className="text-xs text-gray-400">2 minutes ago • You</div>
                                </div>
                                <div className="p-2 bg-gray-800/50 rounded-lg">
                                    <div className="text-sm">Added opening scene</div>
                                    <div className="text-xs text-gray-400">
                                        15 minutes ago • You
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-800/50 rounded-lg">
                                    <div className="text-sm">Initial story creation</div>
                                    <div className="text-xs text-gray-400">1 hour ago • You</div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg px-3 py-2 text-sm transition-all">
                                    🍴 Fork this story
                                </button>
                            </div>
                        </div>

                        {/* Live Stats */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">📊 Live Stats</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 bg-gray-800 rounded-lg">
                                    <span className="text-sm">👁️ Viewers</span>
                                    <span className="text-sm font-medium">{viewerCount}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-800 rounded-lg">
                                    <span className="text-sm">📝 Scenes</span>
                                    <span className="text-sm font-medium">{nodes.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-800 rounded-lg">
                                    <span className="text-sm">🔗 Connections</span>
                                    <span className="text-sm font-medium">
                                        {connections.length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-800 rounded-lg">
                                    <span className="text-sm">👥 Collaborators</span>
                                    <span className="text-sm font-medium">
                                        {collaborators.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
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
