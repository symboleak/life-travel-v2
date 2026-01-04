
import React from 'react';
import { Globe2, Building2, Leaf, UserCheck, Lightbulb, Users2, HandHeart, Zap } from 'lucide-react';
import { UserProfile, Review, Trip, TripOption, AgendaEvent } from './types';

// Réexport des types pour compatibilité avec les imports existants dans d'autres fichiers si nécessaire
export * from './types';

// ============================================================================
// 🔒 COFFRE-FORT DE CONTENU (SANCTUARY FILE)
// ============================================================================

export const SITE_SETTINGS = {
  whatsappApiNumber: "237677614250", 
  whatsappDisplay: "+237 677 61 42 50",
  contactEmail: "contact@life-travel.org",
  officialVisaUrl: "https://www.evisacam.cm", 
  currency: "FCFA",
  agencyName: "Life Travel Cameroun",
  address: "Akwa, Douala, Cameroun - BP 1234",
  rc: "RC/DLA/2020/B/123",
  socialTag: "#LifeTravel237"
};

// ============================================================================
// DONNÉES DE BASE
// ============================================================================

export const MOCK_USER: UserProfile = {
  id: 1,
  name: "Jean Dupont",
  email: "jean.dupont@example.com",
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
  tier: "Voyageur",
  points: 150,
  history: [],
  paymentMethods: [],
  preferences: { emailMarketing: true, whatsappUpdates: true, smsAlerts: false }
};

export const ADMIN_USER: UserProfile = {
  id: 0,
  name: "Admin Life Travel",
  email: "admin@life-travel.org",
  avatar: "https://life-travel.org/wp-content/uploads/2024/09/1000052168-removebg-preview-190x98.png",
  tier: "Admin",
  points: 99999,
  history: [],
  paymentMethods: [],
  preferences: { emailMarketing: true, whatsappUpdates: true, smsAlerts: true }
};

const INITIAL_REVIEWS: Review[] = [
    {
        id: 101,
        userId: 2,
        rating: 5,
        date: "10 Oct 2023",
        comment: "Une expérience incroyable à Kribi. Les guides étaient fantastiques.",
        verified: true,
        tripId: 1
    },
    {
        id: 102,
        userId: 3,
        rating: 4,
        date: "15 Nov 2023",
        comment: "Très beau voyage, organisation fluide. Juste un petit retard au départ.",
        verified: true,
        tripId: 4
    },
    // AVIS GÉNÉRAUX AGENCE (SANS TRIP ID)
    {
        id: 901,
        userId: 5,
        rating: 5,
        date: "05 Dec 2023",
        comment: "Life Travel a changé ma vision du Cameroun. Un professionnalisme rare et une attention aux détails incroyable. Bravo !",
        verified: true
    },
    {
        id: 902,
        userId: 4,
        rating: 5,
        date: "12 Jan 2024",
        comment: "Je recommande à 100%. Sécurité, confort et surtout une équipe humaine et passionnée. C'est plus qu'une agence, c'est une famille.",
        verified: true
    },
    {
        id: 903,
        userId: 2,
        rating: 5,
        date: "20 Jan 2024",
        comment: "Service client impeccable via WhatsApp. Ils ont tout organisé pour notre délégation d'entreprise. Merci pour l'efficacité.",
        verified: true
    }
];

export const LOCATION_CONSTRAINTS: {[key: string]: {min: number, max: number}} = {
    "Kribi": { min: 2, max: 10 },
    "Île de Manoka": { min: 1, max: 2 },
    "Garoua": { min: 3, max: 15 },
    "Bafoussam": { min: 2, max: 7 },
    "Buea": { min: 1, max: 5 },
    "Edea": { min: 1, max: 3 },
    "Limbe": { min: 1, max: 7 }
};

