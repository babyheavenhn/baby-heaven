
// Bridge coordinates for La Ceiba delivery zones
// These three bridges define the boundaries of the "inside" delivery zone

interface BridgeCoordinate {
    name: string;
    lat: number;
    lng: number;
}

const BRIDGES: BridgeCoordinate[] = [
    { name: 'Puente Danto', lat: 15.7594158, lng: -86.8149412 },      // Westernmost
    { name: 'Puente Saopin', lat: 15.7621218, lng: -86.783392 },      // Middle
    { name: 'Puente Reino de Suecia', lat: 15.7729232, lng: -86.7797647 }  // Easternmost
];

// Delivery prices
const PRICE_INSIDE = 0;   // Free inside the bridge zone
const PRICE_OUTSIDE = 105; // 105 Lps outside the zone and nationwide

/**
 * Calculate delivery price based on location
 * Logic: The delivery zone is defined by the area BETWEEN the westernmost and easternmost bridges.
 * If the user's longitude is between Puente Danto (west) and Puente Reino de Suecia (east),
 * they are in the Free zone. Otherwise, they're in the 105 Lps zone.
 * 
 * @param lat - Latitude of delivery location
 * @param lng - Longitude of delivery location  
 * @returns Delivery price in Lempiras (0 inside, 105 outside)
 */
export const calculateDeliveryPrice = (lat: number, lng: number): number => {
    // Get the westernmost and easternmost bridge longitudes
    const westBridge = BRIDGES[0]; // Puente Danto (most negative lng)
    const eastBridge = BRIDGES[2]; // Puente Reino de Suecia (least negative lng)

    // Check if longitude is between the two outer bridges
    // In negative longitude, "between" means: westLng < userLng < eastLng
    // More negative = further west, Less negative = further east
    const isInsideZone = lng > westBridge.lng && lng < eastBridge.lng;

    return isInsideZone ? PRICE_INSIDE : PRICE_OUTSIDE;
};

/**
 * Format price as Honduran Lempiras currency
 */
export const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('es-HN', {
        style: 'currency',
        currency: 'HNL',
    }).format(amount);
};
