
import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, Clock, Minus, Plus, Gem, Check, X, 
  ShoppingCart, MessageCircle, ArrowRight, Star, ChevronLeft, ChevronRight, Calendar, ShoppingBag, Users, ShieldCheck, Sparkles, PenTool, Lock, AlertCircle,
  Zap, Info, Plane, UserCheck, Shield, Crown, RefreshCcw, CheckCircle2, Heart, Briefcase, Baby
} from 'lucide-react';
import { optimizeImage, formatPrice, generateWhatsAppLink } from './utils';
import { REVIEWS_MOCK, MOCK_USERS_DB, Trip, AgendaEvent, CartItem, TripOption } from './data';
import { RelatedTrips } from './components-widgets';
import { StarRating } from './components-ui';

// --- CALENDAR VIEW (AGENDA) ---
export const CalendarView = ({ onSelectProduct, onCreatePrivate, allTrips, allEvents }: any) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const eventsByMonth = useMemo(() => {
        return allEvents.filter((e: AgendaEvent) => 
            e.date.getMonth() === selectedMonth.getMonth() && 
            e.date.getFullYear() === selectedMonth.getFullYear()
        ).sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
    }, [selectedMonth, allEvents]);

    const changeMonth = (delta: number) => {
        const newDate = new Date(selectedMonth);
        newDate.setMonth(newDate.getMonth() + delta);
        setSelectedMonth(newDate);
    };

    return (
        <div className="pt-24 pb-20 bg-gray-50 min-h-screen animate-fade-in-up">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-2">Agenda des Départs</h1>
                    <p className="text-gray-600 text-sm md:text-base">Rejoignez nos petits groupes pour des aventures conviviales à prix doux.</p>
                </div>

                <div className="flex items-center justify-center gap-6 mb-8 bg-white p-2 rounded-full shadow-sm w-fit mx-auto border border-gray-100">
                    <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="h-5 w-5 text-gray-600"/></button>
                    <h2 className="text-lg md:text-xl font-bold text-brand-dark w-40 text-center capitalize">
                        {selectedMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight className="h-5 w-5 text-gray-600"/></button>
                </div>

                {eventsByMonth.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {eventsByMonth.map((ev: AgendaEvent) => {
                            const trip = allTrips.find((t: Trip) => t.id === ev.tripId);
                            if (!trip) return null;
                            return (
                                <div key={ev.id} onClick={() => onSelectProduct(trip, ev.date)} className="relative h-72 rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300">
                                    <img src={optimizeImage(trip.image, 600)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                    
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-brand-dark px-4 py-2 rounded-2xl text-center shadow-lg border border-white/50 min-w-[70px]">
                                        <p className="text-xs font-bold uppercase text-gray-500 leading-none mb-1">{ev.date.toLocaleDateString('fr-FR', {weekday: 'short'})}</p>
                                        <p className="text-3xl font-bold leading-none">{ev.date.getDate()}</p>
                                    </div>

                                    <div className="absolute top-4 right-4 bg-brand-green/90 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white/20 flex items-center gap-1">
                                        <Users className="h-3 w-3"/> {trip.spots} places
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <div className="flex items-center gap-2 mb-1 opacity-80">
                                            <Clock className="h-3 w-3 text-brand-gold"/>
                                            <span className="text-xs font-bold uppercase tracking-wider">{trip.duration}</span>
                                        </div>
                                        <h3 className="font-serif font-bold text-2xl leading-tight mb-3">{trip.title}</h3>
                                        <div className="flex justify-between items-end border-t border-white/20 pt-3">
                                            <div className="flex items-center gap-1 text-gray-300 text-xs font-medium">
                                                <MapPin className="h-3 w-3"/> {trip.location}
                                            </div>
                                            <span className="text-lg font-bold text-brand-gold">{trip.priceDisplay}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 mx-4">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun départ groupé</h3>
                        <p className="text-gray-500 text-base mb-8 max-w-md mx-auto">Aucune date n'est prévue pour ce mois, mais vous pouvez partir quand vous voulez en mode privé.</p>
                        <button onClick={onCreatePrivate} className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold hover:bg-black transition-colors shadow-xl flex items-center gap-2 mx-auto hover:scale-105 transform duration-200">
                            <Gem className="h-4 w-4 text-brand-gold"/> Créer un départ privé
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- PRODUCT DETAIL VIEW ---
export const ProductDetailView = ({ trip, initialDate, onBack, addToCart, onSelectTrip, addToast, onCreatePrivate, allEvents, allTrips, editingItem }: any) => {
    
    const [bookingMode, setBookingMode] = useState<'group' | 'private'>(initialDate ? 'group' : 'private');
    
    // Dates Management
    const [selectedDateId, setSelectedDateId] = useState<string>(initialDate ? initialDate.toISOString() : "");
    
    const [participants, setParticipants] = useState(bookingMode === 'private' ? 2 : 1);
    const [selectedOptions, setSelectedOptions] = useState<{[key:string]: number}>({});

    // Review Slider State
    const [reviewIndex, setReviewIndex] = useState(0);

    // Effect to populate state if editingItem is provided
    useEffect(() => {
        if (editingItem) {
            setParticipants(editingItem.participants);
            setSelectedOptions(editingItem.options);
            setBookingMode(editingItem.trip.type === 'Privé' ? 'private' : 'group');

            if (editingItem.trip.type === 'Groupe') {
                const matchedEvent = allEvents.find((e:AgendaEvent) => 
                    e.tripId === trip.id && 
                    e.date.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}) === editingItem.date
                );
                if (matchedEvent) setSelectedDateId(matchedEvent.date.toISOString());
            }
        }
    }, [editingItem, allEvents, trip]);

    const upcomingDates = useMemo(() => {
        if (!allEvents) return [];
        return allEvents
            .filter((e: AgendaEvent) => e.tripId === trip.id && e.date > new Date())
            .sort((a:any, b:any) => a.date.getTime() - b.date.getTime())
            .slice(0, 5);
    }, [trip, allEvents]);

    // Sorted Reviews
    const sortedReviews = useMemo(() => {
        return REVIEWS_MOCK
            .filter(r => r.tripId === trip.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [trip.id]);

    const currentReviews = sortedReviews.slice(reviewIndex, reviewIndex + 3);

    const handleNextReview = () => {
        if (reviewIndex + 3 < sortedReviews.length) setReviewIndex(reviewIndex + 3);
    };

    const handlePrevReview = () => {
        if (reviewIndex - 3 >= 0) setReviewIndex(reviewIndex - 3);
    };

    const handleModeSwitch = (mode: 'group' | 'private') => {
        setBookingMode(mode);
        if (mode === 'group') {
            setParticipants(1);
            if (upcomingDates.length > 0) {
                setSelectedDateId(upcomingDates[0].date.toISOString());
            } else {
                setSelectedDateId("");
            }
        } else {
            setParticipants(2); 
        }
    };

    const currentPrice = useMemo(() => {
        if (bookingMode === 'private') {
            return trip.type === 'Groupe' ? Math.round(trip.basePrice * 1.4) : trip.basePrice;
        }
        return trip.basePrice;
    }, [bookingMode, trip]);

    const totalPrice = useMemo(() => {
        if (bookingMode === 'private') return 0; // Calcul dynamique dans le Wizard plus tard, affiché "Sur devis" ici
        
        let total = currentPrice * participants;

        if (trip.availableOptions) {
            trip.availableOptions.forEach((opt: TripOption) => {
                if (selectedOptions[opt.id]) {
                     if (opt.type === 'checkbox') total += opt.price * participants; 
                     else total += opt.price * selectedOptions[opt.id];
                }
            });
        }
        return total;
    }, [currentPrice, participants, selectedOptions, trip, bookingMode]);

    const toggleOption = (optId: string, type: string) => {
        if (type === 'checkbox') setSelectedOptions(prev => ({...prev, [optId]: prev[optId] ? 0 : 1}));
    };
    const updateOptionQty = (optId: string, delta: number) => {
        setSelectedOptions(prev => ({...prev, [optId]: Math.max(0, (prev[optId] || 0) + delta)}));
    };

    const handleMainAction = () => {
        if (bookingMode === 'private') {
            // REDIRECTION VERS LE WIZARD AVEC DESTINATION PRÉ-REMPLIE
            onCreatePrivate(trip.location);
        } else {
            if (!selectedDateId) return addToast('error', 'Veuillez sélectionner une date.');
            
            const finalDate = new Date(selectedDateId).toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});

            addToCart({
                id: editingItem ? editingItem.id : `item-${Date.now()}`,
                trip: { ...trip, type: 'Groupe', priceDisplay: formatPrice(currentPrice) },
                date: finalDate,
                participants,
                options: selectedOptions,
                totalPrice,
                tripTitle: `${trip.title} (Groupe)`
            });
        }
    };

    const selectedDateDisplay = useMemo(() => {
        if (!selectedDateId) return "...";
        return new Date(selectedDateId).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'});
    }, [selectedDateId]);

    return (
        <div className="pt-0 bg-brand-light min-h-screen animate-fade-in-up pb-32 md:bg-white">
            
            {/* HERO IMAGE */}
            <div className="h-[45vh] md:h-[60vh] relative group w-full">
                <img src={optimizeImage(trip.image, 1200)} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                
                <button onClick={onBack} className="absolute top-6 left-6 md:top-8 md:left-8 p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-all text-white hover:text-brand-dark z-20 shadow-lg border border-white/20">
                    <ArrowRight className="h-6 w-6 rotate-180"/>
                </button>

                {/* Titre Mobile */}
                <div className="absolute bottom-16 left-0 w-full px-6 text-white md:hidden">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-brand-gold text-brand-dark font-bold text-[10px] uppercase rounded tracking-wider shadow-sm">{trip.category}</span>
                        {bookingMode === 'private' && (
                            <span className="px-2 py-0.5 bg-brand-dark text-brand-gold font-bold text-[10px] uppercase rounded flex items-center gap-1 border border-brand-gold/30">
                                <Gem className="h-3 w-3"/> Privé
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-serif font-bold leading-none shadow-black drop-shadow-md">{trip.title}</h1>
                    {/* Indicateurs de prestige Mobile */}
                    <div className="flex gap-2 mt-2">
                        {trip.suitability?.map((tag: string, i: number) => (
                           <span key={i} className="flex items-center gap-1 text-[10px] font-bold bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-0.5 rounded-full text-brand-light">
                              <Star className="w-2.5 h-2.5 text-brand-gold fill-brand-gold" /> {tag}
                           </span>
                        ))}
                    </div>
                </div>

                {/* Titre Desktop */}
                <div className="absolute bottom-0 left-0 w-full p-12 text-white pb-16 hidden md:block">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-brand-gold text-brand-dark font-bold text-xs uppercase rounded-md tracking-wider shadow-lg">{trip.category}</span>
                            {bookingMode === 'private' && (
                                <span className="px-3 py-1 bg-brand-dark text-brand-gold font-bold text-xs uppercase rounded-md flex items-center gap-1 border border-brand-gold/30">
                                    <Gem className="h-3 w-3"/> Mode Privé VIP
                                </span>
                            )}
                        </div>
                        <h1 className="text-5xl font-serif font-bold mb-4 leading-tight">{trip.title}</h1>
                        <div className="flex items-center gap-6 text-base font-medium text-gray-200">
                            <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-brand-gold"/> {trip.location}</span>
                            <span className="flex items-center gap-2"><Clock className="h-5 w-5 text-brand-gold"/> {trip.duration}</span>
                            
                            {/* Indicateurs de prestige Desktop */}
                            <div className="flex gap-3 ml-4 border-l border-white/20 pl-4">
                                {trip.suitability?.map((tag: string, i: number) => (
                                   <span key={i} className="flex items-center gap-1.5 text-xs font-bold bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-brand-light hover:bg-white/20 transition-colors cursor-default">
                                      <Star className="w-3 h-3 text-brand-gold fill-brand-gold" /> {tag}
                                   </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="relative z-20 -mt-8 rounded-t-[2.5rem] bg-white px-6 py-10 shadow-2xl md:mt-0 md:bg-transparent md:p-0 md:shadow-none md:rounded-none">
                <div className="max-w-7xl mx-auto md:px-4 md:grid md:grid-cols-3 md:gap-12 md:mt-8">
                    
                    {/* COLONNE GAUCHE (CONTENU) */}
                    <div className="md:col-span-2 space-y-8">
                        
                        {/* SÉLECTEUR DE MODE STYLISÉ (Caché en mode édition) */}
                        {!editingItem && (
                            <div className="bg-gray-50 border border-gray-200 p-1.5 rounded-2xl flex relative overflow-hidden mb-6">
                                <div className={`absolute top-1.5 bottom-1.5 w-[48%] bg-white shadow-md rounded-xl transition-all duration-300 ease-out ${bookingMode === 'private' ? 'translate-x-[104%]' : 'translate-x-1'}`}></div>
                                <button 
                                    onClick={() => handleModeSwitch('group')}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${bookingMode === 'group' ? 'text-brand-dark' : 'text-gray-500'}`}
                                >
                                    <Users className="h-4 w-4"/> En Groupe
                                </button>
                                <button 
                                    onClick={() => handleModeSwitch('private')}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${bookingMode === 'private' ? 'text-brand-dark' : 'text-gray-500'}`}
                                >
                                    <Gem className={`h-4 w-4 ${bookingMode === 'private' ? 'text-brand-gold' : 'text-gray-400'}`}/> 
                                    {bookingMode === 'private' ? <span className="text-brand-gold">Mode Privé VIP</span> : 'Privé'}
                                </button>
                            </div>
                        )}

                        {/* DESCRIPTION TEXTE (Remontée pour être lue avant le prix/options) */}
                        <section>
                            <h2 className="font-serif font-bold text-2xl mb-4 text-brand-dark flex items-center gap-2 mt-2"><Sparkles className="h-5 w-5 text-brand-gold"/> L'Expérience</h2>
                            <div className="prose prose-sm md:prose-lg text-gray-600 leading-relaxed text-justify max-w-none" dangerouslySetInnerHTML={{__html: trip.fullDescription}}></div>
                        </section>

                        {/* --- BLOC GROUPE --- */}
                        {bookingMode === 'group' && (
                            <div className="animate-fade-in space-y-6">
                                {/* Sélection de la date (Discrète) */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Choisissez votre date</label>
                                    <div className="relative">
                                        <select 
                                            value={selectedDateId} 
                                            onChange={(e) => setSelectedDateId(e.target.value)}
                                            className="w-full p-4 bg-white border border-gray-200 rounded-xl appearance-none font-bold text-gray-700 focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none cursor-pointer"
                                        >
                                            <option value="">Sélectionner une date...</option>
                                            {upcomingDates.map((evt: AgendaEvent) => (
                                                <option key={evt.id} value={evt.date.toISOString()}>
                                                    {evt.date.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 h-5 w-5 pointer-events-none"/>
                                    </div>
                                    {upcomingDates.length === 0 && <p className="text-xs text-orange-500 mt-2 font-bold">Aucune date prévue. Passez en mode privé !</p>}
                                </div>
                            </div>
                        )}

                        {/* --- BLOC PRIVÉ (CONTENU ÉTOFFÉ) --- */}
                        {bookingMode === 'private' && (
                            <div className="animate-fade-in space-y-8 mt-4">
                                <div className="bg-brand-dark text-white p-8 rounded-3xl relative overflow-hidden border border-brand-gold/30 shadow-xl">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="bg-brand-gold p-3 rounded-full shadow-lg">
                                                <Crown className="h-8 w-8 text-brand-dark"/>
                                            </div>
                                            <div>
                                                <h3 className="font-serif font-bold text-2xl text-white">Voyage Sur Mesure</h3>
                                                <p className="text-xs text-brand-gold">Liberté Totale • Service Conciergerie • Expérience Unique</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Heart className="h-5 w-5 text-brand-gold"/>
                                                    <span className="font-bold text-sm">Pour les Couples</span>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-relaxed">Moments romantiques, dîners privés sur la plage et intimité garantie. Nous créons votre bulle parfaite.</p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Baby className="h-5 w-5 text-brand-gold"/>
                                                    <span className="font-bold text-sm">Pour les Familles</span>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-relaxed">Rythme adapté aux enfants, pauses flexibles et sécurité maximale. Profitez sans stress.</p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Briefcase className="h-5 w-5 text-brand-gold"/>
                                                    <span className="font-bold text-sm">Pour les Entreprises</span>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-relaxed">Team building, délégations VIP ou séminaires. Discrétion absolue et logistique sans faille.</p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Sparkles className="h-5 w-5 text-brand-gold"/>
                                                    <span className="font-bold text-sm">Liberté Totale</span>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-relaxed">Départ quand vous voulez, arrêt où vous voulez. C'est votre voyage, nous nous adaptons à 100%.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 bg-brand-gold/10 p-4 rounded-xl border border-brand-gold/20">
                                            <CheckCircle2 className="h-5 w-5 text-brand-gold mt-0.5 shrink-0"/>
                                            <p className="text-sm text-gray-200"><strong>Inclus de base :</strong> Véhicule 4x4 privé climatisé, chauffeur expérimenté, carburant et service de conciergerie 24/7.</p>
                                        </div>
                                    </div>
                                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-green rounded-full blur-3xl opacity-50"></div>
                                </div>
                            </div>
                        )}

                        {/* EXTRAS & PARTICIPANTS (Uniquement pour Groupe) */}
                        {bookingMode === 'group' && trip.availableOptions && (
                            <section className="bg-brand-light/50 border border-brand-gold/30 p-6 rounded-3xl relative overflow-hidden animate-fade-in">
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-200/50 pb-4">
                                        <div>
                                            <h3 className="font-serif font-bold text-xl text-brand-dark flex items-center gap-2">
                                                <Gem className="h-5 w-5 text-brand-gold"/> Options & Voyageurs
                                            </h3>
                                            <p className="text-sm text-gray-500">Personnalisez votre expérience.</p>
                                        </div>
                                        
                                        {/* SÉLECTEUR PARTICIPANTS INTÉGRÉ */}
                                        <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                                            <button onClick={()=>setParticipants(Math.max(1, participants-1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg"><Minus className="h-4 w-4"/></button>
                                            <div className="text-center px-2">
                                                <span className="block text-lg font-bold leading-none">{participants}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Pers.</span>
                                            </div>
                                            <button onClick={()=>setParticipants(participants+1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg"><Plus className="h-4 w-4"/></button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {trip.availableOptions.map((opt: TripOption) => (
                                            <div key={opt.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                                <div className="flex-1 pr-4">
                                                    <p className="font-bold text-brand-dark text-sm">{opt.name}</p>
                                                    <p className="text-xs text-brand-gold font-bold mt-1">{formatPrice(opt.price)}</p>
                                                </div>
                                                {opt.type === 'checkbox' ? (
                                                    <div onClick={() => toggleOption(opt.id, 'checkbox')} className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${selectedOptions[opt.id] ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                                        {selectedOptions[opt.id] ? 'Ajouté' : 'Ajouter'}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={()=>updateOptionQty(opt.id, -1)} className="w-8 h-8 bg-gray-50 border rounded-lg flex items-center justify-center hover:bg-gray-100"><Minus className="h-3 w-3"/></button>
                                                        <span className="font-bold text-sm w-4 text-center">{selectedOptions[opt.id] || 0}</span>
                                                        <button onClick={()=>updateOptionQty(opt.id, 1)} className="w-8 h-8 bg-gray-50 border rounded-lg flex items-center justify-center hover:bg-gray-100"><Plus className="h-3 w-3"/></button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* PRIX TOTAL */}
                                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Estimé</span>
                                        <span className="text-3xl font-serif font-bold text-brand-dark">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            </section>
                        )}

                        {/* INCLUSIONS / EXCLUSIONS (Seulement pour Groupe) */}
                        {bookingMode === 'group' && (
                            <section className="border-t border-b border-gray-100 py-6">
                                    <div className="grid sm:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Inclus (Base)</h3>
                                        <ul className="space-y-2">
                                            {trip.inclusions?.map((inc: string, i: number) => (
                                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span> 
                                                    {inc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-widest flex items-center gap-2 opacity-70"><X className="h-4 w-4 text-gray-400"/> Non Inclus</h3>
                                        <ul className="space-y-2">
                                            {trip.exclusions?.map((exc: string, i: number) => (
                                                <li key={i} className="text-sm text-gray-500 flex items-start gap-2 italic">
                                                        <span className="mt-1.5 w-1 h-1 bg-gray-300 rounded-full flex-shrink-0"></span> 
                                                    {exc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        )}
                        
                        {/* AVIS CLIENTS (SLIDER 3 par 3) */}
                        <section className="pt-8">
                             <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-serif font-bold text-2xl text-brand-dark">L'avis des Voyageurs</h2>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                                        <span className="font-bold text-lg">4.8</span>
                                        <span className="text-gray-400 text-sm">({sortedReviews.length} avis)</span>
                                    </div>
                                </div>
                                
                                {sortedReviews.length > 3 && (
                                    <div className="flex gap-2">
                                        <button onClick={handlePrevReview} disabled={reviewIndex === 0} className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-colors">
                                            <ChevronLeft className="h-5 w-5 text-gray-600"/>
                                        </button>
                                        <button onClick={handleNextReview} disabled={reviewIndex + 3 >= sortedReviews.length} className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-colors">
                                            <ChevronRight className="h-5 w-5 text-gray-600"/>
                                        </button>
                                    </div>
                                )}
                             </div>

                             <div className="space-y-4 animate-fade-in">
                                 {currentReviews.length > 0 ? 
                                    currentReviews.map(review => (
                                        <div key={review.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                                            <div className="flex justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs text-gray-500 overflow-hidden">
                                                        {MOCK_USERS_DB.find(u=>u.id===review.userId)?.avatar ? 
                                                            <img src={MOCK_USERS_DB.find(u=>u.id===review.userId)?.avatar} className="w-full h-full object-cover"/> : 
                                                            (MOCK_USERS_DB.find(u=>u.id===review.userId)?.name.charAt(0) || 'A')
                                                        }
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-sm text-gray-800 block leading-none">{MOCK_USERS_DB.find(u=>u.id===review.userId)?.name || 'Anonyme'}</span>
                                                        <span className="text-[10px] text-gray-400">{review.date}</span>
                                                    </div>
                                                </div>
                                                <StarRating rating={review.rating} size="sm"/>
                                            </div>
                                            <p className="text-gray-600 text-sm italic leading-relaxed">"{review.comment}"</p>
                                        </div>
                                    ))
                                 : <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200"><p className="text-gray-500 italic text-sm">Soyez le premier à donner votre avis sur ce voyage !</p></div>}
                             </div>
                        </section>

                        <RelatedTrips currentTripId={trip.id} onSelect={onSelectTrip} allTrips={allTrips} />
                    </div>

                    {/* COLONNE DROITE (DESKTOP SEULEMENT - RÉSUMÉ FLOTTANT) */}
                    <div className="md:col-span-1 hidden md:block">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24 z-20">
                            
                            {bookingMode === 'group' ? (
                                <div className="mb-6 text-center">
                                    <p className="text-gray-500 uppercase text-xs font-bold tracking-widest mb-1">Total Estimé</p>
                                    <p className="text-4xl font-serif font-bold text-brand-dark">{formatPrice(totalPrice)}</p>
                                </div>
                            ) : (
                                <div className="mb-6 text-center">
                                    <p className="text-gray-500 uppercase text-xs font-bold tracking-widest mb-1">Budget</p>
                                    <p className="text-2xl font-serif font-bold text-brand-dark">À définir selon options</p>
                                </div>
                            )}
                            
                            <button 
                                onClick={handleMainAction}
                                className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 mb-4 hover:scale-105 ${bookingMode === 'private' ? 'bg-brand-dark text-brand-gold' : 'bg-brand-green text-white hover:bg-brand-dark'}`}
                            >
                                {editingItem ? <><RefreshCcw className="h-5 w-5"/> Mettre à jour</> : <><ShoppingBag className="h-5 w-5"/> {bookingMode === 'private' ? 'Configurer mon Voyage' : 'Réserver Maintenant'}</>}
                            </button>

                            <a href={generateWhatsAppLink('product_inquiry', trip)} target="_blank" className="w-full py-3 border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                                <MessageCircle className="h-5 w-5 text-green-500"/> Discuter avec un agent
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY BOTTOM BAR (MOBILE ONLY) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 z-[60] shadow-[0_-5px_20px_rgba(0,0,0,0.15)] md:hidden flex gap-3 items-center safe-area-pb">
                
                <a 
                    href={generateWhatsAppLink('product_inquiry', trip)} 
                    target="_blank"
                    className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center border border-green-200 text-green-600 shadow-sm active:scale-95 transition-transform"
                >
                    <MessageCircle className="h-6 w-6"/>
                </a>

                <button 
                    onClick={handleMainAction}
                    className={`flex-1 h-12 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 text-sm transition-all active:scale-95 ${bookingMode === 'group' ? 'bg-brand-green text-white' : 'bg-brand-dark text-white'}`}
                >
                    {bookingMode === 'group' ? (
                        <>
                            {editingItem ? <RefreshCcw className="h-4 w-4"/> : <ShoppingBag className="h-4 w-4"/>}
                            <div className="flex flex-col items-start leading-none">
                                <span>{editingItem ? 'Mettre à jour' : `Réserver ${selectedDateId ? `le ${selectedDateDisplay}` : ''}`}</span>
                                <span className="text-[10px] opacity-80 font-normal">{formatPrice(totalPrice)}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <PenTool className="h-4 w-4 text-brand-gold"/> 
                            <div className="flex flex-col items-start leading-none">
                                <span>Configurer mon Voyage</span>
                                <span className="text-[10px] opacity-80 font-normal text-brand-gold">Sur mesure</span>
                            </div>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
