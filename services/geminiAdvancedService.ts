import { GoogleGenAI, GenerateContentResponse, Content, Type, Modality } from "@google/genai";
import { TravelPlan, Workflow } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

// Grounded Search with Google
export const groundedSearch = async (prompt: string, thinkingMode: boolean): Promise<{ text: string, sources: {title: string, uri: string}[] }> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { text: "This is a simulated search response. To connect to Gemini, please provide an API key.", sources: [] };
    }
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const modelName = thinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const config: any = { tools: [{googleSearch: {}}] };

    if (thinkingMode) {
        config.thinkingConfig = { thinkingBudget: 32768 };
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: config,
        });
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
            .map(chunk => ({ title: chunk.web?.title || '', uri: chunk.web?.uri || ''}))
            .filter(source => source.uri);

        return { text: response.text, sources };
    } catch (error) {
        console.error("Error calling Gemini Search API:", error);
        return { text: "An error occurred while searching.", sources: [] };
    }
};

// Fix: Implement and export mapsSearch function
export const mapsSearch = async (prompt: string, location: {latitude: number, longitude: number}): Promise<{ text: string, sources: {title: string, uri: string}[] }> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { text: "Simulated maps response: La Trattoria is a great Italian restaurant nearby.", sources: [] };
    }
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{googleMaps: {}}],
                toolConfig: {
                    retrievalConfig: { latLng: location }
                }
            },
        });
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
            .map(chunk => ({ title: chunk.maps?.title || '', uri: chunk.maps?.uri || ''}))
            .filter(source => source.uri);

        return { text: response.text, sources };
    } catch (error) {
        console.error("Error calling Gemini Maps API:", error);
        return { text: "An error occurred while searching maps.", sources: [] };
    }
};


// Travel Plan Generation
export const generateTravelPlan = async (tripDetails: { destination: string, startDate: string, endDate: string, budget: string }): Promise<TravelPlan> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return {
            destination: tripDetails.destination,
            tripTitle: `An Amazing Mock Adventure in ${tripDetails.destination}`,
            itinerary: [
                { day: 1, title: 'Arrival & Exploration', activities: ['Check into hotel', 'Explore the local market', 'Dinner at a traditional restaurant'] },
                { day: 2, title: 'Cultural Immersion', activities: ['Visit the main museum', 'Walking tour of the historic district', 'Attend a local performance'] },
                { day: 3, title: 'Departure', activities: ['Souvenir shopping', 'Enjoy a final local breakfast', 'Head to the airport'] }
            ],
            budget: [ { category: 'Flights', cost: parseInt(tripDetails.budget) * 0.4 }, { category: 'Accommodation', cost: parseInt(tripDetails.budget) * 0.3 }, { category: 'Food & Activities', cost: parseInt(tripDetails.budget) * 0.3 } ],
            dealsAndLinks: [ { title: `Best Hotels in ${tripDetails.destination}`, url: 'https://example.com' }, { title: 'Local City Guide', url: 'https://example.com' } ]
        };
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const prompt = `Create a detailed travel plan for a trip to ${tripDetails.destination} from ${tripDetails.startDate} to ${tripDetails.endDate} with a budget of $${tripDetails.budget}. The plan should include a creative trip title, a day-by-day itinerary with specific activities, a detailed budget breakdown into categories, and a list of useful web links and potential deals.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT, properties: {
                        destination: { type: Type.STRING }, tripTitle: { type: Type.STRING },
                        itinerary: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: { type: Type.INTEGER }, title: { type: Type.STRING }, activities: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
                        budget: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, cost: { type: Type.NUMBER } } } },
                        dealsAndLinks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, url: { type: Type.STRING } } } }
                    }
                },
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating travel plan:", error);
        throw new Error("Failed to generate travel plan from AI.");
    }
};

// Text-to-Speech
export const generateSpeech = async (text: string): Promise<string> => {
    if (!API_KEY) return ''; 
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say with a friendly and clear tone: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
    } catch (error) {
        console.error("Error generating speech:", error);
        return '';
    }
};

// Audio Transcription
export const transcribeAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return "This is a mock transcription of your audio: Plan a trip to Tokyo for next week.";
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const audioPart = { inlineData: { mimeType, data: audioBase64 } };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [audioPart, { text: "Transcribe this audio." }] },
        });
        return response.text;
    } catch (error) {
        console.error("Error transcribing audio:", error);
        return "Failed to transcribe audio.";
    }
};

// Dynamic Workflow Generation
export const generateWorkflowFromPrompt = async (prompt: string): Promise<Workflow> => {
     if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Return a mock travel workflow
        return {
            title: `Workflow for: "${prompt}"`,
            nodes: [
                { id: '1', agentId: 'luna', description: 'Plan itinerary for Tokyo' },
                { id: '2', agentId: 'scout', description: 'Find flights and hotels' },
                { id: '3', agentId: 'karim', description: 'Create budget' },
            ],
            connections: [{ from: '1', to: '2' }, { from: '2', to: '3' }]
        };
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const systemInstruction = `You are an expert workflow designer. Based on the user's prompt, create a logical sequence of steps. Each step should be assigned to an agent that possesses the necessary skills. Available agent IDs are 'luna' (planning), 'scout' (searching), 'karim' (finance), 'maya' (communication), 'jules' (technical), 'orion' (orchestration), 'atlas' (business). A travel plan needs Luna, Scout, and Karim. A business plan needs Atlas. A coding task needs Jules. Break down the user's request into a series of nodes and connect them logically. The output must be a valid JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Prompt: "${prompt}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        nodes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    agentId: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                }
                            }
                        },
                        connections: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    from: { type: Type.STRING },
                                    to: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error generating workflow:", error);
        throw new Error("Failed to generate workflow from prompt.");
    }
};

