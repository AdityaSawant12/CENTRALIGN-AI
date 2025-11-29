import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testCurrentKey() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.log('❌ No API key found');
        process.exit(1);
    }

    console.log(`🔍 Testing current API key from .env file`);
    console.log(`   Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 5)}\n`);

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log('1️⃣ Testing text generation (gemini-1.5-flash)...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say hello');
        console.log('✅ SUCCESS! Text generation works!');
        console.log(`   Response: ${result.response.text()}\n`);

        console.log('2️⃣ Testing embedding (text-embedding-004)...');
        const embModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const embResult = await embModel.embedContent('test');
        console.log('✅ SUCCESS! Embedding works!');
        console.log(`   Dimension: ${embResult.embedding.values.length}\n`);

        console.log('🎉 ALL TESTS PASSED! Your API key is working perfectly!');
        console.log('   You can now generate forms in the application.');
        process.exit(0);

    } catch (error: any) {
        console.log('❌ FAILED\n');
        console.log('Error:', error.message);

        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
            console.log('\n🔴 This API key is INVALID');
            console.log('   Please create a NEW API key at: https://ai.google.dev/');
            console.log('   Make sure to choose "Create API key in new project"');
        } else if (error.message?.includes('quota') || error.message?.includes('Quota')) {
            console.log('\n⚠️  Quota exceeded - this key has hit the daily limit');
            console.log('   Either wait 24 hours or create a new key in a new project');
        } else if (error.message?.includes('404') || error.message?.includes('not found')) {
            console.log('\n⚠️  Model not found - API might not be enabled');
        }

        process.exit(1);
    }
}

testCurrentKey();
