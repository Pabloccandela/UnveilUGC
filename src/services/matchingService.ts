/**
 * Servicio de matching para la plataforma Unveil UGC
 * Implementa la lógica de negocio para conectar creadores con ofertas relevantes
 *
 * Este servicio se encarga de filtrar y ordenar ofertas para los creadores,
 * así como gestionar las propuestas y el estado de las campañas simuladas.
 */
import { Offer, CreatorProposal, Campaign } from '../models/Offer';
import { User } from '../models/User';
import { MOCK_OFFERS, MOCK_CAMPAIGNS_STATUS } from './mockData';

// Almacena las propuestas enviadas por los usuarios y se usa como campañas
export const userProposals: Campaign[] = [];

// Variable para alternar entre aceptación y rechazo (una sí, una no)
let alternateAccept = true;

/**
 * MatchingService: Servicio principal para emparejar ofertas con usuarios
 * basado en múltiples criterios de relevancia y compatibilidad
 */
export class MatchingService {
  /**
   * Obtiene todas las ofertas disponibles sin filtrar
   * @returns Array con todas las ofertas
   */
  static getAllOffers(): Offer[] {
    return MOCK_OFFERS;
  }

  /**
   * Filtra y ordena ofertas para un usuario específico basado en múltiples criterios
   * 
   * @param user Usuario para el que se filtran las ofertas
   * @returns Array de ofertas ordenadas por relevancia
   */
  static getMatchingOffersForUser(user: User): Offer[] {
    if (!user) return [];

    // Obtener los businessIds de las campañas completas o canceladas del usuario
    const completedOrCanceledBusinessIds = userProposals
      .filter(campaign => 
        campaign.userId === user.id && 
        (campaign.status === 'completed' || campaign.status === 'canceled')
      )
      .map(campaign => campaign.businessId);

    // Orden de niveles para comparaciones
    const LEVEL_ORDER = ['Principiante', 'Intermedio', 'Avanzado'];
    const userLevelIndex = LEVEL_ORDER.indexOf(user.stats.level);

    // Umbral mínimo de compatibilidad (60%)
    const MIN_SCORE = 0.6;
    
    // Pesos de cada criterio para el cálculo del score total (100%)
    const WEIGHTS = {
      level: 0.25,          // Nivel requerido (25%)
      interest: 0.25,       // Intereses/categoría (25%)
      location: 0.15,       // Localización (15%)
      platforms: 0.15,      // Plataformas requeridas (15%)
      contentType: 0.10,    // Tipo de contenido (10%)
      mustAttendEvent: 0.05, // Asistencia a evento (5%)
      exclusive: 0.05,      // Exclusividad (5%)
    };

    /**
     * Calcula el score de compatibilidad entre una oferta y el usuario
     * @param offer Oferta a evaluar
     * @returns Puntuación de 0 a 1 que representa la compatibilidad
     */
    function getOfferScore(offer: Offer): number {
      let score = 0;
      
      // 1. NIVEL (25%) - Criterio excluyente si el usuario no cumple el mínimo
      if (offer.requiredLevel) {
        const offerLevelIndex = LEVEL_ORDER.indexOf(offer.requiredLevel);
        if (offerLevelIndex <= userLevelIndex) {
          score += WEIGHTS.level; // Usuario cumple o supera el nivel requerido
        } else {
          return 0; // Usuario no alcanza el nivel mínimo, descartamos la oferta
        }
      } else {
        score += WEIGHTS.level; // Sin requisito de nivel, todos califican
      }
      
      // 2. INTERESES (25%) - Coincidencia por categoría o tags relacionados
      // 2. INTERESES (criterio excluyente por categoría)
      if (offer.category && user.interests) {
        if (user.interests.includes(offer.category)) {
          // Coincidencia directa con la categoría
          score += WEIGHTS.interest;
        } else {
          // Si la categoría no coincide, descartar la oferta
          return 0;
        }
      }
      
      // 3. LOCALIZACIÓN (15%) - Relevancia geográfica
      let locationScore = 0;
      if (offer.isRemote) {
        // Trabajo remoto, ubicación irrelevante
        locationScore = WEIGHTS.location;
      } else if (offer.country && user.country && offer.country === user.country) {
        // Coincidencia de país (60% del peso)
        locationScore += WEIGHTS.location * 0.6;
        
        // Bonus por coincidencia de ciudad (40% adicional)
        if (offer.city && user.city && offer.city === user.city) {
          locationScore += WEIGHTS.location * 0.4;
        }
      }
      score += locationScore;
      
      // 4. PLATAFORMAS (15%) - Compatibilidad con redes sociales del usuario
      if (offer.platformsRequired && offer.platformsRequired.length > 0) {
        const userPlatforms = user.socialMedia?.map(s => s.platform) || [];
        
        // Porcentaje de plataformas requeridas que tiene el usuario
        const matchedPlatforms = offer.platformsRequired.filter(p => 
          userPlatforms.includes(p)).length;
        const platformsScore = (matchedPlatforms / offer.platformsRequired.length) 
          * WEIGHTS.platforms;
        
        score += platformsScore;
      } else {
        score += WEIGHTS.platforms; // Sin requisitos específicos
      }
      
      // 5. TIPO DE CONTENIDO (10%) - Compatibilidad con habilidades del usuario
      if (offer.contentType && offer.contentType.length > 0 && user.contentTypes) {
        // Porcentaje de tipos de contenido que el usuario puede crear
        const matchedContentTypes = offer.contentType.filter(c => 
          user.contentTypes?.includes(c)).length;
        const contentTypeScore = (matchedContentTypes / offer.contentType.length) 
          * WEIGHTS.contentType;
        
        score += contentTypeScore;
      } else {
        score += WEIGHTS.contentType; // Sin requisitos específicos
      }
      
      // 6. ASISTENCIA A EVENTO (5%)
      if (offer.mustAttendEvent !== undefined) {
        if (offer.mustAttendEvent && offer.city && user.city && offer.city === user.city) {
          // Requiere asistencia y usuario está en la misma ciudad
          score += WEIGHTS.mustAttendEvent;
        } else if (!offer.mustAttendEvent) {
          // No requiere asistencia presencial
          score += WEIGHTS.mustAttendEvent;
        }
        // Si requiere asistencia pero usuario está en otra ciudad, no suma puntos
      }
      
      // 7. EXCLUSIVIDAD (5%)
      if (offer.exclusive !== undefined) {
        // Por ahora sumamos siempre (podría mejorarse con preferencias del usuario)
        score += WEIGHTS.exclusive;
      }
      
      console.log(`Score para ${offer.title}: ${score}`);
      return score;
    }

    // Procesa todas las ofertas, calcula scores, filtra y ordena por relevancia
    return MOCK_OFFERS
      // Filtrar ofertas de negocios con campañas completas o canceladas
      .filter(offer => !completedOrCanceledBusinessIds.includes(offer.businessId))
      .map(offer => ({ offer, score: getOfferScore(offer) }))
      .filter(item => item.score >= MIN_SCORE) // Solo ofertas con al menos 60% de compatibilidad
      .sort((a, b) => b.score - a.score) // Ordena de mayor a menor relevancia
      .map(item => item.offer); // Devuelve solo las ofertas sin los scores
  }

