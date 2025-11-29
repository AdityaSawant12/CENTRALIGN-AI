const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const apiKey = 'AIzaSyCxg9Fb00-4-sPTKRXUpW8A6obd3gNHiZE';
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('hi');
        const output = 'SUCCESS: ' + result.response.text();
        console.log(output);
        fs.writeFileSync('test-result.txt', output);
    } catch (error) {
        const output = 'ERROR: ' + JSON.stringify({
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            errorDetails: error.errorDetails
        }, null, 2);
        console.log(output);
        fs.writeFileSync('test-result.txt', output);
    }
}

test();
