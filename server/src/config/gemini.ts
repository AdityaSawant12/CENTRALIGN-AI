import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

export const genAI = new GoogleGenerativeAI(apiKey);

// Model for form generation
export const generationModel = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
});

// Model for embeddings (context-aware memory)
export const embeddingModel = genAI.getGenerativeModel({
    model: 'embedding-001',
});
