export function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    // The raw data from the API is Int16
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            // Normalize the Int16 data to the Float32 range [-1.0, 1.0]
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

export async function playDecodedAudio(decodedData: Uint8Array, audioContext: AudioContext): Promise<void> {
    // FIX: Add a check to prevent errors if the audio context was closed before playback.
    // This resolves a race condition where unmounting the component could cause silent failures.
    if (audioContext.state === 'closed') {
        console.warn("Audio context was closed before playback could start.");
        return;
    }

    const audioBuffer = await decodeAudioData(
        decodedData,
        audioContext,
        24000, // Sample rate for gemini-2.5-flash-preview-tts and Live API
        1,     // Number of channels
    );
    
    return new Promise((resolve) => {
        // Re-check state in case the context was closed during the async decoding.
        if (audioContext.state === 'closed') {
             console.warn("Audio context was closed before buffer source could be created.");
             resolve();
             return;
        }
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => resolve();
        source.start();
    });
}