
import React, { useState, useEffect, useRef } from 'react';
import { 
  Crown, Sparkles, User, Star, LogOut, History, Bell, HelpCircle, 
  Edit2, Mail, Phone, Save, X, ShieldCheck, Trash2, Plus, Calendar, Check, Clock, MessageCircle,
  CreditCard as CardIcon, ChevronLeft, ChevronRight, Wifi, Smartphone, Camera, Lock
} from 'lucide-react';
import { generateWhatsAppLink } from './utils';
import { SITE_SETTINGS, REVIEWS_MOCK } from './data';
import { ReviewModal } from './components-widgets';
import { StarRating } from './components-ui';

export const ClientDashboard = ({ user, onLogout }: any) => {
    const [activeTab, setActiveTab] = useState('history');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewContext, setReviewContext] = useState<any>(null);
    const [showAddPayment, setShowAddPayment] = useState(false);
    
    // States local management for interactivity
    const [profileData, setProfileData] = useState<any>({});
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any>({});
    const [myReviews, setMyReviews] = useState<any[]>([]);
    
    // Payment Form State
    const [paymentType, setPaymentType] = useState('OM');
    
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            setProfileData({ ...user, firstName: user.name.split(' ')[0], lastName: user.name.split(' ').slice(1).join(' ') || '', nickname: user.name });
            setPaymentMethods(user.paymentMethods || []);
            setNotifications(user.preferences || {});
            setMyReviews(REVIEWS_MOCK.filter(r => r.userId === user.id));
        }
    }, [user]);

    const completedTripsCount = user?.history?.filter((h:any) => h.status === 'completed').length || 0;
    const tripsToReview = user?.history?.filter((h:any) => h.status === 'completed' && !h.reviewed) || [];

    // --- Actions ---

    const handleSaveProfile = () => {
        setIsEditingProfile(false);
        // Reconstruct full name for display consistency
        const fullName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || profileData.nickname;
        setProfileData(prev => ({...prev, name: fullName}));
        alert('Profil mis à jour avec succès');
    };

    const handleDeleteReview = (id: number) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet avis ?")) {
            setMyReviews(prev => prev.filter(r => r.id !== id));
            // Sync with global mock if needed
            const idx = REVIEWS_MOCK.findIndex(r => r.id === id);
            if (idx > -1) REVIEWS_MOCK.splice(idx, 1);
        }
    };

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const type = formData.get('type') as string;
        const number = formData.get('number') as string;
        
        // Logic specific detail display
        let detailDisplay = number;
        if (type === 'VISA') {
            detailDisplay = `•••• ${number.slice(-4)}`;
        }

        const newMethod = {
            id: `pm_${Date.now()}`,
            type: type as any,
            label: type === 'OM' ? 'Orange Money' : type === 'MOMO' ? 'MTN MoMo' : 'Visa',
            detail: detailDisplay,
            isDefault: paymentMethods.length === 0
        };
        setPaymentMethods([...paymentMethods, newMethod]);
        setShowAddPayment(false);
        setPaymentType('OM'); // Reset
    };

    const handleDeletePayment = (id: string) => {
        if(window.confirm("Supprimer ce moyen de paiement ?")) {
            setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
        }
    };

    const handleToggleNotification = (key: string) => {
        setNotifications((prev:any) => ({...prev, [key]: !prev[key]}));
    };

    const handleReviewSubmit = (reviewData: { rating: number, comment: string }) => {
        const newReview = {
            id: Date.now(),
            userId: user.id,
            tripId: reviewContext?.tripId,
            rating: reviewData.rating,
            date: new Date().toLocaleDateString('fr-FR'),
            comment: reviewData.comment,
            verified: true
        };
        setMyReviews([newReview, ...myReviews]);
        REVIEWS_MOCK.unshift(newReview);
        
        if(reviewContext?.tripId) {
             const h = user.history.find((x:any) => x.tripId === reviewContext.tripId);
             if(h) h.reviewed = true;
        }
    };

    const openReviewModal = (tripId?: number, tripTitle?: string) => {
        setReviewContext(tripId ? { tripId, tripTitle } : null);
        setShowReviewModal(true);
    };

    const tabs = [
        { id: 'history', label: 'Historique', icon: <History className="h-4 w-4"/> },
        { id: 'profile', label: 'Mon Profil', icon: <User className="h-4 w-4"/> },
        { id: 'payments', label: 'Portefeuille', icon: <CardIcon className="h-4 w-4"/> },
        { id: 'reviews', label: 'Avis', icon: <Star className="h-4 w-4"/> },
        { id: 'notifications', label: 'Alertes', icon: <Bell className="h-4 w-4"/> },
        { id: 'help', label: 'Aide', icon: <HelpCircle className="h-4 w-4"/> },
    ];

    const handleTabClick = (id: string, index: number) => {
        setActiveTab(id);
        window.scrollTo({top: 0, behavior: 'smooth'});
        if (scrollRef.current) {
            const buttons = scrollRef.current.querySelectorAll('button');
            if (buttons[index]) {
                buttons[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    };

    const scrollTabs = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    if (!user) return null;

    return (
        <div className="pt-24 pb-20 bg-gray-50 min-h-screen animate-fade-in-up">
            <ReviewModal 
                isOpen={showReviewModal} 
                onClose={() => setShowReviewModal(false)} 
                onSubmit={handleReviewSubmit}
                contextTitle={reviewContext ? reviewContext.tripTitle : `L'agence ${SITE_SETTINGS.agencyName}`}
            />

            {showAddPayment && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowAddPayment(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="h-4 w-4"/></button>
                        <h3 className="font-bold text-lg mb-4 text-brand-dark">Nouveau moyen de paiement</h3>
                        <form onSubmit={handleAddPayment} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Type de compte</label>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <label className="cursor-pointer">
                                        <input type="radio" name="type" value="OM" checked={paymentType === 'OM'} onChange={()=>setPaymentType('OM')} className="peer sr-only"/>
                                        <div className="p-2 rounded-lg border border-gray-200 peer-checked:border-[#FF7900] peer-checked:bg-orange-50 text-center text-xs font-bold transition-all">
                                            Orange
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input type="radio" name="type" value="MOMO" checked={paymentType === 'MOMO'} onChange={()=>setPaymentType('MOMO')} className="peer sr-only"/>
                                        <div className="p-2 rounded-lg border border-gray-200 peer-checked:border-[#FFCC00] peer-checked:bg-yellow-50 text-center text-xs font-bold transition-all">
                                            MTN
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input type="radio" name="type" value="VISA" checked={paymentType === 'VISA'} onChange={()=>setPaymentType('VISA')} className="peer sr-only"/>
                                        <div className="p-2 rounded-lg border border-gray-200 peer-checked:border-blue-800 peer-checked:bg-blue-50 text-center text-xs font-bold transition-all">
                                            Carte
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {paymentType === 'VISA' ? (
                                <>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Nom sur la carte</label>
                                        <input type="text" placeholder="EX: JEAN DUPONT" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium uppercase" required />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Numéro de carte</label>
                                        <div className="relative">
                                            <input name="number" type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium tracking-widest pl-10" required />
                                            <CardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Expiration</label>
                                            <input type="text" placeholder="MM/AA" maxLength={5} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-center" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">CVV</label>
                                            <input type="password" placeholder="123" maxLength={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-center" required />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Numéro Mobile ({paymentType})</label>
                                    <div className="relative">
                                        <input name="number" type="tel" placeholder="6..." maxLength={9} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium pl-10" required />
                                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1 mb-3"><Lock className="h-3 w-3"/> Sécurité bancaire SSL garantie</p>
                                <button className="w-full py-3 bg-brand-green text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4">
                {/* Header User */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-gold to-brand-green"></div>
                    <img src={profileData.avatar || user.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-serif font-bold text-brand-dark">{profileData.name}</h1>
                        <p className="text-gray-500 mb-2">{profileData.email}</p>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                             <span className="px-3 py-1 bg-brand-gold text-brand-dark rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Crown className="h-3 w-3"/> {user.tier}</span>
                             <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1"><Sparkles className="h-3 w-3"/> {user.points} pts</span>
                        </div>
                    </div>
                    <button onClick={onLogout} className="px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-bold text-sm flex items-center gap-2"><LogOut className="h-4 w-4"/> Déconnexion</button>
                </div>

                {/* Dashboard Navigation */}
                <div className="sticky top-20 z-30 bg-gray-50/95 backdrop-blur py-3 -mx-4 px-4 md:static md:bg-transparent md:p-0 md:mx-0 shadow-sm md:shadow-none group/tabs">
                    <div className="relative flex items-center">
                        <button onClick={() => scrollTabs('left')} className="absolute left-0 z-20 p-1.5 rounded-full bg-gradient-to-r from-white via-white to-transparent md:hidden text-gray-600"><ChevronLeft className="h-5 w-5"/></button>
                        <div ref={scrollRef} className="flex overflow-x-auto gap-3 pb-1 hide-scrollbar snap-x px-8 md:px-1 md:justify-start scroll-smooth">
                            {tabs.map((tab, idx) => (
                                <button 
                                    key={tab.id} 
                                    onClick={() => handleTabClick(tab.id, idx)} 
                                    className={`snap-start shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${activeTab === tab.id ? 'bg-brand-dark text-white shadow-md border-brand-dark' : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'}`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                         <button onClick={() => scrollTabs('right')} className="absolute right-0 z-20 p-1.5 rounded-full bg-gradient-to-l from-white via-white to-transparent md:hidden text-gray-600"><ChevronRight className="h-5 w-5"/></button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px] mt-6">
                    {/* ... (History and other tabs remain unchanged) ... */}
                    {activeTab === 'history' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h2 className="font-serif font-bold text-xl mb-4 text-brand-dark px-2">Vos Voyages</h2>
                            {user.history.length > 0 ? (
                                <div className="space-y-4">
                                    {user.history.map((trip: any) => (
                                        <div key={trip.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
                                            {trip.status === 'completed' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"/>}
                                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-brand-light group-hover:text-brand-green transition-colors">
                                                <Calendar className="h-7 w-7"/>
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-lg text-brand-dark">{trip.tripTitle}</h3>
                                                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full w-fit mx-auto md:mx-0 ${trip.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {trip.status === 'completed' ? 'Terminé' : 'À venir'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">Réf: {trip.id} • Date: {trip.date}</p>
                                            </div>
                                            {trip.status === 'completed' && !trip.reviewed && (
                                                <button onClick={() => openReviewModal(trip.tripId, trip.tripTitle)} className="px-4 py-2 bg-brand-light text-brand-dark border border-brand-gold/30 rounded-xl font-bold text-sm hover:bg-white transition-colors flex items-center gap-2 shadow-sm">
                                                    <Star className="h-4 w-4 text-brand-gold"/> Noter
                                                </button>
                                            )}
                                            {trip.status === 'completed' && trip.reviewed && (
                                                <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg"><Check className="h-3 w-3"/> Avis publié</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4"/>
                                    <p className="text-gray-500">Aucun voyage dans votre historique.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif font-bold text-xl text-brand-dark">Informations Personnelles</h2>
                                <button onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)} className={`text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isEditingProfile ? 'bg-brand-green text-white' : 'bg-gray-100 text-brand-dark hover:bg-gray-200'}`}>
                                    {isEditingProfile ? <><Save className="h-4 w-4"/> Enregistrer</> : <><Edit2 className="h-4 w-4"/> Modifier</>}
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Prénom</label>
                                    <input 
                                        type="text" 
                                        value={profileData.firstName || ''} 
                                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                                        disabled={!isEditingProfile} 
                                        className={`w-full p-3 rounded-xl border transition-all ${isEditingProfile ? 'bg-white border-brand-green ring-2 ring-brand-green/10' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Nom</label>
                                    <input 
                                        type="text" 
                                        value={profileData.lastName || ''} 
                                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                                        disabled={!isEditingProfile} 
                                        className={`w-full p-3 rounded-xl border transition-all ${isEditingProfile ? 'bg-white border-brand-green ring-2 ring-brand-green/10' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Pseudo (Affiché)</label>
                                    <input 
                                        type="text" 
                                        value={profileData.nickname || ''} 
                                        onChange={(e) => setProfileData({...profileData, nickname: e.target.value})}
                                        disabled={!isEditingProfile} 
                                        className={`w-full p-3 rounded-xl border transition-all ${isEditingProfile ? 'bg-white border-brand-green ring-2 ring-brand-green/10' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Photo URL</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={profileData.avatar || ''} 
                                            onChange={(e) => setProfileData({...profileData, avatar: e.target.value})}
                                            disabled={!isEditingProfile} 
                                            className={`w-full p-3 rounded-xl border pl-10 transition-all ${isEditingProfile ? 'bg-white border-brand-green ring-2 ring-brand-green/10' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                        />
                                        <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Email</label>
                                    <input type="email" value={profileData.email} disabled className="w-full p-3 bg-gray-100 rounded-xl border border-gray-200 text-gray-400 font-medium cursor-not-allowed"/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Téléphone</label>
                                    <input 
                                        type="text" 
                                        value={profileData.phone || ""} 
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                        disabled={!isEditingProfile} 
                                        className={`w-full p-3 rounded-xl border transition-all ${isEditingProfile ? 'bg-white border-brand-green ring-2 ring-brand-green/10' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                        placeholder="+237 ..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Ville de résidence</label>
                                    <input 
                                        type="text" 
                                        value={profileData.city || ""} 
                                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                                        disabled={!isEditingProfile} 
                                        className={`w-full p-3 rounded-xl border transition-all ${isEditingProfile ? 'bg-white border-brand-green ring-2 ring-brand-green/10' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                        placeholder="Douala, Cameroun"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif font-bold text-xl text-brand-dark">Mon Portefeuille</h2>
                                <button onClick={() => setShowAddPayment(true)} className="text-sm font-bold text-brand-green flex items-center gap-1 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
                                    <Plus className="h-4 w-4"/> Ajouter
                                </button>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                {paymentMethods.map((pm: any) => (
                                    <div key={pm.id} className={`relative p-6 rounded-2xl text-white shadow-lg overflow-hidden transition-transform hover:scale-[1.02] group ${pm.type === 'OM' ? 'bg-gradient-to-br from-[#FF7900] to-[#FF9E4D]' : pm.type === 'MOMO' ? 'bg-gradient-to-br from-[#FFCC00] to-[#FDB913] text-black' : 'bg-gradient-to-br from-[#1a1f71] to-[#2b3595]'}`}>
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-2">
                                                {pm.type === 'VISA' ? <CardIcon className="h-6 w-6"/> : <Smartphone className="h-6 w-6"/>}
                                                <span className="font-bold tracking-wider">{pm.label}</span>
                                            </div>
                                            {pm.type === 'VISA' ? <Wifi className="h-6 w-6 opacity-70"/> : <div className="h-6 w-6 rounded-full border-2 border-current opacity-30"/>}
                                        </div>
                                        <p className="font-mono text-xl tracking-widest mb-4">{pm.detail}</p>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] uppercase opacity-80">Enregistré</span>
                                            <button onClick={() => handleDeletePayment(pm.id)} className="p-2 bg-white/20 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="h-4 w-4"/></button>
                                        </div>
                                        {/* Décoration */}
                                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                                    </div>
                                ))}
                                
                                {/* Carte Ajout Rapide */}
                                <button onClick={() => setShowAddPayment(true)} className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-brand-green hover:text-brand-green hover:bg-green-50/50 transition-all min-h-[180px]">
                                    <Plus className="h-8 w-8 mb-2"/>
                                    <span className="font-bold text-sm">Ajouter un compte</span>
                                </button>
                            </div>
                            
                            {paymentMethods.length > 0 && (
                                <p className="text-xs text-gray-400 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-500"/> Vos informations de paiement sont chiffrées et stockées de manière sécurisée.</p>
                            )}
                        </div>
                    )}

                    {/* ... (Reviews, Notifications, Help remain unchanged) ... */}
                    {activeTab === 'reviews' && (
                         <div className="space-y-8 animate-fade-in-up">
                            {tripsToReview.length > 0 && (
                                <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
                                    <h3 className="font-serif font-bold text-lg text-orange-900 mb-4 flex items-center gap-2">
                                        <Star className="h-5 w-5 fill-orange-400 text-orange-400"/> En attente de votre avis
                                    </h3>
                                    <div className="grid gap-3">
                                        {tripsToReview.map((trip:any) => (
                                            <div key={`pending-${trip.id}`} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                                                <div>
                                                    <p className="font-bold text-brand-dark">{trip.tripTitle}</p>
                                                    <p className="text-xs text-gray-500">{trip.date}</p>
                                                </div>
                                                <button onClick={() => openReviewModal(trip.tripId, trip.tripTitle)} className="px-4 py-2 bg-brand-dark text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">
                                                    Noter
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center px-2">
                                <h2 className="font-serif font-bold text-xl text-brand-dark">Mon Historique d'Avis</h2>
                                {completedTripsCount >= 2 && (
                                    <button onClick={() => openReviewModal()} className="px-5 py-2.5 bg-brand-gold text-brand-dark rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-white hover:scale-105 transition-all">
                                        <MessageCircle className="h-4 w-4"/> Noter l'Agence Life Travel
                                    </button>
                                )}
                            </div>

                            {myReviews.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {myReviews.map(review => (
                                        <div key={review.id} className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group relative">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-bold text-brand-dark text-sm">{review.tripId ? (user.history.find((h:any)=>h.tripId===review.tripId)?.tripTitle || 'Voyage') : `Avis Life Travel Global`}</p>
                                                    <p className="text-xs text-gray-400">{review.date}</p>
                                                </div>
                                                <StarRating rating={review.rating} size="sm"/>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl mb-3 border border-gray-100 relative">
                                                <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                                            </div>
                                            <button onClick={() => handleDeleteReview(review.id)} className="absolute bottom-6 right-6 text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 className="h-4 w-4"/></button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <MessageCircle className="h-10 w-10 text-gray-300 mx-auto mb-2"/>
                                    <p className="text-gray-500">Vous n'avez pas encore laissé d'avis.</p>
                                    <p className="text-xs text-gray-400 mt-1">Vos retours sont précieux pour la communauté.</p>
                                </div>
                            )}
                         </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up">
                            <h2 className="font-serif font-bold text-xl mb-6 text-brand-dark">Préférences de Notification</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onClick={() => handleToggleNotification('emailMarketing')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Mail className="h-5 w-5"/></div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">Email Marketing</p>
                                            <p className="text-xs text-gray-500">Offres exclusives et news</p>
                                        </div>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${notifications.emailMarketing ? 'bg-brand-green' : 'bg-gray-300'}`}>
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${notifications.emailMarketing ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onClick={() => handleToggleNotification('whatsappUpdates')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><MessageCircle className="h-5 w-5"/></div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">WhatsApp</p>
                                            <p className="text-xs text-gray-500">Confirmations instantanées</p>
                                        </div>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${notifications.whatsappUpdates ? 'bg-brand-green' : 'bg-gray-300'}`}>
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${notifications.whatsappUpdates ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onClick={() => handleToggleNotification('smsAlerts')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Phone className="h-5 w-5"/></div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">SMS</p>
                                            <p className="text-xs text-gray-500">Alertes urgentes (Sécurité)</p>
                                        </div>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${notifications.smsAlerts ? 'bg-brand-green' : 'bg-gray-300'}`}>
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${notifications.smsAlerts ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'help' && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up text-center">
                            <HelpCircle className="h-12 w-12 text-brand-gold mx-auto mb-4"/>
                            <h2 className="font-serif font-bold text-xl mb-2 text-brand-dark">Besoin d'assistance ?</h2>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">Notre équipe est disponible 7j/7 pour répondre à vos questions concernant vos réservations ou votre compte.</p>
                            <button onClick={() => window.open(generateWhatsAppLink('default'), '_blank')} className="px-8 py-3 bg-[#25D366] text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto">
                                <MessageCircle className="h-5 w-5"/> Contacter le Support WhatsApp
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
