import React, { useState } from 'react';
import { ImageIcon, SparklesIcon } from '../Icons';

const ImageGeneratorApp: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setGeneratedImage(null);
        // Simulate API call
        setTimeout(() => {
            // In a real app, you would get a URL from the geminiAdvancedService
            setGeneratedImage('https://images.unsplash.com/photo-1682687220208-22d715869648?q=80&w=2070&auto=format&fit=crop');
            setIsLoading(false);
        }, 3000);
    };

    return (
        <div className="h-full w-full flex flex-col bg-bg-tertiary rounded-b-md text-white">
            <div className="flex-grow p-6 flex flex-col items-center justify-center gap-6 overflow-y-auto">
                <div className="w-full h-full min-h-[200px] flex-1 flex items-center justify-center bg-black/20 border-2 border-dashed border-white/10 rounded-xl">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2 text-primary-pink">
                             <SparklesIcon className="w-10 h-10 animate-pulse" />
                             <p className="font-semibold">Generating your vision...</p>
                        </div>
                    ) : generatedImage ? (
                        <img src={generatedImage} alt="AI generated" className="max-w-full max-h-full object-contain rounded-lg"/>
                    ) : (
                        <div className="text-center text-text-muted">
                            <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                            <p>Your generated image will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
             <div className="p-4 border-t border-white/10 flex-shrink-0">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A robot holding a red skateboard"
                        disabled={isLoading}
                        className="flex-grow h-12 bg-white/5 border border-white/10 rounded-lg px-4 text-text-primary focus:ring-2 focus:ring-primary-pink focus:outline-none transition-all duration-300"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className="h-12 px-6 font-bold rounded-lg bg-gradient-to-r from-primary-pink to-rose-500 hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageGeneratorApp;
