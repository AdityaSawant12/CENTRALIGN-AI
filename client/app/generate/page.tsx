'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getToken } from '@/lib/api';

export default function GenerateFormPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedForm, setGeneratedForm] = useState<any>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = getToken();
        if (!token) {
            router.push('/auth/login');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const result = await api.generateForm(prompt);

            if (result.error) {
                // Show detailed error if available
                const errorMessage = result.details
                    ? `${result.error}: ${result.details}`
                    : result.error;
                setError(errorMessage);
                console.error('Form generation error:', result);
            } else if (result.form) {
                setGeneratedForm(result.form);
            }
        } catch (err) {
            console.error('Exception during form generation:', err);
            setError('Failed to generate form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyShareableLink = () => {
        if (generatedForm) {
            const link = `${window.location.origin}/form/${generatedForm.shareableId}`;
            navigator.clipboard.writeText(link);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold gradient-text mb-2">Generate Form</h1>
                    <p className="text-gray-400">Describe your form in natural language and let AI create it</p>
                </div>

                {/* Generator Form */}
                {!generatedForm ? (
                    <div className="glass rounded-2xl p-8 animate-fade-in">
                        <form onSubmit={handleGenerate} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="prompt" className="block text-lg font-medium text-gray-300 mb-3">
                                    Describe your form
                                </label>
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none"
                                    placeholder="Example: I need a job application form with fields for name, email, phone number, resume upload, cover letter, years of experience, and portfolio link."
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    💡 Tip: Be specific about field types, validation requirements, and any special features you need.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transform transition-all shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-pulse">🤖</span>
                                        Generating form with AI...
                                    </span>
                                ) : (
                                    '✨ Generate Form'
                                )}
                            </button>
                        </form>

                        {/* Example Prompts */}
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <h3 className="text-sm font-semibold text-gray-400 mb-4">Example Prompts:</h3>
                            <div className="space-y-2">
                                {[
                                    'Create a customer feedback survey with rating scales and comment boxes',
                                    'I need an event registration form with name, email, ticket type selection, and dietary preferences',
                                    'Build a contact form with name, email, phone, subject, and message fields',
                                ].map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setPrompt(example)}
                                        className="block w-full text-left px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Success View */
                    <div className="space-y-6 animate-fade-in">
                        <div className="glass rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-4xl">✅</span>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Form Generated Successfully!</h2>
                                    <p className="text-gray-400">Your form is ready to share</p>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-lg p-6 mb-6">
                                <h3 className="text-xl font-bold text-white mb-2">{generatedForm.title}</h3>
                                <p className="text-gray-400 mb-4">{generatedForm.description}</p>
                                <div className="text-sm text-gray-500">
                                    {generatedForm.schema.fields.length} fields • {generatedForm.metadata.purpose}
                                </div>
                            </div>

                            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mb-6">
                                <div className="text-sm text-gray-400 mb-2">Shareable Link:</div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/form/${generatedForm.shareableId}`}
                                        readOnly
                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                                    />
                                    <button
                                        onClick={copyShareableLink}
                                        className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link
                                    href={`/form/${generatedForm.shareableId}`}
                                    target="_blank"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-semibold text-white text-center hover:scale-105 transform transition-all"
                                >
                                    Preview Form
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="flex-1 px-6 py-3 glass rounded-lg font-semibold text-white text-center hover:scale-105 transform transition-all"
                                >
                                    Back to Dashboard
                                </Link>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setGeneratedForm(null);
                                setPrompt('');
                            }}
                            className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold text-white transition-colors"
                        >
                            Generate Another Form
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
