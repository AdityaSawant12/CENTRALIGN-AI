import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyCxg9Fb00-4-sPTKRXUpW8A6obd3gNHiZE';

async function testAllModels() {
    console.log('🔍 Testing API Key with different models\n');
    console.log(`Key: ${apiKey.substring(0, 20)}...\n`);

    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b'
    ];

    let workingModel = null;

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hi');
            console.log(`✅ ${modelName} WORKS!`);
            console.log(`   Response: ${result.response.text()}\n`);
            workingModel = modelName;
            break;
        } catch (error: any) {
            console.log(`❌ ${modelName} failed: ${error.message.substring(0, 80)}...\n`);
        }
    }

    if (workingModel) {
        console.log(`\n🎉 Found working model: ${workingModel}`);
        console.log('\nNow testing embedding...');

        try {
            const embModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
            const embResult = await embModel.embedContent('test');
            console.log('✅ Embedding works!');
            console.log(`   Dimension: ${embResult.embedding.values.length}`);

            console.log('\n✅✅✅ SUCCESS! API key is working!');
            console.log(`\nUpdate server/.env with:`);
            console.log(`GEMINI_API_KEY=${apiKey}`);
        } catch (error: any) {
            console.log(`❌ Embedding failed: ${error.message}`);
        }
    } else {
        console.log('\n❌ No working models found. API key might be invalid or restricted.');
    }
}

testAllModels();
