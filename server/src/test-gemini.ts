import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testGeminiAPI() {
    console.log('🔍 Testing Gemini API Configuration...\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY is not set in .env file');
        process.exit(1);
    }

    if (apiKey === 'your-gemini-api-key-here') {
        console.error('❌ GEMINI_API_KEY is still the placeholder value');
        process.exit(1);
    }

    console.log('✅ API key found in environment');
    console.log(`   Key starts with: ${apiKey.substring(0, 10)}...`);
    console.log(`   Key length: ${apiKey.length} characters`);

    try {
        console.log('\n🧪 Testing Gemini Flash model...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent('Say hello in one word');
        const response = result.response.text();

        console.log('✅ Gemini Flash is working!');
        console.log(`   Response: ${response}`);

        console.log('\n🧪 Testing Embedding model...');
        const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const embeddingResult = await embeddingModel.embedContent('test');

        console.log('✅ Embedding model is working!');
        console.log(`   Embedding dimension: ${embeddingResult.embedding.values.length}`);

        console.log('\n✅ All Gemini API tests passed!');
        process.exit(0);
    } catch (error: any) {
        console.error('\n❌ Gemini API test failed:');
        console.error('   Error message:', error.message);
        console.error('   Error name:', error.name);

        if (error.message) {
            if (error.message.includes('API_KEY_INVALID') || error.message.includes('invalid')) {
                console.error('\n   ⚠️  Your API key appears to be invalid');
                console.error('   Please verify:');
                console.error('   1. The key is copied correctly (no extra spaces)');
                console.error('   2. The key is from https://ai.google.dev/');
                console.error('   3. The key has not been revoked');
            } else if (error.message.includes('quota') || error.message.includes('limit')) {
                console.error('\n   ⚠️  API quota exceeded');
                console.error('   You may have hit the free tier limit');
            } else if (error.message.includes('permission')) {
                console.error('\n   ⚠️  Permission denied');
                console.error('   Make sure the API is enabled in your Google Cloud project');
            }
        }

        console.error('\n   Full error:', error);
        process.exit(1);
    }
}

testGeminiAPI();