  /**
   * Versión extendida de getMatchingOffersForUser que incluye detalles de coincidencia
   * 
   * @param user Usuario para el que se filtran las ofertas
   * @returns Array de objetos con oferta, puntuación y detalles de coincidencia
   */
  static getMatchingOffersWithDetailsForUser(user: User): { offer: Offer, score: number, matches: string[] }[] {
    if (!user) return [];

    // Obtener los businessIds de las campañas completas o canceladas del usuario
    const completedOrCanceledBusinessIds = userProposals
      .filter(campaign => 
        campaign.userId === user.id && 
        (campaign.status === 'completed' || campaign.status === 'canceled')
      )
      .map(campaign => campaign.businessId);

    // Orden de niveles para comparaciones
    const LEVEL_ORDER = ['Principiante', 'Intermedio', 'Avanzado'];
    const userLevelIndex = LEVEL_ORDER.indexOf(user.stats.level);

    // Umbral mínimo de compatibilidad (40%)
    const MIN_SCORE = 0.4;
    
    // Pesos de cada criterio para el cálculo del score total (100%)
    const WEIGHTS = {
      level: 0.25,          // Nivel requerido (25%)
      interest: 0.25,       // Intereses/categoría (25%)
      location: 0.15,       // Localización (15%)
      platforms: 0.15,      // Plataformas requeridas (15%)
      contentType: 0.10,    // Tipo de contenido (10%)
      mustAttendEvent: 0.05, // Asistencia a evento (5%)
      exclusive: 0.05,      // Exclusividad (5%)
    };

    /**
     * Calcula el score de compatibilidad entre una oferta y el usuario
     * @param offer Oferta a evaluar
     * @returns Puntuación de 0 a 1 que representa la compatibilidad
     */
    function getOfferScore(offer: Offer): number {
      let score = 0;
      
      // 1. NIVEL (25%) - Criterio excluyente si el usuario no cumple el mínimo
      if (offer.requiredLevel) {
        const offerLevelIndex = LEVEL_ORDER.indexOf(offer.requiredLevel);
        if (offerLevelIndex <= userLevelIndex) {
          score += WEIGHTS.level; // Usuario cumple o supera el nivel requerido
        } else {
          return 0; // Usuario no alcanza el nivel mínimo, descartamos la oferta
        }
      } else {
        score += WEIGHTS.level; // Sin requisito de nivel, todos califican
      }
      
      // 2. INTERESES (25%) - Coincidencia por categoría o tags relacionados
      // 2. INTERESES (criterio excluyente por categoría)
      if (offer.category && user.interests) {
        if (user.interests.includes(offer.category)) {
          // Coincidencia directa con la categoría
          score += WEIGHTS.interest;
        } else {
          // Si la categoría no coincide, descartar la oferta
          return 0;
        }
      }
      
      // 3. LOCALIZACIÓN (15%) - Relevancia geográfica
      let locationScore = 0;
      if (offer.isRemote) {
        // Trabajo remoto, ubicación irrelevante
        locationScore = WEIGHTS.location;
      } else if (offer.country && user.country && offer.country === user.country) {
        // Coincidencia de país (60% del peso)
        locationScore += WEIGHTS.location * 0.6;
        
        // Bonus por coincidencia de ciudad (40% adicional)
        if (offer.city && user.city && offer.city === user.city) {
          locationScore += WEIGHTS.location * 0.4;
        }
      }
      score += locationScore;
      
      // 4. PLATAFORMAS (15%) - Compatibilidad con redes sociales del usuario
      if (offer.platformsRequired && offer.platformsRequired.length > 0) {
        const userPlatforms = user.socialMedia?.map(s => s.platform) || [];
        
        // Porcentaje de plataformas requeridas que tiene el usuario
        const matchedPlatforms = offer.platformsRequired.filter(p => 
          userPlatforms.includes(p)).length;
        const platformsScore = (matchedPlatforms / offer.platformsRequired.length) 
          * WEIGHTS.platforms;
        
        score += platformsScore;
      } else {
        score += WEIGHTS.platforms; // Sin requisitos específicos
      }
      
      // 5. TIPO DE CONTENIDO (10%) - Compatibilidad con habilidades del usuario
      if (offer.contentType && offer.contentType.length > 0 && user.contentTypes) {
        // Porcentaje de tipos de contenido que el usuario puede crear
        const matchedContentTypes = offer.contentType.filter(c => 
          user.contentTypes?.includes(c)).length;
        const contentTypeScore = (matchedContentTypes / offer.contentType.length) 
          * WEIGHTS.contentType;
        
        score += contentTypeScore;
      } else {
        score += WEIGHTS.contentType; // Sin requisitos específicos
      }
      
      // 6. ASISTENCIA A EVENTO (5%)
      if (offer.mustAttendEvent !== undefined) {
        if (offer.mustAttendEvent && offer.city && user.city && offer.city === user.city) {
          // Requiere asistencia y usuario está en la misma ciudad
          score += WEIGHTS.mustAttendEvent;
        } else if (!offer.mustAttendEvent) {
          // No requiere asistencia presencial
          score += WEIGHTS.mustAttendEvent;
        }
        // Si requiere asistencia pero usuario está en otra ciudad, no suma puntos
      }
      
      // 7. EXCLUSIVIDAD (5%)
      if (offer.exclusive !== undefined) {
        // Por ahora sumamos siempre (podría mejorarse con preferencias del usuario)
        score += WEIGHTS.exclusive;
      }
      
      return score;
    }

    // Procesa todas las ofertas, calcula scores y genera detalles de coincidencia
    return MOCK_OFFERS
      // Filtrar ofertas de negocios con campañas completas o canceladas
      .filter(offer => !completedOrCanceledBusinessIds.includes(offer.businessId))
      .map(offer => {
        // Array para almacenar los detalles de coincidencia en texto legible
        const matches: string[] = [];
        
        // 1. Detalles de coincidencia de NIVEL
        if (offer.requiredLevel) {
          const offerLevelIndex = LEVEL_ORDER.indexOf(offer.requiredLevel);
          if (offerLevelIndex <= userLevelIndex) {
            matches.push(`Nivel: ${user.stats.level}`);
          }
        }
        
        // 2. Detalles de coincidencia de INTERESES
        if (offer.category && user.interests) {
          if (user.interests.includes(offer.category)) {
            matches.push(`Categoría: ${offer.category}`);
          } else if (offer.customTags && offer.customTags.some(tag => 
            user.interests.some(interest => 
              tag.toLowerCase().includes(interest.toLowerCase()) || 
              interest.toLowerCase().includes(tag.toLowerCase())
            )
          )) {
            // Identificar qué tags específicos coinciden con los intereses
            const matchingTags = offer.customTags.filter(tag => 
              user.interests.some(interest => 
                tag.toLowerCase().includes(interest.toLowerCase()) || 
                interest.toLowerCase().includes(tag.toLowerCase())
              )
            );
            matches.push(`Tags relacionados: ${matchingTags.join(', ')}`);
          }
        }
        
        // 3. Detalles de coincidencia de LOCALIZACIÓN
        if (offer.isRemote) {
          matches.push('Trabajo remoto');
        } else if (offer.country && user.country && offer.country === user.country) {
          if (offer.city && user.city && offer.city === user.city) {
            matches.push(`Misma ciudad: ${offer.city}`);
          } else {
            matches.push(`Mismo país: ${offer.country}`);
          }
        }
        
        // 4. Detalles de coincidencia de PLATAFORMAS
        if (offer.platformsRequired && offer.platformsRequired.length > 0) {
          const userPlatforms = user.socialMedia?.map(s => s.platform) || [];
          const matchedPlatforms = offer.platformsRequired.filter(p => userPlatforms.includes(p));
          if (matchedPlatforms.length > 0) {
            matches.push(`Plataformas: ${matchedPlatforms.join(', ')}`);
          }
        }
        
        // 5. Detalles de coincidencia de TIPO DE CONTENIDO
        if (offer.contentType && offer.contentType.length > 0 && user.contentTypes) {
          const matchedContentTypes = offer.contentType.filter(c => user.contentTypes?.includes(c));
          if (matchedContentTypes.length > 0) {
            matches.push(`Contenido: ${matchedContentTypes.join(', ')}`);
          }
        }
        
        // 6. Detalles de coincidencia de ASISTENCIA A EVENTO
        if (offer.mustAttendEvent !== undefined) {
          if (offer.mustAttendEvent && offer.city && user.city && offer.city === user.city) {
            matches.push('Evento en tu ciudad');
          } else if (!offer.mustAttendEvent) {
            matches.push('No requiere asistencia presencial');
          }
        }
        
        // 7. Detalles de coincidencia de EXCLUSIVIDAD
        if (offer.exclusive) {
          matches.push('Requiere exclusividad');
        } else if (offer.exclusive === false) {
          matches.push('No requiere exclusividad');
        }
        
        // Calcula el score final y retorna el objeto completo
        const score = getOfferScore(offer);
        return { offer, score, matches };
      })
      .filter(item => item.score >= MIN_SCORE) // Solo ofertas con al menos 40% de compatibilidad
      .sort((a, b) => b.score - a.score); // Ordena de mayor a menor relevancia
  }