export const WIZARD_EXTRAS: TripOption[] = [
    { id: "wiz_vip_welcome", name: "Accueil Aéroport VIP & Fast Track", price: 25000, type: "checkbox", category: "extra", description: "Ne faites pas la queue, passez les douanes en priorité." },
    { id: "wiz_sim_card", name: "Carte SIM Locale + Data 10Go", price: 10000, type: "quantity", category: "extra", description: "Restez connecté dès l'atterrissage." },
    { id: "wiz_private_car", name: "4x4 Climatisé avec Chauffeur / jour", price: 60000, type: "quantity", category: "extra", description: "Toyota Prado ou équivalent, carburant non inclus." },
    { id: "wiz_bodyguard", name: "Agent de Sécurité Privé / jour", price: 30000, type: "quantity", category: "extra", description: "Pour une sérénité totale lors de vos déplacements." },
    { id: "wiz_photo", name: "Photographe Pro / jour", price: 50000, type: "quantity", category: "extra", description: "Immortalisez vos souvenirs en haute qualité." },
    { id: "wiz_massage", name: "Séance Massage Traditionnel", price: 15000, type: "quantity", category: "activity", description: "Détente après l'excursion." },
    { id: "wiz_chef", name: "Chef Privé à domicile / repas", price: 20000, type: "quantity", category: "extra", description: "Découverte gastronomique privée." }
];

export const EXTRAS_GROUP: TripOption[] = [
  { id: "opt_beer", name: "Pack Apéro (Bières/Jus)", price: 3000, type: "quantity", category: "extra" },
  { id: "opt_tshirt", name: "T-Shirt Souvenir Life Travel", price: 5000, type: "quantity", category: "extra" },
  { id: "opt_seat", name: "Place Avant (Vue Panoramique)", price: 2000, type: "checkbox", category: "extra" }
];

