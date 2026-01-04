
import React, { useRef, useState } from 'react';
import { 
  X, Facebook, LogIn, Loader2, ChevronLeft, ChevronRight, Gem, Clock, Calendar, 
  Quote, Send, MapPin, MessageSquarePlus
} from 'lucide-react';
import { optimizeImage, sanitizeInput, formatPrice } from './utils';
import { Trip, MOCK_USER, ADMIN_USER, MOCK_USERS_DB, REVIEWS_MOCK } from './data';
import { StarRating } from './components-ui';

// --- REVIEW MODAL ---
export const ReviewModal = ({ isOpen, onClose, onSubmit, contextTitle }: any) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            onSubmit({ rating, comment });
            setLoading(false);
            onClose();
            setComment("");
            setRating(5);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white rounded-3xl w-full max-w-md relative p-6 shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="h-4 w-4"/></button>
                <div className="text-center mb-6">
                    <h3 className="font-serif font-bold text-xl text-brand-dark">Votre Avis</h3>
                    <p className="text-sm text-gray-500 mt-1">{contextTitle}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center mb-4">
                        <StarRating rating={rating} size="lg" onChange={setRating}/>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Votre expérience</label>
                        <textarea 
                            value={comment} 
                            onChange={e => setComment(e.target.value)} 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none min-h-[120px] focus:border-brand-green transition-colors text-sm"
                            placeholder="Racontez-nous ce qui vous a marqué..."
                            required
                        />
                    </div>
                    <button disabled={loading} className="w-full py-3 bg-brand-green text-white rounded-xl font-bold flex justify-center gap-2 hover:bg-brand-dark transition-all">
                        {loading ? <Loader2 className="animate-spin"/> : <Send className="h-4 w-4"/>} Publier
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- TESTIMONIALS SLIDER ---
export const TestimonialsSlider = () => {
    const reviews = REVIEWS_MOCK.filter(r => !r.tripId); 
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const scroll = (dir: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    // Fake submit just to close the modal for the demo
    const handleFakeSubmit = () => setIsReviewModalOpen(false);

    if (reviews.length === 0) return null;

    return (
        <div className="py-16 bg-brand-dark text-white relative overflow-hidden group/slider">
            <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} onSubmit={handleFakeSubmit} contextTitle="Life Travel Cameroun"/>
            
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="absolute top-10 left-10"><Quote className="h-32 w-32 rotate-180 text-white/5"/></div>
                 <div className="absolute bottom-10 right-10"><Quote className="h-32 w-32 text-white/5"/></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">Confiance & Transparence</span>
                        <h2 className="text-3xl font-serif font-bold mt-2">Ce qu'ils disent de nous</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => scroll('left')} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-20 relative"><ChevronLeft className="h-5 w-5"/></button>
                        <button onClick={() => scroll('right')} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-20 relative"><ChevronRight className="h-5 w-5"/></button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex flex-nowrap overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory touch-pan-x">
                    {reviews.map(review => {
                        const author = MOCK_USERS_DB.find(u => u.id === review.userId);
                        return (
                            <div key={review.id} className="snap-center shrink-0 w-[85vw] md:w-[400px] bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl flex flex-col hover:bg-white/10 transition-colors">
                                <div className="mb-4"><StarRating rating={review.rating} size="md"/></div>
                                <p className="text-gray-300 italic mb-6 leading-relaxed flex-1">"{review.comment}"</p>
                                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
                                    <img src={author?.avatar} className="w-10 h-10 rounded-full border border-brand-gold/50" alt={author?.name}/>
                                    <div>
                                        <p className="font-bold text-sm text-white">{author?.name}</p>
                                        <p className="text-xs text-brand-gold">{review.verified ? 'Client Vérifié' : 'Voyageur'}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                
                <div className="text-center mt-8">
                    <button onClick={() => setIsReviewModalOpen(true)} className="inline-flex items-center gap-2 text-brand-gold font-bold text-sm hover:underline hover:text-white transition-colors">
                        <MessageSquarePlus className="h-4 w-4"/> Ajouter mon avis
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- AUTH MODAL ---
export const AuthModal = ({ isOpen, onClose, onLogin }: any) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if ((email.toLowerCase().includes('symbo')) && password === '1234') {
        setTimeout(() => { setLoading(false); onLogin(ADMIN_USER); onClose(); }, 800);
    } else {
        setTimeout(() => { setLoading(false); onLogin(MOCK_USER); onClose(); }, 1500);
    }
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md relative overflow-hidden shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full z-10 hover:bg-gray-200"><X className="h-4 w-4 text-gray-600" /></button>
        <div className="bg-brand-green p-8 text-white text-center">
          <h2 className="text-2xl font-serif font-bold">Connexion</h2>
          <p className="text-sm opacity-80 mt-2">Rejoignez la communauté Life Travel</p>
        </div>
        <div className="p-8">
           <div className="grid grid-cols-2 gap-3 mb-6">
             <button className="flex items-center justify-center gap-2 p-3 border border-blue-600 bg-[#1877F2] text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-bold shadow-sm">
                 <Facebook className="w-5 h-5 fill-white" /> Facebook
             </button>
             <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700 bg-white shadow-sm group">
                 <div className="w-5 h-5 flex items-center justify-center">
                    {/* Simulated Google G Icon */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                 </div>
                 Google
             </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Identifiant</label><input type="text" value={email} onChange={e=>setEmail(sanitizeInput(e.target.value))} className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none" placeholder="Email ou Pseudo" /></div>
              <div><label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Mot de Passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none" placeholder="••••" /></div>
              <button disabled={loading} className="w-full py-4 bg-brand-dark text-white rounded-xl font-bold flex justify-center gap-2 mt-4 hover:bg-black transition-all">{loading ? <Loader2 className="animate-spin"/> : <LogIn className="h-5 w-5"/>} Se Connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- RELATED TRIPS (DESIGN IMMERSIF) ---
export const RelatedTrips = ({ currentTripId, onSelect, allTrips }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const suggestions = allTrips.filter((t: Trip) => t.id !== currentTripId).slice(0, 6);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
        const scrollAmount = 200;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-gray-100 pb-4 relative group/slider w-full max-w-full overflow-hidden">
      <div className="flex justify-between items-end mb-6 gap-4">
          <h3 className="font-serif font-bold text-lg text-brand-dark">Vous aimerez aussi</h3>
          <div className="flex gap-2 shrink-0">
             <button onClick={() => scroll('left')} className="p-3 bg-white shadow-md border border-gray-100 rounded-full hover:bg-gray-50 z-20 active:scale-95"><ChevronLeft className="h-5 w-5 text-gray-700"/></button>
             <button onClick={() => scroll('right')} className="p-3 bg-white shadow-md border border-gray-100 rounded-full hover:bg-gray-50 z-20 active:scale-95"><ChevronRight className="h-5 w-5 text-gray-700"/></button>
          </div>
      </div>
      
      <div ref={scrollRef} className="flex flex-nowrap overflow-x-auto gap-4 pb-4 px-2 hide-scrollbar snap-x snap-mandatory touch-pan-x relative">
         {suggestions.map((t: Trip) => (
            <div key={t.id} onClick={() => onSelect(t)} className="snap-start shrink-0 w-[160px] md:w-[200px] h-48 md:h-56 relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all group/card border border-gray-100">
               <img src={optimizeImage(t.image, 300)} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
               
               {/* STICKERS TOP LEFT */}
               <div className="absolute top-2 left-2 flex flex-col gap-1">
                   {t.type === 'Privé' && <span className="bg-brand-gold text-brand-dark text-[8px] px-1.5 py-0.5 rounded font-bold uppercase shadow-sm w-fit">Privé</span>}
                   <span className="bg-white/20 backdrop-blur-md text-white text-[8px] px-1.5 py-0.5 rounded border border-white/20 w-fit">{t.category}</span>
               </div>

               {/* INFO BOTTOM (STICKERS) */}
               <div className="absolute bottom-0 left-0 w-full p-3 text-white">
                  <h4 className="font-bold text-xs md:text-sm line-clamp-2 mb-1 leading-tight">{t.title}</h4>
                  <p className="text-brand-green text-xs font-bold bg-white/90 px-2 py-0.5 rounded-full w-fit mt-1 shadow-sm">{t.priceDisplay}</p>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

// --- FEATURED SLIDER (HOME) - DESIGN IMMERSIF ---
export const FeaturedSlider = ({ trips, onSelectProduct, onCreatePrivate }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const displayItems = React.useMemo(() => {
      const items: (Trip | { type: 'custom' })[] = [...trips];
      items.splice(1, 0, { type: 'custom' }); 
      return items;
  }, [trips]);
  
  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
        const scrollAmount = 300;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative group w-full py-8">
       {/* Flèches Visibles Mobile (transparent) & Desktop */}
       <button onClick={() => scroll('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur shadow-lg p-3 rounded-full hover:scale-110 transition-transform text-brand-dark border border-gray-100 flex items-center justify-center"><ChevronLeft className="h-6 w-6" /></button>
       <button onClick={() => scroll('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur shadow-lg p-3 rounded-full hover:scale-110 transition-transform text-brand-dark border border-gray-100 flex items-center justify-center"><ChevronRight className="h-6 w-6" /></button>
       
       <div ref={scrollRef} className="flex flex-nowrap overflow-x-auto gap-4 md:gap-6 pb-8 px-4 hide-scrollbar snap-x snap-mandatory touch-pan-x">
          {displayItems.map((item, idx) => {
             if ('type' in item && item.type === 'custom') {
                 return (
                    <div key={`custom-${idx}`} onClick={onCreatePrivate} className="snap-center shrink-0 w-[85vw] md:w-[320px] cursor-pointer group/card">
                        <div className="h-[380px] md:h-[450px] rounded-3xl overflow-hidden relative shadow-lg bg-brand-dark flex flex-col items-center justify-center text-center p-8 border-2 border-brand-gold/30 hover:border-brand-gold transition-colors">
                            <Gem className="h-16 w-16 text-brand-gold mb-6 animate-pulse"/>
                            <h3 className="text-3xl font-serif font-bold text-white mb-4">Voyage Sur Mesure</h3>
                            <p className="text-gray-300 mb-6">Une envie précise ? Créez votre propre aventure privée.</p>
                            <span className="px-6 py-3 bg-brand-gold text-brand-dark font-bold rounded-full hover:bg-white hover:text-brand-dark transition-colors">Créer mon Voyage</span>
                        </div>
                    </div>
                 );
             } 
             const t = item as Trip;
             return (
               <div key={`trip-${t.id}`} onClick={() => onSelectProduct(t)} className="snap-center shrink-0 w-[85vw] md:w-[320px] cursor-pointer group/card transition-all duration-300">
                  <div className="h-[380px] md:h-[450px] rounded-3xl overflow-hidden relative shadow-lg transform transition-transform md:group-hover/card:scale-105">
                     <img src={optimizeImage(t.image, 600)} className="w-full h-full object-cover" loading="lazy" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                     
                     {/* STICKERS TOP LEFT */}
                     <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                        {t.type === 'Privé' && (
                             <span className="bg-brand-gold text-brand-dark px-3 py-1 rounded-lg text-xs font-bold uppercase shadow-lg flex items-center gap-1"><Gem className="h-3 w-3"/> Privé</span>
                        )}
                        <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold uppercase border border-white/30">{t.category}</span>
                     </div>

                     {/* INFO BOTTOM (STICKERS) */}
                     <div className="absolute bottom-0 p-6 text-white w-full">
                        <h3 className="text-2xl font-serif font-bold mb-2 leading-tight">{t.title}</h3>
                        <p className="text-gray-300 text-sm line-clamp-2 mb-4">{t.shortDescription}</p>
                        <div className="flex justify-between items-center border-t border-white/20 pt-4">
                           <div>
                               <p className="text-xs text-brand-gold uppercase tracking-wider mb-0.5">À partir de</p>
                               <span className="font-bold text-xl">{t.priceDisplay}</span>
                           </div>
                           <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center font-medium"><Clock className="h-3 w-3 mr-1.5"/> {t.duration}</span>
                        </div>
                     </div>
                  </div>
               </div>
             );
          })}
       </div>
    </div>
  );
};

// --- UPCOMING ADVENTURES (DESIGN IMMERSIF) ---
export const UpcomingAdventures = ({ onSelectTrip, allTrips, allEvents }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const nextEvents = React.useMemo(() => {
     return allEvents.filter((e: any) => e.date > new Date()).sort((a: any, b: any) => a.date.getTime()-b.date.getTime());
  }, [allEvents]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
        const scrollAmount = 300;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (nextEvents.length === 0) return null;
  return (
    <div className="py-12 bg-white border-t border-gray-100 relative group/slider">
       <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
                 <Calendar className="h-6 w-6 text-brand-gold" />
                 <h2 className="text-2xl font-serif font-bold text-brand-dark">Nos Prochaines Aventures</h2>
             </div>
             <div className="flex gap-2">
                 <button onClick={() => scroll('left')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 z-10 relative"><ChevronLeft className="h-5 w-5"/></button>
                 <button onClick={() => scroll('right')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 z-10 relative"><ChevronRight className="h-5 w-5"/></button>
             </div>
          </div>
          
          <div className="relative">
              <div ref={scrollRef} className="flex flex-nowrap overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x snap-mandatory touch-pan-x">
                 {nextEvents.map((ev: any) => {
                    const trip = allTrips.find((t: Trip) => t.id === ev.tripId);
                    if (!trip) return null;
                    return (
                       <div key={ev.id} onClick={() => onSelectTrip(trip, ev.date)} className="snap-start shrink-0 w-[80vw] md:w-[280px] relative h-48 md:h-56 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all border border-gray-100">
                          <img src={optimizeImage(trip.image, 400)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                          
                          {/* DATE BADGE (STICKER) */}
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-brand-dark px-3 py-1.5 rounded-xl text-center shadow-sm border border-white/50">
                             <p className="text-xs font-bold uppercase text-gray-500 leading-none mb-0.5">{ev.date.toLocaleDateString('fr-FR', {month: 'short'})}</p>
                             <p className="text-lg font-bold leading-none">{ev.date.getDate()}</p>
                          </div>

                          {/* INFO EN BAS (STICKER/OVERLAY) */}
                          <div className="absolute bottom-3 left-3 text-white right-3">
                             <div className="flex items-center gap-2 mb-1">
                                 <MapPin className="h-3 w-3 text-brand-gold"/>
                                 <span className="text-xs font-bold text-gray-300 uppercase">{trip.location}</span>
                             </div>
                             <h3 className="font-bold text-base leading-tight line-clamp-2 mb-1">{trip.title}</h3>
                             <p className="text-xs text-brand-gold font-bold bg-white/90 px-2 py-0.5 rounded-full w-fit">{trip.priceDisplay}</p>
                          </div>
                       </div>
                    );
                 })}
              </div>
          </div>
       </div>
    </div>
  );
};
