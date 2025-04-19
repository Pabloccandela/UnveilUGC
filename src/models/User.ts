// Modelo de Usuario para la plataforma Unveil UGC

// Perfil de red social vinculado al usuario
export type SocialMediaProfile = {
  platform: string;
  username: string;
};

// Reseña de un negocio hacia el usuario
export type UserReview = {
  textReview: string;
  businessId: string;
  stars: number;
};

// Estadísticas del usuario (campañas, reviews, nivel)
export type UserStats = {
  campaigns: number;
  reviews: UserReview[];
  level: string;
};

// Rol del usuario en la plataforma
export type UserRole = 'guest' | 'creator' | 'business';

// Estructura principal de un usuario/creador
export interface User {
  id: string;
  fullName: string;
  password: string;
  email: string;
  role: UserRole;
  country: string;
  city: string;
  socialMedia: SocialMediaProfile[];
  stats: UserStats;
  interests: string[];
  contentTypes?: string[]; // Tipos de contenido que el usuario puede crear (post, story, video, reel, etc.)
  gender?: string;         // Género del usuario (male, female, other)
  birthDate?: string;      // Fecha de nacimiento en formato ISO
  languages?: string[];    // Idiomas que habla el usuario
}