// SEO Idea Generation
export const generateSeoIdeas = async (url: string, topic: string): Promise<{ keywords: string[]; blogOutline: { title: string; points: string[] }; adCopy: string[] }> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2500));
        return {
            keywords: ['mock keyword 1', 'mock keyword 2', 'mock keyword 3'],
            blogOutline: { title: 'Mock Blog Post Title', points: ['Point A', 'Point B', 'Point C'] },
            adCopy: ['Mock Ad Headline 1', 'Mock Ad Headline 2']
        };
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `Analyze the content at the URL ${url} and the topic "${topic}". Generate a comprehensive SEO strategy. I need a list of target keywords, a detailed blog post outline with a catchy title, and three different ad copy headlines.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                        blogOutline: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                points: { type: Type.ARRAY, items: { type: Type.STRING } }
                            }
                        },
                        adCopy: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error generating SEO ideas:", error);
        throw new Error("Failed to generate SEO ideas.");
    }
};

export const summarizeText = async (text: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return "This is a simulated summary of the provided text content.";
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following text concisely: "${text}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary:", error);
        throw new Error("Failed to summarize text.");
    }
};

export const generateDailyInsight = async (): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "The best way to predict the future is to invent it.";
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a short, insightful, and inspiring quote or thought for the day related to technology, creativity, or the future.",
        });
        return response.text.replace(/"/g, ''); // Remove quotes from the response
    } catch (error) {
        console.error("Error generating daily insight:", error);
        return "Embrace the challenges of today to build a better tomorrow.";
    }
};


// Fix: Implement and export generateImage function
export const generateImage = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return 'https://via.placeholder.com/512/1e1b42/FFFFFF?text=Simulated+Image';
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in response.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image.");
    }
};

// Fix: Implement and export editImage function
export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return 'https://via.placeholder.com/512/1e1b42/FFFFFF?text=Simulated+Edit';
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType: mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in response.");
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image.");
    }
};

// Fix: Implement and export generateVideoFromImage async generator
export async function* generateVideoFromImage(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    aspectRatio: '16:9' | '9:16'
): AsyncGenerator<{ status: 'processing' | 'completed' | 'error', progress: number, message: string, url?: string }> {
    if (!API_KEY) {
        yield { status: 'processing', progress: 30, message: 'Simulating video generation...' };
        await new Promise(resolve => setTimeout(resolve, 2000));
        yield { status: 'processing', progress: 70, message: 'Finalizing video...' };
        await new Promise(resolve => setTimeout(resolve, 2000));
        yield { status: 'completed', progress: 100, message: 'Simulation complete.', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' };
        return;
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        yield { status: 'processing', progress: 10, message: 'Sending request to Veo...' };

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: { imageBytes: imageBase64, mimeType: mimeType },
            config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
        });

        yield { status: 'processing', progress: 30, message: 'Video generation in progress... this may take a few minutes.' };
        
        let progress = 30;
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
            progress = Math.min(progress + 10, 90); // Simulate progress
            yield { status: 'processing', progress, message: 'Checking video status...' };
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            yield { status: 'completed', progress: 100, message: 'Video generated successfully!', url: `${downloadLink}&key=${API_KEY}` };
        } else {
            const errorMessage = "Video generation finished, but no download link was found.";
            yield { status: 'error', progress: 100, message: errorMessage };
        }
    } catch (error: any) {
        console.error("Error generating video:", error);
        let message = "An error occurred during video generation.";
        if(error.message.includes("Requested entity was not found")) {
            message = "API key is invalid or has insufficient permissions. Please select a valid key.";
        }
        yield { status: 'error', progress: 100, message };
    }
}

// Fix: Implement and export analyzeVideo function
export const analyzeVideo = async (videoBase64: string, mimeType: string, prompt: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return "This is a mock analysis. The video appears to show a cat playing with a ball of yarn.";
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const videoPart = { inlineData: { mimeType, data: videoBase64 } };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [videoPart, { text: prompt }] },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing video:", error);
        return "Failed to analyze video.";
    }
};