export const TRIPS_MOCK: Trip[] = [
  {
    id: 1, title: "Détente à Kribi & Chutes de la Lobé", sku: "KRI-LOB",
    shortDescription: "Plages de sable blanc, chutes uniques au monde et villages pygmées.",
    fullDescription: "<p>Kribi est la perle balnéaire du Sud. Idéal pour décompresser. Nous privilégions les rencontres authentiques avec les pêcheurs locaux.</p>",
    location: "Kribi", departureCity: "Douala", duration: "1 Journée", priceDisplay: "30.000 FCFA", basePrice: 30000, spots: 20,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6", type: "Groupe", category: "Détente", loyaltyPoints: 300,
    inclusions: ["Transport Climatisé", "Entrée Chutes", "Déjeuner"], exclusions: ["Boissons", "Pourboires"],
    availableOptions: [...EXTRAS_GROUP, { id: "opt_langouste", name: "Menu Langouste VIP", price: 15000, type: "quantity", category: "extra" } as TripOption],
    suitability: ["Famille", "Couple", "Détente"]
  },
  {
    id: 2, title: "Île de Manoka & Mangroves", sku: "MAN-OKA",
    shortDescription: "Aventure en pirogue, visite de l'ancienne prison et immersion culturelle.",
    fullDescription: "<p>Une traversée historique dans l'estuaire du Wouri. Découvrez la mangrove et la vie insulaire.</p>",
    location: "Île de Manoka", departureCity: "Douala", duration: "1 Journée", priceDisplay: "25.000 FCFA", basePrice: 25000, spots: 30,
    image: "https://images.unsplash.com/photo-1518385061619-3b66df21b068", type: "Groupe", category: "Culture", loyaltyPoints: 250,
    inclusions: ["Pirogue", "Visite", "Repas"], exclusions: [],
    availableOptions: EXTRAS_GROUP,
    suitability: ["Aventure", "Histoire", "Groupe"]
  },
  { 
    id: 4, title: "Safari Parc de la Benoué", sku: "SAF-BEN", 
    shortDescription: "L'appel de la savane : Lions, Hippos et Girafes.", 
    fullDescription: "<p>Le grand nord Camerounais vous ouvre ses portes. Un voyage d'exception pour les amateurs de faune sauvage.</p>", 
    location: "Garoua", departureCity: "Douala", duration: "3 Jours", priceDisplay: "250.000 FCFA", basePrice: 250000, spots: 8, 
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801", type: "Privé", category: "Safari", loyaltyPoints: 2500, 
    inclusions: [], exclusions: [], 
    availableOptions: WIZARD_EXTRAS,
    suitability: ["Luxe", "Aventure", "Premium"] 
  },
  { id: 5, title: "Chefferies de l'Ouest", sku: "WEST-CUL", shortDescription: "Immersion traditions Bamiléké.", fullDescription: "<p>Architecture traditionnelle, musées royaux.</p>", location: "Bafoussam", departureCity: "Douala", duration: "2 Jours", priceDisplay: "65.000 FCFA", basePrice: 65000, spots: 15, image: "https://images.unsplash.com/photo-1544299863-7c858b998782", type: "Groupe", category: "Culture", loyaltyPoints: 650, inclusions: ["Transport", "Hébergement", "Guide"], exclusions: ["Repas du soir"], availableOptions: EXTRAS_GROUP, suitability: ["Culture", "Histoire", "Famille"] },
  { id: 6, title: "Mont Cameroun & Tea Road", sku: "MNT-TEA", shortDescription: "Randonnée douce et thé.", fullDescription: "Alternative au trek.", location: "Buea", departureCity: "Douala", duration: "1 Journée", priceDisplay: "20.000 FCFA", basePrice: 20000, spots: 20, image: "https://images.unsplash.com/photo-1596005553641-55c32822a16d", type: "Groupe", category: "Nature", loyaltyPoints: 200, inclusions: ["Transport", "Dégustation"], exclusions: [], availableOptions: EXTRAS_GROUP, suitability: ["Nature", "Sportif"] },
  { id: 7, title: "Sanctuaire de Pongo", sku: "PON-GO", shortDescription: "Rencontre avec les chimpanzés.", fullDescription: "Journée éco-responsable.", location: "Edea", departureCity: "Douala", duration: "1 Journée", priceDisplay: "36.000 FCFA", basePrice: 36000, spots: 12, image: "https://images.unsplash.com/photo-1548598198-d1df556d3548", type: "Groupe", category: "Nature", loyaltyPoints: 360, inclusions: ["Transport", "Entrée Sanctuaire"], exclusions: [], availableOptions: EXTRAS_GROUP, suitability: ["Eco-Tourisme", "Famille", "Nature"] },
  { id: 8, title: "Jardin Botanique de Limbe", sku: "LIM-BOT", shortDescription: "Biodiversité et plages.", fullDescription: "Visite botanique.", location: "Limbe", departureCity: "Douala", duration: "1 Journée", priceDisplay: "20.000 FCFA", basePrice: 20000, spots: 25, image: "https://images.unsplash.com/photo-1622312684551-76674390be10", type: "Groupe", category: "Détente", loyaltyPoints: 200, inclusions: ["Transport", "Entrée Jardin"], exclusions: [], availableOptions: EXTRAS_GROUP, suitability: ["Détente", "Famille", "Couple"] }
];

export const FAQ_ITEMS = [
    { q: "Comment se déroule la réservation ?", a: "Choisissez votre voyage, payez un acompte via Orange Money ou Carte Bancaire, et recevez votre confirmation instantanément sur WhatsApp." },
    { q: "Les voyages sont-ils sécurisés ?", a: "Absolument. La sécurité est notre priorité n°1. Nous ne voyageons que dans les zones sûres et nos véhicules sont suivis par GPS." },
    { q: "Puis-je annuler ma réservation ?", a: "Oui, l'annulation est gratuite jusqu'à 30 jours avant le départ. Entre 30 et 15 jours, 50% de frais s'appliquent." },
    { q: "Quels documents sont nécessaires ?", a: "Une pièce d'identité valide (CNI ou Passeport) est requise pour tous les voyageurs." },
    { q: "Acceptez-vous les enfants ?", a: "Oui, la plupart de nos excursions sont adaptées aux familles. Des tarifs réduits s'appliquent pour les moins de 12 ans." }
];

