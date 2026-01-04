
import React, { useState, useRef, useEffect } from 'react';
import { 
  Scale, MessageCircle, FileText, Globe, ShieldCheck, 
  Globe2, Building2, Leaf, UserCheck, Utensils, History,
  Info, Check, Lightbulb, Users2, HandHeart, Plane, Syringe, Banknote,
  ChevronLeft, ChevronRight, Handshake, HeartHandshake, AlertTriangle, ArrowDownCircle, Shield, Link2
} from 'lucide-react';
import { generateWhatsAppLink } from './utils';
import { SITE_SETTINGS, FAQ_ITEMS, SECURITY_DATA, CULTURE_DATA, COMMITMENT_CARDS } from './data';

export const LegalView = () => (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen animate-fade-in-up">
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-serif font-bold text-brand-dark mb-8 text-center">Mentions Légales & CGV</h1>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 text-sm text-gray-600">
                <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2 flex items-center gap-2"><Scale className="h-5 w-5 text-brand-gold"/> 1. Mentions Légales</h2>
                    <p>Le site Life Travel Cameroun est édité par l'agence Life Travel, société agréée par le Ministère du Tourisme et des Loisirs.</p>
                    <ul className="mt-2 list-disc pl-5">
                        <li>Siège Social : {SITE_SETTINGS.address}</li>
                        <li>Registre de Commerce : {SITE_SETTINGS.rc}</li>
                        <li>Directeur de la publication : Direction Life Travel</li>
                        <li>Contact : {SITE_SETTINGS.contactEmail}</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2">2. Conditions Générales de Vente (CGV)</h2>
                    <p className="mb-2"><strong>Réservation :</strong> Toute réservation n'est confirmée qu'après réception du paiement (total ou acompte selon l'offre).</p>
                    <p className="mb-2"><strong>Annulation :</strong></p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Plus de 30 jours avant le départ : Remboursement 100% (hors frais dossier).</li>
                        <li>Entre 15 et 30 jours : Remboursement 50%.</li>
                        <li>Moins de 15 jours : Pas de remboursement (sauf cas de force majeure).</li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
);

export const FAQView = () => (
  <div className="pt-24 pb-20 bg-gray-50 min-h-screen animate-fade-in-up">
     <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-center text-brand-dark mb-10">Questions Fréquentes</h1>
        <div className="space-y-4">
           {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                 <h3 className="font-bold text-lg text-brand-dark mb-2 flex items-start gap-3">
                    <span className="bg-brand-light text-brand-green w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1">?</span>
                    {item.q}
                 </h3>
                 <p className="text-gray-600 pl-9 leading-relaxed">{item.a}</p>
              </div>
           ))}
        </div>
        <div className="mt-12 text-center">
            <a href={generateWhatsAppLink('default')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                <MessageCircle className="h-5 w-5"/> Discuter sur WhatsApp
            </a>
        </div>
     </div>
  </div>
);

