import React, { useState, useEffect } from 'react';
import { SubAgent, Agent, Workflow, TravelPlan } from '../../types';
import { agents, subAgentDetails } from '../../data/agents';
import SubAgentNode from '../SubAgentNode';
import { generateTravelPlan } from '../../services/geminiAdvancedService';

interface WorkflowStudioAppProps {
    workflow?: Workflow;
    isExecuting?: boolean;
    onComplete?: (result: any) => void;
    executingDetails?: any;
}

const agentMap: Record<string, Agent> = agents.reduce((acc, agent) => {
    acc[agent.id] = agent;
    return acc;
}, {} as Record<string, Agent>);

const agentToSubAgent = (agent: Agent): SubAgent => {
    const Icon = subAgentDetails[agent.subAgents[0]]?.icon || (() => <span>?</span>);
    return {
        id: agent.subAgents[0],
        name: agent.name,
        description: agent.role,
        icon: Icon
    }
};

const WorkflowStudioApp: React.FC<WorkflowStudioAppProps> = ({ workflow, isExecuting, onComplete, executingDetails }) => {
    const [currentStep, setCurrentStep] = useState(isExecuting ? 0 : -1);
    const [finalPlan, setFinalPlan] = useState<TravelPlan | null>(null);

    useEffect(() => {
        if (!isExecuting || !workflow) return;

        const runWorkflow = async () => {
            for (let i = 0; i < workflow.nodes.length; i++) {
                setCurrentStep(i);
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // Simulate the final step generating the plan
            if (workflow.title.includes("Travel Plan")) {
                const plan = await generateTravelPlan(executingDetails);
                setFinalPlan(plan);
                if(onComplete) onComplete(plan);
            }
            setCurrentStep(workflow.nodes.length); // Mark as complete
        };

        runWorkflow();
    }, [isExecuting, workflow, onComplete, executingDetails]);

    const getStatus = (stepIndex: number): 'Completed' | 'Active' | 'Pending' => {
        if (currentStep === -1) return 'Pending';
        if (stepIndex < currentStep) return 'Completed';
        if (stepIndex === currentStep && currentStep < (workflow?.nodes.length || 0)) return 'Active';
        if (currentStep === (workflow?.nodes.length || 0)) return 'Completed';
        return 'Pending';
    };

    if (!workflow) {
        return (
             <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-4 gap-4 overflow-hidden">
                <h1 className="font-display text-2xl font-bold mb-6 text-center">Workflow Studio</h1>
                <p className="text-text-secondary">Drag and drop agents to build custom AI pipelines.</p>
                <p className="text-xs text-text-muted">(Interactive builder coming soon)</p>
             </div>
        )
    }

    return (
        <div className="h-full w-full flex bg-bg-tertiary rounded-b-md text-white p-4 gap-4 overflow-hidden">
            <div className="flex-grow bg-black/20 rounded-lg border border-border-color p-4 flex flex-col items-center justify-center">
                 <h1 className="font-display text-2xl font-bold mb-6 text-center">{workflow.title}</h1>
                 <div className="relative flex items-center justify-center gap-12">
                     <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
                        <defs>
                            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                        </defs>
                         {workflow.connections.map((connection, index) => (
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

                     {workflow.nodes.map((node, index) => (
                         <SubAgentNode 
                            key={node.id}
                            subAgent={agentToSubAgent(agentMap[node.agentId])}
                            description={node.description}
                            status={getStatus(index)}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        />
                     ))}
                 </div>
                 <div className="h-20 mt-8">
                    {finalPlan ? (
                        <div className="mt-8 flex items-center gap-2 py-2 px-5 text-green-400 animate-fade-in">
                           ✅ Workflow Completed
                        </div>
                    ) : (
                        <div className="mt-8 flex items-center gap-2 py-2 px-5 text-text-secondary animate-fade-in">
                            <div className={`w-5 h-5 border-2 border-current border-t-transparent rounded-full ${isExecuting ? 'animate-spin' : ''}`}></div>
                            <span>{isExecuting ? 'AI Agents are working...' : 'Waiting for workflow to start...'}</span>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default WorkflowStudioApp;