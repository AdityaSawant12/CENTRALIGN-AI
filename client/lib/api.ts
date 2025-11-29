const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
}

// Auth helpers
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export function setToken(token: string): void {
    localStorage.setItem('token', token);
}

export function removeToken(): void {
    localStorage.removeItem('token');
}

export function getAuthHeaders(): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

// API functions
export const api = {
    // Auth
    async register(email: string, password: string) {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },

    async login(email: string, password: string) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },

    // Forms
    async generateForm(prompt: string) {
        const res = await fetch(`${API_URL}/api/forms/generate`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ prompt }),
        });
        return res.json();
    },

    async getForms() {
        const res = await fetch(`${API_URL}/api/forms`, {
            headers: getAuthHeaders(),
        });
        return res.json();
    },

    async getForm(id: string) {
        const res = await fetch(`${API_URL}/api/forms/${id}`, {
            headers: getAuthHeaders(),
        });
        return res.json();
    },

    async getPublicForm(shareableId: string) {
        const res = await fetch(`${API_URL}/api/forms/public/${shareableId}`);
        return res.json();
    },

    // Submissions
    async submitForm(shareableId: string, responses: any) {
        const res = await fetch(`${API_URL}/api/submissions/${shareableId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses }),
        });
        return res.json();
    },

    async getFormSubmissions(formId: string) {
        const res = await fetch(`${API_URL}/api/submissions/form/${formId}`, {
            headers: getAuthHeaders(),
        });
        return res.json();
    },

    async getUserSubmissions() {
        const res = await fetch(`${API_URL}/api/submissions/user/all`, {
            headers: getAuthHeaders(),
        });
        return res.json();
    },

    // Upload
    async uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);

        const token = getToken();
        const res = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        });
        return res.json();
    },
};
