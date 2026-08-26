import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { 
  isGoogleMapsKeyConfigured, 
  loadGoogleMapsScript, 
  DEFAULT_SRI_LANKA_CENTER 
} from '../services/googleMapsLoader';

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  type?: 'customer' | 'provider' | 'supervisor';
}

interface GoogleMapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MarkerData[];
  addressName?: string;
  className?: string;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  center = DEFAULT_SRI_LANKA_CENTER,
  zoom = 14,
  markers = [],
  addressName = 'Colombo, Sri Lanka',
  className = "w-full h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isApiKeyActive, setIsApiKeyActive] = useState(isGoogleMapsKeyConfigured());
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  useEffect(() => {
    if (isApiKeyActive) {
      loadGoogleMapsScript()
        .then((maps) => {
          if (maps && mapContainerRef.current) {
            setIsSdkLoaded(true);
            const map = new maps.Map(mapContainerRef.current, {
              center,
              zoom,
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
            });

            // Add markers
            if (markers.length > 0) {
              const bounds = new maps.LatLngBounds();
              markers.forEach((m) => {
                const marker = new maps.Marker({
                  position: { lat: m.lat, lng: m.lng },
                  map,
                  title: m.title,
                });
                bounds.extend(marker.getPosition());
              });
              if (markers.length > 1) {
                map.fitBounds(bounds);
              }
            } else {
              new maps.Marker({
                position: center,
                map,
                title: addressName,
              });
            }
          }
        })
        .catch((err) => {
          console.warn("Error rendering GoogleMapView:", err);
          setIsApiKeyActive(false);
        });
    }
  }, [isApiKeyActive, center, zoom, markers, addressName]);

  if (isApiKeyActive && isSdkLoaded) {
    return <div ref={mapContainerRef} className={className} />;
  }

  return (
    <div className={`${className} bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-400 border border-white/10">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">Area & Site Mapping</h4>
            <p className="text-[11px] text-slate-300">Live GPS tracking and site inspection</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Active Geo-Zone
        </span>
      </div>

      <div className="my-4 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center animate-pulse">
            <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 truncate">
          <Navigation className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
          <span className="truncate text-slate-200 font-medium">{addressName}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
          {center.lat.toFixed(2)}° N, {center.lng.toFixed(2)}° E
        </span>
      </div>
    </div>
  );
};
