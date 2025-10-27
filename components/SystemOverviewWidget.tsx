import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SparklesIcon } from './Icons';
import { UserAccount } from '../types';

interface SystemOverviewWidgetProps {
    userAccount: UserAccount;
}

const SystemOverviewWidget: React.FC<SystemOverviewWidgetProps> = ({ userAccount }) => {
    const { t } = useLanguage();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000); // Update every second
        return () => clearInterval(timerId);
    }, []);

    const getGreeting = () => {
        const hour = time.getHours();
        const name = userAccount.name || 'User';
        if (hour < 12) return t('desktop.greeting.morning', { name });
        if (hour < 18) return t('desktop.greeting.afternoon', { name });
        return t('desktop.greeting.evening', { name });
    };

    return (
        <div className="w-full max-w-4xl glass-effect rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
            <div className="flex items-center gap-4">
                 <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 hidden sm:flex items-center justify-center text-3xl bg-black/20">
                    {userAccount.avatar || '👩‍🚀'}
                 </div>
                 <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-display">{getGreeting()}</h1>
                    <p className="text-sm sm:text-base opacity-80">{time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                 <div className="text-center">
                    <p className="text-xs opacity-70">{t('overview.plan', { tier: userAccount.tier })}</p>
                    <p className="font-semibold text-green-400 flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Active
                    </p>
                </div>
                 <div className="text-center">
                    <p className="text-xs opacity-70">{t('overview.credits')}</p>
                    <p className="font-semibold text-cyan-400">{userAccount.aiCredits.toLocaleString()}</p>
                </div>
                <div className="text-3xl sm:text-5xl font-bold font-mono text-[var(--accent-color)] text-right">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

export default SystemOverviewWidget;