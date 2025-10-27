import React from 'react';
import { WorkflowIcon } from './Icons';
import { AppID } from '../types';

interface WorkflowDashboardWidgetProps {
    onOpenApp: (appId: AppID) => void;
}

const WorkflowDashboardWidget: React.FC<WorkflowDashboardWidgetProps> = ({ onOpenApp }) => {
    return (
        <div className="fixed top-6 left-6 w-80 z-20 animate-slide-up">
            <div className="bg-glass-bg backdrop-blur-lg rounded-xl border border-border-color p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <WorkflowIcon className="w-5 h-5 text-primary-purple" />
                        <h2 className="font-display font-bold text-lg">Active Workflows</h2>
                    </div>
                    <button onClick={() => onOpenApp('workflow')} className="text-xs bg-accent/50 hover:bg-accent text-white font-semibold px-2 py-1 rounded-md transition-colors">
                        New +
                    </button>
                </div>
                <div className="space-y-3">
                    {/* Mock Active Workflow */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-semibold">Generating Travel Plan: Tokyo</p>
                            <p className="text-xs font-mono text-primary-purple">75%</p>
                        </div>
                        <div className="w-full bg-black/30 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-primary-blue to-primary-purple h-1.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-text-muted mt-1">Agent: Karim - Optimizing Budget</p>
                    </div>
                     {/* Mock Pending Workflow */}
                     <div>
                        <p className="text-sm font-semibold text-text-secondary">SEO Strategy for Amrikyy.com</p>
                        <p className="text-xs text-text-muted mt-1">Status: Queued</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowDashboardWidget;
