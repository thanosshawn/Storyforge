'use client';

import { useState, useEffect } from 'react';

export default function Page() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('builder');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = {
        builder: {
            icon: '🧱',
            title: 'Visual Story Builder',
            description: 'Node-based editor with drag-and-drop branching paths',
            items: [
                'React Flow visual editor',
                'Color-coded mood nodes',
                'Drag to rearrange layout',
            ],
        },
        collaboration: {
            icon: '✍️',
            title: 'Live Collaboration',
            description: 'Real-time editing with AI-powered assistance',
            items: ['Real-time cursors', 'Voice typing integration', 'AI co-author suggestions'],
        },
        forking: {
            icon: '🔗',
            title: 'GitHub-Style Forking',
            description: 'Fork, remix, and contribute to any public story',
            items: ['One-click story forking', 'Pull request system', 'Credit multiple authors'],
        },
        viewer: {
            icon: '👁️',
            title: 'Live Viewer Mode',
            description: 'Watch stories being built in real-time',
            items: ['Live story building', 'Emoji reactions', 'Vote on next paths'],
        },
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white"
            data-oid="m7fu88q"
        >
            {/* Header */}
            <nav
                className="relative z-10 px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-black/20"
                data-oid="2w:3l9q"
            >
                <div className="flex items-center space-x-3" data-oid="rfuzki7">
                    <span className="text-2xl" data-oid="hd43k-0">
                        🌟
                    </span>
                    <span className="text-xl font-bold tracking-tight" data-oid="gdzpd6j">
                        StoryForge
                    </span>
                </div>
                <div className="flex space-x-4" data-oid="-iicynt">
                    <button
                        className="px-4 py-2 border border-white/30 rounded-full hover:bg-white/10 transition-all"
                        data-oid="izw07a4"
                    >
                        Sign In
                    </button>
                    <button
                        className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all font-medium"
                        data-oid="xp7p9wq"
                    >
                        Start Creating
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div
                className={`relative px-6 py-20 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                data-oid="pirkbw0"
            >
                <div className="max-w-4xl mx-auto" data-oid="ac:ne_s">
                    <h1
                        className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent"
                        data-oid="yp_0vac"
                    >
                        Live, Forkable,
                        <br data-oid="vvxedg3" />
                        <span className="text-white" data-oid="s_lrx1b">
                            Erotic Story Worlds
                        </span>
                    </h1>

                    <p
                        className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto leading-relaxed"
                        data-oid="5m_y01e"
                    >
                        A collaborative platform where creators build branching erotic stories live,
                        with AI-powered writing assistance and GitHub-style forking mechanics.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                        data-oid="iuvtd4s"
                    >
                        <button
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105"
                            data-oid="3ugv34k"
                        >
                            🚀 Launch Builder
                        </button>
                        <button
                            className="px-8 py-4 border-2 border-white/30 rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
                            data-oid="yp6kybr"
                        >
                            👁️ Watch Live Stories
                        </button>
                    </div>

                    {/* Live Stats */}
                    <div
                        className="flex justify-center space-x-8 text-sm text-purple-300"
                        data-oid="qd:lgmu"
                    >
                        <div className="flex items-center space-x-2" data-oid="w-n:q2u">
                            <div
                                className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                                data-oid="qcp.62t"
                            ></div>
                            <span data-oid="o29mm2r">247 creators online</span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid=":m0p_vp">
                            <div
                                className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                                data-oid="lqw9hx1"
                            ></div>
                            <span data-oid="vhkcwgw">1,432 stories forked today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Tabs */}
            <div className="max-w-6xl mx-auto px-6 py-16" data-oid="k-qvq34">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-oid="nd7ruh_">
                    💡 Core Features
                </h2>

                {/* Tab Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-12" data-oid="5jmhki0">
                    {Object.entries(features).map(([key, feature]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${
                                activeTab === key
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                            }`}
                            data-oid="s6gwgmy"
                        >
                            {feature.icon} {feature.title}
                        </button>
                    ))}
                </div>

                {/* Active Tab Content */}
                <div
                    className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                    data-oid="kdtw:a0"
                >
                    <div className="text-center mb-8" data-oid="djhafam">
                        <div className="text-6xl mb-4" data-oid="k:r43:q">
                            {features[activeTab].icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-2" data-oid="t8kxcly">
                            {features[activeTab].title}
                        </h3>
                        <p className="text-purple-200 text-lg" data-oid="g8z0-th">
                            {features[activeTab].description}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4" data-oid="a2yxxc4">
                        {features[activeTab].items.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/5 rounded-lg p-4 border border-white/10"
                                data-oid="v64h14o"
                            >
                                <div className="flex items-center space-x-2" data-oid="qb40xl5">
                                    <div
                                        className="w-2 h-2 bg-pink-400 rounded-full"
                                        data-oid="lj_3e4w"
                                    ></div>
                                    <span className="text-white" data-oid="c2xfqbm">
                                        {item}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bonus Features Grid */}
            <div className="max-w-6xl mx-auto px-6 py-16" data-oid="5xtd5c8">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-oid="7uwyifm">
                    ✨ Bonus Features
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-oid="zy20nsf">
                    {[
                        {
                            icon: '🤖',
                            title: 'AI Co-Author',
                            desc: 'Rewrite scenes in different tones, generate variants',
                        },
                        {
                            icon: '🗳️',
                            title: 'Audience Voting',
                            desc: 'Let viewers vote on story direction in real-time',
                        },
                        {
                            icon: '🔁',
                            title: 'Pull Requests',
                            desc: 'Propose changes to original stories like GitHub',
                        },
                        {
                            icon: '🎭',
                            title: 'Mood Coding',
                            desc: 'Color-coded nodes by romantic, dark, playful themes',
                        },
                        {
                            icon: '💬',
                            title: 'Live Chat',
                            desc: 'Real-time discussion during story creation',
                        },
                        {
                            icon: '🏆',
                            title: 'Story of the Day',
                            desc: 'Community-driven featured content discovery',
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-pink-400/50 transition-all group"
                            data-oid=":69t1vh"
                        >
                            <div
                                className="text-3xl mb-3 group-hover:scale-110 transition-transform"
                                data-oid="9bm47dn"
                            >
                                {feature.icon}
                            </div>
                            <h3
                                className="text-lg font-semibold mb-2 text-white"
                                data-oid="uahc4r3"
                            >
                                {feature.title}
                            </h3>
                            <p className="text-purple-200 text-sm" data-oid="97ouo3l">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div
                className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-sm border-t border-white/10"
                data-oid="skbf33c"
            >
                <div className="max-w-4xl mx-auto px-6 py-16 text-center" data-oid="8o0ad16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6" data-oid="yibs2mc">
                        Ready to Forge Your Story?
                    </h2>
                    <p className="text-xl text-purple-200 mb-8" data-oid="wlx2ub1">
                        Join thousands of creators building the future of interactive erotic
                        fiction.
                    </p>
                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        data-oid="y-kjuc8"
                    >
                        <button
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105"
                            data-oid="fgmbhi3"
                        >
                            🌟 Start Building Now
                        </button>
                        <button
                            className="px-8 py-4 border-2 border-white/30 rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
                            data-oid="9j8nfmi"
                        >
                            📖 Explore Stories
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer
                className="border-t border-white/10 py-8 px-6 text-center text-purple-300"
                data-oid="k4-jm_1"
            >
                <div className="max-w-4xl mx-auto" data-oid="sosu567">
                    <p className="mb-4" data-oid="kc_oxro">
                        🔞 This platform is for adults only. Age verification required.
                    </p>
                    <div className="flex justify-center space-x-6 text-sm" data-oid="gu26:tk">
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                            data-oid="wow.:4g"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                            data-oid="dgmrhc3"
                        >
                            Community Guidelines
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                            data-oid="k21hbzp"
                        >
                            Support
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
