import { embeddingModel } from '../config/gemini.js';
import { getDatabase } from '../config/database.js';
import { Form, FormMetadata } from '../models/types.js';
import { ObjectId } from 'mongodb';

/**
 * Generate embedding for a text prompt using Gemini Embedding API
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const result = await embeddingModel.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieve top-K most relevant forms from user's history
 * This is the core of the context-aware memory system
 */
export async function retrieveRelevantForms(
    userId: ObjectId,
    promptEmbedding: number[],
    topK: number = 5
): Promise<Form[]> {
    try {
        const db = getDatabase();
        const formsCollection = db.collection<Form>('forms');

        // Get all user's forms that have embeddings
        const userForms = await formsCollection
            .find({
                userId,
                embedding: { $exists: true, $ne: null },
            })
            .toArray();

        if (userForms.length === 0) {
            return [];
        }

        // Calculate similarity scores
        const formsWithScores = userForms.map((form) => ({
            form,
            similarity: cosineSimilarity(promptEmbedding, form.embedding!),
        }));

        // Sort by similarity (descending) and take top-K
        const topForms = formsWithScores
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK)
            .map((item) => item.form);

        console.log(
            `📊 Retrieved ${topForms.length} relevant forms from ${userForms.length} total forms`
        );

        return topForms;
    } catch (error) {
        console.error('Error retrieving relevant forms:', error);
        return [];
    }
}

/**
 * Build context string from relevant forms for AI prompt
 */
export function buildContextFromForms(forms: Form[]): string {
    if (forms.length === 0) {
        return '';
    }

    const contextItems = forms.map((form) => ({
        purpose: form.metadata.purpose,
        title: form.title,
        fieldTypes: form.metadata.fieldTypes,
        hasImageUpload: form.metadata.hasImageUpload,
        sampleFields: form.schema.fields.slice(0, 5).map((f) => ({
            label: f.label,
            type: f.type,
            required: f.required,
        })),
    }));

    return JSON.stringify(contextItems, null, 2);
}

/**
 * Extract metadata from form schema for quick retrieval
 */
export function extractFormMetadata(
    title: string,
    schema: { fields: any[] }
): FormMetadata {
    const fieldTypes = schema.fields.map((f) => f.label.toLowerCase());
    const hasImageUpload = schema.fields.some(
        (f) => f.type === 'image' || f.type === 'file'
    );

    // Infer purpose from title and field types
    let purpose = 'general form';
    const titleLower = title.toLowerCase();
    const allFields = fieldTypes.join(' ');

    if (
        titleLower.includes('job') ||
        titleLower.includes('application') ||
        titleLower.includes('career') ||
        allFields.includes('resume') ||
        allFields.includes('cv')
    ) {
        purpose = 'job application';
    } else if (titleLower.includes('survey') || titleLower.includes('feedback')) {
        purpose = 'survey';
    } else if (
        titleLower.includes('medical') ||
        titleLower.includes('health') ||
        titleLower.includes('patient')
    ) {
        purpose = 'medical';
    } else if (
        titleLower.includes('registration') ||
        titleLower.includes('signup')
    ) {
        purpose = 'registration';
    } else if (titleLower.includes('contact')) {
        purpose = 'contact';
    }

    return {
        purpose,
        fieldTypes,
        hasImageUpload,
    };
}
