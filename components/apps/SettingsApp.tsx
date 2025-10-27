import React, { useState } from 'react';
import { SettingsAppProps, Theme, WallpaperID, TaskbarTheme } from '../../types';
import { SettingsIcon } from '../Icons';

type Section = 'personalization' | 'display' | 'sound';

const wallpapers: { id: WallpaperID, name: string, thumbnail: string }[] = [
    { id: '/wallpaper.svg', name: 'Holographic Vista', thumbnail: '/wallpaper.svg' },
    { id: '/wallpaper2.svg', name: 'Solaris Dunes', thumbnail: '/wallpaper2.svg' },
    { id: '/wallpaper3.svg', name: 'Cosmic Reef', thumbnail: '/wallpaper3.svg' },
];

const accentColors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

const taskbarThemes: { id: TaskbarTheme, name: string }[] = [
    { id: 'glass', name: 'Glass' },
    { id: 'solid', name: 'Solid' },
    { id: 'transparent', name: 'Transparent' },
]

const SettingsApp: React.FC<SettingsAppProps> = ({ settings, onSettingsChange }) => {
    const [activeSection, setActiveSection] = useState<Section>('personalization');

    const renderSection = () => {
        switch (activeSection) {
            case 'personalization':
                return <PersonalizationSection settings={settings} onSettingsChange={onSettingsChange} />;
            case 'display':
                return <PlaceholderSection title="Display Settings" />;
            case 'sound':
                return <PlaceholderSection title="Sound Settings" />;
            default:
                return null;
        }
    };

    return (
        <div className="h-full w-full flex bg-bg-secondary rounded-b-md text-text-primary">
            {/* Sidebar */}
            <aside className="w-56 flex-shrink-0 bg-bg-tertiary p-4 border-r border-border-color">
                <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
                <nav className="space-y-2">
                    <NavItem id="personalization" label="Personalization" activeSection={activeSection} setActiveSection={setActiveSection} />
                    <NavItem id="display" label="Display" activeSection={activeSection} setActiveSection={setActiveSection} />
                    <NavItem id="sound" label="Sound" activeSection={activeSection} setActiveSection={setActiveSection} />
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-grow p-6 overflow-y-auto">
                {renderSection()}
            </main>
        </div>
    );
};

interface NavItemProps {
    id: Section;
    label: string;
    activeSection: Section;
    setActiveSection: (section: Section) => void;
}

const NavItem: React.FC<NavItemProps> = ({ id, label, activeSection, setActiveSection }) => (
    <button
        onClick={() => setActiveSection(id)}
        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === id ? 'bg-accent text-white' : 'hover:bg-bg-primary'
        }`}
    >
        {label}
    </button>
);

const PersonalizationSection: React.FC<SettingsAppProps> = ({ settings, onSettingsChange }) => (
    <div>
        <h2 className="text-xl font-bold font-display mb-4">Personalization</h2>

        <div className="space-y-8">
            {/* Theme Selection */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Theme</h3>
                <div className="flex gap-4 p-2 bg-bg-tertiary rounded-lg border border-border-color">
                    <ThemeButton theme="light" currentTheme={settings.theme} setTheme={(theme) => onSettingsChange({ theme })} />
                    <ThemeButton theme="dark" currentTheme={settings.theme} setTheme={(theme) => onSettingsChange({ theme })} />
                </div>
            </div>

            {/* Taskbar Style */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Taskbar Style</h3>
                <div className="flex gap-2 p-2 bg-bg-tertiary rounded-lg border border-border-color">
                    {taskbarThemes.map(theme => (
                         <button
                            key={theme.id}
                            onClick={() => onSettingsChange({ taskbarTheme: theme.id })}
                            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${settings.taskbarTheme === theme.id ? 'bg-accent text-white' : 'hover:bg-bg-primary'}`}
                        >
                            {theme.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Accent Color */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Accent Color</h3>
                 <div className="flex flex-wrap gap-3 p-3 bg-bg-tertiary rounded-lg border border-border-color">
                    {accentColors.map(color => (
                        <button
                            key={color}
                            onClick={() => onSettingsChange({ accentColor: color })}
                            className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${settings.accentColor === color ? 'ring-2 ring-offset-2 ring-offset-bg-tertiary ring-white' : ''}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Set accent color to ${color}`}
                        />
                    ))}
                </div>
            </div>

            {/* Wallpaper Selection */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Wallpaper</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wallpapers.map(wp => (
                        <button
                            key={wp.id}
                            onClick={() => onSettingsChange({ wallpaper: wp.id })}
                            className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-200 ${settings.wallpaper === wp.id ? 'ring-2 ring-offset-2 ring-offset-bg-tertiary ring-accent' : 'hover:scale-105'}`}
                        >
                            <img src={wp.thumbnail} alt={wp.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-xs text-center">{wp.name}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

interface ThemeButtonProps {
    theme: Theme;
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ theme, currentTheme, setTheme }) => (
    <button
        onClick={() => setTheme(theme)}
        className={`flex-1 p-4 rounded-md border-2 transition-colors ${
            currentTheme === theme ? 'border-accent' : 'border-transparent hover:border-border-color'
        }`}
    >
        <div className={`w-full h-20 rounded ${theme === 'light' ? 'bg-white' : 'bg-bg-primary'}`}></div>
        <span className="mt-2 block text-sm font-medium capitalize">{theme}</span>
    </button>
);


const PlaceholderSection: React.FC<{title: string}> = ({ title }) => (
    <div className="h-full flex flex-col items-center justify-center text-center text-text-muted">
         <SettingsIcon className="w-16 h-16 mb-4 animate-spin" style={{animationDuration: '10s'}} />
         <h2 className="text-xl font-bold">{title}</h2>
         <p>This section is under construction.</p>
    </div>
);


export default SettingsApp;