  /**
   * Obtiene una oferta específica por su ID
   * 
   * @param offerId ID de la oferta a buscar
   * @returns La oferta encontrada o undefined si no existe
   */
  static getOfferById(offerId: string): Offer | undefined {
    return MOCK_OFFERS.find(offer => offer.id === offerId);
  }

  /**
   * Simula la respuesta de un negocio a una propuesta de un creador
   * 
   * @param offerId ID de la oferta
   * @param creatorId ID del creador que envía la propuesta
   * @param proposedDates Fechas propuestas por el creador
   * @returns Promesa que resuelve a un objeto con el resultado de la propuesta
   */
  static async simulateBusinessResponse(
    offerId: string,
    creatorId: string,
    proposedDates: Date[]
  ): Promise<{ accepted: boolean; selectedDate?: Date; message: string }> {
    // Simula un retraso de red (2 segundos)
    return new Promise(resolve => {
      setTimeout(() => {
        // Alternar entre aceptación y rechazo (una sí, una no)
        const accepted = alternateAccept;
        // Invertir el valor para la próxima propuesta
        alternateAccept = !alternateAccept;
        
        const selectedDate = accepted ? proposedDates[0] : undefined;
        
        // Crea una nueva campaña a partir de la propuesta del usuario
        const campaignId = `campaign_${Date.now()}`;
        const newCampaign: Campaign = {
          id: campaignId,
          businessId: MatchingService.getOfferById(offerId)?.businessId || '',
          userId: creatorId,
          status: accepted ? 'active' : 'rejected',
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días después
        };
        
        // Guarda la campaña en el array de propuestas/campañas
        userProposals.push(newCampaign);
        
        // Mensaje personalizado según el resultado
        const message = accepted
          ? `¡El negocio ha aceptado tu propuesta para ${selectedDate?.toLocaleDateString('es-ES')}!`
          : 'El negocio ha seleccionado a otro creador para esta oferta.';
        
        resolve({ accepted, selectedDate, message });
      }, 2000);
    });
  }
  
