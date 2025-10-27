import { GoogleGenAI, GenerateContentResponse, Content, Type, Modality, FunctionDeclaration } from "@google/genai";
import { TravelPlan, Workflow, SystemVoice, WorkflowNode, WorkflowConnection, ExecutionLogEntry, SkillID, Engram, UserAction, DashboardLayout, AppID, SocialPost, SharedContent } from "../types";
import { skills } from '../data/skills';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

// Helper to escape characters for SSML
const escapeSSML = (text: string) => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

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

// Maps Search with Google
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

export const createCalendarEventFromPlan = async (plan: TravelPlan): Promise<{title: string, start: string, end: string}[]> => {
    if (!API_KEY) return [{ title: "Mock Event: Museum Visit", start: new Date().toISOString(), end: new Date().toISOString() }];
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const systemInstruction = `You are a scheduling assistant. Given a travel plan, extract key activities and convert them into a list of calendar events. Each event needs a title, a start time, and an end time. Assume a reasonable duration for each activity. The output must be a valid JSON array.`;
    
    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Here is the travel plan: ${JSON.stringify(plan.itinerary)}`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            start: { type: Type.STRING },
                            end: { type: Type.STRING },
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error(e);
        throw new Error("AI failed to create calendar events.");
    }
}


// Text-to-Speech
export const generateSpeech = async (text: string, voiceName: SystemVoice = 'Kore', rate: number = 1.0, pitch: number = 0): Promise<string> => {
    if (!API_KEY) return '';
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const ssmlText = `<speak><prosody rate="${rate}" pitch="${pitch}dB">${escapeSSML(text)}</prosody></speak>`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: ssmlText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
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
    const systemInstruction = `You are an expert workflow designer. Based on the user's prompt, create a logical sequence of steps. Each step should be assigned to an agent that possesses the necessary skills. Available agent IDs are 'luna' (planning), 'scout' (searching), 'karim' (finance), 'maya' (communication), 'jules' (technical), 'leo' (marketing manager). A travel plan needs Luna, Scout, and Karim. A business plan needs Leo. A coding task needs Jules. Break down the user's request into a series of nodes and connect them logically. The output must be a valid JSON object.`;

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

// Dynamic Workflow Execution
export const executeDynamicWorkflow = async (nodes: WorkflowNode[], connections: WorkflowConnection[]): Promise<ExecutionLogEntry[]> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return [
            { step: 1, thought: "User wants to run a custom workflow. I need to start with the first node.", action: "Executing Node 1 (luna): Plan itinerary for Tokyo", result: "Itinerary draft created." },
            { step: 2, thought: "The workflow connects to the next node. I will proceed.", action: "Executing Node 2 (scout): Find flights and hotels", result: "Found 5 flight options and 10 hotel deals." },
            { step: 3, thought: "The workflow is complete. I will provide a final summary.", action: "Finalizing", result: "Workflow executed successfully. All tasks completed." },
        ];
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const workflowDescription = `
        Nodes: ${JSON.stringify(nodes.map(n => ({ id: n.id, agent: n.agentId, task: n.description })))}
        Connections: ${JSON.stringify(connections)}
    `;

    const systemInstruction = `You are Orion, a master AI orchestrator. You have been given a workflow defined by nodes (agents and their tasks) and connections (the flow of execution).
    Your task is to interpret this workflow and generate a step-by-step execution log of how you would carry it out.
    For each step, provide your "thought" process, the "action" you are taking (which agent is doing what), and the simulated "result" of that action.
    Follow the connections logically from start to end. The final result should be a summary of the entire operation.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Execute the following workflow:\n${workflowDescription}`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.INTEGER },
                            thought: { type: Type.STRING },
                            action: { type: Type.STRING },
                            result: { type: Type.STRING },
                        },
                        required: ["step", "thought", "action", "result"]
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error executing dynamic workflow:", error);
        throw new Error("Failed to execute dynamic workflow.");
    }
};

export const suggestAgentPersona = async (role: string): Promise<{ name: string; icon: string; skillIDs: SkillID[] }> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            name: 'Creative Writer',
            icon: '✍️',
            skillIDs: ['gemini-pro-text', 'fast-text']
        };
    }
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const availableSkills = skills.map(s => `- ${s.id} (${s.name}): ${s.description}`).join('\n');

    const systemInstruction = `You are an AI Agent Persona Designer. Your task is to suggest a creative name, a single suitable emoji icon, and a list of relevant skill IDs for a new AI agent based on its described role. You must choose from the provided list of available skills.

    Available Skills:
    ${availableSkills}
    
    The output must be a valid JSON object matching the provided schema.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Design a persona for an agent with this role: "${role}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        icon: { type: Type.STRING },
                        skillIDs: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["name", "icon", "skillIDs"]
                }
            }
        });
        
        const result = JSON.parse(response.text.trim());
        const validSkillIDs = result.skillIDs.filter((id: string) => skills.some(s => s.id === id));
        
        return { ...result, skillIDs: validSkillIDs };

    } catch (error) {
        console.error("Error suggesting agent persona:", error);
        throw new Error("Failed to get agent suggestions from AI.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return 'https://storage.googleapis.com/gweb-aip.appspot.com/experiments/mediapipe/cat_and_dog.jpg';
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image from AI.");
    }
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return 'https://storage.googleapis.com/gweb-aip.appspot.com/experiments/mediapipe/cat_and_dog.jpg';
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("No image found in response.");
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image with AI.");
    }
};

