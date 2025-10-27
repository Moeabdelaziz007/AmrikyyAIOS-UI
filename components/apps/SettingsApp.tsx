import React, { useState } from 'react';
import { Settings, SettingsAppProps, Theme, WallpaperID, WindowStyle, SystemVoice, DashboardLayout, VoiceOption } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { voices } from '../../data/voices';
import { suggestDashboardLayout } from '../../services/geminiAdvancedService';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';

type Section = 'profile' | 'dashboard' | 'billing' | 'appearance' | 'assistant' | 'integrations';

const themes: { id: Theme, name: string, image: string }[] = [
    { id: 'deep-space', name: 'Deep Space', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2IGaJhLUoZ41zzrN4UCLvW6aLVCUgmSA3AEftYEnC_IH7cCkMXHJXQzL0dA_nVza56Z5WIf0M3MegcSjuxksB8sXeBThrpZhkowdYmi0dZ-pgHK0eLL0BRfzNrKBWTQbb9-wlIyHwm8jR-PqE0aHpgbc6q0-KVI3i_Pol8OSgWZBsUQBsFEQVNF6GcN3cRAQ9QXDHq9OO3gVVaeGZwldDOUM_c51hJlZ0OTaWPhWZaP4yUgC3Z87JwfdTV5h3ES6PBe_LqBeROWA' },
    { id: 'neon-noir', name: 'Neon Noir', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB21J1C02L0kI2P0q1p9A8z7F6E5g4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0' },
    { id: 'synthwave-sunset', name: 'Synthwave Sunset', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3kL7j5R9w1p0q2o8z7f6e5g4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0' },
    { id: 'zen', name: 'Zen', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXE2XK8St4NU5jUYsvITfCmYlII-xcXmNacO9gME6nXHjPDCtELW0OI4WPs53ENLPiOTJbh8-SOdPNIfnIGuPZdSaazwEfk0xh1leG0lQijhby7cAJe1x9rg_2S2nTFf-PyM3FL4F_nKobaoAf4VZfgemHpNgWisbPf6xTtiW3OZCGglbFZQ6jL4ckzeprV9ljr70JhfSMg93g2Ywe3G51TBNkcPFZO-Pw-t4Y8jkvKuWMkpOHaC2EqrhW21TQe5dV-AdnQ6mWe0c' },
    { id: 'playful', name: 'Playful', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBdrHQlSE7z2ncUwwghHEzjxH8_q7JfsUO-DFdSsyAuIuR9pU6FQErI10sZ42MckNsT8sZfvGNyUISiC80lJCB0kqQNK4nckfQh8dGcw1AjQEnrX_xZd7r020EOSxsMIeyDJB0WWtuGWEous2SKibhWY9j3ax5eFikLawpqx24_oDDemxJsLoe252vvWvcw0dDtl_XQ9SeP9GK48EsJv7GLxReQVYvIYfHh8TwQKFyNR47ygQ_mxe3CDZHk_qFDcl08AU7pfnsZl4' },
    { id: 'professional', name: 'Professional', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFK-dQwBx4j7JwBkN0HMVt76IY5_VSmG-oXhjLaMbOn0mCs1FBiKM89RBvAoR2zQn_VrgAol9u0G53rZijmM_2AvYitU0kkNGcNPMWKxOlyvN-5MSGNNxqOjIBlKM3DjFba871JmqYT2uWUU71q3i4GlT6HEHNzYH1wYm_fueEQFhG85r2k0XlJpa9yCT2bMdjOXAR1r3DVb_6phty80dVNON_Z2dkpfebPrHCaHM18P3qs7a5_7X13uHwuCmjNIxkAhCbBh6-8I8' },
];

const windowStyles: { id: WindowStyle, name: string }[] = [ { id: 'gemini', name: 'Gemini' }, { id: 'macos', name: 'macOS' }, { id: 'futuristic', name: 'Futuristic' }, { id: 'cyberpunk', name: 'Cyberpunk' }];
const wallpapers: { id: WallpaperID, name: string }[] = [ { id: '/wallpaper.svg', name: 'Holographic Vista' }, { id: '/wallpaper2.svg', name: 'Solaris Dunes' }, { id: '/wallpaper3.svg', name: 'Cosmic Reef' }];
const dashboardLayouts: { id: DashboardLayout, name: string}[] = [ {id: 'default', name: 'Default'}, {id: 'work', name: 'Work'}, {id: 'developer', name: 'Developer'} ];

const SettingsApp: React.FC<SettingsAppProps> = ({ settings, onSettingsChange, resetSettings, userAccount, onUserAccountChange, onUpgrade }) => {
    const { t } = useLanguage();
    const [activeSection, setActiveSection] = useState<Section>('profile');
    const [aiLayoutSuggestion, setAiLayoutSuggestion] = useState('');
    const [isSuggestingLayout, setIsSuggestingLayout] = useState(false);

    const handleLayoutSuggestion = async () => {
        if (!aiLayoutSuggestion) return;
        setIsSuggestingLayout(true);
        const suggestedLayout = await suggestDashboardLayout(aiLayoutSuggestion);
        onSettingsChange({ dashboardLayout: suggestedLayout });
        setIsSuggestingLayout(false);
    };

    const groupedVoices = voices.reduce((acc, voice) => {
        const lang = voice.language;
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push(voice);
        return acc;
    }, {} as Record<string, VoiceOption[]>);

    const sections: { id: Section; label: string; icon: string }[] = [
        { id: 'profile', label: t('settings.profile'), icon: 'person' },
        { id: 'dashboard', label: t('settings.dashboard'), icon: 'dashboard' },
        { id: 'billing', label: t('settings.billing'), icon: 'credit_card' },
        { id: 'appearance', label: t('settings.appearance'), icon: 'palette' },
        { id: 'assistant', label: t('settings.assistant'), icon: 'smart_toy' },
        { id: 'integrations', label: t('settings.integrations'), icon: 'hub' },
    ];

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfileSection userAccount={userAccount} onUserAccountChange={onUserAccountChange} />;
            case 'dashboard':
                return <DashboardSection settings={settings} onSettingsChange={onSettingsChange} aiLayoutSuggestion={aiLayoutSuggestion} setAiLayoutSuggestion={setAiLayoutSuggestion} handleLayoutSuggestion={handleLayoutSuggestion} isSuggestingLayout={isSuggestingLayout} />;
            case 'billing':
                return <BillingSection userAccount={userAccount} onUpgrade={onUpgrade} />;
            case 'appearance':
                return <AppearanceSection settings={settings} onSettingsChange={onSettingsChange} />;
            case 'assistant':
                 return <AssistantSection settings={settings} onSettingsChange={onSettingsChange} groupedVoices={groupedVoices} />;
            case 'integrations':
                 return <IntegrationsSection />;
            default:
                return null;
        }
    };

    return (
        <div className={`h-full w-full flex text-sm transition-colors duration-300`}>
            {/* Sidebar */}
            <aside className={`hidden md:flex flex-col w-64 p-4 border-e shrink-0 settings-sidebar transition-colors duration-300`}>
                <h1 className="font-bold text-base px-2 mb-4">{t('app_titles.settings')}</h1>
                <nav className="flex flex-col gap-1">
                    {sections.map(sec => (
                        <button key={sec.id} onClick={() => setActiveSection(sec.id)} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === sec.id ? 'bg-accent/10 text-accent font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
                             <span className="material-symbols-outlined text-xl">{sec.icon}</span>
                             <span>{sec.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-8 pb-12">
                   {renderSection()}
                </div>
            </main>
        </div>
    );
};

const SectionHeader: React.FC<{title: string; subtitle: string}> = ({title, subtitle}) => (
    <header>
        <h2 className="text-2xl font-bold font-display">{title}</h2>
        <p className="text-text-secondary mt-1">{subtitle}</p>
    </header>
);

const IntegrationsSection: React.FC = () => {
    const { t } = useLanguage();
    const { isSignedIn, userProfile, signIn, signOut } = useGoogleAuth();

    return (
        <div className="space-y-6">
            <SectionHeader title={t('settings.integrations')} subtitle={t('settings.integrations_desc')} />
            <div className="p-4 rounded-lg bg-black/10 dark:bg-white/5 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">{t('settings.google_account')}</h3>
                    {isSignedIn && userProfile ? (
                        <p className="text-xs text-text-secondary">{t('settings.google_connected_as', { email: userProfile.email })}</p>
                    ) : (
                        <p className="text-xs text-text-secondary">Connect to see live data in your widgets.</p>
                    )}
                </div>
                {isSignedIn ? (
                    <button onClick={signOut} className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40">{t('settings.google_disconnect')}</button>
                ) : (
                    <button onClick={signIn} className="px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-white">{t('settings.google_connect')}</button>
                )}
            </div>
        </div>
    );
};

const ProfileSection: React.FC<{userAccount: SettingsAppProps['userAccount']; onUserAccountChange: SettingsAppProps['onUserAccountChange']}> = ({ userAccount, onUserAccountChange }) => {
    const { t } = useLanguage();
    return (
        <div className="space-y-6">
            <SectionHeader title={t('settings.profile')} subtitle={t('settings.profile_desc')} />
            <div className="space-y-4">
                 <div>
                    <label htmlFor="display-name" className="block text-sm font-medium mb-1">{t('settings.profile_name')}</label>
                    <input type="text" id="display-name" value={userAccount.name} onChange={e => onUserAccountChange({ name: e.target.value })} className="w-full max-w-xs bg-black/10 dark:bg-white/5 p-2 rounded-md border border-border-color" />
                </div>
                <div>
                    <label htmlFor="avatar" className="block text-sm font-medium mb-1">{t('settings.profile_avatar')}</label>
                    <input type="text" id="avatar" value={userAccount.avatar} onChange={e => onUserAccountChange({ avatar: e.target.value })} className="w-24 bg-black/10 dark:bg-white/5 p-2 rounded-md border border-border-color text-2xl text-center" />
                </div>
            </div>
        </div>
    );
};

const DashboardSection: React.FC<{settings: Settings; onSettingsChange: (s: Partial<Settings>) => void; aiLayoutSuggestion: string; setAiLayoutSuggestion: (s:string)=>void; handleLayoutSuggestion: ()=>void; isSuggestingLayout: boolean}> = ({settings, onSettingsChange, aiLayoutSuggestion, setAiLayoutSuggestion, handleLayoutSuggestion, isSuggestingLayout}) => {
    const { t } = useLanguage();
    return (
         <div className="space-y-6">
            <SectionHeader title={t('settings.dashboard')} subtitle={t('settings.dashboard_desc')} />
             <div>
                <h3 className="font-semibold mb-2">{t('settings.dashboard_preset')}</h3>
                <p className="text-xs text-text-secondary mb-3">{t('settings.dashboard_preset_desc')}</p>
                <div className="flex flex-wrap gap-2">
                    {dashboardLayouts.map(l => (
                         <button key={l.id} onClick={() => onSettingsChange({ dashboardLayout: l.id })} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${settings.dashboardLayout === l.id ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10'}`}>{l.name}</button>
                    ))}
                </div>
                 <div className="mt-4">
                    <div className="flex gap-2">
                        <input type="text" value={aiLayoutSuggestion} onChange={e => setAiLayoutSuggestion(e.target.value)} placeholder={t('settings.dashboard_ai_suggestion')} className="flex-grow bg-black/10 dark:bg-white/5 p-2 rounded-md border border-border-color" />
                        <button onClick={handleLayoutSuggestion} disabled={isSuggestingLayout} className="px-4 py-2 font-semibold rounded-lg bg-accent text-white disabled:opacity-50">
                            {isSuggestingLayout ? '...' : t('settings.dashboard_ai_button')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BillingSection: React.FC<{userAccount: SettingsAppProps['userAccount']; onUpgrade: SettingsAppProps['onUpgrade']}> = ({ userAccount, onUpgrade }) => {
     const { t } = useLanguage();
    return (
        <div className="space-y-6">
            <SectionHeader title={t('settings.billing')} subtitle={t('settings.billing_desc')} />
            <div className={`p-6 rounded-2xl border ${userAccount.tier === 'Pro' ? 'border-accent' : 'border-border-color'} bg-black/10`}>
                <h3 className="font-bold text-lg">Your Plan: {userAccount.tier}</h3>
                <p className="text-sm text-text-secondary mt-1">You have <span className="font-bold text-accent">{userAccount.aiCredits.toLocaleString()}</span> AI Credits remaining this month.</p>
                {userAccount.tier === 'Free' && (
                     <button onClick={onUpgrade} className="mt-4 px-5 py-2 font-semibold rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors">Upgrade to Pro</button>
                )}
            </div>
        </div>
    );
}

const AppearanceSection: React.FC<{settings: Settings; onSettingsChange: (s: Partial<Settings>) => void;}> = ({ settings, onSettingsChange }) => {
    const { t } = useLanguage();
    return (
         <div className="space-y-8">
             <SectionHeader title={t('settings.appearance')} subtitle="Customize the entire look and feel of your OS." />
             <div>
                <h3 className="font-semibold mb-2">{t('settings.language')}</h3>
                <div className="flex gap-2 p-1 rounded-lg border max-w-xs bg-black/10 dark:bg-white/5">
                   <button onClick={() => onSettingsChange({ language: 'en' })} className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-colors ${settings.language === 'en' ? 'bg-accent text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>English</button>
                   <button onClick={() => onSettingsChange({ language: 'ar' })} className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-colors ${settings.language === 'ar' ? 'bg-accent text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>العربية</button>
                </div>
            </div>
            <div>
                <h3 className="font-semibold mb-2">{t('settings.theme')}</h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
                    {themes.map(th => <PreviewCard key={th.id} label={th.name} image={th.image} isSelected={settings.theme === th.id} onClick={() => onSettingsChange({ theme: th.id })} /> )}
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-2">{t('settings.window')}</h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
                    {windowStyles.map(ws => <WindowPreviewCard key={ws.id} label={ws.name} styleId={ws.id} isSelected={settings.windowStyle === ws.id} onClick={() => onSettingsChange({ windowStyle: ws.id })} />)}
                </div>
            </div>
            <div>
                <h3 className="font-semibold mb-2">{t('settings.wallpaper')}</h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
                    {wallpapers.map(wp => <PreviewCard key={wp.id} label={wp.name} image={wp.id} isSelected={settings.wallpaper === wp.id} onClick={() => onSettingsChange({ wallpaper: wp.id })} />)}
                </div>
            </div>
        </div>
    );
};

const AssistantSection: React.FC<{ settings: Settings; onSettingsChange: (s: Partial<Settings>) => void; groupedVoices: Record<string, VoiceOption[]> }> = ({ settings, onSettingsChange, groupedVoices }) => {
    const { t } = useLanguage();
    return (
        <div className="space-y-6">
            <SectionHeader title={t('settings.assistant')} subtitle={t('settings.assistant_description')} />
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2">{t('settings.speech_rate')}</h3>
                    <p className="text-xs text-text-secondary mb-3">{t('settings.speech_rate_desc')}</p>
                    <div className="flex items-center gap-4">
                        <input 
                            type="range" 
                            min="0.5" 
                            max="2" 
                            step="0.1" 
                            value={settings.speechRate} 
                            onChange={e => onSettingsChange({ speechRate: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                        <span className="font-mono text-sm w-12 text-center">{settings.speechRate.toFixed(1)}x</span>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">{t('settings.speech_pitch')}</h3>
                    <p className="text-xs text-text-secondary mb-3">{t('settings.speech_pitch_desc')}</p>
                    <div className="flex items-center gap-4">
                        <input 
                            type="range" 
                            min="-20" 
                            max="20" 
                            step="1" 
                            value={settings.speechPitch} 
                            onChange={e => onSettingsChange({ speechPitch: parseInt(e.target.value, 10) })}
                            className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                        <span className="font-mono text-sm w-12 text-center">{settings.speechPitch.toFixed(0)}dB</span>
                    </div>
                </div>
            </div>
            {Object.entries(groupedVoices).map(([language, langVoices]) => (
                <div key={language}>
                    <h3 className="font-semibold mb-2 capitalize">{language}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {Array.isArray(langVoices) && langVoices.map(voice => (
                            <button key={voice.id} onClick={() => onSettingsChange({ voice: voice.id })} className={`p-3 rounded-lg text-left transition-colors ${settings.voice === voice.id ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10'}`}>
                                <p className="font-bold">{voice.name}</p>
                                <p className="text-xs opacity-80">{voice.accent} - {voice.gender}</p>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const PreviewCard: React.FC<{label: string, image: string, isSelected: boolean, onClick: ()=>void}> = ({label, image, isSelected, onClick}) => (
    <div onClick={onClick} className={`group relative cursor-pointer rounded-xl transition-all duration-300 ${isSelected ? 'ring-2 ring-accent' : 'ring-1 ring-transparent hover:ring-2 hover:ring-accent/50'}`}>
        <div className="bg-cover bg-center flex flex-col gap-3 rounded-lg justify-end p-3 aspect-video relative overflow-hidden" style={{backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%), url("${image}")`}}>
            <p className="text-white text-sm font-medium leading-tight">{label}</p>
        </div>
    </div>
);

const WindowPreviewCard: React.FC<{label: string, styleId: WindowStyle, isSelected: boolean, onClick: ()=>void}> = ({label, styleId, isSelected, onClick}) => (
    <div onClick={onClick} className={`group relative cursor-pointer rounded-xl p-3 aspect-[4/3] flex flex-col justify-between transition-all duration-300 ${isSelected ? 'ring-2 ring-accent' : 'ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-2 hover:ring-accent/50'}`}>
        <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div></div>
        <p className="font-medium leading-tight text-sm">{label}</p>
    </div>
);

export default SettingsApp;