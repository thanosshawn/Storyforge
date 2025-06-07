'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.clear();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [dropdownOpen]);

    return (
        <nav className="relative z-10 px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-black/20">
            <div className="flex items-center space-x-3">
                <span className="text-2xl">🌟</span>
                <span className="text-xl font-bold tracking-tight">StoryForge</span>
            </div>
            <div className="relative">
                {user ? (
                    <div className="flex items-center space-x-3">
                        <img
                            src={user.photoURL || '/images/logo-text.png'}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full border border-white/30 cursor-pointer"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                        <span className="text-sm font-medium text-white">{user.displayName || 'User'}</span>
                        {dropdownOpen && (
                            <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20"
                            >
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => router.push('/profile')}
                                >
                                    Profile
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="px-4 py-2 border border-white/30 rounded-full hover:bg-white/10 transition-all"
                        onClick={() => router.push('/login')}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
