import React, { useState, useEffect } from 'react';
import { Message, Workspace, User } from '../../types';
import { SparklesIcon, SendIcon, YouTubeIcon } from '../Icons';
import { generateResponse } from '../../services/geminiService';
import { Content } from '@google/genai';

const mockUsers: User[] = [
    { id: '1', name: 'You', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: '2', name: 'John Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    { id: '3', name: 'Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
];

const WorkspaceApp: React.FC = () => {
    const [workspace, setWorkspace] = useState<Workspace>({
        id: '1',
        title: 'Project Phoenix - Q3 Strategy',
        contentType: 'notes',
        notes: 'Initial brainstorming for Q3 marketing campaign:\n\n- Target Audience: Developers & AI Enthusiasts\n- Key Message: "Build Faster with AI"\n- Channels: Tech blogs, YouTube, Twitter\n- Potential Video Idea: A tutorial on building a simple AI app using Amrikyy OS.\n',
        members: mockUsers,
    });

    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'system', text: 'Cortex AI is ready to assist.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMessage: Message = { id: `user-${Date.now()}`, sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        const prompt = `Based on the following notes, ${input}:\n\n---\n${workspace.notes}\n---`;
        const history: Content[] = []; // Simplified history for this context
        const responseText = await generateResponse(prompt, history);
        
        const aiMessage: Message = { id: `ai-${Date.now()}`, sender: 'ai', text: responseText };
        setMessages(prev => [...prev, aiMessage]);
        setInput('');
        setIsLoading(false);
    };

    const handleShare = () => {
        const link = `https://amrikyy.ai/workspace/join/${workspace.id}`;
        navigator.clipboard.writeText(link)
            .then(() => alert(`Invitation link copied to clipboard!\n${link}`))
            .catch(() => alert('Could not copy link.'));
    };

    return (
        <div className="h-full w-full flex flex-col lg:flex-row bg-bg-secondary rounded-b-md text-white overflow-hidden">
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                <header className="flex-shrink-0 p-4 border-b border-border-color flex justify-between items-center">
                    <div>
                        <h1 className="font-display text-2xl font-bold">{workspace.title}</h1>
                        <p className="text-sm text-text-secondary">A shared space for real-time collaboration.</p>
                    </div>
                    <div className="flex items-center">
                        <div className="flex -space-x-2 mr-4">
                            {workspace.members.map(member => (
                                <img key={member.id} src={member.avatarUrl} alt={member.name} title={member.name} className="w-8 h-8 rounded-full border-2 border-bg-secondary" />
                            ))}
                        </div>
                        <button onClick={handleShare} className="px-3 py-1.5 text-xs font-semibold bg-accent rounded-md hover:bg-accent/80 transition-colors">Share</button>
                    </div>
                </header>
                <div className="flex-grow p-4 overflow-y-auto">
                    {workspace.contentType === 'notes' ? (
                        <textarea
                            value={workspace.notes}
                            onChange={(e) => setWorkspace(w => ({ ...w, notes: e.target.value }))}
                            className="w-full h-full bg-transparent text-text-primary resize-none focus:outline-none leading-relaxed"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                             <YouTubeIcon className="w-24 h-24 text-text-muted" />
                             <p className="text-text-muted">YouTube viewing not yet implemented.</p>
                        </div>
                    )}
                </div>
                 <footer className="flex-shrink-0 p-2 border-t border-border-color text-center">
                    <p className="text-xs text-green-400 font-mono">P2P Connection: Encrypted & Stable</p>
                </footer>
            </main>

            {/* AI Chat & Collaboration Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border-color flex flex-col bg-bg-tertiary h-1/2 lg:h-full">
                <div className="flex-shrink-0 p-3 border-b border-border-color flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-orange-400"/>
                    <h2 className="font-bold">Cortex AI Assistant</h2>
                </div>
                <div className="flex-grow p-3 space-y-3 overflow-y-auto">
                     {messages.map(msg => (
                        <div key={msg.id} className={`text-sm p-2 rounded-lg ${
                            msg.sender === 'user' ? 'bg-accent text-white' :
                            msg.sender === 'ai' ? 'bg-bg-secondary' : 'text-center text-text-muted italic'
                        }`}>
                            {msg.text}
                        </div>
                     ))}
                     {isLoading && <div className="text-sm p-2 rounded-lg bg-bg-secondary">...</div>}
                </div>
                <div className="flex-shrink-0 p-3 border-t border-border-color">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask AI to help..."
                            disabled={isLoading}
                            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 text-sm focus:ring-1 focus:ring-orange-400 focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-orange-500 rounded-md flex items-center justify-center hover:bg-orange-400 disabled:bg-gray-500"
                        >
                            <SendIcon className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default WorkspaceApp;
