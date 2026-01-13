'use client';

import React, { useState, useEffect } from 'react';
import { fetchPendingMesses, updateMessStatus, deleteMess, createMess, fetchAllMesses, updateMess } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { AvatarFallback } from '../../components/AvatarFallback';
import { MessForm } from '../../components/MessForm';

type Tab = 'submissions' | 'all-messes';

export default function AdminDashboard() {
    const [adminKey, setAdminKey] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [messes, setMesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMess, setSelectedMess] = useState<any | null>(null);
    const [editMess, setEditMess] = useState<any | null>(null);
    const [activeMenuDay, setActiveMenuDay] = useState('monday');
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('submissions');
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminKey) {
            setIsAuthenticated(true);
            loadData('submissions');
        }
    };

    const loadData = async (tab: Tab) => {
        setLoading(true);
        setError(null);
        try {
            let data;
            if (tab === 'submissions') {
                data = await fetchPendingMesses(adminKey);
            } else {
                data = await fetchAllMesses(undefined, adminKey);
            }
            setMesses(data);
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadData(activeTab);
        }
    }, [activeTab, isAuthenticated]);

    const handleAddMess = async (formData: FormData) => {
        try {
            await createMess(formData, adminKey);
            setShowAddForm(false);
            alert('Mess created and published successfully!');
            loadData(activeTab);
        } catch (err: any) {
            alert(err.message || 'Failed to create mess');
        }
    };

    const handleUpdateMess = async (formData: FormData) => {
        if (!editMess) return;
        try {
            await updateMess(editMess._id, formData, adminKey);
            setEditMess(null);
            alert('Mess updated successfully!');
            loadData(activeTab);
        } catch (err: any) {
            alert(err.message || 'Failed to update mess');
        }
    };

    const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED' | 'DELETE') => {
        try {
            if (action === 'DELETE') {
                if (confirm('Are you sure you want to delete this mess?')) {
                    await deleteMess(id, adminKey);
                } else return;
            } else {
                await updateMessStatus(id, action, adminKey);
            }
            setMesses(messes.filter(m => m._id !== id));
            if (selectedMess?._id === id) setSelectedMess(null);
        } catch (err: any) {
            alert(err.message || 'Action failed');
        }
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="max-w-md w-full border-foreground/10 shadow-2xl">
                    <CardContent className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black text-primary">Admin Access</h1>
                            <p className="text-foreground/40 text-sm mt-2">Enter your secret key to continue</p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <Input
                                label="Admin Secret Key"
                                type="password"
                                value={adminKey}
                                onChange={(e) => setAdminKey(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="bg-foreground/5"
                            />
                            <Button type="submit" className="w-full h-12 shadow-xl shadow-primary/20 font-bold">
                                Authentication
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const filteredMesses = messes.filter((m: any) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const NavItem = ({ tab, icon, label }: { tab: Tab, icon: string, label: string }) => (
        <button
            onClick={() => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === tab
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'hover:bg-foreground/5 text-foreground/50'
                }`}
        >
            <span className="text-xl group-hover:scale-120 transition-transform">{icon}</span>
            <span className="font-bold text-sm lg:opacity-100 transition-opacity whitespace-nowrap overflow-hidden">
                {label}
            </span>
        </button>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-foreground/10 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <h2 className="text-xl font-black text-primary">findMyMess</h2>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-foreground/5 rounded-xl text-2xl"
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-foreground/10 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:w-20 lg:hover:w-64 group/sidebar
            `}>
                <div className="p-6 h-20 flex items-center lg:justify-center lg:group-hover/sidebar:justify-start overflow-hidden">
                    <h2 className="text-xl font-black text-primary whitespace-nowrap">f<span className="lg:hidden lg:group-hover/sidebar:inline">indMyMess</span></h2>
                </div>

                <nav className="flex-1 p-4 space-y-3">
                    <NavItem tab="submissions" icon="📨" label="Submissions" />
                    <NavItem tab="all-messes" icon="🏢" label="All Messes" />
                </nav>

                <div className="p-4 border-t border-foreground/10">
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold overflow-hidden"
                    >
                        <span className="text-xl">🚪</span>
                        <span className="text-sm lg:hidden lg:group-hover/sidebar:inline">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-foreground/2">
                <header className="p-8 border-b border-foreground/10 bg-background/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold capitalize">{activeTab.replace('-', ' ')}</h1>
                            <p className="text-foreground/50 text-sm mt-1">
                                {activeTab === 'submissions' ? 'Manage pending mess requests' : 'Manage all listings in the system'}
                            </p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative grow md:w-64">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 bg-foreground/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button
                                className="bg-primary text-white shrink-0"
                                onClick={() => setShowAddForm(true)}
                            >
                                + New Mess
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto">
                    {loading ? (
                        <div className="text-center py-24">
                            <div className="animate-spin text-primary text-4xl mb-4">🌀</div>
                            <p className="text-foreground/40">Loading data...</p>
                        </div>
                    ) : filteredMesses.length === 0 ? (
                        <div className="text-center py-24 bg-background rounded-3xl border-2 border-dashed border-foreground/10">
                            <p className="text-foreground/40 text-lg">No records found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredMesses.map((mess: any) => (
                                <Card key={mess._id} className="overflow-hidden hover:shadow-xl transition-all border-foreground/5 group">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row items-center p-5 gap-6">
                                            <div className="w-20 h-20 rounded-2xl bg-foreground/5 shrink-0 overflow-hidden relative shadow-inner">
                                                {mess.logo ? (
                                                    <img src={mess.logo.url} alt={mess.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <AvatarFallback name={mess.name} size="xl" />
                                                )}
                                            </div>
                                            <div className="grow text-center md:text-left">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-xl font-bold">{mess.name}</h3>
                                                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${mess.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
                                                        mess.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-red-500/10 text-red-500'
                                                        }`}>
                                                        {mess.status}
                                                    </span>
                                                </div>
                                                <p className="text-foreground/50 text-sm">📍 {mess.area}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button
                                                    className="p-2.5 rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all"
                                                    title="View Details"
                                                    onClick={() => setSelectedMess(mess)}
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                                                    title="Edit Mess"
                                                    onClick={() => setEditMess(mess)}
                                                >
                                                    ✏️
                                                </button>
                                                {activeTab === 'submissions' && (
                                                    <button
                                                        className="p-2.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                                                        title="Approve"
                                                        onClick={() => handleAction(mess._id, 'APPROVED')}
                                                    >
                                                        ✅
                                                    </button>
                                                )}
                                                <button
                                                    className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                    title="Delete"
                                                    onClick={() => handleAction(mess._id, 'DELETE')}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-foreground/2 px-6 py-3 border-t border-foreground/5 text-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-foreground/40">
                                            <div><span className="font-semibold text-foreground/60">Phone:</span> {mess.phone}</div>
                                            <div><span className="font-semibold text-foreground/60">Price:</span> {mess.priceRange}</div>
                                            <div className="col-span-2 text-right"><span className="font-semibold text-foreground/60">ID:</span> {mess._id}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Mess Details Modal */}
            {selectedMess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200 border border-foreground/10">
                        <button
                            onClick={() => setSelectedMess(null)}
                            className="absolute top-6 right-6 p-2 hover:bg-foreground/5 cursor-pointer rounded-full text-foreground transition-all z-10"
                        >
                            ✕
                        </button>

                        <div className="p-10">
                            {/* Modal Header */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 border-b border-foreground/10 pb-10">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-foreground/5 shrink-0 border-4 border-background shadow-xl">
                                    {selectedMess.logo ? (
                                        <img src={selectedMess.logo.url} alt={selectedMess.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <AvatarFallback name={selectedMess.name} size="xl" />
                                    )}
                                </div>
                                <div className="grow text-center md:text-left">
                                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-2">
                                        <h2 className="text-4xl font-black text-primary">{selectedMess.name}</h2>
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                            {selectedMess.status}
                                        </span>
                                    </div>
                                    <p className="text-xl text-foreground/50">📍 {selectedMess.area}</p>
                                    <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                                        <div className="bg-background px-4 py-2 rounded-2xl shadow-sm border border-foreground/5">
                                            <p className="text-xs text-foreground/30 font-bold uppercase">Price Range</p>
                                            <p className="font-black text-primary">₹ {selectedMess.priceRange}</p>
                                        </div>
                                        <div className="bg-background px-4 py-2 rounded-2xl shadow-sm border border-foreground/5">
                                            <p className="text-xs text-foreground/30 font-bold uppercase">Contact</p>
                                            <p className="font-black text-foreground/80">{selectedMess.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold">Weekly Menu</h3>
                                        {!selectedMess.isMenuAvailable && (
                                            <span className="text-xs bg-red-500/10 text-red-500 px-3 py-1 rounded-full font-bold">Unavailable</span>
                                        )}
                                    </div>

                                    {selectedMess.isMenuAvailable && selectedMess.menu ? (
                                        <div className="space-y-6">
                                            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                                    <button
                                                        key={day}
                                                        onClick={() => setActiveMenuDay(day)}
                                                        className={`px-5 py-2.5 rounded-2xl text-sm font-bold capitalize whitespace-nowrap transition-all ${activeMenuDay === day
                                                            ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105'
                                                            : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/50'
                                                            }`}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="bg-foreground/3 p-8 rounded-3xl space-y-8 border border-foreground/5">
                                                {['breakfast', 'lunch', 'dinner'].map(meal => (
                                                    <div key={meal} className="flex gap-6 items-start group">
                                                        <div className="w-24 shrink-0">
                                                            <div className="text-[10px] font-black uppercase text-primary/40 tracking-wider mb-1">{meal}</div>
                                                            <div className="w-10 h-1 bg-primary/20 rounded-full group-hover:w-full transition-all duration-500"></div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-xl text-foreground/80 mb-1">{selectedMess.menu[activeMenuDay]?.[meal]?.item || 'Not set'}</div>
                                                            <div className="text-sm text-foreground/40 leading-relaxed font-medium">{selectedMess.menu[activeMenuDay]?.[meal]?.description || 'No description provided'}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-foreground/2 rounded-3xl text-foreground/30 italic font-medium border-2 border-dashed border-foreground/5">
                                            Menu details haven't been provided for this mess.
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-background p-8 rounded-3xl border border-foreground/10 shadow-xl flex flex-col gap-4">
                                        <h3 className="font-black text-xs uppercase tracking-widest text-foreground/30">Action Center</h3>

                                        {selectedMess.status !== 'APPROVED' && (
                                            <Button
                                                className="w-full h-12 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 text-white font-bold"
                                                onClick={() => handleAction(selectedMess._id, 'APPROVED')}
                                            >
                                                Approve Mess
                                            </Button>
                                        )}

                                        <Button
                                            variant="outline"
                                            className="w-full h-12 border-primary/20 text-primary hover:bg-primary/5 font-bold"
                                            onClick={() => {
                                                setEditMess(selectedMess);
                                                setSelectedMess(null);
                                            }}
                                        >
                                            Edit Details
                                        </Button>

                                        {selectedMess.status === 'APPROVED' && (
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 border-yellow-500/20 text-yellow-600 hover:bg-yellow-500/5 font-bold"
                                                onClick={() => handleAction(selectedMess._id, 'REJECTED')}
                                            >
                                                Unpublish / Reject
                                            </Button>
                                        )}

                                        <div className="pt-4 mt-4 border-t border-foreground/5">
                                            <Button
                                                className="w-full h-12 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 text-white font-bold"
                                                onClick={() => handleAction(selectedMess._id, 'DELETE')}
                                            >
                                                Delete Permanent
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10">
                                        <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-wider mb-2">Meta Info</h4>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between"><span className="text-foreground/30">Created:</span> <span className="font-bold">{new Date(selectedMess.createdAt).toLocaleDateString()}</span></div>
                                            <div className="flex justify-between"><span className="text-foreground/30">Last Update:</span> <span className="font-bold">{new Date(selectedMess.updatedAt).toLocaleDateString()}</span></div>
                                            <div className="flex justify-between"><span className="text-foreground/30">V1.5 ID:</span> <span className="font-mono text-[10px] truncate ml-4">{selectedMess._id}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Mess Modal */}
            {editMess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200 border border-foreground/10">
                        <button
                            onClick={() => setEditMess(null)}
                            className="absolute top-6 right-6 p-2 hover:bg-foreground/5 cursor-pointer rounded-full text-foreground transition-all z-10"
                        >
                            ✕
                        </button>

                        <div className="p-10">
                            <MessForm
                                onSubmit={handleUpdateMess}
                                initialData={editMess}
                                submitLabel="Save Changes"
                                successMessage="Mess updated successfully!"
                                description={`Editing: ${editMess.name}`}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Mess Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200 border border-foreground/10">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-foreground/5 cursor-pointer rounded-full text-foreground transition-all z-10"
                        >
                            ✕
                        </button>

                        <div className="p-10">
                            <MessForm
                                onSubmit={handleAddMess}
                                submitLabel="Create Mess"
                                successMessage="Mess created and published successfully!"
                                description="Add a new mess entry directly to the system. Submissions from admin are automatically approved."
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
