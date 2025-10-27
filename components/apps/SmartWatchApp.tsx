import React, { useState, useEffect } from 'react';
import { Alarm, Automation, AppID } from '../../types';

type Tab = 'clock' | 'alarms' | 'automations';

interface SmartWatchAppProps {
    alarms: Alarm[];
    setAlarms: React.Dispatch<React.SetStateAction<Alarm[]>>;
    automations: Automation[];
    setAutomations: React.Dispatch<React.SetStateAction<Automation[]>>;
}

const SmartWatchApp: React.FC<SmartWatchAppProps> = (props) => {
    const [time, setTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState<Tab>('clock');

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const TabButton: React.FC<{ tabId: Tab, label: string }> = ({ tabId, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabId ? 'bg-accent text-white' : 'hover:bg-white/10'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="h-full w-full flex flex-col bg-black rounded-b-md text-white font-mono">
            <div className="flex-grow flex flex-col items-center p-4">
                {activeTab === 'clock' && <ClockView time={time} />}
                {activeTab === 'alarms' && <AlarmsView {...props} />}
                {activeTab === 'automations' && <AutomationsView {...props} />}
            </div>
            <nav className="flex-shrink-0 flex gap-1 p-2 bg-bg-tertiary/50 border-t border-border-color">
                <TabButton tabId="clock" label="Clock" />
                <TabButton tabId="alarms" label="Alarms" />
                <TabButton tabId="automations" label="Automations" />
            </nav>
        </div>
    );
};

const ClockView: React.FC<{ time: Date }> = ({ time }) => (
    <div className="flex flex-col items-center justify-center h-full w-full bg-bg-secondary rounded-full border-8 border-bg-tertiary">
        <p className="text-5xl font-bold tracking-widest text-accent">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </p>
        <p className="text-lg text-text-secondary">
            {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
    </div>
);

const AlarmsView: React.FC<SmartWatchAppProps> = ({ alarms, setAlarms }) => {
    const toggleAlarm = (id: string) => {
        setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h2 className="text-xl font-bold text-center mb-4">Alarms</h2>
            <div className="flex-grow space-y-3 overflow-y-auto">
                {alarms.map(alarm => (
                    <div key={alarm.id} className="flex items-center justify-between bg-bg-secondary p-3 rounded-lg">
                        <div>
                            <p className="text-2xl">{alarm.time}</p>
                            <p className="text-xs text-text-muted">{alarm.label}</p>
                        </div>
                        <div onClick={() => toggleAlarm(alarm.id)} className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${alarm.enabled ? 'bg-accent' : 'bg-bg-primary'}`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${alarm.enabled ? 'transform translate-x-6' : ''}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AutomationsView: React.FC<SmartWatchAppProps> = ({ automations }) => {
    return (
         <div className="w-full h-full flex flex-col">
            <h2 className="text-xl font-bold text-center mb-4">Automations</h2>
            <div className="flex-grow space-y-3 overflow-y-auto">
                {automations.map(auto => (
                     <div key={auto.id} className="bg-bg-secondary p-3 rounded-lg">
                        <p className="font-semibold text-accent">Trigger:</p>
                        <p className="text-sm ml-2">{auto.trigger}</p>
                        <p className="font-semibold text-accent mt-1">Action:</p>
                        <p className="text-sm ml-2">{auto.action.task}</p>
                     </div>
                ))}
                 <p className="text-xs text-center text-text-muted pt-4">Automation creation coming soon.</p>
            </div>
        </div>
    );
};

export default SmartWatchApp;
