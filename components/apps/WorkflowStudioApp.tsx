
import React from 'react';
import { SubAgent, SubAgentID } from '../../types';
import { subAgentIcons, WorkflowIcon } from '../Icons';
import SubAgentNode from '../SubAgentNode';

const subAgentLibrary: Record<SubAgentID, SubAgent> = {
    'gemini-pro': { id: 'gemini-pro', name: 'Gemini Pro', icon: subAgentIcons['gemini-pro'] },
    'gemini-flash-image': { id: 'gemini-flash-image', name: 'Nano Banana', icon: subAgentIcons['gemini-flash-image'] },
    'veo': { id: 'veo', name: 'Veo', icon: subAgentIcons['veo'] },
    'google-search': { id: 'google-search', name: 'Google Search', icon: subAgentIcons['google-search'] },
    'google-maps': { id: 'google-maps', name: 'Google Maps', icon: subAgentIcons['google-maps'] },
    'google-flights': { id: 'google-flights', name: 'Google Flights', icon: subAgentIcons['google-flights'] },
    'youtube': { id: 'youtube', name: 'YouTube Uploader', icon: subAgentIcons['youtube'] },
};

const workflowSteps = [
    { subAgent: subAgentLibrary['gemini-pro'], description: "Write script for 'Top 5 Paris Spots'", status: 'Completed' },
    { subAgent: subAgentLibrary['gemini-flash-image'], description: "Generate scene illustrations", status: 'Completed' },
    { subAgent: subAgentLibrary['veo'], description: "Create video from illustrations", status: 'Active' },
    { subAgent: subAgentLibrary['youtube'], description: "Upload to YouTube", status: 'Pending' },
]

const WorkflowStudioApp: React.FC = () => {
    return (
        <div className="h-full w-full flex bg-bg-tertiary rounded-b-md text-white p-4 gap-4 overflow-hidden">
            {/* Toolbox */}
            <div className="w-64 flex-shrink-0 bg-black/20 rounded-lg p-4 border border-white/10 flex flex-col">
                <h2 className="font-display font-bold text-xl mb-4 text-primary-purple">Sub-Agent Toolbox</h2>
                <div className="grid grid-cols-2 gap-3 overflow-y-auto">
                    {Object.values(subAgentLibrary).map(agent => {
                        const Icon = agent.icon;
                        return (
                            <div key={agent.id} className="p-2 flex flex-col items-center gap-1 bg-white/5 rounded-md text-center cursor-grab active:cursor-grabbing">
                                <Icon className="w-8 h-8 text-text-secondary" />
                                <span className="text-xs font-semibold">{agent.name}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-grow bg-black/20 rounded-lg border border-white/10 p-4 flex flex-col items-center justify-center">
                 <h1 className="font-display text-2xl font-bold mb-6">Workflow: Create & Upload a Travel YouTube Video</h1>
                 <div className="relative flex items-center justify-center gap-12">
                    {/* SVG Lines connecting the nodes */}
                     <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
                         <path d="M 100 50 H 220" stroke="#4F46E5" strokeWidth="2" strokeDasharray="1000" className="animate-line-draw" style={{ animationDelay: '0.5s' }} fill="none" />
                         <path d="M 300 50 H 420" stroke="#4F46E5" strokeWidth="2" strokeDasharray="1000" className="animate-line-draw" style={{ animationDelay: '1.0s' }} fill="none" />
                         <path d="M 500 50 H 620" stroke="#4F46E5" strokeWidth="2" strokeDasharray="1000" className="animate-line-draw" style={{ animationDelay: '1.5s' }} fill="none" />
                     </svg>

                     {workflowSteps.map((step, index) => (
                         <SubAgentNode 
                            key={step.subAgent.id}
                            subAgent={step.subAgent} 
                            description={step.description}
                            status={step.status as 'Completed' | 'Active' | 'Pending'}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        />
                     ))}
                 </div>
                 <button className="mt-8 flex items-center gap-2 py-2 px-5 font-bold rounded-lg bg-gradient-to-r from-primary-purple to-indigo-500 hover:brightness-110 active:scale-95 transition-all duration-200">
                    <WorkflowIcon className="w-5 h-5" />
                    Execute Workflow
                 </button>
            </div>
        </div>
    );
};

export default WorkflowStudioApp;
