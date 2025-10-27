import React from 'react';

const mockTasks = [
    { id: 1, text: 'Draft marketing copy for Project Phoenix', completed: false },
    { id: 2, text: 'Review Q3 budget with Karim agent', completed: false },
    { id: 3, text: 'Finalize Tokyo trip itinerary', completed: true },
];

const TasksWidget: React.FC = () => {
    return (
        <div>
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-400 text-lg">task_alt</span>
                    <h2 className="font-medium text-sm">My Tasks</h2>
                </div>
            </div>
            <div className="space-y-2 p-4">
                {mockTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-2">
                        <input type="checkbox" checked={task.completed} readOnly className="size-4 rounded bg-white/10 border-white/20 accent-rose-400" />
                        <label className={`text-sm ${task.completed ? 'line-through text-text-muted' : ''}`}>{task.text}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TasksWidget;