import React, { useState } from 'react';
import { ImageIcon, SparklesIcon, UploadIcon } from '../Icons';
import { generateImage, editImage } from '../../services/geminiAdvancedService';
import { fileToBase64 } from '../../utils/fileUtils';

type Mode = 'generate' | 'edit';

const ImageGeneratorApp: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>('generate');
    const [sourceImage, setSourceImage] = useState<{file: File, base64: string} | null>(null);

    const handleGenerate = async () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);
        try {
            const imageUrl = await generateImage(prompt);
            setGeneratedImage(imageUrl);
        } catch (e) {
            setError('Failed to generate image. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!prompt || !sourceImage || isLoading) return;
        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);
        try {
            const editedImageUrl = await editImage(prompt, sourceImage.base64.split(',')[1], sourceImage.file.type);
            setGeneratedImage(editedImageUrl);
        } catch (e) {
            setError('Failed to edit image. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const base64 = await fileToBase64(file);
            setSourceImage({ file, base64 });
            setGeneratedImage(null);
            setError(null);
        } else {
            setError('Please select a valid image file.');
        }
    };

    const handleSubmit = () => {
        if (mode === 'generate') {
            handleGenerate();
        } else {
            handleEdit();
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-bg-tertiary rounded-b-md text-white">
            <div className="p-4 border-b border-border-color flex justify-center">
                <div className="bg-black/20 p-1 rounded-lg flex gap-1">
                    <button onClick={() => setMode('generate')} className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${mode === 'generate' ? 'bg-primary-pink text-white' : 'hover:bg-white/10'}`}>Generate</button>
                    <button onClick={() => setMode('edit')} className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${mode === 'edit' ? 'bg-primary-pink text-white' : 'hover:bg-white/10'}`}>Edit</button>
                </div>
            </div>
            <div className="flex-grow p-6 flex flex-col items-center justify-center gap-6 overflow-y-auto">
                {mode === 'edit' && (
                    <label htmlFor="image-upload" className="w-full h-40 flex flex-col items-center justify-center bg-black/20 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary-pink transition-colors">
                        {sourceImage ? (
                            <img src={sourceImage.base64} alt="Source for editing" className="max-w-full max-h-full object-contain rounded-lg"/>
                        ) : (
                            <>
                                <UploadIcon className="w-8 h-8 text-text-muted mb-2" />
                                <span className="text-text-secondary">Click to upload image to edit</span>
                            </>
                        )}
                    </label>
                )}
                 <input id="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />

                <div className="w-full h-full min-h-[200px] flex-1 flex items-center justify-center bg-black/20 border-2 border-dashed border-white/10 rounded-xl">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2 text-primary-pink text-center">
                             <SparklesIcon className="w-10 h-10 animate-pulse" />
                             <p className="font-semibold">{mode === 'generate' ? 'Generating your vision...' : 'Applying your edits...'}</p>
                        </div>
                    ) : generatedImage ? (
                        <img src={generatedImage} alt="AI generated" className="max-w-full max-h-full object-contain rounded-lg"/>
                    ) : error ? (
                        <p className="text-red-400">{error}</p>
                    ) : (
                        <div className="text-center text-text-muted">
                            <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                            <p>Your result will appear here.</p>
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
                        placeholder={mode === 'generate' ? "e.g., A robot holding a red skateboard" : "e.g., Add a retro filter"}
                        disabled={isLoading}
                        className="flex-grow h-12 bg-white/5 border border-white/10 rounded-lg px-4 text-text-primary focus:ring-2 focus:ring-primary-pink focus:outline-none transition-all duration-300"
                    />
                    <button 
                        onClick={handleSubmit}
                        disabled={isLoading || !prompt || (mode === 'edit' && !sourceImage)}
                        className="h-12 px-6 font-bold rounded-lg bg-gradient-to-r from-primary-pink to-rose-500 hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mode === 'generate' ? 'Generate' : 'Edit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageGeneratorApp;