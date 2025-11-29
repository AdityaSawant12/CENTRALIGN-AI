import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log('🔍 Current Gemini API Key Configuration:\n');

if (!apiKey) {
    console.log('❌ GEMINI_API_KEY is NOT set');
    process.exit(1);
}

console.log('✅ API key is set');
console.log(`   Length: ${apiKey.length} characters`);
console.log(`   First 15 chars: ${apiKey.substring(0, 15)}...`);
console.log(`   Last 5 chars: ...${apiKey.substring(apiKey.length - 5)}`);
console.log(`   Starts with "AIza": ${apiKey.startsWith('AIza')}`);
console.log(`   Contains spaces: ${apiKey.includes(' ')}`);
console.log(`   Contains newlines: ${apiKey.includes('\n') || apiKey.includes('\r')}`);

// Check for common issues
const issues = [];

if (apiKey.length !== 39) {
    issues.push(`⚠️  Expected length is 39, but got ${apiKey.length}`);
}

if (!apiKey.startsWith('AIza')) {
    issues.push('⚠️  API key should start with "AIza"');
}

if (apiKey.includes(' ')) {
    issues.push('⚠️  API key contains spaces (should not have any)');
}

if (apiKey.includes('\n') || apiKey.includes('\r')) {
    issues.push('⚠️  API key contains newline characters');
}

if (apiKey === 'your-gemini-api-key-here') {
    issues.push('⚠️  API key is still the placeholder value');
}

if (issues.length > 0) {
    console.log('\n❌ Issues found:');
    issues.forEach(issue => console.log(`   ${issue}`));
    console.log('\n💡 Please check your .env file and make sure:');
    console.log('   1. The key is exactly 39 characters');
    console.log('   2. It starts with "AIza"');
    console.log('   3. There are no spaces or newlines');
    console.log('   4. Format: GEMINI_API_KEY=AIzaSy...');
} else {
    console.log('\n✅ API key format looks correct!');
    console.log('   If you still get errors, the key might be:');
    console.log('   - Revoked or expired');
    console.log('   - From a different Google Cloud project');
    console.log('   - Not enabled for the Generative Language API');
}