export const SECURITY_DATA = [
    { 
        area: "Zone Côtière (Kribi, Douala, Limbe)", 
        status: "safe", 
        advice: "Zone très sûre et touristique. Vigilance standard dans les grandes villes la nuit.", 
        solution: "Guides locaux certifiés et chauffeurs de confiance.",
        details: "Le Littoral est le cœur économique et touristique. La vie y est paisible et festive. Nos chauffeurs connaissent chaque quartier de Douala et chaque plage de Kribi pour vous garantir des déplacements fluides et sereins, de jour comme de nuit."
    },
    { 
        area: "Ouest (Bafoussam, Dschang)", 
        status: "safe", 
        advice: "Région calme et accueillante. Respectez les coutumes locales.", 
        solution: "Immersion encadrée par les chefferies.",
        details: "L'Ouest Cameroun est un havre de paix et de traditions. La sécurité y est assurée par une forte cohésion sociale. En visitant les chefferies avec Life Travel, vous êtes considérés comme des invités d'honneur, sous la protection bienveillante des communautés locales."
    },
    { 
        area: "Nord (Garoua, Maroua)", 
        status: "vigilance", 
        advice: "Déplacements en convoi recommandés dans certaines zones reculées.", 
        solution: "Escorte de sécurité incluse si nécessaire.",
        details: "Le Grand Nord offre des paysages époustouflants. Bien que la zone soit globalement stable, nous appliquons un principe de précaution maximale : itinéraires validés par les autorités, communication satellite et guides experts de la brousse."
    },
    { 
        area: "Nord-Ouest / Sud-Ouest (Hors Limbe)", 
        status: "restricted", 
        advice: "Nous ne proposons pas d'excursions dans ces zones actuellement.", 
        solution: "Sécurité avant tout.",
        details: "Votre sécurité passe avant tout profit. Nous surveillons la situation en temps réel et ne proposons aucune excursion dans les zones où la stabilité n'est pas garantie à 100%. Limbe reste une exception sécurisée que nous desservons."
    }
];

export const CULTURE_DATA = [
    { 
        region: "Le Littoral", 
        peoples: "Sawa & Douala", 
        icon: <Globe2 className="h-6 w-6"/>, 
        desc: "Le peuple de l'eau. Célèbre pour le festival Ngondo et les courses de pirogues.", 
        food: "Ndolé aux crevettes, Poisson braisé.", 
        history: "Porte d'entrée des explorateurs et colons.",
        details: "Le Littoral est une terre de mangrove et d'estuaires. Ici, l'eau est sacrée. Ne manquez pas de goûter au véritable Ndolé, plat national à base de feuilles amères, d'arachides et de crevettes fraîches de l'estuaire du Wouri."
    },
    { 
        region: "L'Ouest", 
        peoples: "Bamiléké", 
        icon: <Building2 className="h-6 w-6"/>, 
        desc: "Terre de traditions, de chefferies et d'art royal. Un commerce dynamique.", 
        food: "Kondre, Taro sauce jaune.", 
        history: "Royaumes centenaires et résistance.",
        details: "L'Ouest est le gardien des traditions. L'architecture des cases à palabres, les tissus Ndop et les danses de masques sont uniques au monde. La gastronomie est riche : le Taro à la sauce jaune est un plat de noblesse servi lors des grandes cérémonies."
    },
    { 
        region: "Le Sud", 
        peoples: "Beti & Pygmées", 
        icon: <Leaf className="h-6 w-6"/>, 
        desc: "La forêt équatoriale et l'hospitalité légendaire.", 
        food: "Mbol, Gibier.", 
        history: "Berceau de la culture Fang-Beti.",
        details: "Plongez au cœur de la forêt dense. Le Sud offre une connexion pure avec la nature. C'est ici que vivent les peuples de la forêt, gardiens d'une pharmacopée ancestrale. La cuisine y est forestière, avec des mets cuits à l'étouffée dans des feuilles de bananier."
    },
    { 
        region: "Le Nord", 
        peoples: "Peuls & Kirdis", 
        icon: <UserCheck className="h-6 w-6"/>, 
        desc: "Les grands lamidats, les fantasias et l'architecture en terre cuite.", 
        food: "Foléré, Bouillie de mil.", 
        history: "Carrefour des civilisations sahéliennes.",
        details: "Le dépaysement absolu. Des savanes immenses aux monts Mandara. La culture du Nord est marquée par l'héritage des grands empires sahéliens. Les fantasias (parades équestres) sont un spectacle inoubliable."
    }
];

