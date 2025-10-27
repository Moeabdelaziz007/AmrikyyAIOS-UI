import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connectToLiveStream, streamAudio, encode } from '../../services/liveService';
import { LiveSession, LiveServerMessage } from '@google/genai';
import { decode, playDecodedAudio } from '../../utils/audioUtils';
import VoiceHologram from '../VoiceHologram';

type VoiceState = 'idle' | 'listening' | 'speaking';
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

const VoiceAssistantApp: React.FC = () => {
    const [voiceState, setVoiceState] = useState<VoiceState>('idle');
    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
    const [error, setError] = useState<string | null>(null);

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioStreamerRef = useRef<{ stop: () => void } | null>(null);
    const audioQueue = useRef<string[]>([]);
    const isPlaying = useRef(false);

    const playNextInQueue = useCallback(async () => {
        if (isPlaying.current || audioQueue.current.length === 0) return;
        if (!outputAudioContextRef.current) return;
        
        isPlaying.current = true;
        setVoiceState('speaking');

        const base64Audio = audioQueue.current.shift();
        if (base64Audio) {
            try {
                await playDecodedAudio(decode(base64Audio), outputAudioContextRef.current);
            } catch (e) {
                console.error("Error playing audio chunk:", e);
            }
        }

        isPlaying.current = false;
        if(audioQueue.current.length > 0) {
            playNextInQueue();
        } else {
            setVoiceState('listening'); // Or idle if conversation ends
        }
    }, []);

    const handleMessage = useCallback((message: LiveServerMessage) => {
        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
        if (base64Audio) {
            audioQueue.current.push(base64Audio);
            playNextInQueue();
        }
         if (message.serverContent?.interrupted) {
            // Future improvement: Handle interruption by clearing queue
        }
    }, [playNextInQueue]);

    const connect = useCallback(async () => {
        if (connectionState === 'connecting' || connectionState === 'connected') return;
        setConnectionState('connecting');
        setError(null);
        
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

            sessionPromiseRef.current = connectToLiveStream({
                onOpen: () => {
                    setConnectionState('connected');
                    setVoiceState('listening');
                },
                onMessage: handleMessage,
                onError: (e) => {
                    console.error("Live session error:", e);
                    setError("Connection error. Please try again.");
                    setConnectionState('error');
                },
                onClose: () => {
                    setConnectionState('disconnected');
                    setVoiceState('idle');
                }
            });
            
            audioStreamerRef.current = await streamAudio(sessionPromiseRef.current, streamRef.current, audioContextRef.current);

        } catch (err) {
            console.error(err);
            setError("Could not start session. Please ensure microphone access is enabled.");
            setConnectionState('error');
        }
    }, [connectionState, handleMessage]);

    const disconnect = useCallback(() => {
        sessionPromiseRef.current?.then(session => session.close());
        streamRef.current?.getTracks().forEach(track => track.stop());
        audioStreamerRef.current?.stop();
        audioContextRef.current?.close();
        outputAudioContextRef.current?.close();
        
        sessionPromiseRef.current = null;
        streamRef.current = null;
        audioStreamerRef.current = null;
        audioContextRef.current = null;
        outputAudioContextRef.current = null;
        audioQueue.current = [];
        isPlaying.current = false;

        setConnectionState('disconnected');
        setVoiceState('idle');

    }, []);

    useEffect(() => {
        return () => {
            disconnect();
        }
    }, [disconnect]);

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-bg-tertiary rounded-b-md text-white p-6 gap-6">
            <VoiceHologram state={voiceState} />
             <div className="h-10 text-center">
                 {error && <p className="text-red-400">{error}</p>}
             </div>
             {connectionState !== 'connected' && connectionState !== 'connecting' ? (
                <button
                    onClick={connect}
                    className="px-6 py-3 font-bold rounded-lg bg-gradient-to-r from-primary-cyan to-sky-500 hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                    Start Conversation
                </button>
             ) : (
                <button
                    onClick={disconnect}
                    className="px-6 py-3 font-bold rounded-lg bg-gradient-to-r from-red-500 to-rose-500 hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                    End Conversation
                </button>
             )}
        </div>
    );
};

export default VoiceAssistantApp;