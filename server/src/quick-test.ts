import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function quickTest() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.log('❌ No API key found');
        process.exit(1);
    }

    console.log(`Testing API key: ${apiKey.substring(0, 15)}...`);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Test 1: Simple generation
        console.log('\n1️⃣ Testing text generation...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say "hello" in one word');
        console.log('✅ Text generation works!');
        console.log(`   Response: ${result.response.text()}`);

        // Test 2: Embedding
        console.log('\n2️⃣ Testing embedding...');
        const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const embResult = await embeddingModel.embedContent('test');
        console.log('✅ Embedding works!');
        console.log(`   Dimension: ${embResult.embedding.values.length}`);

        console.log('\n✅ ALL TESTS PASSED! API key is valid and working!');
        process.exit(0);
    } catch (error: any) {
        console.log('\n❌ API TEST FAILED');
        console.log('Error:', error.message);

        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
            console.log('\n🔴 The API key is INVALID or REVOKED');
            console.log('   Please create a NEW API key at: https://ai.google.dev/');
        } else if (error.message?.includes('quota')) {
            console.log('\n⚠️  API quota exceeded');
        } else if (error.message?.includes('403') || error.message?.includes('permission')) {
            console.log('\n⚠️  Permission denied - API may not be enabled');
        }

        process.exit(1);
    }
}

quickTest().catch(console.error);
