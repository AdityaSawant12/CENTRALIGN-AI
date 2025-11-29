import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db: Db;
let client: MongoClient;

export async function connectDatabase(): Promise<Db> {
    if (db) {
        return db;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }

    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db();
        console.log('✅ Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

export function getDatabase(): Db {
    if (!db) {
        throw new Error('Database not initialized. Call connectDatabase() first.');
    }
    return db;
}

export async function closeDatabase(): Promise<void> {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
}
