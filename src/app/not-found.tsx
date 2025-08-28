'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function NotFoundPage() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setIsLoggedIn(!!user);
        });
    }, []);

    const handleDashboardClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            router.push('/login');
        }
    };

    return (
        <main id='not-found' className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white shadow-xl rounded-xl p-10 flex flex-col items-center max-w-md w-full">
                <FiAlertTriangle className="text-highlight text-6xl mb-4" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                <p className="text-lg text-gray-600 mb-6 text-center">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/dashboard"
                    onClick={handleDashboardClick}
                    className="inline-block px-6 py-2 rounded-lg bg-highlight text-white font-semibold shadow hover:bg-highlight-dark transition"
                >
                    Go to Dashboard
                </Link>
                <p className="text-sm text-gray-400 mt-4">
                    {isLoggedIn
                        ? 'Return to your dashboard.'
                        : 'You’ll be redirected to login if not authenticated.'}
                </p>
            </div>
        </main>
    );
}