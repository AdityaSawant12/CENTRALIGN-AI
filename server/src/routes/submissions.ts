import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { Submission, Form } from '../models/types.js';

const router = Router();

// Submit form response (public)
router.post('/:shareableId', async (req: Request, res: Response): Promise<void> => {
    try {
        const { shareableId } = req.params;
        const { responses } = req.body;

        if (!responses || typeof responses !== 'object') {
            res.status(400).json({ error: 'Responses are required' });
            return;
        }

        const db = getDatabase();
        const formsCollection = db.collection<Form>('forms');
        const submissionsCollection = db.collection<Submission>('submissions');

        // Find the form
        const form = await formsCollection.findOne({ shareableId });
        if (!form) {
            res.status(404).json({ error: 'Form not found' });
            return;
        }

        // Validate responses against schema
        const requiredFields = form.schema.fields
            .filter((field) => field.required)
            .map((field) => field.id);

        for (const fieldId of requiredFields) {
            if (!responses[fieldId] || responses[fieldId] === '') {
                res.status(400).json({
                    error: `Required field "${fieldId}" is missing`,
                });
                return;
            }
        }

        // Create submission
        const newSubmission: Submission = {
            formId: form._id!,
            responses,
            submittedAt: new Date(),
        };

        const result = await submissionsCollection.insertOne(newSubmission);

        res.status(201).json({
            message: 'Form submitted successfully',
            submissionId: result.insertedId,
        });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error: 'Failed to submit form' });
    }
});

// Get submissions for a specific form (protected)
router.get(
    '/form/:formId',
    authenticateToken,
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { formId } = req.params;
            const userId = req.userId!;

            const db = getDatabase();
            const formsCollection = db.collection<Form>('forms');
            const submissionsCollection = db.collection<Submission>('submissions');

            // Verify form belongs to user
            const form = await formsCollection.findOne({
                _id: new ObjectId(formId),
                userId,
            });

            if (!form) {
                res.status(404).json({ error: 'Form not found' });
                return;
            }

            // Get submissions
            const submissions = await submissionsCollection
                .find({ formId: new ObjectId(formId) })
                .sort({ submittedAt: -1 })
                .toArray();

            res.json({
                form: {
                    id: form._id,
                    title: form.title,
                    schema: form.schema,
                },
                submissions,
            });
        } catch (error) {
            console.error('Error fetching submissions:', error);
            res.status(500).json({ error: 'Failed to fetch submissions' });
        }
    }
);

// Get all submissions for user's forms grouped by form (protected)
router.get(
    '/user/all',
    authenticateToken,
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId!;

            const db = getDatabase();
            const formsCollection = db.collection<Form>('forms');
            const submissionsCollection = db.collection<Submission>('submissions');

            // Get all user's forms
            const userForms = await formsCollection.find({ userId }).toArray();

            // Get submissions for each form
            const formsWithSubmissions = await Promise.all(
                userForms.map(async (form) => {
                    const submissions = await submissionsCollection
                        .find({ formId: form._id! })
                        .sort({ submittedAt: -1 })
                        .toArray();

                    return {
                        form: {
                            id: form._id,
                            title: form.title,
                            shareableId: form.shareableId,
                            createdAt: form.createdAt,
                        },
                        submissionCount: submissions.length,
                        submissions,
                    };
                })
            );

            res.json({ data: formsWithSubmissions });
        } catch (error) {
            console.error('Error fetching user submissions:', error);
            res.status(500).json({ error: 'Failed to fetch submissions' });
        }
    }
);

export default router;