export const COMMITMENT_CARDS = [
    { 
        id: 1, 
        title: "Éco-Tourisme", 
        desc: "Nous minimisons notre empreinte carbone et protégeons la biodiversité unique du Cameroun.", 
        more: "1 Voyage = 1 Arbre planté", 
        icon: <Leaf className="h-8 w-8 text-green-600"/>, 
        colorClass: "bg-green-100",
        content: "Notre engagement pour l'environnement est total. Nous bannissons le plastique à usage unique de nos excursions, privilégions les hébergements éco-responsables et finançons la reforestation locale. Chaque voyageur contribue directement à la préservation des parcs nationaux (Benoué, Waza, Lobé)."
    },
    { 
        id: 2, 
        title: "Impact Local", 
        desc: "L'argent de votre voyage bénéficie directement aux populations locales, sans intermédiaires inutiles.", 
        more: "100% des repas sont locaux", 
        icon: <Users2 className="h-8 w-8 text-blue-600"/>, 
        colorClass: "bg-blue-100",
        content: "Nous croyons en un tourisme équitable. Nos guides sont formés localement et rémunérés justement. Nous soutenons l'artisanat local en intégrant des visites d'ateliers et en encourageant l'achat direct. Les repas inclus sont préparés par des restaurateurs locaux avec des produits du terroir."
    },
    { 
        id: 3, 
        title: "Patrimoine & Culture", 
        desc: "Nous ne vendons pas du folklore, mais une immersion respectueuse dans les traditions vivantes.", 
        more: "Sauvegarde de la culture", 
        icon: <Building2 className="h-8 w-8 text-orange-600"/>, 
        colorClass: "bg-orange-100",
        content: "Le Cameroun compte plus de 250 ethnies. Notre mission est de valoriser cette diversité sans la dénaturer. Nous travaillons avec les chefferies traditionnelles pour restaurer des sites historiques et financer des festivals culturels, garantissant que le tourisme devienne un outil de fierté identitaire."
    },
    { 
        id: 4, 
        title: "Innovation & Sécurité", 
        desc: "La technologie au service de l'humain pour une expérience fluide et 100% sécurisée.", 
        more: "Tracking GPS & Paiement Mobile", 
        icon: <Lightbulb className="h-8 w-8 text-purple-600"/>, 
        colorClass: "bg-purple-100",
        content: "Nous allions authenticité et modernité. Notre flotte de véhicules est géolocalisée en temps réel pour une sécurité maximale. Nous avons digitalisé l'ensemble du processus de réservation et de paiement (Mobile Money, Visa) pour faciliter l'accès au Cameroun aux voyageurs du monde entier."
    }
];

const generateDates = () => {
    const dates: AgendaEvent[] = [];
    const today = new Date();
    // Generate some events for the next 3 months
    [1, 2, 4, 5, 6, 7, 8].forEach(tripId => {
        for (let i = 0; i < 4; i++) {
             const d = new Date(today);
             d.setDate(d.getDate() + (i * 14) + Math.floor(Math.random() * 10)); // Random dates
             dates.push({
                 id: parseInt(`${tripId}${i}`),
                 tripId: tripId,
                 date: d,
                 status: 'disponible'
             });
        }
    });
    return dates;
};

