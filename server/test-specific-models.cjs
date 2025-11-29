const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyCxg9Fb00-4-sPTKRXUpW8A6obd3gNHiZE';
const genAI = new GoogleGenerativeAI(apiKey);

async function testSpecificModels() {
    const modelsToTest = [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.5-pro-preview-05-06',
        'gemini-2.5-pro-preview-03-25'
    ];

    for (const modelName of modelsToTest) {
        try {
            console.log(`\nTesting ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say hello');
            console.log(`✅ SUCCESS! ${modelName} works!`);
            console.log(`Response: ${result.response.text()}`);
            console.log(`\n🎉 UPDATE YOUR CODE TO USE: ${modelName}`);
            return;
        } catch (error) {
            console.log(`❌ Failed: ${error.message.substring(0, 150)}`);
        }
    }

    console.log('\n❌ All models failed. API key has no available quota.');
}

testSpecificModels();
