const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 15)}... (${apiKey.length} chars)` : 'NOT SET');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        console.log('\nTesting Gemini API...');
        const result = await model.generateContent('Say hello');
        const text = result.response.text();

        console.log('✅ SUCCESS!');
        console.log('Response:', text);
    } catch (error) {
        console.log('\n❌ ERROR:');
        console.log('Message:', error.message);
        console.log('Status:', error.status);
        console.log('StatusText:', error.statusText);
        console.log('\nFull error:', JSON.stringify(error, null, 2));
    }
}

test();
