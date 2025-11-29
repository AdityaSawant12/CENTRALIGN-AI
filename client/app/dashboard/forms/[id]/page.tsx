'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getToken } from '@/lib/api';

export default function FormSubmissionsPage() {
    const params = useParams();
    const router = useRouter();
    const formId = params.id as string;

    const [form, setForm] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/auth/login');
            return;
        }

        loadSubmissions();
    }, [formId, router]);

    const loadSubmissions = async () => {
        try {
            const result = await api.getFormSubmissions(formId);
            if (result.form && result.submissions) {
                setForm(result.form);
                setSubmissions(result.submissions);
            }
        } catch (err) {
            setError('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-400 animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8">
                <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 mb-4 inline-block">
                    ← Back to Dashboard
                </Link>

                {form && (
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">{form.title}</h1>
                        <p className="text-gray-400 mb-4">View all submissions for this form</p>
                        <div className="text-lg text-gray-300">
                            Total Submissions: <span className="font-bold text-indigo-400">{submissions.length}</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-8">
                        {error}
                    </div>
                )}

                {submissions.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h2 className="text-2xl font-bold text-white mb-2">No submissions yet</h2>
                        <p className="text-gray-400">Share your form to start collecting responses</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {submissions.map((submission, index) => (
                            <div key={submission._id} className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">Submission #{submissions.length - index}</h3>
                                    <span className="text-sm text-gray-500">
                                        {new Date(submission.submittedAt).toLocaleString()}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {form.schema.fields.map((field: any) => {
                                        const response = submission.responses[field.id];
                                        if (!response) return null;

                                        return (
                                            <div key={field.id} className="border-t border-white/10 pt-4">
                                                <div className="text-sm font-medium text-gray-400 mb-1">{field.label}</div>
                                                {field.type === 'image' || (typeof response === 'string' && response.startsWith('http') && response.includes('cloudinary')) ? (
                                                    <img src={response} alt={field.label} className="max-w-sm rounded-lg mt-2" />
                                                ) : Array.isArray(response) ? (
                                                    <div className="text-white">{response.join(', ')}</div>
                                                ) : (
                                                    <div className="text-white">{response}</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
