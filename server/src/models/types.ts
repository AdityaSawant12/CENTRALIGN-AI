import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    email: string;
    passwordHash: string;
    createdAt: Date;
}

export interface FormField {
    id: string;
    type: 'text' | 'email' | 'number' | 'textarea' | 'image' | 'file' | 'select' | 'checkbox' | 'radio';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // For select, radio, checkbox
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
}

export interface FormSchema {
    fields: FormField[];
}

export interface FormMetadata {
    purpose: string;
    fieldTypes: string[];
    hasImageUpload: boolean;
}

export interface Form {
    _id?: ObjectId;
    userId: ObjectId;
    title: string;
    description: string;
    prompt: string;
    schema: FormSchema;
    embedding?: number[];
    metadata: FormMetadata;
    shareableId: string;
    createdAt: Date;
}

export interface Submission {
    _id?: ObjectId;
    formId: ObjectId;
    responses: {
        [fieldId: string]: string | string[];
    };
    submittedAt: Date;
}