export const AGENDA_EVENTS_MOCK: AgendaEvent[] = generateDates();

// ============================================================================
// ⚠️ MOCK USERS & REVIEWS GENERATION (LEA SQUAD)
// ============================================================================

const generateLeaSquad = () => {
    const users: UserProfile[] = [];
    const reviews: Review[] = [];
    
    // Ajout des utilisateurs de base
    users.push(MOCK_USER);
    users.push(ADMIN_USER);
    users.push({ id: 2, name: "Sarah L.", email: "sarah@test.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", tier: "Voyageur", points: 120, history: [], paymentMethods: [], preferences: { emailMarketing: true, whatsappUpdates: true, smsAlerts: false } });
    users.push({ id: 3, name: "Jean-Paul K.", email: "jp@test.com", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200", tier: "VIP", points: 3000, history: [], paymentMethods: [], preferences: { emailMarketing: true, whatsappUpdates: true, smsAlerts: false } });
    users.push({ id: 4, name: "Mélanie & Tom", email: "couple@test.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200", tier: "Voyageur", points: 450, history: [], paymentMethods: [], preferences: { emailMarketing: true, whatsappUpdates: true, smsAlerts: false } });
    users.push({ id: 5, name: "Dr. Hassan", email: "hassan@test.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", tier: "Elite", points: 15000, history: [], paymentMethods: [], preferences: { emailMarketing: true, whatsappUpdates: true, smsAlerts: false } });

    // Ajout des reviews de base et générales
    reviews.push(...INITIAL_REVIEWS);

    const commentsPool = [
        "Un voyage inoubliable, merci Life Travel !",
        "Organisation au top, je recommande vivement.",
        "Le guide était passionnant et très attentif.",
        "Une découverte authentique du Cameroun.",
        "Sécurité impeccable, je me suis senti rassuré tout le long.",
        "Les paysages étaient à couper le souffle.",
        "Une expérience humaine enrichissante.",
        "Le repas local était délicieux.",
        "Transport confortable et climatisé, parfait.",
        "J'ai adoré l'ambiance du groupe."
    ];

    for (let i = 1; i <= 30; i++) {
        const userId = 100 + i;
        const name = i === 1 ? "Lea" : `Lea ${i}`;
        const email = `lea${i === 1 ? '' : i}@test.com`; // MdP: 1234 (virtuel)
        
        const hasHistory = Math.random() > 0.3; // 70% ont un historique
        const history: any[] = [];
        
        if (hasHistory) {
            const nbTrips = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < nbTrips; j++) {
                const trip = TRIPS_MOCK[Math.floor(Math.random() * TRIPS_MOCK.length)];
                const isCompleted = Math.random() > 0.2;
                
                history.push({
                    id: `CMD-LEA-${userId}-${j}`,
                    tripId: trip.id,
                    tripTitle: trip.title,
                    date: "2023-11-20",
                    status: isCompleted ? 'completed' : 'upcoming',
                    reviewed: isCompleted && Math.random() > 0.3
                });

                if (isCompleted && Math.random() > 0.3) {
                    reviews.push({
                        id: userId * 1000 + j,
                        userId: userId,
                        tripId: trip.id,
                        rating: Math.floor(Math.random() * 2) + 4, // 4 ou 5
                        date: "2023-12-01",
                        verified: true,
                        comment: commentsPool[Math.floor(Math.random() * commentsPool.length)]
                    });
                }
            }
        }

        users.push({
            id: userId,
            name: name,
            email: email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            tier: history.length > 2 ? "VIP" : "Voyageur",
            points: history.length * 100,
            history: history,
            paymentMethods: [],
            preferences: { emailMarketing: false, whatsappUpdates: false, smsAlerts: false }
        });
    }

    return { users, reviews };
};

const generatedData = generateLeaSquad();
export const MOCK_USERS_DB = generatedData.users;
export const REVIEWS_MOCK = generatedData.reviews;
