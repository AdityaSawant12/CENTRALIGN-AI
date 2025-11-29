'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getToken, removeToken } from '@/lib/api';

interface Form {
    _id: string;
    title: string;
    description: string;
    shareableId: string;
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [forms, setForms] = useState<Form[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/auth/login');
            return;
        }

        loadForms();
    }, [router]);

    const loadForms = async () => {
        try {
            const result = await api.getForms();
            if (result.forms) {
                setForms(result.forms);
            }
        } catch (err) {
            setError('Failed to load forms');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        router.push('/');
    };

    const copyShareableLink = (shareableId: string) => {
        const link = `${window.location.origin}/form/${shareableId}`;
        navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
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
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
                        <p className="text-gray-400">Manage your AI-generated forms</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/generate"
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transform transition-all shadow-lg"
                        >
                            + Generate New Form
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 glass rounded-lg font-semibold text-white hover:scale-105 transform transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-8">
                        {error}
                    </div>
                )}

                {/* Forms Grid */}
                {forms.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center animate-fade-in">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-2xl font-bold text-white mb-4">No forms yet</h2>
                        <p className="text-gray-400 mb-8">
                            Create your first AI-powered form to get started
                        </p>
                        <Link
                            href="/generate"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-semibold text-white hover:scale-105 transform transition-all shadow-lg"
                        >
                            Generate Your First Form
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map((form, index) => (
                            <div
                                key={form._id}
                                className="glass rounded-xl p-6 hover:scale-105 transform transition-all animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <h3 className="text-xl font-bold text-white mb-2">{form.title}</h3>
                                <p className="text-gray-400 mb-4 line-clamp-2">{form.description}</p>
                                <div className="text-sm text-gray-500 mb-4">
                                    Created: {new Date(form.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/forms/${form._id}`}
                                        className="flex-1 px-4 py-2 bg-indigo-600 rounded-lg text-center text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
                                    >
                                        View Submissions
                                    </Link>
                                    <button
                                        onClick={() => copyShareableLink(form.shareableId)}
                                        className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors text-sm font-medium"
                                        title="Copy shareable link"
                                    >
                                        🔗
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
