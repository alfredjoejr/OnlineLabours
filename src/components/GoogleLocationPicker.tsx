import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { 
  isGoogleMapsKeyConfigured, 
  loadGoogleMapsScript, 
  DEFAULT_SRI_LANKA_CENTER, 
  SRI_LANKAN_PRESET_LOCATIONS,
  GeocodedPlace
} from '../services/googleMapsLoader';

interface GoogleLocationPickerProps {
  value: string;
  onChange: (location: { address: string; lat?: number; lng?: number }) => void;
  placeholder?: string;
  label?: string;
  showMapPreview?: boolean;
  className?: string;
}

export const GoogleLocationPicker: React.FC<GoogleLocationPickerProps> = ({
  value,
  onChange,
  placeholder = "Search location or enter address (e.g. Colombo 03, Kandy)",
  label = "Task Location",
  showMapPreview = true,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isApiKeyActive, setIsApiKeyActive] = useState(isGoogleMapsKeyConfigured());
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(DEFAULT_SRI_LANKA_CENTER);
  const [suggestions, setSuggestions] = useState<GeocodedPlace[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const autocompleteInstanceRef = useRef<any>(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Try to load Google Maps SDK if API key is provided
  useEffect(() => {
    if (isApiKeyActive) {
      loadGoogleMapsScript()
        .then((maps) => {
          if (maps) {
            setIsSdkLoaded(true);
            initGoogleMapAndAutocomplete(maps);
          }
        })
        .catch((err) => {
          console.warn("Could not initialize Google Maps SDK:", err);
          setIsApiKeyActive(false);
        });
    }
  }, [isApiKeyActive]);

  const initGoogleMapAndAutocomplete = (maps: any) => {
    if (inputRef.current && !autocompleteInstanceRef.current) {
      const autocomplete = new maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'lk' }, // Restrict to Sri Lanka
        fields: ['formatted_address', 'geometry', 'name'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name || inputRef.current?.value || '';

          setInputValue(address);
          setCurrentCoords({ lat, lng });
          onChange({ address, lat, lng });

          if (mapInstanceRef.current && markerInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(15);
            markerInstanceRef.current.setPosition({ lat, lng });
          }
        }
      });

      autocompleteInstanceRef.current = autocomplete;
    }

    if (showMapPreview && mapContainerRef.current && !mapInstanceRef.current) {
      const map = new maps.Map(mapContainerRef.current, {
        center: currentCoords,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'simplified' }] }
        ]
      });

      const marker = new maps.Marker({
        position: currentCoords,
        map: map,
        draggable: true,
        animation: maps.Animation.DROP,
        title: "Selected Task Location"
      });

      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        if (pos) {
          const lat = pos.lat();
          const lng = pos.lng();
          setCurrentCoords({ lat, lng });

          // Reverse geocode if available
          const geocoder = new maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
            if (status === 'OK' && results && results[0]) {
              const newAddress = results[0].formatted_address;
              setInputValue(newAddress);
              onChange({ address: newAddress, lat, lng });
            } else {
              onChange({ address: inputValue || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`, lat, lng });
            }
          });
        }
      });

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;
    }
  };

  // Fallback suggestions filter
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange({ address: val, lat: currentCoords.lat, lng: currentCoords.lng });

    if (!isApiKeyActive || !isSdkLoaded) {
      if (val.trim().length > 0) {
        const filtered = SRI_LANKAN_PRESET_LOCATIONS.filter(
          item => item.address.toLowerCase().includes(val.toLowerCase()) || 
                  item.city?.toLowerCase().includes(val.toLowerCase())
        );
        setSuggestions(filtered);
        setIsDropdownOpen(true);
      } else {
        setSuggestions(SRI_LANKAN_PRESET_LOCATIONS.slice(0, 5));
        setIsDropdownOpen(false);
      }
    }
  };

  const handleSelectPreset = (preset: GeocodedPlace) => {
    setInputValue(preset.address);
    setCurrentCoords({ lat: preset.lat, lng: preset.lng });
    setIsDropdownOpen(false);
    onChange({ address: preset.address, lat: preset.lat, lng: preset.lng });

    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: preset.lat, lng: preset.lng });
      markerInstanceRef.current.setPosition({ lat: preset.lat, lng: preset.lng });
    }
  };

  // Use current browser GPS location if permitted
  const handleDetectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentCoords({ lat, lng });
          const detectedAddress = `Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          setInputValue(detectedAddress);
          onChange({ address: detectedAddress, lat, lng });

          if (mapInstanceRef.current && markerInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(16);
            markerInstanceRef.current.setPosition({ lat, lng });
          }
        },
        (error) => {
          console.warn("Geolocation access denied or unavailable:", error);
        }
      );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
          {isApiKeyActive ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <CheckCircle2 className="w-3 h-3" /> Google Maps Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              <Sparkles className="w-3 h-3" /> Maps Ready (Pending API Key)
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-indigo-500 z-10" />
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (!isApiKeyActive || !isSdkLoaded) {
              setSuggestions(SRI_LANKAN_PRESET_LOCATIONS.slice(0, 5));
              setIsDropdownOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all shadow-xs"
        />

        <button
          type="button"
          onClick={handleDetectCurrentLocation}
          title="Use current location"
          className="absolute right-2 top-2 px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>GPS</span>
        </button>

        {/* Fallback Autocomplete Suggestions Dropdown (when Google Maps API key is not yet set) */}
        {(!isApiKeyActive || !isSdkLoaded) && isDropdownOpen && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100">
            <div className="p-2 bg-slate-50 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
              <span>Suggested Sri Lankan Cities & Towns</span>
              <button 
                type="button" 
                onClick={() => setIsDropdownOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectPreset(item)}
                className="p-3 hover:bg-indigo-50/70 cursor-pointer flex items-center justify-between text-sm group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                  <span className="text-slate-800 font-medium group-hover:text-indigo-900">{item.address}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.lat.toFixed(2)}, {item.lng.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Preview Container */}
      {showMapPreview && (
        <div className="mt-3">
          {isApiKeyActive && isSdkLoaded ? (
            <div 
              ref={mapContainerRef} 
              className="w-full h-48 rounded-2xl border border-slate-200 shadow-inner overflow-hidden bg-slate-100"
            />
          ) : (
            <div className="w-full p-4 bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Map & Coordinates Preview</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Lat: {currentCoords.lat.toFixed(4)}, Lng: {currentCoords.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                  Sri Lanka Grid
                </span>
              </div>

              {/* Decorative Map Grid Illustration */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate max-w-[280px]">
                  📍 {inputValue || 'Colombo, Sri Lanka'}
                </span>
                <span className="text-[11px] text-slate-400 italic">
                  Drag pin enabled upon API key entry
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
