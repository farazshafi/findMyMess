'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { fetchMesses } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { AvatarFallback } from '../../components/AvatarFallback';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface IMenu {
    item: string;
    description: string;
}

interface IMealPlan {
    breakfast: IMenu;
    lunch: IMenu;
    dinner: IMenu;
}

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const EMPTY_MEAL_PLAN: IMealPlan = {
    breakfast: { item: '', description: '' },
    lunch: { item: '', description: '' },
    dinner: { item: '', description: '' }
};

function AdminContent() {
    const [messes, setMesses] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        area: '',
        priceRange: '',
        phone: '',
        whatsappLink: '',
        isMenuAvailable: false,
        logo: null as File | null
    });
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [weeklyMenu, setWeeklyMenu] = useState<Record<DayOfWeek, IMealPlan>>({
        monday: { ...EMPTY_MEAL_PLAN },
        tuesday: { ...EMPTY_MEAL_PLAN },
        wednesday: { ...EMPTY_MEAL_PLAN },
        thursday: { ...EMPTY_MEAL_PLAN },
        friday: { ...EMPTY_MEAL_PLAN },
        saturday: { ...EMPTY_MEAL_PLAN },
        sunday: { ...EMPTY_MEAL_PLAN }
    });

    const [activeDay, setActiveDay] = useState<DayOfWeek>('monday');

    useEffect(() => {
        loadMesses();
    }, []);

    async function loadMesses() {
        const data = await fetchMesses();
        setMesses(data);
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this mess?')) return;
        try {
            await fetch(`${API_BASE_URL}/messes/${id}`, { method: 'DELETE' });
            loadMesses();
        } catch (err) {
            alert('Failed to delete');
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('area', formData.area);
            formDataToSend.append('priceRange', formData.priceRange);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('whatsappLink', formData.whatsappLink);
            formDataToSend.append('isMenuAvailable', String(formData.isMenuAvailable));

            if (formData.logo) {
                formDataToSend.append('logo', formData.logo);
            }

            if (formData.isMenuAvailable) {
                formDataToSend.append('menu', JSON.stringify(weeklyMenu));
            }

            const res = await fetch(`${API_BASE_URL}/messes`, {
                method: 'POST',
                body: formDataToSend
            });

            if (res.ok) {
                alert('Mess added successfully!');
                setShowForm(false);
                loadMesses();
                // Reset form
                setFormData({
                    name: '',
                    area: '',
                    priceRange: '',
                    phone: '',
                    whatsappLink: '',
                    isMenuAvailable: false,
                    logo: null
                });
                setLogoPreview(null);
                setWeeklyMenu({
                    monday: { ...EMPTY_MEAL_PLAN },
                    tuesday: { ...EMPTY_MEAL_PLAN },
                    wednesday: { ...EMPTY_MEAL_PLAN },
                    thursday: { ...EMPTY_MEAL_PLAN },
                    friday: { ...EMPTY_MEAL_PLAN },
                    saturday: { ...EMPTY_MEAL_PLAN },
                    sunday: { ...EMPTY_MEAL_PLAN }
                });
                setActiveDay('monday');
            } else {
                alert('Failed to add mess. Please check the form.');
            }
        } catch (err) {
            alert('Error submitting form');
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.type === 'file') {
            const file = e.target.files?.[0] || null;
            setFormData({ ...formData, [field]: file });
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setLogoPreview(reader.result as string);
                reader.readAsDataURL(file);
            } else {
                setLogoPreview(null);
            }
        } else {
            const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            setFormData({ ...formData, [field]: value });
        }
    };

    const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement>, mealType: 'breakfast' | 'lunch' | 'dinner', field: 'item' | 'description') => {
        setWeeklyMenu(prev => ({
            ...prev,
            [activeDay]: {
                ...prev[activeDay],
                [mealType]: {
                    ...prev[activeDay][mealType],
                    [field]: e.target.value
                }
            }
        }));
    };

    return (
        <div className="min-h-screen p-8 sm:p-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary dark:text-light">Admin Dashboard</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Mess'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-8 max-w-4xl mx-auto">
                    <CardHeader><h2 className="text-xl font-bold">Add New Mess</h2></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input className='text-light placeholder:text-light/50' placeholder="Mess Name" value={formData.name} onChange={(e) => handleChange(e, 'name')} required />
                            <div className="grid grid-cols-2 gap-4">
                                <Input className='text-light placeholder:text-light/50' placeholder="Area" value={formData.area} onChange={(e) => handleChange(e, 'area')} required />
                                <Input className='text-light placeholder:text-light/50' placeholder="Price Range (e.g. 3000-4000)" value={formData.priceRange} onChange={(e) => handleChange(e, 'priceRange')} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input className='text-light placeholder:text-light/50' placeholder="Phone" value={formData.phone} onChange={(e) => handleChange(e, 'phone')} required />
                                <Input className='text-light placeholder:text-light/50' placeholder="WhatsApp Link (Optional)" value={formData.whatsappLink} onChange={(e) => handleChange(e, 'whatsappLink')} />
                            </div>

                            {/* Logo Upload */}
                            <div className="space-y-2 border p-4 rounded-lg">
                                <label className="block text-sm font-medium mb-1">Mess Logo (Needed)</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs text-white/40">No Logo</span>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleChange(e, 'logo')}
                                        className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent/80 cursor-pointer"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Menu Availability Toggle */}
                            <div className="flex items-center gap-2 border p-4 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="isMenuAvailable"
                                    checked={formData.isMenuAvailable}
                                    onChange={(e) => handleChange(e, 'isMenuAvailable')}
                                    className="w-5 h-5 accent-accent"
                                />
                                <label htmlFor="isMenuAvailable" className="font-semibold cursor-pointer select-none">Menu Available</label>
                            </div>

                            {/* Weekly Menu Editor */}
                            {formData.isMenuAvailable && (
                                <div className="space-y-4 border p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg">Weekly Menu</h3>

                                    {/* Day Tabs */}
                                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                                        {DAYS.map(day => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => setActiveDay(day)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${activeDay === day
                                                    ? 'bg-accent text-white'
                                                    : 'bg-white/10 hover:bg-white/20'
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Menu Inputs for Active Day */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
                                        {/* Breakfast */}
                                        <div className="space-y-2">
                                            <span className="text-sm font-bold text-accent">Breakfast</span>
                                            <Input
                                                className='text-light placeholder:text-light/50'
                                                placeholder="Item Name"
                                                value={weeklyMenu[activeDay].breakfast.item}
                                                onChange={(e) => handleMenuChange(e, 'breakfast', 'item')}
                                            />
                                            <Input
                                                className='text-light placeholder:text-light/50 text-sm'
                                                placeholder="Description (Optional)"
                                                value={weeklyMenu[activeDay].breakfast.description}
                                                onChange={(e) => handleMenuChange(e, 'breakfast', 'description')}
                                            />
                                        </div>

                                        {/* Lunch */}
                                        <div className="space-y-2">
                                            <span className="text-sm font-bold text-accent">Lunch</span>
                                            <Input
                                                className='text-light placeholder:text-light/50'
                                                placeholder="Item Name"
                                                value={weeklyMenu[activeDay].lunch.item}
                                                onChange={(e) => handleMenuChange(e, 'lunch', 'item')}
                                            />
                                            <Input
                                                className='text-light placeholder:text-light/50 text-sm'
                                                placeholder="Description (Optional)"
                                                value={weeklyMenu[activeDay].lunch.description}
                                                onChange={(e) => handleMenuChange(e, 'lunch', 'description')}
                                            />
                                        </div>

                                        {/* Dinner */}
                                        <div className="space-y-2">
                                            <span className="text-sm font-bold text-accent">Dinner</span>
                                            <Input
                                                className='text-light placeholder:text-light/50'
                                                placeholder="Item Name"
                                                value={weeklyMenu[activeDay].dinner.item}
                                                onChange={(e) => handleMenuChange(e, 'dinner', 'item')}
                                            />
                                            <Input
                                                className='text-light placeholder:text-light/50 text-sm'
                                                placeholder="Description (Optional)"
                                                value={weeklyMenu[activeDay].dinner.description}
                                                onChange={(e) => handleMenuChange(e, 'dinner', 'description')}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mt-2">
                                        Editing Menu for <span className="capitalize font-bold text-accent">{activeDay}</span>
                                    </p>
                                </div>
                            )}

                            <Button type="submit" className="w-full text-lg py-6 mt-4">Create Mess</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4">
                {messes.map((mess) => (
                    <Card key={mess._id} className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
                        <div className="flex items-center gap-4 w-full">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 shrink-0 border border-white/20">
                                {mess.logo ? (
                                    <img src={mess.logo.url} alt={mess.name} className="w-full h-full object-cover" />
                                ) : (
                                    <AvatarFallback name={mess.name} size="md" />
                                )}
                            </div>
                            <div className="grow">
                                <h3 className="text-xl font-bold">{mess.name}</h3>
                                <p className="text-sm text-gray-500">{mess.area} - {mess.priceRange}</p>
                                {mess.isMenuAvailable ? (
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-500 border border-green-500/30">
                                        Menu Available
                                    </span>
                                ) : (
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-500 border border-red-500/30">
                                        No Menu
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 sm:mt-0">
                            <Button variant="outline" size="sm" onClick={() => alert('Edit feature coming soon')}>Edit</Button>
                            <Button variant="secondary" size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(mess._id)}>Delete</Button>
                        </div>
                    </Card>
                ))}
                {messes.length === 0 && !showForm && <p className="text-center text-gray-500">No messes found.</p>}
            </div>
        </div>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AdminContent />
        </Suspense>
    );
}
