
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Menu, X, MessageCircle, Mail, User, ShoppingCart, Loader2, ArrowRight, Calendar, Gem, Clock, MapPin, Facebook, Plus
} from 'lucide-react';
import { optimizeImage, generateWhatsAppLink } from './utils';
import { SITE_SETTINGS, TRIPS_MOCK, AGENDA_EVENTS_MOCK } from './data';
import { UserProfile, Trip, AgendaEvent, CartItem } from './types';
import { ToastContainer, ScrollToTop } from './components-ui';
import { AuthModal, FeaturedSlider, UpcomingAdventures, TestimonialsSlider } from './components-widgets';

// Nouveaux imports depuis les fichiers splittés
import { LegalView, FAQView, CommitmentView, TravelGuideView } from './view-info';
import { CheckoutView, CreatePrivateTripView } from './view-booking';
import { ProductDetailView, CalendarView } from './view-product';
import { ClientDashboard } from './view-dashboard';

// ============================================================================
// SERVICE DE DONNÉES
// ============================================================================

interface Window {
  lifeTravelSettings?: {
    apiUrl: string;
    nonce: string;
    isLoggedIn: boolean;
  };
}

const useDataService = () => {
  const [trips, setTrips] = useState<Trip[]>(TRIPS_MOCK);
  const [events, setEvents] = useState<AgendaEvent[]>(AGENDA_EVENTS_MOCK);
  const [isLoading, setIsLoading] = useState(false);
  const isWP = typeof (window as unknown as Window).lifeTravelSettings !== 'undefined';

  React.useEffect(() => {
    if (isWP) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500); 
    }
  }, []);

  return { trips, events, isLoading, isWP };
};

// ============================================================================
// CONFIGURATION NAVIGATION
// ============================================================================

const NAV_ITEMS = [
    { id: 'home', label: 'Accueil', primary: true },
    { id: 'agenda', label: 'Agenda', primary: true },
    { id: 'excursions', label: 'Nos Séjours', primary: true },
    { id: 'guide', label: 'Infos Pratiques', primary: false },
    { id: 'commitments', label: 'Notre Impact', primary: false },
];

// ============================================================================
// APP ROOT
// ============================================================================

