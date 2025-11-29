import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function testMongoDB() {
    console.log('🔍 Testing MongoDB Connection...\n');

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI is not set in .env file');
        process.exit(1);
    }

    if (uri.includes('username:password')) {
        console.error('❌ MONGODB_URI is still the placeholder value');
        console.error('   Please get a real connection string from MongoDB Atlas');
        process.exit(1);
    }

    console.log('✅ MongoDB URI found in environment');
    console.log(`   URI starts with: ${uri.substring(0, 30)}...`);

    try {
        console.log('\n🧪 Connecting to MongoDB...');
        const client = new MongoClient(uri);
        await client.connect();

        console.log('✅ Successfully connected to MongoDB!');

        const db = client.db();
        console.log(`   Database: ${db.databaseName}`);

        // Test a simple operation
        const collections = await db.listCollections().toArray();
        console.log(`   Collections: ${collections.length} found`);

        await client.close();
        console.log('\n✅ MongoDB connection test passed!');
    } catch (error) {
        console.error('\n❌ MongoDB connection failed:');
        if (error instanceof Error) {
            console.error(`   Error: ${error.message}`);
            if (error.message.includes('authentication failed')) {
                console.error('\n   Authentication failed. Please check:');
                console.error('   1. Username and password are correct');
                console.error('   2. User has proper permissions');
                console.error('   3. IP address is whitelisted in MongoDB Atlas');
            } else if (error.message.includes('ENOTFOUND')) {
                console.error('\n   DNS lookup failed. Please check:');
                console.error('   1. Cluster URL is correct');
                console.error('   2. Internet connection is working');
            }
        }
        process.exit(1);
    }
}

testMongoDB();
