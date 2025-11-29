import { FormField, FormSchema } from '../models/types';

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

/**
 * Validate a single field value against its schema
 */
export function validateField(field: FormField, value: any): ValidationError | null {
    const fieldName = field.label || field.id;

    // Required field validation
    if (field.required && (value === undefined || value === null || value === '')) {
        return {
            field: field.id,
            message: `${fieldName} is required`
        };
    }

    // Skip further validation if field is empty and not required
    if (!value && !field.required) {
        return null;
    }

    // Type-specific validation
    switch (field.type) {
        case 'email':
            return validateEmail(field, value);

        case 'number':
            return validateNumber(field, value);

        case 'text':
        case 'textarea':
            return validateText(field, value);

        case 'file':
        case 'image':
            return validateFile(field, value);

        case 'select':
        case 'radio':
            return validateSelect(field, value);

        case 'checkbox':
            return validateCheckbox(field, value);

        default:
            return null;
    }
}

/**
 * Validate email format
 */
function validateEmail(field: FormField, value: string): ValidationError | null {
    const emailPattern = field.validation?.pattern || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regex = typeof emailPattern === 'string' ? new RegExp(emailPattern) : emailPattern;

    if (!regex.test(value)) {
        return {
            field: field.id,
            message: field.validation?.message || `Please enter a valid email address`
        };
    }

    return null;
}

/**
 * Validate number field
 */
function validateNumber(field: FormField, value: any): ValidationError | null {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
        return {
            field: field.id,
            message: `${field.label} must be a valid number`
        };
    }

    // Min value validation
    if (field.validation?.min !== undefined && num < field.validation.min) {
        return {
            field: field.id,
            message: field.validation.message || `${field.label} must be at least ${field.validation.min}`
        };
    }

    // Max value validation
    if (field.validation?.max !== undefined && num > field.validation.max) {
        return {
            field: field.id,
            message: field.validation.message || `${field.label} must be at most ${field.validation.max}`
        };
    }

    return null;
}

/**
 * Validate text field
 */
function validateText(field: FormField, value: string): ValidationError | null {
    const strValue = String(value);

    // Min length validation
    if (field.validation?.minLength !== undefined && strValue.length < field.validation.minLength) {
        return {
            field: field.id,
            message: field.validation.message || `${field.label} must be at least ${field.validation.minLength} characters`
        };
    }

    // Max length validation
    if (field.validation?.maxLength !== undefined && strValue.length > field.validation.maxLength) {
        return {
            field: field.id,
            message: field.validation.message || `${field.label} must be at most ${field.validation.maxLength} characters`
        };
    }

    // Pattern validation
    if (field.validation?.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(strValue)) {
            return {
                field: field.id,
                message: field.validation.message || `${field.label} format is invalid`
            };
        }
    }

    return null;
}

/**
 * Validate file upload (metadata validation)
 * Note: Actual file validation happens on upload endpoint
 */
function validateFile(field: FormField, value: any): ValidationError | null {
    // If value is a string (URL), it means file is already uploaded
    if (typeof value === 'string') {
        return null;
    }

    // For file objects, check if they exist
    if (!value && field.required) {
        return {
            field: field.id,
            message: `${field.label} is required`
        };
    }

    return null;
}

/**
 * Validate file upload constraints (for actual file objects)
 */
export function validateFileUpload(field: FormField, file: { name: string; size: number; mimetype: string }): ValidationError | null {
    const fieldName = field.label || field.id;

    // File size validation
    if (field.maxFileSize && file.size > field.maxFileSize) {
        const maxSizeMB = (field.maxFileSize / (1024 * 1024)).toFixed(2);
        return {
            field: field.id,
            message: `${fieldName} must be smaller than ${maxSizeMB}MB`
        };
    }

    // File type validation
    if (field.accept && field.accept.length > 0) {
        const fileName = file.name.toLowerCase();
        const fileExtension = '.' + fileName.split('.').pop();

        // Check if extension is in accepted list
        const isAccepted = field.accept.some(acceptType => {
            if (acceptType.startsWith('.')) {
                return fileName.endsWith(acceptType.toLowerCase());
            }
            // Handle MIME type patterns like 'image/*'
            if (acceptType.includes('*')) {
                const pattern = acceptType.replace('*', '.*');
                return new RegExp(pattern).test(file.mimetype);
            }
            return file.mimetype === acceptType;
        });

        if (!isAccepted) {
            return {
                field: field.id,
                message: `${fieldName} must be one of: ${field.accept.join(', ')}`
            };
        }
    }

    return null;
}

/**
 * Validate select/radio field
 */
function validateSelect(field: FormField, value: string): ValidationError | null {
    if (field.options && !field.options.includes(value)) {
        return {
            field: field.id,
            message: `${field.label} must be one of the provided options`
        };
    }

    return null;
}

/**
 * Validate checkbox field
 */
function validateCheckbox(field: FormField, value: any): ValidationError | null {
    // For multi-checkbox, value should be an array
    if (Array.isArray(value)) {
        if (field.required && value.length === 0) {
            return {
                field: field.id,
                message: `${field.label} requires at least one selection`
            };
        }

        // Validate all selected values are in options
        if (field.options) {
            const invalidOptions = value.filter(v => !field.options!.includes(v));
            if (invalidOptions.length > 0) {
                return {
                    field: field.id,
                    message: `${field.label} contains invalid selections`
                };
            }
        }
    }

    return null;
}

/**
 * Validate entire form submission
 */
export function validateFormSubmission(schema: FormSchema, data: { [fieldId: string]: any }): ValidationResult {
    const errors: ValidationError[] = [];

    for (const field of schema.fields) {
        const value = data[field.id];
        const error = validateField(field, value);

        if (error) {
            errors.push(error);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