export async function* generateVideoFromImage(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    aspectRatio: '16:9' | '9:16'
): AsyncGenerator<{ status: 'processing' | 'completed' | 'error', progress: number, message: string, url?: string }> {
    if (!API_KEY) {
        yield { status: 'processing', progress: 25, message: 'Simulating video generation...' };
        await new Promise(resolve => setTimeout(resolve, 2000));
        yield { status: 'processing', progress: 75, message: 'Finalizing video...' };
        await new Promise(resolve => setTimeout(resolve, 2000));
        yield { status: 'completed', progress: 100, message: 'Simulation complete.', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' };
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        yield { status: 'processing', progress: 10, message: 'Sending request to Veo...' };

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt,
            image: { imageBytes: imageBase64, mimeType },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio,
            }
        });

        yield { status: 'processing', progress: 30, message: 'Veo is processing your video...' };
        
        let progress = 30;
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
            progress = Math.min(90, progress + 10);
            yield { status: 'processing', progress: progress, message: 'Generating frames...' };
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
             throw new Error("Video generation completed but no download link was found.");
        }
        
        const videoUrl = `${downloadLink}&key=${API_KEY}`;
        yield { status: 'completed', progress: 100, message: 'Video generated successfully!', url: videoUrl };

    } catch (error: any) {
        console.error("Error generating video:", error);
        let message = "An unexpected error occurred during video generation.";
        if (error.message && (error.message.includes("not found") || error.message.includes("API key not valid"))) {
            message = "API key is invalid or lacks permissions. Please select a valid key.";
        }
        yield { status: 'error', progress: 100, message, url: undefined };
    }
}

export const analyzeVideo = async (videoBase64: string, mimeType: string, prompt: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return "This is a mock analysis. The video appears to show a cat playing with a ball of yarn.";
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const videoPart = { inlineData: { mimeType, data: videoBase64 } };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [videoPart, { text: prompt }] },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing video:", error);
        return "Failed to analyze video.";
    }
};

export const generateSeoIdeas = async (url: string, topic: string): Promise<{ keywords: string[]; blogOutline: { title: string; points: string[]; }; adCopy: string[]; }> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            keywords: ['AI travel', 'automated trip planning', 'gemini travel'],
            blogOutline: { title: 'How AI is Revolutionizing Travel Planning', points: ['Introduction to AI in travel', 'Benefits of using AI planners', 'Top AI travel tools', 'Future of travel tech'] },
            adCopy: ['Plan your dream trip in seconds.', 'The future of travel is here.', 'Never stress about planning again.']
        };
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const systemInstruction = `You are a world-class SEO and marketing strategist. Based on the user's website URL and primary topic, generate a comprehensive SEO strategy. The output must be a valid JSON object.`;
    const prompt = `Generate an SEO strategy for a website at ${url} with the primary topic of "${topic}".`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                systemInstruction,
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
                            },
                            required: ["title", "points"]
                        },
                        adCopy: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["keywords", "blogOutline", "adCopy"]
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error generating SEO ideas:", error);
        throw new Error("Failed to generate SEO ideas from AI.");
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
            contents: `Summarize the following text:\n\n${text}`,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing text:", error);
        return "Failed to summarize text.";
    }
};

