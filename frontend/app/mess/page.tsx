'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchMesses } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

// Mock data type until we have full types in frontend
interface Mess {
    _id: string;
    name: string;
    area: string;
    priceRange: string;
    phone: string;
}

function MessListingContent() {
    const searchParams = useSearchParams();
    const initialArea = searchParams.get('area') || '';
    const [area, setArea] = useState(initialArea);
    const [messes, setMesses] = useState<Mess[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadMesses(initialArea);
    }, []);

    async function loadMesses(searchArea: string) {
        setLoading(true);
        try {
            const data = await fetchMesses(searchArea);
            setMesses(data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to load messes. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadMesses(area);
    };

    return (
        <div className="min-h-screen p-8 sm:p-20 ">
            <h1 className="text-3xl font-bold mb-8 text-primary dark:text-light">Find a Mess</h1>

            <form onSubmit={handleSearch} className="flex gap-4 mb-10 max-w-2xl">
                <Input
                    placeholder="Search by area (e.g. Kakkanad)"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="flex-1 text-light placeholder:text-light/50"
                />

                <Button type="submit">Search</Button>
            </form>

            {loading && <p>Loading messes...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && messes.length === 0 && (
                <p>No messes found in this area.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messes.map((mess) => (
                    <Link href={`/mess/${mess._id}`} key={mess._id}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent>
                                <h2 className="text-xl font-bold text-primary dark:text-light mb-2">{mess.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">📍 {mess.area}</p>
                                <p className="text-secondary font-medium">💰 {mess.priceRange}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function MessListing() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <MessListingContent />
        </Suspense>
    );
}
