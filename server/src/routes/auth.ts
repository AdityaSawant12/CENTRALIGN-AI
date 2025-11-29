import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../config/database.js';
import { User } from '../models/types.js';

const router = Router();

// Register new user
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }

        // Validate password length
        if (password.length < 6) {
            res.status(400).json({ error: 'Password must be at least 6 characters' });
            return;
        }

        const db = getDatabase();
        const usersCollection = db.collection<User>('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const newUser: User = {
            email: email.toLowerCase(),
            passwordHash,
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        // Generate JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ error: 'Server configuration error' });
            return;
        }

        const token = jwt.sign({ userId: result.insertedId.toString() }, secret, {
            expiresIn: '7d',
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertedId,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login user
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const db = getDatabase();
        const usersCollection = db.collection<User>('users');

        // Find user
        const user = await usersCollection.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ error: 'Server configuration error' });
            return;
        }

        const token = jwt.sign({ userId: user._id!.toString() }, secret, {
            expiresIn: '7d',
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