export const analyzeDocumentAndVisualize = async (fileContent: string, prompt: string): Promise<any> => {
     if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (prompt.includes('bar chart')) {
             return { type: 'bar', title: 'Simulated Financials', data: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [{ label: 'Revenue', data: [120, 190, 150, 240], backgroundColor: ['#3B82F6'] }] } };
        }
        return { type: 'summary', title: 'Simulated Summary', data: 'This is a mock summary of the document provided.' };
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const systemInstruction = `You are a data analysis AI. Analyze the provided document content based on the user's prompt. Your output must be one of two types: 'summary' or a chart ('bar', 'pie').
    - If the user asks for a chart, respond with a JSON object for that chart, including a title, labels, and datasets.
    - If the user asks for a summary or general analysis, respond with a JSON object of type 'summary' with a title and the text content in the 'data' field.
    The response must be a single, valid JSON object that matches the specified schema.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Document Content:\n"""\n${fileContent}\n"""\n\nUser Prompt: "${prompt}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING },
                        title: { type: Type.STRING },
                        data: {
                          oneOf: [
                            { type: Type.STRING },
                            {
                              type: Type.OBJECT,
                              properties: {
                                labels: { type: Type.ARRAY, items: { type: Type.STRING } },
                                datasets: {
                                  type: Type.ARRAY,
                                  items: {
                                    type: Type.OBJECT,
                                    properties: {
                                      label: { type: Type.STRING },
                                      data: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                                      backgroundColor: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    },
                                  },
                                },
                              },
                            },
                          ],
                        },
                    },
                    required: ['type', 'title', 'data']
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error analyzing document:", error);
        throw new Error("AI analysis failed.");
    }
}

export const synthesizeMemory = async (prompt: string, existingEngrams: Engram[]): Promise<Omit<Engram, 'id' | 'timestamp'>> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            label: 'Synthesized Mock Insight',
            type: 'synthesized_insight',
            content: 'Based on existing memories, it appears the user enjoys both technology and cultural experiences, suggesting a future trip to Seoul.',
            color: '#EC4899', // Pink for synthesized
            potentiality: 0,
        };
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const memoryContext = existingEngrams.map(e => `- ${e.label}: ${e.content}`).join('\n');

    const systemInstruction = `You are a Quantum Reasoning Engine within an AI OS. Your task is to analyze a user's query and a set of existing memories (engrams).
    Synthesize a new, insightful memory that connects or expands upon the existing ones based on the query.
    The new memory should have a concise label, a summary content, and a color. Assign it the type 'synthesized_insight'.
    The output must be a valid JSON object matching the provided schema.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `User Query: "${prompt}"\n\nExisting Memories:\n${memoryContext}`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['synthesized_insight'] },
                        content: { type: Type.STRING },
                        color: { type: Type.STRING, description: "A hex color code, e.g., '#EC4899'" }
                    },
                    required: ["label", "type", "content", "color"]
                }
            }
        });
        const result = JSON.parse(response.text.trim());
        return { ...result, potentiality: 0 }; // Start in superposition
    } catch (error) {
        console.error("Error synthesizing memory:", error);
        throw new Error("Failed to synthesize new memory from AI.");
    }
};

