
import React from 'react';
import { SubAgent, SubAgentID, Agent } from '../../types';
import { subAgentIcons } from '../Icons';
import SubAgentNode from '../SubAgentNode';

interface WorkflowStudioAppProps {
    isWorkflowRunning: boolean;
    currentStep: number;
    finalPlan: any | null;
    onViewPlan: () => void;
}

const travelWorkflowAgents: Agent[] = [
  { name: 'Luna', role: 'Trip Planner', icon: '🌟', tasks: 0, color: '', hologram: { color: '', glow: '', task: '' }, subAgents: ['gemini-pro'] },
  { name: 'Scout', role: 'Deal Finder', icon: '🔍', tasks: 0, color: '', hologram: { color: '', glow: '', task: '' }, subAgents: ['google-search'] },
  { name: 'Karim', role: 'Budget Optimizer', icon: '💰', tasks: 0, color: '', hologram: { color: '', glow: '', task: '' }, subAgents: ['gemini-pro'] },
  { name: 'Maya', role: 'Plan Compiler', icon: '💬', tasks: 0, color: '', hologram: { color: '', glow: '', task: '' }, subAgents: ['gemini-pro'] },
];

const travelWorkflowSteps = [
    { agent: travelWorkflowAgents[0], description: "Generating Itinerary..." },
    { agent: travelWorkflowAgents[1], description: "Finding Deals & Links..." },
    { agent: travelWorkflowAgents[2], description: "Creating Budget Breakdown..." },
    { agent: travelWorkflowAgents[3], description: "Compiling Final Plan..." },
];

const agentToSubAgent = (agent: Agent): SubAgent => ({
    id: agent.name.toLowerCase() as SubAgentID,
    name: agent.name,
    icon: ({ className }) => <span className={`${className} text-4xl`}>{agent.icon}</span>
});

const WorkflowStudioApp: React.FC<WorkflowStudioAppProps> = ({ isWorkflowRunning, currentStep, finalPlan, onViewPlan }) => {
    
    const getStatus = (stepIndex: number): 'Completed' | 'Active' | 'Pending' => {
        if (!isWorkflowRunning && !finalPlan) return 'Pending';
        if (stepIndex < currentStep) return 'Completed';
        if (stepIndex === currentStep && isWorkflowRunning) return 'Active';
        if (finalPlan) return 'Completed';
        return 'Pending';
    }

    const workflowTitle = "Automated Travel Plan Generation";

    return (
        <div className="h-full w-full flex bg-bg-tertiary rounded-b-md text-white p-4 gap-4 overflow-hidden">
            {/* Canvas */}
            <div className="flex-grow bg-black/20 rounded-lg border border-white/10 p-4 flex flex-col items-center justify-center">
                 <h1 className="font-display text-2xl font-bold mb-6 text-center">{workflowTitle}</h1>
                 <div className="relative flex items-center justify-center gap-12">
                     <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
                        <defs>
                            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                        </defs>
                         {travelWorkflowSteps.slice(0, -1).map((_, index) => (
                            <path 
                                key={index}
                                d={`M ${100 + index * 192} 96 H ${220 + index * 192}`} 
                                stroke="url(#line-grad)" 
                                strokeWidth="3" 
                                fill="none"
                                strokeDasharray="1000"
                                className={getStatus(index) === 'Completed' ? 'animate-line-draw' : ''}
                                style={{ strokeDashoffset: getStatus(index) === 'Completed' ? 0 : 1000, transition: 'stroke-dashoffset 1s ease-in-out' }}
                            />
                         ))}
                     </svg>

                     {travelWorkflowSteps.map((step, index) => (
                         <SubAgentNode 
                            key={step.agent.name}
                            subAgent={agentToSubAgent(step.agent)}
                            description={step.description}
                            status={getStatus(index)}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        />
                     ))}
                 </div>
                 <div className="h-20 mt-8">
                    {finalPlan ? (
                        <button onClick={onViewPlan} className="mt-8 flex items-center gap-2 py-2 px-5 font-bold rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:brightness-110 active:scale-95 transition-all duration-200 animate-fade-in">
                            View Generated Plan
                        </button>
                    ) : (
                        <div className="mt-8 flex items-center gap-2 py-2 px-5 text-text-secondary animate-fade-in">
                            <div className={`w-5 h-5 border-2 border-current border-t-transparent rounded-full ${isWorkflowRunning ? 'animate-spin' : ''}`}></div>
                            <span>{isWorkflowRunning ? 'AI Agents are working...' : 'Waiting for workflow to start...'}</span>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default WorkflowStudioApp;
