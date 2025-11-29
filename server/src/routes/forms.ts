import { Router, Response } from 'express';
import { nanoid } from 'nanoid';
import { getDatabase } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { Form } from '../models/types.js';
import { generateFormSchema } from '../services/formGenerator.js';
import {
    generateEmbedding,
    retrieveRelevantForms,
    buildContextFromForms,
    extractFormMetadata,
} from '../services/memoryRetrieval.js';

const router = Router();

// Generate new form from prompt (protected)
router.post(
    '/generate',
    authenticateToken,
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { prompt } = req.body;

            if (!prompt || typeof prompt !== 'string') {
                res.status(400).json({ error: 'Prompt is required' });
                return;
            }

            const userId = req.userId!;

            console.log(`🤖 Generating form for prompt: "${prompt}"`);

            // Step 1-3: Try to use context-aware memory (optional feature)
            let contextFromHistory = '';
            let promptEmbedding: number[] | undefined;
            try {
                // Generate embedding for the prompt
                promptEmbedding = await generateEmbedding(prompt);

                // Retrieve relevant forms from user's history
                const relevantForms = await retrieveRelevantForms(userId, promptEmbedding, 5);

                // Build context string from relevant forms
                contextFromHistory = buildContextFromForms(relevantForms);

                if (relevantForms.length > 0) {
                    console.log(
                        `📚 Using context from ${relevantForms.length} relevant past forms`
                    );
                }
            } catch (error) {
                console.log('⚠️  Context-aware memory unavailable (quota exceeded), continuing without it');
            }

            // Step 4: Generate form schema using AI with context
            const { title, description, schema } = await generateFormSchema(
                prompt,
                contextFromHistory
            );

            // Step 5: Extract metadata for future retrieval
            const metadata = extractFormMetadata(title, schema);

            // Step 6: Create shareable ID
            const shareableId = nanoid(10);

            // Step 7: Save form to database
            const db = getDatabase();
            const formsCollection = db.collection<Form>('forms');

            const newForm: Form = {
                userId,
                title,
                description,
                prompt,
                schema,
                ...(promptEmbedding && { embedding: promptEmbedding }),
                metadata,
                shareableId,
                createdAt: new Date(),
            };

            const result = await formsCollection.insertOne(newForm);

            res.status(201).json({
                message: 'Form generated successfully',
                form: {
                    id: result.insertedId,
                    title,
                    description,
                    schema,
                    shareableId,
                    metadata,
                },
            });
        } catch (error) {
            console.error('Form generation error:', error);
            console.error('Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                name: error instanceof Error ? error.name : undefined,
            });
            res.status(500).json({
                error: 'Failed to generate form',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }

    }
);

// Get all user's forms (protected)
router.get(
    '/',
    authenticateToken,
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId!;

            const db = getDatabase();
            const formsCollection = db.collection<Form>('forms');

            const forms = await formsCollection
                .find({ userId })
                .sort({ createdAt: -1 })
                .toArray();

            res.json({ forms });
        } catch (error) {
            console.error('Error fetching forms:', error);
            res.status(500).json({ error: 'Failed to fetch forms' });
        }
    }
);

// Get specific form by ID (protected)
router.get(
    '/:id',
    authenticateToken,
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.userId!;

            const db = getDatabase();
            const formsCollection = db.collection<Form>('forms');

            const { ObjectId } = await import('mongodb');
            const form = await formsCollection.findOne({
                _id: new ObjectId(id),
                userId,
            });

            if (!form) {
                res.status(404).json({ error: 'Form not found' });
                return;
            }

            res.json({ form });
        } catch (error) {
            console.error('Error fetching form:', error);
            res.status(500).json({ error: 'Failed to fetch form' });
        }
    }
);

// Get public form by shareable ID (public route)
router.get('/public/:shareableId', async (req, res: Response): Promise<void> => {
    try {
        const { shareableId } = req.params;

        const db = getDatabase();
        const formsCollection = db.collection<Form>('forms');

        const form = await formsCollection.findOne({ shareableId });

        if (!form) {
            res.status(404).json({ error: 'Form not found' });
            return;
        }

        // Return only necessary public information
        res.json({
            form: {
                id: form._id,
                title: form.title,
                description: form.description,
                schema: form.schema,
                shareableId: form.shareableId,
            },
        });
    } catch (error) {
        console.error('Error fetching public form:', error);
        res.status(500).json({ error: 'Failed to fetch form' });
    }
});

export default router;
