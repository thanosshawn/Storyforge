'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Node,
    Edge,
    Connection,
    ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

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
    mediaUrl?: string;
}

interface Collaborator {
    id: string;
    name: string;
    avatar: string;
    isTyping: boolean;
    currentNode?: string;
}

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'storyNode',
        position: { x: 250, y: 100 },
        data: {
            title: 'Opening Scene',
            content:
                'The rain drummed against the window as Sarah sat alone in the dimly lit café...',
            tags: ['romantic', 'atmospheric'],
            visibility: 'public',
            author: 'You',
            lastEdited: new Date(),
            isAIGenerated: false,
        },
    },
];

const initialEdges: Edge[] = [];

// Custom Story Node Component
const StoryNodeComponent = ({ data, selected }: { data: StoryNode; selected: boolean }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div
            className={`
            bg-gray-900/90 backdrop-blur-sm border-2 rounded-xl p-4 min-w-[280px] max-w-[320px]
            transition-all duration-200 shadow-lg
            ${selected ? 'border-pink-500 shadow-pink-500/20' : 'border-gray-700 hover:border-gray-600'}
        `}
            data-oid="b6l59-q"
        >
            {/* Node Header */}
            <div className="flex items-center justify-between mb-3" data-oid="8y3lltn">
                <div className="flex items-center gap-2" data-oid="03y10oz">
                    <div
                        className={`w-2 h-2 rounded-full ${
                            data.visibility === 'public'
                                ? 'bg-green-400'
                                : data.visibility === 'draft'
                                  ? 'bg-yellow-400'
                                  : 'bg-red-400'
                        }`}
                        data-oid="gm_vbru"
                    />

                    <span className="text-xs text-gray-400" data-oid="8bbsemf">
                        {data.author}
                    </span>
                </div>
                {data.isAIGenerated && (
                    <div
                        className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
                        data-oid="r_2qe5e"
                    >
                        🤖 AI
                    </div>
                )}
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold mb-2 text-sm" data-oid="mv7m0i:">
                {data.title}
            </h3>

            {/* Content Preview */}
            <p className="text-gray-300 text-xs mb-3 line-clamp-3" data-oid="lzwl3x6">
                {data.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2" data-oid="rzcrqfg">
                {data.tags.map((tag, index) => (
                    <span
                        key={index}
                        className={`
                        text-xs px-2 py-1 rounded-full
                        ${
                            tag === 'romantic'
                                ? 'bg-pink-500/20 text-pink-300'
                                : tag === 'dark'
                                  ? 'bg-gray-500/20 text-gray-300'
                                  : tag === 'kinky'
                                    ? 'bg-red-500/20 text-red-300'
                                    : 'bg-purple-500/20 text-purple-300'
                        }
                    `}
                        data-oid="c_wrvf7"
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Last Edited */}
            <div className="text-xs text-gray-500" data-oid="u:hxi8_">
                {data.lastEdited.toLocaleTimeString()}
            </div>
        </div>
    );
};

const nodeTypes = {
    storyNode: StoryNodeComponent,
};

export default function VisualStoryBuilder() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [storyTitle, setStoryTitle] = useState('Untitled Story');
    const [isViewerMode, setIsViewerMode] = useState(false);
    const [viewerCount, setViewerCount] = useState(247);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

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

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNode(node.id);
    }, []);

    const addNewNode = useCallback(() => {
        const newNode: Node = {
            id: `${nodes.length + 1}`,
            type: 'storyNode',
            position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
            data: {
                title: 'New Scene',
                content: 'Start writing your scene here...',
                tags: [],
                visibility: 'draft',
                author: 'You',
                lastEdited: new Date(),
                isAIGenerated: false,
            },
        };
        setNodes((nds) => [...nds, newNode]);
    }, [nodes.length, setNodes]);

    const generateWithAI = useCallback(async () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            const newNode: Node = {
                id: `ai-${Date.now()}`,
                type: 'storyNode',
                position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
                data: {
                    title: 'AI Generated Scene',
                    content: `Generated content based on: "${aiPrompt}". The tension builds as characters face their deepest desires...`,
                    tags: ['ai-generated'],
                    visibility: 'draft',
                    author: 'AI Assistant',
                    lastEdited: new Date(),
                    isAIGenerated: true,
                },
            };
            setNodes((nds) => [...nds, newNode]);
            setAiPrompt('');
            setIsGenerating(false);
        }, 2000);
    }, [aiPrompt, setNodes]);

    // Simulate floating emojis
    useEffect(() => {
        const interval = setInterval(() => {
            const emojis = ['💖', '🔥', '😮', '💕', '✨'];
            const newEmoji = {
                id: Date.now().toString(),
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
            };
            setFloatingEmojis((prev) => [...prev.slice(-5), newEmoji]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode)?.data : null;

    return (
        <div
            className="w-full h-screen bg-gray-950 text-white flex flex-col overflow-hidden"
            data-oid="e9gc_ca"
        >
            {/* Top Navbar */}
            <nav
                className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between"
                data-oid="34.wid0"
            >
                <div className="flex items-center gap-4" data-oid="ryw33n0">
                    <div className="flex items-center gap-2" data-oid="j0_2qaj">
                        <span className="text-2xl" data-oid=".3jpgce">
                            🔥
                        </span>
                        <input
                            value={storyTitle}
                            onChange={(e) => setStoryTitle(e.target.value)}
                            className="bg-transparent text-xl font-semibold border-none outline-none text-white"
                            data-oid="05.9rvq"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4" data-oid="3b82gni">
                    {/* Collaborators */}
                    <div className="flex -space-x-2" data-oid="hyrgrfe">
                        {collaborators.map((collab) => (
                            <div key={collab.id} className="relative" data-oid="ivgdmix">
                                <div
                                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-900"
                                    data-oid="7c:ji._"
                                >
                                    {collab.avatar}
                                </div>
                                {collab.isTyping && (
                                    <div
                                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"
                                        data-oid="l1b4p8z"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Viewer Count */}
                    <div
                        className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full"
                        data-oid="7zfro28"
                    >
                        <span className="text-sm" data-oid="kkwvluf">
                            👁️
                        </span>
                        <span className="text-sm" data-oid="0fkxhus">
                            {viewerCount}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2" data-oid="0pvi0ht">
                        <button
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                            data-oid="8e:ms7e"
                        >
                            📤 Save Draft
                        </button>
                        <button
                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-sm transition-all"
                            data-oid="b0-wa1l"
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
                            data-oid="lnfyruh"
                        >
                            👁️ {isViewerMode ? 'Exit Viewer' : 'Viewer Mode'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden" data-oid="fvtd3:0">
                {/* Left Sidebar - Node Editor */}
                <div
                    className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 p-4 overflow-y-auto"
                    data-oid="yvbmx.:"
                >
                    <h2 className="text-lg font-semibold mb-4" data-oid="jg9kyqg">
                        📝 Scene Editor
                    </h2>

                    {selectedNodeData ? (
                        <div className="space-y-4" data-oid="_b7tm7t">
                            <div data-oid="0j_u9qb">
                                <label
                                    className="block text-sm font-medium mb-2"
                                    data-oid="0p3timi"
                                >
                                    Scene Title
                                </label>
                                <input
                                    value={selectedNodeData.title}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                                    placeholder="Enter scene title..."
                                    data-oid="ql1an5x"
                                />
                            </div>

                            <div data-oid=".k8yl71">
                                <label
                                    className="block text-sm font-medium mb-2"
                                    data-oid="mv09uxw"
                                >
                                    Content
                                </label>
                                <textarea
                                    value={selectedNodeData.content}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm h-32 resize-none"
                                    placeholder="Write your scene content..."
                                    data-oid="0piuh_:"
                                />
                            </div>

                            <div data-oid="lpxs69e">
                                <label
                                    className="block text-sm font-medium mb-2"
                                    data-oid="z2lad75"
                                >
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2" data-oid="l8ce6um">
                                    {selectedNodeData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
                                            data-oid="7ui2p6-"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <input
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                                    placeholder="Add tags (romantic, dark, kinky)..."
                                    data-oid="a9lz:la"
                                />
                            </div>

                            <div data-oid="sg_sa_r">
                                <label
                                    className="block text-sm font-medium mb-2"
                                    data-oid="iiz6xlz"
                                >
                                    Visibility
                                </label>
                                <select
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                                    data-oid="cro9n1b"
                                >
                                    <option value="draft" data-oid="q8:_7..">
                                        📝 Draft
                                    </option>
                                    <option value="public" data-oid="eiu15nm">
                                        🌍 Public
                                    </option>
                                    <option value="locked" data-oid="1grqv00">
                                        🔒 Locked
                                    </option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-700" data-oid="6fc0aj0">
                                <h3 className="text-sm font-medium mb-2" data-oid="-xh33bl">
                                    Choices
                                </h3>
                                <button
                                    className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-sm transition-colors"
                                    data-oid=".h6h3-b"
                                >
                                    + Add Choice
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8" data-oid="1y194:a">
                            <p data-oid="e66901x">Select a node to edit its content</p>
                        </div>
                    )}
                </div>

                {/* Center - Canvas */}
                <div className="flex-1 relative" data-oid="7m5eluj">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        connectionMode={ConnectionMode.Loose}
                        className="bg-gray-950"
                        fitView
                        data-oid="8iw_g_l"
                    >
                        <Controls className="bg-gray-800 border-gray-700" data-oid="79oss7h" />
                        <MiniMap
                            className="bg-gray-800 border border-gray-700"
                            nodeColor="#374151"
                            maskColor="rgba(0, 0, 0, 0.8)"
                            data-oid="wqgh5z1"
                        />

                        <Background color="#374151" gap={20} data-oid="lr53w-0" />
                    </ReactFlow>

                    {/* Floating Add Button */}
                    <button
                        onClick={addNewNode}
                        className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-110 shadow-lg"
                        data-oid="7gbw7_w"
                    >
                        +
                    </button>

                    {/* Floating Emojis */}
                    {floatingEmojis.map((emoji) => (
                        <div
                            key={emoji.id}
                            className="absolute pointer-events-none text-2xl animate-bounce"
                            style={{ left: emoji.x, top: emoji.y }}
                            data-oid="8uejgsf"
                        >
                            {emoji.emoji}
                        </div>
                    ))}
                </div>

                {/* Right Sidebar - AI & Collaboration */}
                <div
                    className="w-80 bg-gray-900/50 backdrop-blur-sm border-l border-gray-800 p-4 overflow-y-auto"
                    data-oid="ks9bvs5"
                >
                    <div className="space-y-6" data-oid="0ilnned">
                        {/* AI Assistant */}
                        <div data-oid="utgqyh.">
                            <h2 className="text-lg font-semibold mb-4" data-oid="eymlxhk">
                                🧠 AI Co-Author
                            </h2>
                            <div className="space-y-3" data-oid="gncea.a">
                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm h-20 resize-none"
                                    placeholder="Continue the story, add branching options, change tone..."
                                    data-oid="vivwmtk"
                                />

                                <button
                                    onClick={generateWithAI}
                                    disabled={isGenerating || !aiPrompt.trim()}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg px-3 py-2 text-sm transition-colors"
                                    data-oid="mflrfha"
                                >
                                    {isGenerating ? '🔄 Generating...' : '✨ Generate'}
                                </button>

                                <div className="grid grid-cols-1 gap-2" data-oid="666m4k-">
                                    <button
                                        className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-xs transition-colors"
                                        data-oid="fmwwf9l"
                                    >
                                        💡 Suggest next scene
                                    </button>
                                    <button
                                        className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-xs transition-colors"
                                        data-oid="9sc-i7."
                                    >
                                        🔄 Rewrite scene
                                    </button>
                                    <button
                                        className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-xs transition-colors"
                                        data-oid="db9l4b:"
                                    >
                                        🔥 Expand tension
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Live Collaboration */}
                        <div data-oid="w8d1r5k">
                            <h2 className="text-lg font-semibold mb-4" data-oid="a3_606c">
                                👥 Collaborators
                            </h2>
                            <div className="space-y-2" data-oid="4_0iuyf">
                                {collaborators.map((collab) => (
                                    <div
                                        key={collab.id}
                                        className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg"
                                        data-oid="hqztrbg"
                                    >
                                        <div className="text-lg" data-oid="-vv5sm5">
                                            {collab.avatar}
                                        </div>
                                        <div className="flex-1" data-oid="ds5jzjo">
                                            <div className="text-sm font-medium" data-oid="jbu9ps8">
                                                {collab.name}
                                            </div>
                                            {collab.isTyping && (
                                                <div
                                                    className="text-xs text-green-400"
                                                    data-oid="vxbcd05"
                                                >
                                                    Typing in scene...
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className={`w-2 h-2 rounded-full ${collab.isTyping ? 'bg-green-400' : 'bg-gray-600'}`}
                                            data-oid="6raunyz"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Version History */}
                        <div data-oid=":1._-xu">
                            <h2 className="text-lg font-semibold mb-4" data-oid="8esc6zp">
                                🔗 Version History
                            </h2>
                            <div className="space-y-2" data-oid="0h0v9cm">
                                <div className="p-2 bg-gray-800 rounded-lg" data-oid="vb59phd">
                                    <div className="text-sm font-medium" data-oid="p07-7_9">
                                        Current Version
                                    </div>
                                    <div className="text-xs text-gray-400" data-oid="ndk9ofs">
                                        2 minutes ago
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-800/50 rounded-lg" data-oid="4levf.4">
                                    <div className="text-sm" data-oid="r5kk68t">
                                        Previous Version
                                    </div>
                                    <div className="text-xs text-gray-400" data-oid="e_4mb4w">
                                        15 minutes ago
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-sm transition-colors"
                                    data-oid="9qonzsc"
                                >
                                    🍴 Fork this story
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
