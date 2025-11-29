const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyCxg9Fb00-4-sPTKRXUpW8A6obd3gNHiZE';
const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
    console.log('🔍 Testing which models work without quota issues...\n');

    const modelsToTest = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-2.0-flash-exp',
        'gemini-exp-1206',
        'learnlm-1.5-pro-experimental'
    ];

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say hi');
            console.log(`✅ ${modelName} WORKS!`);
            console.log(`   Response: ${result.response.text()}\n`);

            // If we found a working model, stop
            console.log(`\n🎉 Use this model: ${modelName}`);
            break;
        } catch (error) {
            if (error.message.includes('quota') || error.message.includes('Quota')) {
                console.log(`❌ ${modelName} - Quota exceeded\n`);
            } else if (error.message.includes('404') || error.message.includes('not found')) {
                console.log(`❌ ${modelName} - Not found\n`);
            } else {
                console.log(`❌ ${modelName} - Error: ${error.message.substring(0, 100)}\n`);
            }
        }
    }
}

testModels();
