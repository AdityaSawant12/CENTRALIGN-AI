import dotenv from 'dotenv';

dotenv.config();

async function testFormGeneration() {
    console.log('🔍 Testing Form Generation API...\n');

    try {
        // First, register a test user
        console.log('📝 Registering test user...');
        const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: `test${Date.now()}@test.com`,
                password: 'test123456',
            }),
        });

        if (!registerResponse.ok) {
            const error = await registerResponse.json();
            console.error('❌ Registration failed:', error);
            process.exit(1);
        }

        const registerData = await registerResponse.json();
        console.log('✅ User registered successfully');
        const token = registerData.token;

        // Now try to generate a form
        console.log('\n🤖 Generating form...');
        const generateResponse = await fetch('http://localhost:5000/api/forms/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                prompt: 'Create a simple contact form with name and email',
            }),
        });

        const generateData = await generateResponse.json();

        if (!generateResponse.ok) {
            console.error('❌ Form generation failed:');
            console.error('   Status:', generateResponse.status);
            console.error('   Error:', generateData.error);
            console.error('   Details:', generateData.details);
            process.exit(1);
        }

        console.log('✅ Form generated successfully!');
        console.log('   Title:', generateData.form.title);
        console.log('   Fields:', generateData.form.schema.fields.length);
        console.log('   Shareable ID:', generateData.form.shareableId);
        console.log('\n✅ All tests passed! Form generation is working!');
    } catch (error) {
        console.error('\n❌ Test failed:');
        if (error instanceof Error) {
            console.error('   Error:', error.message);
        }
        process.exit(1);
    }
}

testFormGeneration();
