
export interface UserTripHistory {
    id: string;
    tripId: number;
    tripTitle: string;
    date: string;
    status: 'completed' | 'upcoming' | 'cancelled';
    reviewed: boolean;
}

export interface PaymentMethod {
    id: string;
    type: 'OM' | 'MOMO' | 'VISA';
    label: string;
    detail: string;
    isDefault: boolean;
}

export interface UserPreferences {
    emailMarketing: boolean;
    whatsappUpdates: boolean;
    smsAlerts: boolean;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  avatar: string;
  tier: string;
  points: number;
  history: UserTripHistory[];
  paymentMethods: PaymentMethod[];
  preferences: UserPreferences;
}

export interface Review {
  id: number;
  userId: number;
  tripId?: number;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface TripOption {
  id: string; 
  name: string;
  price: number;
  type: 'checkbox' | 'quantity';
  category: 'extra' | 'activity';
  description?: string;
}

export interface Trip {
  id: number;
  title: string;
  sku: string;
  shortDescription: string;
  fullDescription: string;
  inclusions: string[];
  exclusions: string[];
  departureCity: string;
  duration: string;
  priceDisplay: string;
  basePrice: number;
  spots: number;
  image: string;
  type: 'Groupe' | 'Privé' | 'Sur Mesure'; 
  category: string;
  location: string;
  loyaltyPoints: number;
  availableOptions?: TripOption[];
  suitability?: string[]; // New field for tags like "Couple", "Famille", "Luxe"
}

export interface AgendaEvent {
  id: number;
  tripId: number;
  date: Date;
  status: 'disponible' | 'complet' | 'bientot';
}

export interface CartItem {
  id: string;
  trip: Trip;
  date: string;
  participants: number;
  options: { [key: string]: number };
  totalPrice: number;
  tripTitle?: string;
}
