import { Router, Response } from 'express';
import { upload, uploadImageToCloudinary } from '../services/imageUpload.js';

const router = Router();

// Upload image endpoint
router.post('/', upload.single('image'), async (req, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No image file provided' });
            return;
        }

        const imageUrl = await uploadImageToCloudinary(req.file.buffer);

        res.json({
            message: 'Image uploaded successfully',
            url: imageUrl,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

export default router;
