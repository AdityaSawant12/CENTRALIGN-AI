const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyCxg9Fb00-4-sPTKRXUpW8A6obd3gNHiZE';
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('📋 Listing available models for this API key...\n');

        // Try to list models
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
        const data = await response.json();

        if (data.models) {
            console.log(`Found ${data.models.length} models:\n`);
            data.models.forEach(model => {
                console.log(`- ${model.name}`);
                if (model.supportedGenerationMethods) {
                    console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
                }
            });
        } else {
            console.log('Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('Error:', error.message);
    }
}

listModels();