  /**
   * Verifica si un usuario ya ha aplicado a una oferta específica
   * 
   * @param offerId ID de la oferta a verificar
   * @param userId ID del usuario
   * @returns objeto con información sobre la aplicación del usuario
   */
  static getUserApplicationStatus(offerId: string, userId: string): { applied: boolean; status?: string } {
    // Busca en las campañas si el usuario ya ha aplicado a esta oferta
    const offer = this.getOfferById(offerId);
    if (!offer) return { applied: false };
    
    const userCampaign = userProposals.find(
      campaign => 
        campaign.businessId === offer.businessId && 
        campaign.userId === userId && 
        campaign.status !== 'completed' && 
        campaign.status !== 'canceled'
    );
    
    if (userCampaign) {
      return { applied: true, status: userCampaign.status };
    }
    
    return { applied: false };
  }
  
  /**
   * Verifica si un usuario ya ha aplicado a una oferta específica
   * 
   * @param offerId ID de la oferta a verificar
   * @param userId ID del usuario
   * @returns true si el usuario ya ha aplicado, false en caso contrario
   */
  static hasUserAppliedToOffer(offerId: string, userId: string): boolean {
    return this.getUserApplicationStatus(offerId, userId).applied;
  }
  
  /**
   * Obtiene todas las ofertas a las que un usuario ha aplicado
   * 
   * @param userId ID del usuario
   * @returns Array con los IDs de las ofertas a las que el usuario ha aplicado
   */
  static getAppliedOffersByUser(userId: string): string[] {
    // Obtiene los businessId de las campañas del usuario
    const businessIds = userProposals
      .filter(campaign => campaign.userId === userId)
      .map(campaign => campaign.businessId);
    
    // Encuentra las ofertas correspondientes a esos businessIds
    return MOCK_OFFERS
      .filter(offer => businessIds.includes(offer.businessId))
      .map(offer => offer.id);
  }
  
  /**
   * Obtiene todas las campañas de un usuario
   * 
   * @param userId ID del usuario
   * @returns Array con las campañas del usuario
   */
  static getUserCampaigns(userId: string): Campaign[] {
    return userProposals.filter(campaign => campaign.userId === userId);
  }
  
  /**
   * Obtiene una campaña por su ID
   * 
   * @param campaignId ID de la campaña
   * @returns La campaña encontrada o undefined si no existe
   */
  static getCampaignById(campaignId: string): Campaign | undefined {
    return userProposals.find(campaign => campaign.id === campaignId);
  }
}
