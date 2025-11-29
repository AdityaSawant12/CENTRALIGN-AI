'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface FormField {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
}

export default function PublicFormPage() {
    const params = useParams();
    const shareableId = params.shareableId as string;

    const [form, setForm] = useState<any>(null);
    const [responses, setResponses] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        loadForm();
    }, [shareableId]);

    const loadForm = async () => {
        try {
            const result = await api.getPublicForm(shareableId);
            if (result.form) {
                setForm(result.form);
            } else {
                setError('Form not found');
            }
        } catch (err) {
            setError('Failed to load form');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (fieldId: string, file: File) => {
        setUploadingImages({ ...uploadingImages, [fieldId]: true });
        try {
            const result = await api.uploadImage(file);
            if (result.url) {
                setResponses({ ...responses, [fieldId]: result.url });
            } else {
                alert('Failed to upload image');
            }
        } catch (err) {
            alert('Failed to upload image');
        } finally {
            setUploadingImages({ ...uploadingImages, [fieldId]: false });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const result = await api.submitForm(shareableId, responses);
            if (result.error) {
                setError(result.error);
            } else {
                setSubmitted(true);
            }
        } catch (err) {
            setError('Failed to submit form');
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (field: FormField) => {
        const commonClasses = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white";

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        id={field.id}
                        required={field.required}
                        value={responses[field.id] || ''}
                        onChange={(e) => setResponses({ ...responses, [field.id]: e.target.value })}
                        placeholder={field.placeholder}
                        rows={4}
                        className={`${commonClasses} resize-none`}
                    />
                );

            case 'select':
                return (
                    <select
                        id={field.id}
                        required={field.required}
                        value={responses[field.id] || ''}
                        onChange={(e) => setResponses({ ...responses, [field.id]: e.target.value })}
                        className={commonClasses}
                    >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );

            case 'image':
            case 'file':
                return (
                    <div>
                        <input
                            type="file"
                            id={field.id}
                            required={field.required && !responses[field.id]}
                            accept={field.type === 'image' ? 'image/*' : '*'}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(field.id, file);
                            }}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer hover:file:bg-indigo-700"
                        />
                        {uploadingImages[field.id] && (
                            <p className="text-sm text-indigo-400 mt-2">Uploading...</p>
                        )}
                        {responses[field.id] && !uploadingImages[field.id] && (
                            <div className="mt-2">
                                {field.type === 'image' ? (
                                    <img src={responses[field.id]} alt="Uploaded" className="max-w-xs rounded-lg" />
                                ) : (
                                    <p className="text-sm text-green-400">✓ File uploaded</p>
                                )}
                            </div>
                        )}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {field.options?.map((option) => (
                            <label key={option} className="flex items-center gap-2 text-white cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={(responses[field.id] || []).includes(option)}
                                    onChange={(e) => {
                                        const current = responses[field.id] || [];
                                        const updated = e.target.checked
                                            ? [...current, option]
                                            : current.filter((v: string) => v !== option);
                                        setResponses({ ...responses, [field.id]: updated });
                                    }}
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.options?.map((option) => (
                            <label key={option} className="flex items-center gap-2 text-white cursor-pointer">
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={option}
                                    checked={responses[field.id] === option}
                                    onChange={(e) => setResponses({ ...responses, [field.id]: e.target.value })}
                                    required={field.required}
                                    className="w-4 h-4 border-white/10 bg-white/5 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                );

            default:
                return (
                    <input
                        type={field.type}
                        id={field.id}
                        required={field.required}
                        value={responses[field.id] || ''}
                        onChange={(e) => setResponses({ ...responses, [field.id]: e.target.value })}
                        placeholder={field.placeholder}
                        className={commonClasses}
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-400 animate-pulse">Loading form...</div>
            </div>
        );
    }

    if (error && !form) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="glass rounded-2xl p-8 text-center max-w-md">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Form Not Found</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="glass rounded-2xl p-8 text-center max-w-md animate-fade-in">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
                    <p className="text-gray-400 mb-6">Your response has been submitted successfully.</p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setResponses({});
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transform transition-all"
                    >
                        Submit Another Response
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="container mx-auto max-w-2xl">
                <div className="glass rounded-2xl p-8 animate-fade-in">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">{form.title}</h1>
                        <p className="text-gray-400">{form.description}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                                {error}
                            </div>
                        )}

                        {form.schema.fields.map((field: FormField) => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                                    {field.label}
                                    {field.required && <span className="text-red-400 ml-1">*</span>}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={submitting || Object.values(uploadingImages).some(Boolean)}
                            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transform transition-all shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Form'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-sm text-gray-500">
                            Powered by <span className="gradient-text font-semibold">CentrAlign</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
