// Modelo de Oferta para la plataforma Unveil UGC

// Incentivo ofrecido al creador (ej: cena, hospedaje, descuento, etc.)
export interface Incentive {
  type: string; // e.g., "Cena", "Hospedaje", "Descuento"
  description: string; // e.g., "Cena gratuita para 2 personas"
  value?: number; // Optional monetary value
}

// Estructura principal de una oferta de campaña para creadores UGC
export interface Offer {
  // --- BÁSICOS ---
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  description: string;
  category: string; // e.g., "Gastronomía", "Moda", "Viajes"
  requiredLevel: 'Principiante' | 'Intermedio' | 'Avanzado';
  incentive: Incentive;
  status: 'active' | 'pending' | 'completed' | 'rejected';
  createdAt: Date;
  expiresAt?: Date;

  // --- NUEVOS REQUISITOS ---
  country?: string;
  city?: string;
  isRemote?: boolean;
  rewardType?: 'monetary' | 'exchange' | 'gift' | 'experience';
  rewardValue?: number;
  rewardCurrency?: string;
  exchangeDetail?: string;
  giftDetail?: string;
  experienceDetail?: string;
  minFollowers?: number;
  platformsRequired?: string[];
  genderRequired?: 'male' | 'female' | 'any';
  ageRange?: [number, number];
  languagesRequired?: string[];
  contentType?: string[];
  deadline?: Date;
  mustAttendEvent?: boolean;
  exclusive?: boolean;
  ndaRequired?: boolean;
  maxApplicants?: number;
  availableSlots?: number;
  businessCategory?: string;
  isUrgent?: boolean;
  customTags?: string[];
}

// --- RESPUESTA DEL NEGOCIO ---
// Respuesta del negocio a una propuesta de creador
export interface BusinessResponse {
  offerId: string;
  creatorId: string;
  accepted: boolean;
  selectedDate?: Date;
  message?: string;
}

// --- PROPUESTAS DEL CREADOR ---
// Propuesta enviada por el creador con fechas sugeridas
export interface CreatorProposal {
  offerId: string;
  creatorId: string;
  proposedDates: Date[];
  message?: string;
}

// --- CAMPAÑAS ---
// Representa una campaña en la que participa el creador
export interface Campaign {
  id: string;
  businessId: string;
  userId: string;
  status: 'active' | 'completed' | 'pending' | 'rejected' | 'canceled';
  createdAt: Date;
  expiresAt?: Date;
}

