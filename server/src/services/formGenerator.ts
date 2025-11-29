import { generationModel } from '../config/gemini.js';
import { FormSchema } from '../models/types.js';

/**
 * Generate form schema from natural language prompt using Gemini AI
 * with context-aware memory injection
 */
export async function generateFormSchema(
  prompt: string,
  contextFromHistory: string
): Promise<{ title: string; description: string; schema: FormSchema }> {
  try {
    // Build the AI prompt with context injection
    const systemPrompt = `You are an intelligent form schema generator. Your task is to convert natural language descriptions into structured JSON form schemas.

${contextFromHistory
        ? `Here is relevant context from the user's past forms for reference:
${contextFromHistory}

Use this context to understand the user's preferences for field ordering, validation patterns, and form structure. However, generate a NEW form based on the current request.`
        : 'This is the user\'s first form.'
      }

Generate a form schema based on the following request:
"${prompt}"

Return a JSON object with this EXACT structure (no markdown, no code blocks, just pure JSON):
{
  "title": "Form Title",
  "description": "Brief description of the form",
  "schema": {
    "fields": [
      {
        "id": "unique_field_id",
        "type": "text|email|number|textarea|image|file|select|checkbox|radio",
        "label": "Field Label",
        "placeholder": "Optional placeholder",
        "required": true|false,
        "options": ["option1", "option2"],
        "validation": {
          "min": 0,
          "max": 100,
          "minLength": 2,
          "maxLength": 100,
          "pattern": "regex pattern",
          "message": "Validation error message"
        },
        "accept": [".jpg", ".png", "image/*"],
        "maxFileSize": 5242880
      }
    ]
  }
}

Rules:
1. Generate field IDs as lowercase with underscores (e.g., "full_name", "email_address")
2. Use appropriate field types based on the data being collected
3. Add validation rules where appropriate:
   - Email fields: Include email validation pattern
   - Text fields: Add minLength (typically 2) and maxLength (50-200 based on field)
   - Number fields: Add min/max values where logical
   - File/Image fields: Add accept array with file types and maxFileSize in bytes
4. For image uploads: use type "image", accept: [".jpg", ".jpeg", ".png", ".gif", ".webp"], maxFileSize: 5242880 (5MB)
5. For document uploads: use type "file", accept: [".pdf", ".doc", ".docx"], maxFileSize: 10485760 (10MB)
6. Include 3-10 fields based on the request
7. Make commonly required fields (name, email) required: true
8. Add sensible validation messages
9. Return ONLY valid JSON, no additional text or markdown`;

    const result = await generationModel.generateContent(systemPrompt);
    const responseText = result.response.text();

    // Clean the response (remove markdown code blocks if present)
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(cleanedResponse);

    // Validate the response structure
    if (!parsedResponse.title || !parsedResponse.schema || !parsedResponse.schema.fields) {
      throw new Error('Invalid response structure from AI');
    }

    console.log(`✅ Generated form: "${parsedResponse.title}" with ${parsedResponse.schema.fields.length} fields`);

    return parsedResponse;
  } catch (error) {
    console.error('Error generating form schema:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate form schema: ${errorMessage}`);
  }
}
