'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (err) {
            setError('Failed to sign in with Google');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
                <div className="flex flex-col gap-4 mt-4">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            className="w-5 h-5"
                        >
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l6-6C34.4 3.2 29.5 1 24 1 14.8 1 7.1 6.6 3.9 14.1l7 5.4C12.5 14.1 17.8 9.5 24 9.5z"
                            />
                            <path
                                fill="#34A853"
                                d="M46.5 24c0-1.6-.2-3.2-.5-4.7H24v9h12.7c-.5 2.6-2 4.8-4.2 6.3l6.5 5.1c3.8-3.5 6-8.7 6-14.7z"
                            />
                            <path
                                fill="#4A90E2"
                                d="M10.9 28.5c-1.1-2.6-1.1-5.4 0-8l-7-5.4C1.4 18.1 0 21 0 24s1.4 5.9 3.9 8.9l7-5.4z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M24 46c5.5 0 10.4-1.8 14.1-4.9l-6.5-5.1c-2 1.3-4.5 2-7.6 2-6.2 0-11.5-4.6-13.1-10.7l-7 5.4C7.1 41.4 14.8 46 24 46z"
                            />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