function App() {
  const [view, setView] = useState('home');
  const [previousView, setPreviousView] = useState('home'); 
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<Date | null>(null);
  const [wizardDestination, setWizardDestination] = useState<string>("");
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null); // State for editing
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const { trips, events, isLoading } = useDataService();

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToasts([...toasts, { id, type, message }]);
    setTimeout(() => {
        setToasts(current => current.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => setToasts(toasts.filter(t => t.id !== id));
  
  const navigate = (destination: string) => { 
      setPreviousView(view); 
      setView(destination); 
      window.scrollTo(0,0); 
      setMenuOpen(false); 
      if (destination !== 'detail') setEditingCartItem(null); // Clear editing state if navigating away
  };
  
  const handleBack = () => {
      setView(previousView);
      window.scrollTo(0,0);
      setEditingCartItem(null);
  };
  
  const selectTrip = (t: Trip, date?: Date) => { 
      setTrip(t); 
      setSelectedAgendaDate(date || null); 
      setEditingCartItem(null); // Ensure we are not editing old item
      setPreviousView(view);
      setView('detail');
      window.scrollTo(0,0);
  };
  
  const addToCart = (item: CartItem) => {
     setCart([...cart, item]);
     addToast('success', `${item.tripTitle || item.trip.title} ajouté au panier !`);
  };

  const handleProductAddToCart = (item: CartItem) => {
      if (editingCartItem) {
          // Update existing item
          setCart(cart.map(i => i.id === editingCartItem.id ? { ...item, id: editingCartItem.id } : i));
          addToast('success', 'Panier mis à jour !');
          setEditingCartItem(null);
          navigate('checkout');
      } else {
          // Add new
          addToCart(item);
          navigate('checkout'); 
      }
  };

  const handleEditCartItem = (item: CartItem) => {
      setTrip(item.trip);
      setEditingCartItem(item);
      setPreviousView('checkout');
      setView('detail');
      window.scrollTo(0,0);
  };

  const handleWizardAddToCart = (item: CartItem) => {
      addToCart(item);
      navigate('checkout');
  };

  const handleCreatePrivate = (destination?: string) => {
      setWizardDestination(destination || "");
      navigate('create-private');
  };

  const handleMenuAccount = () => {
    setMenuOpen(false);
    if (user) {
        navigate('account');
    } else {
        setAuthOpen(true);
    }
  };

  const handleLogin = (loggedInUser: UserProfile) => {
      setUser(loggedInUser);
      setAuthOpen(false);
      if (view !== 'checkout' && view !== 'create-private') {
          navigate('account');
      } else {
          addToast('success', `Ravi de vous revoir, ${loggedInUser.name}`);
      }
  };

  if (isLoading) {
      return <div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="animate-spin h-10 w-10 text-brand-green"/></div>;
  }

  return (
    <div className="font-sans text-brand-dark bg-brand-light min-h-screen overflow-x-hidden w-full relative">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onLogin={handleLogin} />
      <ScrollToTop />

      <header className="fixed w-full z-50 bg-white/95 backdrop-blur shadow-sm h-20 flex items-center transition-all top-0 left-0">
         <div className="max-w-7xl w-full mx-auto px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
                <img src="https://life-travel.org/wp-content/uploads/2024/09/1000052168-removebg-preview-190x98.png" className="h-8 md:h-10 object-contain transform scale-125 origin-left" />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 tracking-wide">
               {NAV_ITEMS.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => navigate(item.id)} 
                    className={`transition-colors relative group ${view === item.id ? 'text-brand-green' : 'text-gray-600 hover:text-brand-green'} ${item.primary ? 'font-bold text-base' : 'font-medium text-sm text-gray-500'}`}
                  >
                      {item.label}
                      {view === item.id && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-green rounded-full"></span>}
                  </button>
               ))}
            </nav>

            <div className="flex gap-4 items-center">
               <button onClick={() => navigate('checkout')} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
                  <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-brand-green"/>
                  {cart.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
               </button>
               <button onClick={() => user ? navigate('account') : setAuthOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                  {user ? <img src={user.avatar} className="w-8 h-8 rounded-full"/> : <div className="flex items-center gap-2 text-sm font-bold"><User className="h-5 w-5"/> <span className="hidden md:inline">Connexion</span></div>}
               </button>
               <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}><Menu className="h-6 w-6"/></button>
            </div>
         </div>
      </header>
      
      {/* Mobile Menu */}
      {menuOpen && (
         <div className="fixed inset-0 z-40 bg-white pt-24 px-6 flex flex-col gap-6 animate-fade-in-up">
            <div className="flex flex-col space-y-2">
                {NAV_ITEMS.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => navigate(item.id)} 
                        className={`text-left py-3 border-b border-gray-50 hover:text-brand-green transition-colors ${item.primary ? 'text-2xl font-serif font-bold text-brand-dark' : 'text-lg font-medium text-gray-500'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            
            <button onClick={handleMenuAccount} className="mt-4 p-4 bg-gray-50 rounded-2xl flex items-center gap-4 hover:bg-gray-100 transition-colors">
                <div className="bg-white p-2 rounded-full shadow-sm"><User className="h-6 w-6 text-brand-dark"/></div>
                <div className="text-left">
                    <p className="font-bold text-brand-dark">{user ? user.name : "Espace Membre"}</p>
                    <p className="text-xs text-gray-500">{user ? "Accéder à mon compte" : "Connexion / Inscription"}</p>
                </div>
            </button>
            
            <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X/></button>
         </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-[100vw] overflow-x-hidden pt-0">
        {view === 'home' && (
           <>
             {/* HERO */}
             <div className="relative h-[80vh] flex items-center justify-center">
                <img src={optimizeImage("https://images.unsplash.com/photo-1516026672322-bc52d61a55d5", 1200)} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-brand-green/30 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="relative text-center text-white px-4 max-w-4xl pt-20 animate-fade-in-up">
                   <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest mb-4">Agence Agréée</div>
                   <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">Cameroun,<br/><span className="text-brand-gold">Terre d'Origines.</span></h1>
                   <div className="flex flex-col md:flex-row gap-4 justify-center mt-8 items-center w-full">
                      <button onClick={() => navigate('excursions')} className="bg-white/10 backdrop-blur border border-white/30 px-8 py-4 rounded-full font-bold hover:bg-white hover:text-brand-dark transition-colors text-white w-full md:w-auto">Nos Excursions</button>
                      <button onClick={() => handleCreatePrivate()} className="bg-brand-gold text-brand-dark px-8 py-5 md:py-4 rounded-full font-bold text-lg md:text-base hover:bg-white hover:scale-105 transition-all shadow-xl shadow-black/20 border-2 border-brand-gold w-full md:w-auto flex items-center justify-center gap-2">
                          <Gem className="h-5 w-5"/> Concevoir mon Séjour Privé
                      </button>
                   </div>
                </div>
             </div>
             
             {/* DESTINATIONS PHARES */}
             <div className="py-16 bg-brand-light border-t border-gray-100 overflow-hidden w-full">
                <div className="max-w-7xl mx-auto px-4">
                   <div className="flex justify-between items-end mb-8">
                      <div>
                         <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">Cameroun, Afrique en miniature</span>
                         <h2 className="text-3xl font-serif font-bold text-brand-dark mt-2">Destinations Phares</h2>
                      </div>
                      <button onClick={() => navigate('excursions')} className="text-brand-green font-bold flex items-center hover:underline">Voir tout <ArrowRight className="h-4 w-4 ml-1"/></button>
                   </div>
                   <FeaturedSlider trips={trips} onSelectProduct={selectTrip} onCreatePrivate={() => handleCreatePrivate()} />
                </div>
             </div>

             <UpcomingAdventures onSelectTrip={selectTrip} allTrips={trips} allEvents={events} />

             {/* SECTION PHILOSOPHIE & PRIVE */}
             <div className="py-12 bg-white">
                <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                   <div className="order-2 md:order-1">
                      <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">Excellence & Discrétion</span>
                      <h2 className="text-3xl font-serif font-bold text-brand-dark mt-2 mb-4">Le Sur-Mesure Professionnel</h2>
                      <div className="prose text-gray-600 mb-6 leading-relaxed text-sm">
                          <p>Au-delà de la convivialité de nos groupes, <strong>Life Travel excelle dans l'art du voyage privé Haute Couture</strong>.</p>
                          <p>Pour les couples en quête d'intimité, les familles exigeantes ou les délégations professionnelles, nous concevons des itinéraires fluides : accueil VIP, sécurité renforcée et accès exclusifs.</p>
                      </div>
                      <button onClick={() => handleCreatePrivate()} className="px-6 py-4 bg-brand-dark text-white rounded-xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-lg text-base w-full md:w-auto justify-center"><Gem className="h-5 w-5 text-brand-gold"/> Concevoir mon Séjour Privé</button>
                   </div>
                   <div className="relative order-1 md:order-2 flex justify-center hidden md:flex">
                      <div className="w-full max-w-sm h-56 relative rounded-2xl overflow-hidden shadow-2xl group">
                          <img src="https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 text-white font-serif italic text-lg">"L'authenticité sans compromis."</div>
                      </div>
                   </div>
                </div>
             </div>

             <TestimonialsSlider />
           </>
        )}
        {view === 'agenda' && <CalendarView onSelectProduct={selectTrip} onCreatePrivate={() => handleCreatePrivate()} allTrips={trips} allEvents={events} />}
        {view === 'guide' && <TravelGuideView />}
        {view === 'commitments' && <CommitmentView />}
        {view === 'faq' && <FAQView />}
        {view === 'legal' && <LegalView />}
        {view === 'create-private' && <CreatePrivateTripView onBack={handleBack} addToast={addToast} addToCart={handleWizardAddToCart} allTrips={trips} initialDestination={wizardDestination} />}
        {view === 'account' && <ClientDashboard user={user} onLogout={() => setUser(null)} />}
        {view === 'excursions' && (
           <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto animate-fade-in-up">
              <h1 className="text-4xl font-serif font-bold mb-10 text-center text-brand-dark">Catalogue Complet</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {trips.map((t: Trip, i) => (
                    <div key={t.id} onClick={() => selectTrip(t)} className="cursor-pointer group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100 flex flex-col h-[400px] relative hover:-translate-y-1 duration-300">
                       <img src={optimizeImage(t.image, 600)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                       
                       <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                           {t.type === 'Privé' && (
                               <span className="bg-brand-gold text-brand-dark px-3 py-1 rounded-lg text-xs font-bold uppercase shadow-lg flex items-center gap-1"><Gem className="h-3 w-3"/> Privé</span>
                           )}
                           <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold uppercase border border-white/30">{t.category}</span>
                       </div>

                       <div className="absolute bottom-0 p-6 text-white w-full">
                           <div className="flex items-center gap-2 mb-2 text-gray-300 text-xs font-bold uppercase tracking-wider">
                                <MapPin className="h-3 w-3 text-brand-gold"/> {t.location}
                           </div>
                           <h3 className="font-bold text-2xl mb-2 text-white leading-tight">{t.title}</h3>
                           <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto">{t.shortDescription}</p>
                           
                           <div className="flex items-center gap-4 border-t border-white/20 pt-4">
                               <div className="flex flex-col">
                                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">À partir de</span>
                                   <span className="text-white font-bold text-xl">{t.priceDisplay}</span>
                               </div>
                               <div className="ml-auto flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-white">
                                   <Clock className="h-3 w-3 text-brand-gold"/>
                                   <span className="text-xs font-bold">{t.duration}</span>
                               </div>
                           </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
        {view === 'detail' && trip && <ProductDetailView trip={trip} initialDate={selectedAgendaDate} onBack={handleBack} addToCart={handleProductAddToCart} onSelectTrip={selectTrip} addToast={addToast} onCreatePrivate={handleCreatePrivate} allEvents={events} allTrips={trips} editingItem={editingCartItem} />}
        {view === 'checkout' && <CheckoutView cart={cart} onUpdateCart={setCart} user={user} onLoginReq={() => setAuthOpen(true)} onSelectTrip={selectTrip} allTrips={trips} onEditItem={handleEditCartItem} />}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 px-6 pb-24 md:pb-12">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-500">
            <div className="col-span-2 md:col-span-1">
               <img src="https://life-travel.org/wp-content/uploads/2024/09/1000052168-removebg-preview-190x98.png" className="h-8 mb-4"/>
               <p className="leading-relaxed mb-4 text-xs">Agence agréée par le Ministère du Tourisme.<br/>Partenaire du développement local et de l'authenticité.</p>
               <div className="flex flex-col gap-1 text-[10px]">
                   <span>{SITE_SETTINGS.address}</span>
                   <span>{SITE_SETTINGS.rc}</span>
               </div>
            </div>
            
            <div>
                <h4 className="font-bold text-brand-dark mb-4 uppercase text-xs tracking-widest">Navigation</h4>
                <ul className="space-y-2">
                    <li onClick={()=>navigate('excursions')} className="cursor-pointer hover:text-brand-green">Nos Séjours</li>
                    <li onClick={()=>navigate('agenda')} className="cursor-pointer hover:text-brand-green">Agenda Départs</li>
                    <li onClick={()=>navigate('create-private')} className="cursor-pointer hover:text-brand-green">Voyage Privé</li>
                    <li onClick={()=>navigate('guide')} className="cursor-pointer hover:text-brand-green">Infos Pratiques</li>
                </ul>
            </div>
            
            <div>
                 <h4 className="font-bold text-brand-dark mb-4 uppercase text-xs tracking-widest">Informations</h4>
                 <ul className="space-y-2">
                    <li onClick={()=>navigate('faq')} className="cursor-pointer hover:text-brand-green">FAQ</li>
                    <li onClick={()=>navigate('legal')} className="cursor-pointer hover:text-brand-green">Mentions Légales</li>
                    <li onClick={()=>navigate('commitments')} className="cursor-pointer hover:text-brand-green">Notre Impact</li>
                 </ul>
            </div>

            <div>
                 <h4 className="font-bold text-brand-dark mb-4 uppercase text-xs tracking-widest">Nous Suivre</h4>
                 <div className="flex gap-4">
                     <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-dark hover:text-white transition-colors"><Facebook className="h-4 w-4"/></a>
                 </div>
                 <a href={generateWhatsAppLink('default')} className="mt-4 inline-flex items-center gap-2 text-brand-green font-bold text-xs border border-brand-green px-3 py-2 rounded-full hover:bg-brand-green hover:text-white transition-colors">
                     <MessageCircle className="h-3 w-3"/> Service Client
                 </a>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
             © 2024 Life Travel Cameroun. Tous droits réservés.
         </div>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
