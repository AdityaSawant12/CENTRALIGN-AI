'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setToken } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await api.login(email, password);

            if (result.error) {
                setError(result.error);
            } else if (result.token) {
                setToken(result.token);
                router.push('/dashboard');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="glass rounded-2xl p-8 w-full max-w-md animate-fade-in">
                <h1 className="text-3xl font-bold mb-2 gradient-text text-center">Welcome Back</h1>
                <p className="text-gray-400 text-center mb-8">Sign in to your CentrAlign account</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transform transition-all shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