export const TravelGuideView = () => {
    const [activeTab, setActiveTab] = useState<'culture' | 'security' | 'visa'>('visa');
    const scrollRef = useRef<HTMLDivElement>(null);
    const cultureScrollRef = useRef<HTMLDivElement>(null);
    const securityScrollRef = useRef<HTMLDivElement>(null);
    
    // Etats pour gérer le dépliement des cartes
    const [expandedCulture, setExpandedCulture] = useState<number | null>(null);
    const [expandedSecurity, setExpandedSecurity] = useState<number | null>(null);

    const tabs = [
        { id: 'visa', label: 'Pratique & Visa', icon: <Plane className="h-4 w-4"/> },
        { id: 'culture', label: 'Culture & Régions', icon: <Globe2 className="h-4 w-4"/> },
        { id: 'security', label: 'Sécurité', icon: <ShieldCheck className="h-4 w-4"/> },
    ];

    const handleTabClick = (id: any, index: number) => {
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

    const scrollContent = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
        if (ref.current) {
            const scrollAmount = 350; // Ajusté pour scroller une carte entière
            ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="pt-24 pb-20 bg-gray-50 min-h-screen animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-6">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">Guide du Voyageur</h1>
                    
                    {/* Navigation Tabs - Slider Mobile Sticky */}
                    <div className="sticky top-20 z-30 bg-gray-50/95 backdrop-blur py-3 -mx-4 px-4 md:static md:bg-transparent md:p-0 md:mx-0 shadow-sm md:shadow-none group/tabs">
                        <div className="relative flex items-center">
                            <button onClick={() => scrollTabs('left')} className="absolute left-0 z-20 p-2 rounded-full bg-white/90 shadow-md text-brand-dark hover:bg-white border border-gray-100 hidden md:flex md:-ml-4 active:scale-95"><ChevronLeft className="h-5 w-5"/></button>
                            <button onClick={() => scrollTabs('left')} className="absolute left-0 z-20 p-1.5 rounded-full bg-gradient-to-r from-white via-white to-transparent md:hidden text-brand-dark"><ChevronLeft className="h-5 w-5"/></button>

                            <div ref={scrollRef} className="flex overflow-x-auto gap-3 pb-1 hide-scrollbar snap-x px-8 md:px-1 w-full md:justify-center scroll-smooth">
                                {tabs.map((tab, idx) => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => handleTabClick(tab.id, idx)}
                                        className={`snap-start shrink-0 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${activeTab === tab.id ? 'bg-brand-dark text-white border-brand-dark shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'}`}
                                    >
                                        {tab.icon} {tab.label}
                                    </button>
                                ))}
                            </div>

                            <button onClick={() => scrollTabs('right')} className="absolute right-0 z-20 p-2 rounded-full bg-white/90 shadow-md text-brand-dark hover:bg-white border border-gray-100 hidden md:flex md:-mr-4 active:scale-95"><ChevronRight className="h-5 w-5"/></button>
                            <button onClick={() => scrollTabs('right')} className="absolute right-0 z-20 p-1.5 rounded-full bg-gradient-to-l from-white via-white to-transparent md:hidden text-brand-dark"><ChevronRight className="h-5 w-5"/></button>
                        </div>
                    </div>
                </div>

                {activeTab === 'culture' && (
                    <div className="relative group/slider mt-6">
                         {/* Flèches de navigation visibles */}
                        <button onClick={() => scrollContent(cultureScrollRef, 'left')} className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white shadow-xl rounded-full text-brand-dark hover:scale-110 transition-transform border border-gray-100"><ChevronLeft className="h-6 w-6"/></button>
                        <button onClick={() => scrollContent(cultureScrollRef, 'right')} className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white shadow-xl rounded-full text-brand-dark hover:scale-110 transition-transform border border-gray-100"><ChevronRight className="h-6 w-6"/></button>

                        <div ref={cultureScrollRef} className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x snap-mandatory px-4 md:px-2 scroll-smooth items-start">
                            {CULTURE_DATA.map((item, idx) => (
                                <div key={idx} className="snap-center shrink-0 w-[85vw] md:w-[400px] bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-brand-green/30 transition-all flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-brand-green shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-brand-dark">{item.region}</h3>
                                            <p className="text-sm text-brand-gold font-bold uppercase">{item.peoples}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 leading-relaxed font-medium">{item.desc}</p>
                                    
                                    {/* Contenu Dépliable */}
                                    {expandedCulture === idx && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in text-sm text-gray-600 leading-relaxed">
                                            <p className="mb-2"><strong>Nature & Traditions :</strong> {item.details}</p>
                                            <p className="italic bg-gray-50 p-2 rounded-lg border border-gray-100 mt-2">Spécialité : {item.food}</p>
                                        </div>
                                    )}

                                    <div className="mt-auto pt-4 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <History className="h-3 w-3"/>
                                            <span>Histoire</span>
                                        </div>
                                        <button 
                                            onClick={() => setExpandedCulture(expandedCulture === idx ? null : idx)}
                                            className="flex items-center gap-1 text-xs font-bold text-brand-green hover:bg-green-50 px-3 py-1 rounded-full transition-colors"
                                        >
                                            {expandedCulture === idx ? 'Réduire' : 'En savoir plus'}
                                            <ArrowDownCircle className={`h-4 w-4 transition-transform ${expandedCulture === idx ? 'rotate-180' : ''}`}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in mt-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4 items-start mx-2">
                            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1"/>
                            <div>
                                <h3 className="font-bold text-blue-900 mb-2">Note de Confiance</h3>
                                <p className="text-blue-800 text-sm leading-relaxed">
                                    Voyagez l'esprit tranquille. Life Travel s'occupe de tout. Nos itinéraires sont vérifiés quotidiennement par nos équipes locales pour vous garantir une expérience 100% sereine.
                                </p>
                            </div>
                        </div>

                        <div className="relative group/slider">
                            {/* Flèches de navigation visibles */}
                            <button onClick={() => scrollContent(securityScrollRef, 'left')} className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white shadow-xl rounded-full text-brand-dark hover:scale-110 transition-transform border border-gray-100"><ChevronLeft className="h-6 w-6"/></button>
                            <button onClick={() => scrollContent(securityScrollRef, 'right')} className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white shadow-xl rounded-full text-brand-dark hover:scale-110 transition-transform border border-gray-100"><ChevronRight className="h-6 w-6"/></button>

                            <div ref={securityScrollRef} className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x snap-mandatory px-4 md:px-2 scroll-smooth items-start">
                                {SECURITY_DATA.map((item, idx) => (
                                    <div key={idx} className="snap-center shrink-0 w-[85vw] md:w-[350px] bg-white p-6 rounded-2xl shadow-sm border-l-4 border-gray-100 hover:shadow-md transition-all flex flex-col h-full" style={{borderLeftColor: item.status === 'safe' ? '#22c55e' : '#f59e0b'}}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg text-brand-dark">{item.area}</h3>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                item.status === 'safe' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {item.status === 'safe' ? 'Zone Verte' : 'Accès Réglementé'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3"><strong>Info :</strong> {item.advice}</p>
                                        
                                        {/* Contenu Dépliable */}
                                        {expandedSecurity === idx && (
                                            <div className="mt-2 pt-2 border-t border-gray-100 animate-fade-in text-sm text-gray-600 leading-relaxed mb-3">
                                                {item.details}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-2 flex justify-between items-center">
                                            <p className="text-brand-green text-xs font-medium flex items-center gap-1"><Shield className="h-3 w-3"/> Life Travel assure</p>
                                            <button 
                                                onClick={() => setExpandedSecurity(expandedSecurity === idx ? null : idx)}
                                                className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-full transition-colors"
                                            >
                                                {expandedSecurity === idx ? 'Réduire' : 'Détails'}
                                                <ArrowDownCircle className={`h-4 w-4 transition-transform ${expandedSecurity === idx ? 'rotate-180' : ''}`}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'visa' && (
                    <div className="max-w-4xl mx-auto animate-fade-in space-y-6 mt-6">
                        
                        {/* 1. LIEN OFFICIEL EN ÉVIDENCE (VERSION RASSURANTE) */}
                         <div className="bg-blue-50 border border-blue-200 p-6 rounded-3xl text-center shadow-sm relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-3 text-blue-600">
                                    <Link2 className="h-6 w-6"/>
                                </div>
                                <h3 className="text-xl font-bold text-blue-900 mb-2">Note de Sérénité - E-Visa</h3>
                                <p className="text-blue-800 text-sm mb-6 max-w-lg mx-auto">
                                    Pour simplifier votre arrivée, privilégiez le portail officiel. C'est simple, rapide et sécurisé.
                                </p>
                                <a href={SITE_SETTINGS.officialVisaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-700 border border-blue-200 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm hover:shadow-md transform">
                                    <Globe className="h-5 w-5"/> Accéder au Site Officiel (evisacam.cm)
                                </a>
                            </div>
                        </div>

                        {/* 2. Assistance Life Travel */}
                        <div className="bg-brand-dark text-white p-6 rounded-3xl relative overflow-hidden shadow-lg border border-brand-gold/30">
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shrink-0">
                                    <Handshake className="h-8 w-8 text-brand-gold"/>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                        <span className="px-3 py-1 bg-brand-green text-white text-[10px] font-bold uppercase rounded-full shadow-sm">Service Inclus</span>
                                        <h2 className="text-xl font-serif font-bold text-white">Nous vous accompagnons</h2>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-4">Besoin d'une lettre d'invitation ou d'un certificat d'hébergement pour votre dossier ? Notre service conciergerie s'en occupe pour vous.</p>
                                    <a href={generateWhatsAppLink('visa_help')} target="_blank" className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-xl font-bold hover:bg-brand-gold transition-colors shadow-md">
                                        <MessageCircle className="h-4 w-4 text-green-600"/> Contacter l'Assistance Visa
                                    </a>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        </div>

                        {/* 3. Infos Pratiques */}
                        <div className="grid md:grid-cols-2 gap-8">
                             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2"><Syringe className="h-6 w-6 text-brand-green"/> Santé & Bien-être</h3>
                                <ul className="space-y-3 text-gray-600 text-sm">
                                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5"/> <strong>Vaccin :</strong> Fièvre Jaune recommandée.</li>
                                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5"/> <strong>Prévention :</strong> Traitement anti-palu conseillé.</li>
                                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5"/> <strong>Eau :</strong> Eau minérale fournie durant les tours.</li>
                                </ul>
                             </div>
                             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2"><Banknote className="h-6 w-6 text-brand-green"/> Argent & Change</h3>
                                <ul className="space-y-3 text-gray-600 text-sm">
                                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5"/> <strong>Devise :</strong> Franc CFA (XAF).</li>
                                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5"/> <strong>Moyens :</strong> Cash pour souvenirs, Visa en ville.</li>
                                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5"/> <strong>Distributeurs :</strong> Disponibles dans toutes les grandes villes.</li>
                                </ul>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const CommitmentView = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
      <div className="pt-20 md:pt-24 pb-24 md:pb-20 bg-white min-h-screen animate-fade-in-up relative">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-6 md:mb-12">
                  <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">Notre Mission</span>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mt-2 mb-4">Voyager pour Impacter</h1>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-lg">
                      Life Travel n'est pas une simple agence de tourisme. C'est un projet militant pour la revalorisation du patrimoine camerounais et l'autonomisation des communautés locales.
                  </p>
              </div>
              
              {/* Desktop Grid / Mobile Slider Container */}
              <div className="relative group/slider">
                  <div className="flex justify-end gap-2 mb-2 md:hidden">
                       <button onClick={() => scroll('left')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><ChevronLeft className="h-4 w-4 text-gray-600"/></button>
                       <button onClick={() => scroll('right')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><ChevronRight className="h-4 w-4 text-gray-600"/></button>
                  </div>

                  <div ref={scrollRef} className="flex md:grid md:grid-cols-2 gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4 md:pb-0 items-start">
                      {COMMITMENT_CARDS.map((card) => (
                          <div key={card.id} className="snap-center shrink-0 w-[85vw] md:w-auto bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all group h-full flex flex-col relative overflow-hidden">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${card.colorClass} group-hover:scale-110 transition-transform`}>
                                  {card.icon}
                              </div>
                              <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">{card.title}</h3>
                              <p className="text-gray-600 mb-4 leading-relaxed font-medium">{card.desc}</p>
                              
                              {/* Contenu Dépliable */}
                              {expandedCard === card.id && (
                                  <div className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-4 animate-fade-in">
                                      {card.content}
                                  </div>
                              )}

                              <div className="mt-auto pt-4 flex justify-between items-center">
                                  <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">{card.more}</span>
                                  <button 
                                    onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center gap-1 text-xs font-bold text-gray-500"
                                  >
                                      {expandedCard === card.id ? 'Réduire' : 'Lire plus'}
                                      <ArrowDownCircle className={`h-5 w-5 transition-transform ${expandedCard === card.id ? 'rotate-180' : ''}`}/>
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Desktop CTA Banner */}
              <div className="hidden md:block mt-16 bg-brand-dark rounded-3xl p-12 text-white text-center relative overflow-hidden">
                  <div className="relative z-10">
                      <HandHeart className="h-16 w-16 text-brand-gold mx-auto mb-6"/>
                      <h2 className="text-3xl font-serif font-bold mb-4">Devenez Partenaire du Changement</h2>
                      <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                          ONG, Investisseurs, Diaspora : nous avons des projets concrets (écolodges, formation, artisanat) qui n'attendent que votre soutien pour décoller.
                      </p>
                      <a href={generateWhatsAppLink('partnership')} target="_blank" rel="noreferrer" className="inline-block px-8 py-4 bg-white text-brand-dark rounded-full font-bold hover:bg-brand-gold transition-colors">
                          Proposer un Partenariat
                      </a>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                      <div className="absolute top-10 left-10 w-32 h-32 bg-brand-gold rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 right-10 w-64 h-64 bg-brand-green rounded-full blur-3xl"></div>
                  </div>
              </div>
          </div>

          {/* Mobile Sticky Bottom CTA for Partners */}
          <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-[60] shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-500 uppercase">ONG & Investisseurs</span>
                      <span className="font-serif font-bold text-brand-dark">Un projet ?</span>
                  </div>
                  <a href={generateWhatsAppLink('partnership')} target="_blank" className="flex items-center gap-2 px-5 py-3 bg-brand-dark text-brand-gold rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                      <HeartHandshake className="h-4 w-4"/> Collaborons
                  </a>
              </div>
          </div>
      </div>
    );
};
