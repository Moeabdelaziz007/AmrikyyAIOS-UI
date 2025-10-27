
import { GoogleGenAI, GenerateContentResponse, Content, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Placeholder for Image Generation
export const generateImage = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return 'https://images.unsplash.com/photo-1682687220208-22d715869648?q=80&w=2070&auto=format&fit=crop';
    }
    // Real implementation would use:
    // const response = await ai.models.generateImages({ model: 'imagen-4.0-generate-001', prompt });
    // return `data:image/png;base64,${response.generatedImages[0].image.imageBytes}`;
    console.log("Image generation called with prompt:", prompt);
    return 'https://images.unsplash.com/photo-1682687220208-22d715869648?q=80&w=2070&auto=format&fit=crop';
};

// Placeholder for Video Generation
export const generateVideo = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        return 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';
    }
    // Real implementation would use Veo model and handle long-running operations
    console.log("Video generation called with prompt:", prompt);
    return 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';
};


// Grounded Search with Google
export const groundedSearch = async (prompt: string): Promise<{ text: string, sources: {title: string, uri: string}[] }> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            text: "This is a simulated search response. To connect to Gemini, please provide an API key.",
            sources: []
        };
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
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


// Maps Search
export const mapsSearch = async (prompt: string, location: {latitude: number, longitude: number}): Promise<{ text: string }> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { text: "This is a simulated maps response. To connect to Gemini, please provide an API key." };
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              tools: [{googleMaps: {}}],
              toolConfig: {
                retrievalConfig: {
                  latLng: {
                    latitude: location.latitude,
                    longitude: location.longitude
                  }
                }
              }
            },
        });
        return { text: response.text };
    } catch (error) {
        console.error("Error calling Gemini Maps API:", error);
        return { text: "An error occurred while searching for places." };
    }
};

export const generateTravelPlan = async (tripDetails: { destination: string, startDate: string, endDate: string, budget: string }): Promise<any> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a faster mock response
        return {
            destination: tripDetails.destination,
            tripTitle: `An Amazing Mock Adventure in ${tripDetails.destination}`,
            itinerary: [
                { day: 1, title: 'Arrival & Exploration', activities: ['Check into hotel', 'Explore the local market', 'Dinner at a traditional restaurant'] },
                { day: 2, title: 'Cultural Immersion', activities: ['Visit the main museum', 'Walking tour of the historic district', 'Attend a local performance'] },
                { day: 3, title: 'Departure', activities: ['Souvenir shopping', 'Enjoy a final local breakfast', 'Head to the airport'] }
            ],
            budget: [
                { category: 'Flights', cost: parseInt(tripDetails.budget) * 0.4 },
                { category: 'Accommodation', cost: parseInt(tripDetails.budget) * 0.3 },
                { category: 'Food & Activities', cost: parseInt(tripDetails.budget) * 0.3 }
            ],
            dealsAndLinks: [
                { title: `Best Hotels in ${tripDetails.destination}`, url: 'https://example.com' },
                { title: 'Local City Guide', url: 'https://example.com' }
            ]
        };
    }

    try {
        const prompt = `Create a detailed travel plan for a trip to ${tripDetails.destination} from ${tripDetails.startDate} to ${tripDetails.endDate} with a budget of $${tripDetails.budget}. The plan should include a creative trip title, a day-by-day itinerary with specific activities, a detailed budget breakdown into categories, and a list of useful web links and potential deals.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        destination: { type: Type.STRING },
                        tripTitle: { type: Type.STRING },
                        itinerary: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.INTEGER },
                                    title: { type: Type.STRING },
                                    activities: { type: Type.ARRAY, items: { type: Type.STRING } }
                                }
                            }
                        },
                        budget: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    category: { type: Type.STRING },
                                    cost: { type: Type.NUMBER }
                                }
                            }
                        },
                        dealsAndLinks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    url: { type: Type.STRING }
                                }
                            }
                        }
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
