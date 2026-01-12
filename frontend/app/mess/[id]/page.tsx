'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchMessById } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';

import { AvatarFallback } from '../../../components/AvatarFallback';

interface IMenu {
    item: string;
    description: string;
}

interface IMealPlan {
    breakfast?: IMenu;
    lunch?: IMenu;
    dinner?: IMenu;
}

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface MessDetails {
    _id: string;
    name: string;
    area: string;
    priceRange: string;
    phone: string;
    whatsappLink?: string;
    isMenuAvailable: boolean;
    menu?: Record<DayOfWeek, IMealPlan>;
    logo?: {
        url: string;
        public_id: string;
    };
}

export default function MessDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [mess, setMess] = useState<MessDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeDay, setActiveDay] = useState<DayOfWeek>('monday');

    useEffect(() => {
        // Set active day to current day of week
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
        if (DAYS.includes(today)) {
            setActiveDay(today);
        }

        if (id) {
            fetchMessById(id)
                .then(setMess)
                .catch(() => setError('Failed to load details'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!mess) return <div className="min-h-screen flex items-center justify-center">Mess not found</div>;

    const currentMenu = mess.menu?.[activeDay];

    return (
        <div className="min-h-screen p-8 sm:p-20">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start mb-8 gap-6 border-b pb-8">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/10 shrink-0 border-2 border-primary/20">
                        {mess.logo ? (
                            <img src={mess.logo.url} alt={mess.name} className="w-full h-full object-cover" />
                        ) : (
                            <AvatarFallback name={mess.name} size="xl" />
                        )}
                    </div>
                    <div className="grow flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold text-primary dark:text-foreground mb-2">{mess.name}</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">📍 {mess.area}</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-2xl font-bold text-foreground">₹ {mess.priceRange}</p>
                            <p className="text-sm text-gray-500">Monthly Est.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold">Menu</h3>
                                    {!mess.isMenuAvailable && (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Not Available</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {mess.isMenuAvailable && mess.menu ? (
                                    <div className="space-y-6">
                                        {/* Day Tabs */}
                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                            {DAYS.map(day => (
                                                <button
                                                    key={day}
                                                    onClick={() => setActiveDay(day)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeDay === day
                                                        ? 'bg-accent text-white'
                                                        : 'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20'
                                                        }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Menu Items */}
                                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl space-y-6 animate-in fade-in slide-in-from-top-2">
                                            {currentMenu ? (
                                                <>
                                                    <div className="flex gap-4 border-b pb-4 border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                                                        <div className="w-24 font-bold text-gray-500 dark:text-gray-400">Breakfast</div>
                                                        <div>
                                                            <div className="font-semibold text-lg">{currentMenu.breakfast?.item || 'Not set'}</div>
                                                            <div className="text-sm text-gray-500">{currentMenu.breakfast?.description}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4 border-b pb-4 border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                                                        <div className="w-24 font-bold text-gray-500 dark:text-gray-400">Lunch</div>
                                                        <div>
                                                            <div className="font-semibold text-lg">{currentMenu.lunch?.item || 'Not set'}</div>
                                                            <div className="text-sm text-gray-500">{currentMenu.lunch?.description}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4 border-b pb-4 border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                                                        <div className="w-24 font-bold text-gray-500 dark:text-gray-400">Dinner</div>
                                                        <div>
                                                            <div className="font-semibold text-lg">{currentMenu.dinner?.item || 'Not set'}</div>
                                                            <div className="text-sm text-gray-500">{currentMenu.dinner?.description}</div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center text-gray-500 py-8">No menu info for this day.</div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="mb-2">Menu details are not available for this mess online.</p>
                                        <p className="text-sm">Please contact the owner directly for the daily menu.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader><h3 className="text-xl font-bold">Contact Info</h3></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                                        📞
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        <p className="text-lg font-bold">{mess.phone}</p>
                                    </div>
                                </div>
                                {mess.whatsappLink ? (
                                    <a href={mess.whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                                        <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 text-lg">
                                            Chat on WhatsApp
                                        </Button>
                                    </a>
                                ) : (
                                    <Button className="w-full py-6 text-lg" onClick={() => window.location.href = `tel:${mess.phone}`}>
                                        Call Now
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Reviews Check (Placeholder) */}
                        <Card>
                            <CardHeader><h3 className="text-xl font-bold">Reviews</h3></CardHeader>
                            <CardContent>
                                <div className="text-center py-6">
                                    <span className="text-4xl mb-2 block">⭐</span>
                                    <p className="text-gray-500 italic mb-4">No reviews yet.</p>
                                    <Button variant="outline" className="w-full">Write a Review</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
