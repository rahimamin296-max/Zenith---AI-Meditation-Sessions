
import { GoogleGenAI, Type, Modality, Chat } from "@google/genai";
import { ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
let chat: Chat | null = null;


export async function generateMeditationScriptAndImagePrompt(topic: string): Promise<{ script: string; imagePrompt: string; }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a guided meditation script about "${topic}". The script should be calm, soothing, and around 200-300 words. Also, provide a simple, descriptive prompt for an image generation model to create a serene and abstract visual that complements this meditation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            script: {
              type: Type.STRING,
              description: "The full guided meditation script.",
            },
            imagePrompt: {
              type: Type.STRING,
              description: "A prompt for an image generation model, like 'Calm serene abstract waves of blue and purple light'.",
            },
          },
          required: ["script", "imagePrompt"],
        },
      },
    });
    
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse;
  } catch (error) {
    console.error("Error generating meditation script:", error);
    throw new Error("Failed to generate meditation script. Please try again.");
  }
}

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to create visuals. Please try again.");
    }
}

export async function generateSpeech(script: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: script }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calming, gentle voice
              },
          },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data received from API.");
    }
    return base64Audio;
  } catch (error) {
     console.error("Error generating speech:", error);
     throw new Error("Failed to synthesize voice. Please try again.");
  }
}

export async function getChatResponse(history: ChatMessage[], newMessage: string): Promise<string> {
    try {
        if (!chat) {
            chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are a friendly and knowledgeable assistant specializing in mindfulness, meditation, and well-being. Answer questions concisely and in a supportive tone.",
                }
            });
        }
        
        const response = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Error in chat:", error);
        chat = null; // Reset chat on error
        throw new Error("Chat service is currently unavailable.");
    }
}
