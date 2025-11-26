"use client";
import { Navigation } from 'lucide-react';

interface LocationPickerProps {
    onLocationSelect: (address: string, coords: { lat: number; lng: number }) => void;
    initialAddress?: string;
}

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta geolocalización');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Create Google Maps link
                const mapsLink = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
                const address = `${mapsLink}`;

                onLocationSelect(address, coords);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('No pudimos obtener tu ubicación. Por favor, intenta de nuevo.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    return (
        <button
            type="button"
            onClick={handleUseMyLocation}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
        >
            <Navigation size={18} />
            <span>Usar Mi Ubicación</span>
        </button>
    );
}