export const generateProactiveSuggestion = async (actions: UserAction[]): Promise<{ title: string; suggestions: { text: string; actionAppId?: AppID, appProps?: Record<string, any> }[] }> => {
    if (!API_KEY || actions.length === 0) {
        return { title: "Suggestions", suggestions: [{text: "Open the Creator Studio to start a new project."}]};
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const context = `A user in an AI OS has performed these recent actions: ${actions.map(a => `Action: Opened app '${a.appId}' with details: ${JSON.stringify(a.details)}`).join(', ')}.`;

    const systemInstruction = `You are Echo, a proactive AI assistant. Based on the user's recent actions, provide a concise title and a list of 2-3 helpful, short, and relevant suggestions. For each suggestion, provide the text, an optional 'actionAppId' to open an app, and optional 'appProps' to pass data to that app.

    Example actionAppIds: 'chat', 'workflow', 'creatorStudio', 'marketing'.
    
    Example: If the user just created a project (e.g., details: {event: 'project_created', projectName: 'New Website'}), you could suggest 'Draft a marketing plan for New Website' with actionAppId 'marketing' and appProps { initialTopic: 'Marketing for New Website' }.
    If the user opens 'travelAgent', suggest 'Shall I find flight deals for you?' with actionAppId 'search'.

    The output must be a valid JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: context,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING },
                                    actionAppId: { type: Type.STRING },
                                    appProps: { type: Type.OBJECT, properties: {} }
                                }
                            }
                        }
                    },
                    required: ['title', 'suggestions']
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error generating proactive suggestion:", error);
        return { title: "Suggestions", suggestions: [{ text: "Keep exploring the OS to see what you can do!"}] };
    }
};

const osCommandFunctionDeclaration: FunctionDeclaration = {
  name: 'execute_os_command',
  parameters: {
    type: Type.OBJECT,
    description: 'Executes a command within the AI OS, like opening or closing an application.',
    properties: {
      action: { type: Type.STRING, description: 'The action to perform, either "open" or "close".' },
      target: { type: Type.STRING, description: 'The ID of the app to target (e.g., "chat", "settings") or "all" to close all windows.' },
    },
    required: ['action', 'target'],
  },
};

export const interpretVoiceCommand = async (prompt: string) => {
    if (!API_KEY) {
         if (prompt.toLowerCase().includes('open chat')) return { action: 'open', target: 'chat' };
         return null;
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User command: "${prompt}"`,
            config: {
                tools: [{ functionDeclarations: [osCommandFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'execute_os_command') {
            return functionCall.args as { action: 'open' | 'close', target: AppID | 'all' };
        }
        return null;
    } catch (error) {
        console.error("Error interpreting voice command:", error);
        return null;
    }
};

export const suggestDashboardLayout = async (description: string): Promise<DashboardLayout> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return 'work';
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const systemInstruction = `You are an OS configuration assistant. Based on the user's description of their needs, suggest the best dashboard layout.
    Available layouts are: 'default', 'work', 'developer'.
    - 'work' is best for productivity, projects, and communication.
    - 'developer' is best for coding, data analysis, and system monitoring.
    - 'default' is a balanced layout.
    Your response must be a single, valid JSON object with one key: "layout".`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User's needs: "${description}"`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { layout: { type: Type.STRING, enum: ['default', 'work', 'developer'] } },
                    required: ['layout'],
                }
            }
        });
        const result = JSON.parse(response.text.trim());
        return result.layout;
    } catch (error) {
        console.error("Error suggesting dashboard layout:", error);
        return 'default';
    }
};

export const testSystemPrompt = async (systemInstruction: string, userPrompt: string): Promise<string> => {
    if (!API_KEY) return "Simulation Mode: This would be the AI's response.";

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: userPrompt,
            config: { systemInstruction },
        });
        return response.text;
    } catch (e: any) {
        console.error("Error testing system prompt:", e);
        return `Error: ${e.message}`;
    }
};

export const generateSocialMediaPost = async (content: SharedContent): Promise<SocialPost> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            caption: `Check out my new ${content.type}: "${content.title}"! Created with the Amrikyy AI OS.`,
            hashtags: ['#AI', '#AmrikyyOS', '#FutureTech']
        };
    }
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const systemInstruction = `You are a viral marketing expert specializing in social media. Your task is to generate a catchy, engaging social media post based on user-generated content from an AI-powered OS. The post must include a short, exciting caption (max 2-3 sentences) and a list of 3-5 relevant and popular hashtags. The tone should be enthusiastic and shareable.

    The output must be a valid JSON object matching the provided schema.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a social media post for the following content:
            - Type: ${content.type}
            - Title: ${content.title}
            - Subtitle: ${content.subtitle}`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        caption: { type: Type.STRING },
                        hashtags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["caption", "hashtags"]
                }
            }
        });
        
        return JSON.parse(response.text.trim());

    } catch (error) {
        console.error("Error generating social media post:", error);
        throw new Error("Failed to get social media post from AI.");
    }
};
