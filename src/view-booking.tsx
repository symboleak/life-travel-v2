
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ArrowRight, MapPin, Calendar, Clock, Minus, Plus, Gem, Lock, ShoppingCart, 
  ShoppingBag, Trash2, MessageCircle, Users, CreditCard, Wallet, Edit3, LogIn, CheckCircle2, ChevronDown, ChevronUp, MoreHorizontal
} from 'lucide-react';
import { optimizeImage, formatPrice, generateWhatsAppLink } from './utils';
import { LOCATION_CONSTRAINTS, WIZARD_EXTRAS, CartItem, Trip, TripOption } from './data';
import { RelatedTrips } from './components-widgets';

export const CreatePrivateTripView = ({ onBack, addToast, addToCart, allTrips, initialDestination }: any) => {
    const [step, setStep] = useState(1);
    const [destination, setDestination] = useState<string>("");
    
    useEffect(() => {
        if (initialDestination) {
            setDestination(initialDestination);
            setStep(2);
        }
    }, [initialDestination]);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [participants, setParticipants] = useState(2);
    const [selectedExtras, setSelectedExtras] = useState<any>({});
    
    const startInputRef = useRef<HTMLInputElement>(null);
    const endInputRef = useRef<HTMLInputElement>(null);

    const locations = Array.from(new Set(allTrips.map((t: Trip) => t.location))) as string[];
    const minDateISO = new Date(Date.now() + 172800000).toISOString().split('T')[0];

    const durationDays = useMemo(() => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        if (diffTime < 0) return 0;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }, [startDate, endDate]);

    const handleNext = () => {
        if (step === 1 && !destination) return addToast("error", "Veuillez choisir une destination");
        
        if (step === 2) {
            if (!startDate || !endDate) return addToast("error", "Veuillez choisir vos dates de départ et retour.");
            if (new Date(endDate) < new Date(startDate)) return addToast("error", "La date de retour doit être après le départ.");
            
            const constraints = LOCATION_CONSTRAINTS[destination];
            if (constraints) {
                if (durationDays < constraints.min) return addToast("error", `Minimum ${constraints.min} jours pour ${destination}.`);
                if (durationDays > constraints.max) return addToast("error", `Maximum ${constraints.max} jours pour ${destination} (Dispo staff).`);
            }
        }
        setStep(step + 1);
    };

    const toggleExtra = (id: string) => {
        setSelectedExtras((prev:any) => ({...prev, [id]: !prev[id]}));
    };
    
    const updateExtraQty = (id: string, delta: number) => {
        setSelectedExtras((prev:any) => ({...prev, [id]: Math.max(0, (prev[id]||0) + delta)}));
    };

    const totalPrice = useMemo(() => {
        let total = 0;
        const baseTrip = allTrips.find((t: Trip) => t.location === destination);
        const dailyBase = baseTrip ? (baseTrip.basePrice / (parseInt(baseTrip.duration) || 1)) * 1.5 : 50000;
        
        total += (dailyBase * (durationDays || 1)) * participants;
        
        WIZARD_EXTRAS.forEach(ex => {
            if (ex.type === 'checkbox' && selectedExtras[ex.id]) total += ex.price;
            if (ex.type === 'quantity') {
                 const multiplier = (ex.id.includes('car') || ex.id.includes('bodyguard') || ex.id.includes('photo')) ? (durationDays || 1) : 1;
                 total += ex.price * (selectedExtras[ex.id] || 0) * multiplier;
            }
        });
        return Math.round(total);
    }, [destination, participants, selectedExtras, durationDays, allTrips]);

    const handleAddToCart = () => {
        const customTrip: CartItem = {
            id: `custom-${Date.now()}`,
            trip: {
                id: 999,
                title: `Voyage Privé : ${destination}`,
                image: allTrips.find((t: Trip)=>t.location===destination)?.image || "",
                type: 'Sur Mesure',
                basePrice: totalPrice / participants,
                location: destination,
                priceDisplay: formatPrice(totalPrice),
                duration: `${durationDays} Jours`,
                description: "Voyage configuré sur mesure",
                sku: "CUST", shortDescription:"", fullDescription:"", inclusions:[], exclusions:[], departureCity:"Douala", spots:10, category:"Privé", loyaltyPoints:0
            } as any,
            date: `Du ${new Date(startDate).toLocaleDateString()} au ${new Date(endDate).toLocaleDateString()}`,
            participants,
            options: selectedExtras,
            totalPrice: totalPrice,
            tripTitle: `Privé ${destination} (${durationDays}j)`
        };
        addToCart(customTrip);
    };

    const openPicker = (ref: React.RefObject<HTMLInputElement>) => {
        const el = ref.current;
        if (!el) return;
        try {
            if (typeof (el as any).showPicker === 'function') {
                (el as any).showPicker();
            } else {
                el.focus();
                el.click();
            }
        } catch (e) {
            el.focus();
            try { el.click(); } catch(err) {}
        }
    };

    return (
        <div className="pt-24 pb-20 bg-gray-50 min-h-screen animate-fade-in-up relative">
            <a href={generateWhatsAppLink('custom_help')} target="_blank" className="fixed bottom-6 right-6 z-50 bg-white text-brand-dark px-4 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-3 border border-gray-100 group">
                <div className="bg-[#25D366] text-white p-1 rounded-full"><MessageCircle className="h-5 w-5"/></div>
                <span className="text-sm">Conciergerie en direct</span>
            </a>

            <div className="max-w-4xl mx-auto px-4">
                <button onClick={onBack} className="flex items-center text-gray-500 mb-6 hover:text-brand-green"><ArrowRight className="h-4 w-4 mr-2 rotate-180"/> Retour</button>
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif font-bold text-brand-dark">Créateur de Voyage Privé</h1>
                    <p className="text-gray-600">Construisez votre expérience sur mesure en 4 étapes.</p>
                    <div className="flex justify-center mt-6 gap-2">
                        {[1,2,3,4].map(s => (
                            <div key={s} className={`h-2 w-12 rounded-full ${s <= step ? 'bg-brand-gold' : 'bg-gray-200'}`}/>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MapPin className="h-5 w-5 text-brand-green"/> 1. Choisissez votre Destination</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {locations.map(loc => (
                                    <div key={loc} onClick={()=>setDestination(loc)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${destination === loc ? 'border-brand-green bg-green-50' : 'border-gray-100 hover:border-brand-green/50'}`}>
                                        <p className="font-bold text-center">{loc}</p>
                                        <p className="text-xs text-center text-gray-400 mt-1">{LOCATION_CONSTRAINTS[loc]?.min}-{LOCATION_CONSTRAINTS[loc]?.max} jours conseillés</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="h-5 w-5 text-brand-green"/> 2. Vos Dates & Groupe</h2>
                            <div className="space-y-6 max-w-md mx-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div onClick={() => openPicker(startInputRef)} className="cursor-pointer group bg-gray-50 rounded-xl border border-gray-200 p-4 hover:border-brand-green transition-colors">
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 pointer-events-none">Départ</label>
                                        <div className="relative pointer-events-none">
                                            <input ref={startInputRef} type="date" min={minDateISO} value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full bg-transparent outline-none text-gray-800 font-bold pointer-events-auto"/>
                                            <Calendar className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-green pointer-events-none"/>
                                        </div>
                                    </div>
                                    <div onClick={() => openPicker(endInputRef)} className="cursor-pointer group bg-gray-50 rounded-xl border border-gray-200 p-4 hover:border-brand-green transition-colors">
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 pointer-events-none">Retour</label>
                                        <div className="relative pointer-events-none">
                                            <input ref={endInputRef} type="date" min={startDate || minDateISO} value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full bg-transparent outline-none text-gray-800 font-bold pointer-events-auto"/>
                                            <Calendar className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-green pointer-events-none"/>
                                        </div>
                                    </div>
                                </div>
                                
                                {durationDays > 0 && (
                                    <div className="text-center bg-blue-50 p-3 rounded-lg text-blue-800 text-sm font-bold border border-blue-100 flex items-center justify-center gap-2">
                                        <Clock className="h-4 w-4"/> Durée du séjour : {durationDays} Jours
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de voyageurs</label>
                                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200 justify-center">
                                        <button onClick={()=>setParticipants(Math.max(1, participants-1))} className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center"><Minus className="h-4 w-4"/></button>
                                        <span className="text-xl font-bold w-8 text-center">{participants}</span>
                                        <button onClick={()=>setParticipants(participants+1)} className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center"><Plus className="h-4 w-4"/></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Gem className="h-5 w-5 text-brand-green"/> 3. Ajoutez vos Extras VIP</h2>
                            <div className="space-y-4">
                                {WIZARD_EXTRAS.map(ex => (
                                    <div key={ex.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="mb-2 md:mb-0">
                                            <p className="font-bold text-brand-dark">{ex.name}</p>
                                            <p className="text-xs text-gray-500">{ex.description}</p>
                                            <p className="text-sm font-bold text-brand-green mt-1">{formatPrice(ex.price)} {ex.type === 'quantity' && (ex.id.includes('car') || ex.id.includes('bodyguard') ? '/ jour' : '')}</p>
                                        </div>
                                        {ex.type === 'checkbox' ? (
                                            <button onClick={()=>toggleExtra(ex.id)} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedExtras[ex.id] ? 'bg-brand-dark text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                                {selectedExtras[ex.id] ? 'Ajouté' : 'Ajouter'}
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <button onClick={()=>updateExtraQty(ex.id, -1)} className="w-8 h-8 bg-white border rounded flex items-center justify-center"><Minus className="h-3 w-3"/></button>
                                                <span className="font-bold">{selectedExtras[ex.id] || 0}</span>
                                                <button onClick={()=>updateExtraQty(ex.id, 1)} className="w-8 h-8 bg-white border rounded flex items-center justify-center"><Plus className="h-3 w-3"/></button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-6 text-brand-dark">Votre Voyage est prêt !</h2>
                            <div className="bg-brand-light p-6 rounded-2xl mb-8 max-w-md mx-auto border border-brand-green/10 shadow-sm">
                                <p className="text-gray-500 uppercase text-xs tracking-widest mb-1">Destination & Dates</p>
                                <p className="text-xl font-serif font-bold mb-1">{destination}</p>
                                <p className="text-sm text-gray-600 mb-4">Du {new Date(startDate).toLocaleDateString()} au {new Date(endDate).toLocaleDateString()} ({durationDays}j)</p>
                                
                                <p className="text-gray-500 uppercase text-xs tracking-widest mb-1">Budget Total Estimé</p>
                                <p className="text-3xl font-bold text-brand-green">{formatPrice(totalPrice)}</p>
                                <p className="text-xs text-gray-400 mt-2">*Inclus hébergement standard, transport & extras</p>
                            </div>
                            
                            <div className="flex flex-col gap-3 max-w-sm mx-auto">
                                <button onClick={handleAddToCart} className="w-full py-4 bg-brand-green text-white rounded-xl font-bold shadow-lg hover:bg-brand-dark transition-all flex items-center justify-center gap-2">
                                    <ShoppingCart className="h-5 w-5"/> Ajouter au Panier & Payer
                                </button>
                                <p className="text-xs text-gray-400 flex items-center justify-center gap-1"><Lock className="h-3 w-3"/> Paiement sécurisé par Orange Money / MTN / Visa</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
                        {step > 1 && <button onClick={()=>setStep(step-1)} className="text-gray-500 font-bold hover:text-brand-dark">Précédent</button>}
                        {step < 4 && <button onClick={handleNext} className="ml-auto px-8 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-black transition-colors">Suivant</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// COMPOSANT CARTE PANIER MOBILE (ROBUSTE & FLEXIBLE)
const MobileCartItem = ({ item, onEdit, onRemove }: any) => {
    const [expanded, setExpanded] = useState(false);
    const optionsCount = Object.keys(item.options).filter(k => item.options[k] > 0).length;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm md:hidden overflow-hidden w-full">
            {/* Main Content Row - Using Flex to avoid grid blowout */}
            <div className="flex p-3 gap-3">
                {/* Image: Fixed width, never shrinks */}
                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                    <img 
                        src={optimizeImage(item.trip.image, 200)} 
                        className="w-full h-full object-cover" 
                        alt={item.tripTitle}
                    />
                </div>
                
                {/* Text Content: Grows but constrained by min-w-0 to allow truncation */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <h3 className="font-bold text-brand-dark text-sm leading-tight line-clamp-2 pr-1">
                            {item.tripTitle || item.trip.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1.5">
                            <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                                <Users className="h-3 w-3"/> {item.participants}
                            </span>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                                <Calendar className="h-3 w-3"/> {item.date.split(' au ')[0]}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-end justify-between mt-1">
                        <span className="font-bold text-brand-green text-base">{formatPrice(item.totalPrice)}</span>
                    </div>
                </div>
            </div>

            {/* Options Toggle Bar */}
            {optionsCount > 0 && (
                <div className="px-3 pb-2">
                    <button 
                        onClick={() => setExpanded(!expanded)} 
                        className="w-full text-xs font-medium text-gray-500 bg-gray-50 rounded-lg py-2 px-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                        <span>{optionsCount} option{optionsCount > 1 ? 's' : ''} ajoutée{optionsCount > 1 ? 's' : ''}</span>
                        {expanded ? <ChevronUp className="h-3 w-3"/> : <ChevronDown className="h-3 w-3"/>}
                    </button>
                    
                    {expanded && (
                        <div className="mt-2 text-xs text-gray-600 space-y-1.5 pl-2 border-l-2 border-gray-100 ml-2">
                            {Object.keys(item.options).filter(k=>item.options[k]).map(k => {
                                const qty = typeof item.options[k] === 'number' && item.options[k] > 1 ? `(x${item.options[k]})` : '';
                                return <div key={k} className="flex items-center gap-2 truncate">• {k} {qty}</div>;
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Action Bar */}
            <div className="grid grid-cols-2 border-t border-gray-100 divide-x divide-gray-100">
                <button onClick={() => onEdit(item)} className="py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 active:bg-gray-100 transition-colors">
                    <Edit3 className="h-3.5 w-3.5"/> Modifier
                </button>
                <button onClick={() => onRemove(item.id)} className="py-3 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center justify-center gap-2 active:bg-red-100 transition-colors">
                    <Trash2 className="h-3.5 w-3.5"/> Supprimer
                </button>
            </div>
        </div>
    );
};

export const CheckoutView = ({ cart, onUpdateCart, user, onLoginReq, onSelectTrip, allTrips, onEditItem }: any) => {
    const total = cart.reduce((sum: number, item: CartItem) => sum + item.totalPrice, 0);
    const [selectedPayment, setSelectedPayment] = useState<string>('om');

    const removeItem = (id: string) => {
        onUpdateCart(cart.filter((i: CartItem) => i.id !== id));
    };

    const handleCheckout = () => {
        const orderId = `CMD-${Date.now().toString().slice(-6)}`;
        const paymentDetails = selectedPayment === 'om' ? 'Orange Money' : selectedPayment === 'momo' ? 'MTN MoMo' : 'Carte Bancaire';
        const link = generateWhatsAppLink('advice_checkout', { orderId, total, items: cart, paymentMethod: paymentDetails });
        window.open(link, '_blank');
    };

    const getPaymentLabel = () => {
        switch(selectedPayment) {
            case 'om': return 'Orange Money';
            case 'momo': return 'MTN MoMo';
            case 'visa': return 'Carte Bancaire';
            default: return 'Payer';
        }
    };

    if (cart.length === 0) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center animate-fade-in-up">
                <div className="text-center max-w-md px-4">
                    <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6"/>
                    <h1 className="text-2xl font-serif font-bold text-brand-dark mb-2">Votre panier est vide</h1>
                    <p className="text-gray-500 mb-8">Il semblerait que vous n'ayez pas encore choisi votre prochaine aventure.</p>
                    <div className="w-full max-w-full overflow-hidden">
                        <RelatedTrips currentTripId={0} onSelect={onSelectTrip} allTrips={allTrips} />
                    </div>
                </div>
            </div>
        );
    }

    // --- PAYMENT OPTIONS COMPONENT ---
    const PaymentOptions = ({ compact = false }: {compact?: boolean}) => (
        <div className={`grid ${compact ? 'grid-cols-3 gap-2 w-full' : 'grid-cols-3 gap-2'}`}>
            <button 
                onClick={() => setSelectedPayment('om')}
                className={`rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${compact ? 'p-1.5 py-2' : 'p-2'} ${selectedPayment === 'om' ? 'border-[#FF7900] bg-orange-50 ring-1 ring-[#FF7900]' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}
            >
                <div className={`rounded-full bg-[#FF7900] text-white flex items-center justify-center font-bold ${compact ? 'w-5 h-5 text-[9px]' : 'w-8 h-8 text-[10px]'}`}>OM</div>
                <span className={`font-bold text-gray-700 ${compact ? 'text-[9px]' : 'text-[10px] hidden md:block'}`}>Orange</span>
            </button>
            <button 
                onClick={() => setSelectedPayment('momo')}
                className={`rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${compact ? 'p-1.5 py-2' : 'p-2'} ${selectedPayment === 'momo' ? 'border-[#FFCC00] bg-yellow-50 ring-1 ring-[#FFCC00]' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}
            >
                <div className={`rounded-full bg-[#FFCC00] text-black flex items-center justify-center font-bold ${compact ? 'w-5 h-5 text-[9px]' : 'w-8 h-8 text-[10px]'}`}>MTN</div>
                <span className={`font-bold text-gray-700 ${compact ? 'text-[9px]' : 'text-[10px] hidden md:block'}`}>MoMo</span>
            </button>
            <button 
                onClick={() => setSelectedPayment('visa')}
                className={`rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${compact ? 'p-1.5 py-2' : 'p-2'} ${selectedPayment === 'visa' ? 'border-[#1a1f71] bg-blue-50 ring-1 ring-[#1a1f71]' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}
            >
                <div className={`rounded-full bg-[#1a1f71] text-white flex items-center justify-center font-bold ${compact ? 'w-5 h-5 text-[9px]' : 'w-8 h-8 text-[10px]'}`}><CreditCard className={compact ? "h-3 w-3" : "h-4 w-4"}/></div>
                <span className={`font-bold text-gray-700 ${compact ? 'text-[9px]' : 'text-[10px] hidden md:block'}`}>Carte</span>
            </button>
        </div>
    );

    return (
        <div className="pt-24 pb-64 md:pb-20 bg-gray-50 min-h-screen animate-fade-in-up w-full overflow-x-hidden">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-serif font-bold text-brand-dark mb-8 flex items-center gap-3"><ShoppingBag className="h-8 w-8 text-brand-gold"/> Votre Panier</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Cart Items List Container - Added min-w-0 to fix grid blowout */}
                    <div className="md:col-span-2 space-y-4 min-w-0">
                        {cart.map((item: CartItem) => (
                            <React.Fragment key={item.id}>
                                {/* MOBILE COMPONENT */}
                                <MobileCartItem item={item} onEdit={onEditItem} onRemove={removeItem} />

                                {/* DESKTOP LAYOUT (UNCHANGED) */}
                                <div className="hidden md:flex flex-row bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                                    <div className="w-48 bg-gray-100 flex-shrink-0">
                                        <img src={optimizeImage(item.trip.image, 300)} className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-xl text-brand-dark">{item.tripTitle || item.trip.title}</h3>
                                            <div className="flex gap-2">
                                                <button onClick={() => onEditItem(item)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><Edit3 className="h-4 w-4"/></button>
                                                <button onClick={()=>removeItem(item.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"><Trash2 className="h-4 w-4"/></button>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"><Calendar className="h-4 w-4"/> {item.date}</span>
                                            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"><Users className="h-4 w-4"/> {item.participants} pers.</span>
                                        </div>

                                        {Object.keys(item.options).some(k => item.options[k] > 0) && (
                                            <div className="flex flex-wrap gap-2">
                                                {Object.keys(item.options).filter(k=>item.options[k]).map(k => (
                                                    <span key={k} className="text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded text-gray-600">
                                                        {k} {typeof item.options[k]==='number' && item.options[k] > 1 ? `(x${item.options[k]})` : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-40 border-l border-gray-50 bg-gray-50/30 flex flex-col items-end justify-center p-6">
                                        <span className="text-xs font-bold text-gray-400 uppercase mb-1">Total</span>
                                        <span className="font-bold text-2xl text-brand-dark">{formatPrice(item.totalPrice)}</span>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}

                        {/* SUGGESTIONS IN CART (Wrapped to prevent overflow) */}
                        <div className="mt-12 pt-8 border-t border-gray-200 w-full max-w-full overflow-hidden">
                            <RelatedTrips currentTripId={0} onSelect={onSelectTrip} allTrips={allTrips} />
                        </div>
                    </div>

                    {/* Summary & Checkout - DESKTOP */}
                    <div className="md:col-span-1 hidden md:block">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                            <h2 className="font-bold text-xl mb-6 text-brand-dark">Résumé</h2>
                            
                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Sous-total</span>
                                    <span className="font-bold">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Frais</span>
                                    <span className="font-bold text-green-600">Offerts</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="font-bold text-lg text-brand-dark">Total à payer</span>
                                <span className="text-3xl font-bold text-brand-green">{formatPrice(total)}</span>
                            </div>

                            <div className="mb-6">
                                <p className="font-bold text-sm text-gray-700 mb-3">Moyen de Paiement</p>
                                <PaymentOptions />
                            </div>

                            {!user ? (
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 text-sm">
                                    <p className="font-bold text-yellow-800 mb-2 flex items-center gap-2"><Lock className="h-4 w-4"/> Compte requis</p>
                                    <button onClick={onLoginReq} className="w-full py-2 bg-white border border-yellow-300 text-yellow-800 rounded-lg font-bold hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2">
                                        <LogIn className="h-4 w-4"/> Se Connecter pour Payer
                                    </button>
                                </div>
                            ) : (
                                <button onClick={handleCheckout} className="w-full py-4 bg-brand-dark text-white rounded-xl font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-2"><MessageCircle className="h-5 w-5"/> {getPaymentLabel()}</span>
                                    <div className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                </button>
                            )}
                            
                            <p className="text-xs text-center text-gray-400 mt-4">
                                Validation sécurisée via WhatsApp Agent.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE STICKY CHECKOUT FOOTER (STICKER) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 z-[60] shadow-[0_-5px_20px_rgba(0,0,0,0.15)] flex flex-col gap-3 safe-area-pb rounded-t-2xl">
                {/* Row 1: Payment Options (Compact Grid) */}
                <PaymentOptions compact={true} />
                
                {/* Row 2: Total + Action */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">Total</span>
                        <span className="text-xl font-bold text-brand-dark leading-tight">{formatPrice(total)}</span>
                    </div>
                    
                    {!user ? (
                        <button onClick={onLoginReq} className="flex-1 h-12 bg-[#FFCC00] text-black rounded-xl font-bold shadow-md flex items-center justify-center gap-2 text-xs active:scale-95 transition-transform">
                            <LogIn className="h-4 w-4"/> Se connecter
                        </button>
                    ) : (
                        <button onClick={handleCheckout} className="flex-1 h-12 bg-brand-green text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2 text-sm active:scale-95 transition-transform">
                            <MessageCircle className="h-5 w-5"/> {getPaymentLabel()}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
