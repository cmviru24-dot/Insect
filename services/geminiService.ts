import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import type { InsectData, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const insectDataSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Common name of the insect." },
    scientificName: { type: Type.STRING, description: "Scientific name (genus and species)." },
    taxonomy: {
      type: Type.OBJECT,
      properties: {
        kingdom: { type: Type.STRING },
        phylum: { type: Type.STRING },
        class: { type: Type.STRING },
        order: { type: Type.STRING },
        family: { type: Type.STRING },
        genus: { type: Type.STRING },
        species: { type: Type.STRING },
      },
      required: ["kingdom", "phylum", "class", "order", "family", "genus", "species"],
    },
    summary: { type: Type.STRING, description: "A brief, engaging summary of the insect." },
    habitat: { type: Type.STRING, description: "Description of the insect's natural habitat and global distribution." },
    ecologicalRole: { type: Type.STRING, description: "The insect's role in the ecosystem (e.g., pollinator, decomposer)." },
    threats: { type: Type.STRING, description: "Major threats to the insect's survival." },
    conservationStatus: { type: Type.STRING, description: "Current conservation status (e.g., from IUCN Red List)." },
    populationTrend: {
      type: Type.ARRAY,
      description: "Mock data for population trend over 5 points in time. Year should be recent, population is an index from 0-100.",
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.INTEGER },
          population: { type: Type.NUMBER },
        },
        required: ["year", "population"],
      },
    },
    funFacts: {
      type: Type.ARRAY,
      description: "A list of 3-5 interesting and fun facts.",
      items: { type: Type.STRING },
    },
    sustainabilityTip: { type: Type.STRING, description: "A practical tip for helping conserve this insect." },
    impactScore: { type: Type.INTEGER, description: "An integer score from 0-100 representing its ecological importance." },
    extinctionPrediction: { type: Type.STRING, description: "A simple, AI-generated prediction or risk assessment for extinction by 2050 based on current trends." },
  },
  required: ["name", "scientificName", "taxonomy", "summary", "habitat", "ecologicalRole", "threats", "conservationStatus", "populationTrend", "funFacts", "sustainabilityTip", "impactScore", "extinctionPrediction"],
};

export const isInsect = async (query: string): Promise<boolean> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Is "${query}" an insect? Answer with only "true" or "false". Do not provide any other explanation. Be very strict. If the query is for an animal that is not an insect, like "lion", answer "false" even if there is an insect with a similar name like "antlion".`,
      config: {
        temperature: 0,
      }
    });

    const resultText = response.text.trim().toLowerCase();
    return resultText === 'true';
  } catch (error) {
    console.error(`Error in isInsect validation for "${query}":`, error);
    // To be safe, if validation fails, we treat it as not an insect.
    return false;
  }
};

export const generateInsectImage = async (insectName: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A high-quality, photorealistic image of a ${insectName} in its natural habitat. The insect should be the main focus. High resolution, detailed.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");
  } catch (error) {
    console.error("Error generating insect image:", error);
    throw new Error("Failed to generate an image for the insect.");
  }
};

export const generateDistributionMap = async (insectName: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A scientific, educational world map illustrating the geographical distribution of the ${insectName}. Use clear shading to indicate its primary habitats. Aspect ratio 16:9.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No map image was generated.");
  } catch (error) {
    console.error("Error generating distribution map:", error);
    throw new Error("Failed to generate a distribution map.");
  }
};

const getInsectSoundText = (insectName: string): string => {
    const lowerInsectName = insectName.toLowerCase();
    if (lowerInsectName.includes('cricket') || lowerInsectName.includes('grasshopper')) {
        return 'Chirp chirp chirp.';
    }
    if (lowerInsectName.includes('bee') || lowerInsectName.includes('fly') || lowerInsectName.includes('wasp') || lowerInsectName.includes('mosquito')) {
        return 'Bzzzzzzzzzz.';
    }
    if (lowerInsectName.includes('cicada')) {
        return 'A loud, high-pitched buzzing sound.';
    }
    if (lowerInsectName.includes('katydid')) {
        return 'A rhythmic clicking sound.';
    }
    return `This is a sound of a ${insectName}.`;
};

export const generateInsectSound = async (insectName: string): Promise<string> => {
    try {
        const soundText = getInsectSoundText(insectName);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: soundText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            return base64Audio;
        }
        throw new Error("No audio was generated.");
    } catch (error) {
        console.error("Error generating insect sound:", error);
        throw new Error("Failed to generate sound for the insect.");
    }
};


export const fetchInsectData = async (insectName: string): Promise<InsectData> => {
  try {
    const [dataResponse, imageUrl, distributionMapImageUrl] = await Promise.all([
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide comprehensive information for the insect: "${insectName}". Focus only on this insect, not other animals.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: insectDataSchema,
          systemInstruction: "You are an expert entomologist. Your goal is to provide detailed, accurate, and engaging information about insects in a structured JSON format. The data should be suitable for an educational app.",
        }
      }),
      generateInsectImage(insectName),
      generateDistributionMap(insectName)
    ]);
    
    const text = dataResponse.text.trim();
    const insectDetails = JSON.parse(text);

    return {
      ...insectDetails,
      imageUrl,
      distributionMapImageUrl,
    } as InsectData;

  } catch (error) {
    console.error("Error fetching insect data:", error);
    throw new Error("Failed to fetch data from Gemini API. The insect might not be in the database or there was a network issue.");
  }
};

export const createChat = (insectName: string): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a helpful and knowledgeable assistant specializing in entomology. Your name is Professor Buzz. Answer questions about the ${insectName} and related topics in an engaging way for all ages. Keep answers concise and accurate.`,
        },
    });
};