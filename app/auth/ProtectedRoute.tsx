'use client'
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user && pathname !== '/login') {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [pathname, router]);

    return <>{children}</>;
};

export default ProtectedRoute;
