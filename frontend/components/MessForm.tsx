'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent } from './ui/Card';

interface MessFormProps {
    onSubmit: (formData: FormData) => Promise<void>;
    initialData?: any;
    submitLabel?: string;
    description?: string;
    successMessage?: string;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const MEALS = ['breakfast', 'lunch', 'dinner'] as const;

export const MessForm: React.FC<MessFormProps> = ({
    onSubmit,
    initialData,
    submitLabel = 'Submit Mess',
    description,
    successMessage
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Menu state
    const [isMenuAvailable, setIsMenuAvailable] = useState(initialData?.isMenuAvailable || false);
    const [activeDay, setActiveDay] = useState<typeof DAYS[number]>('monday');
    const [menu, setMenu] = useState<any>(initialData?.menu ||
        DAYS.reduce((acc, day) => ({
            ...acc,
            [day]: MEALS.reduce((mAcc, meal) => ({
                ...mAcc,
                [meal]: { item: '', description: '' }
            }), {})
        }), {})
    );

    const handleMenuChange = (day: string, meal: string, field: 'item' | 'description', value: string) => {
        setMenu((prev: any) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [meal]: {
                    ...prev[day][meal],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);

        // Add menu data
        formData.append('isMenuAvailable', String(isMenuAvailable));
        if (isMenuAvailable) {
            formData.append('menu', JSON.stringify(menu));
        }

        try {
            await onSubmit(formData);
            setSuccess(true);
            if (!initialData) {
                (e.target as HTMLFormElement).reset();
                // Reset menu state too if needed
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
                <div className="mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-foreground">
                        {initialData ? 'Edit Mess' : 'List Your Mess'}
                    </h2>
                    {description && <p className="text-foreground-500 mt-1">{description}</p>}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4 ">
                        <h3 className="text-lg font-semibold text-foreg">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Mess Name"
                                name="name"
                                required
                                defaultValue={initialData?.name}
                                placeholder="e.g. Kerala Kitchen"
                                className='text-white'
                            />
                            <Input
                                className='text-white'
                                label="Area / Location"
                                name="area"
                                required
                                defaultValue={initialData?.area}
                                placeholder="e.g. Kakkanad, Kochi"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                className='text-white'
                                label="Price Range (per meal/month)"
                                name="priceRange"
                                required
                                defaultValue={initialData?.priceRange}
                                placeholder="e.g. 60 - 3000"
                            />
                            <Input
                                className='text-white'

                                label="Phone Number"
                                name="phone"
                                type="tel"
                                required
                                defaultValue={initialData?.phone}
                                placeholder="e.g. 9876543210"
                            />
                        </div>

                        <Input
                            className='text-white'
                            label="WhatsApp Link (Optional)"
                            name="whatsappLink"
                            defaultValue={initialData?.whatsappLink}
                            placeholder="e.g. https://wa.me/..."
                        />

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Logo / Image
                            </label>
                            <input
                                type="file"
                                name="logo"
                                accept="image/*"
                                className="cursor-pointer w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all border p-2 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">Weekly Menu</h3>
                            <label className="flex items-center cursor-pointer">
                                <span className="mr-2 text-sm font-medium text-foreground">Enable Menu</span>
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isMenuAvailable}
                                    onChange={(e) => setIsMenuAvailable(e.target.checked)}
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        {isMenuAvailable && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b">
                                    {DAYS.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => setActiveDay(day)}
                                            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${activeDay === day
                                                ? 'bg-primary text-white shadow-md'
                                                : 'bg-gray-100 dark:bg-gray-800 text-primary hover:bg-gray-200'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                                    {MEALS.map(meal => (
                                        <div key={meal} className="space-y-2">
                                            <h4 className="text-sm font-bold capitalize text-foreground/80">{meal}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <Input
                                                    placeholder="Item name (e.g. Appam & Stew)"
                                                    value={menu[activeDay][meal].item}
                                                    onChange={(e) => handleMenuChange(activeDay, meal, 'item', e.target.value)}
                                                    className="text-sm text-white"
                                                />
                                                <Input
                                                    placeholder="Short Description (Optional)"
                                                    value={menu[activeDay][meal].description}
                                                    onChange={(e) => handleMenuChange(activeDay, meal, 'description', e.target.value)}
                                                    className="text-sm text-white"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm">
                            {successMessage || (initialData ? 'Updated successfully!' : 'Submitted successfully! It will be visible after admin approval.')}
                        </div>
                    )}

                    <Button type="submit" className="w-full h-12 text-lg shadow-lg" disabled={loading}>
                        {loading ? 'Processing...' : submitLabel}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
