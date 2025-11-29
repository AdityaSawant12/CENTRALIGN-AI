import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyBQPl5QXnGMYYw7xVoOT7YWAwKiehEoWNw';

async function detailedTest() {
    console.log('🔍 Detailed API Key Test\n');
    console.log(`Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 5)}`);
    console.log(`Length: ${apiKey.length} characters\n`);

    const genAI = new GoogleGenerativeAI(apiKey);

    // Test 1: List available models
    try {
        console.log('1️⃣ Checking available models...');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Hi');
        console.log('✅ gemini-pro works!');
        console.log(`   Response: ${result.response.text()}\n`);
    } catch (error: any) {
        console.log('❌ gemini-pro failed');
        console.log(`   Error: ${error.message}\n`);
    }

    // Test 2: Try gemini-1.5-flash
    try {
        console.log('2️⃣ Testing gemini-1.5-flash...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hi');
        console.log('✅ gemini-1.5-flash works!');
        console.log(`   Response: ${result.response.text()}\n`);
    } catch (error: any) {
        console.log('❌ gemini-1.5-flash failed');
        console.log(`   Error: ${error.message}\n`);
    }

    // Test 3: Try embedding
    try {
        console.log('3️⃣ Testing text-embedding-004...');
        const embModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await embModel.embedContent('test');
        console.log('✅ text-embedding-004 works!');
        console.log(`   Dimension: ${result.embedding.values.length}\n`);
    } catch (error: any) {
        console.log('❌ text-embedding-004 failed');
        console.log(`   Error: ${error.message}\n`);
    }

    // Test 4: Try embedding-001
    try {
        console.log('4️⃣ Testing embedding-001...');
        const embModel = genAI.getGenerativeModel({ model: 'embedding-001' });
        const result = await embModel.embedContent('test');
        console.log('✅ embedding-001 works!');
        console.log(`   Dimension: ${result.embedding.values.length}\n`);
    } catch (error: any) {
        console.log('❌ embedding-001 failed');
        console.log(`   Error: ${error.message}\n`);
    }
}

detailedTest().catch(err => {
    console.error('Fatal error:', err.message);
});
